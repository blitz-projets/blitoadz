// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";
import "../interfaces/IBlitoadzRenderer.sol";
import "../interfaces/BlitoadzTypes.sol";
import "../interfaces/IBlitmap.sol";

contract OwnableDelegateProxy {}

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}

error PublicSaleOpen();
error PublicSaleNotOpen();
error BlitoadzExists();
error ToadzIndexOutOfBounds();
error BlitmapIndexOutOfBounds();
error NothingToWithdraw();
error WithdrawalFailed();
error ToadzAndBlitmapLengthMismatch();
error IncorrectPrice();
error AllocationExceeded();
error BlitoadzDoesNotExist();
error WithdrawalQueryForNonexistentToken();
error WithdrawalQueryForTokenNotOwnedByCreator();
error WithdrawalQueryForTokenAlreadyWithdrawn();

contract Blitoadz is ERC721A, Ownable, ReentrancyGuard {
    // Constants
    uint256 public constant MINT_PUBLIC_PRICE = 0.056 ether;
    uint8 public constant TOADZ_COUNT = 56;
    uint8 public constant BLITMAP_COUNT = 100;
    uint16 public constant BLITOADZ_COUNT = 5_600;
    IBlitmap public blitmap;

    // Blitoadz states variables
    bool[BLITOADZ_COUNT] public blitoadzExist;
    BlitoadzTypes.Blitoadz[] public blitoadz;
    uint256 receivedAmount;

    function getBlitoadz()
        external
        view
        returns (BlitoadzTypes.Blitoadz[] memory)
    {
        return blitoadz;
    }

    // Blitoadz funds split
    uint256 public blitmapCreatorShares;
    mapping(address => Founder) public founders;

    struct Founder {
        uint128 withdrawnAmount;
        uint16 shares;
        uint8 remainingAllocation;
    }

    // Events
    event PublicSaleOpened(uint256 timestamp);
    event RendererChanged(address newRenderer);
    event BlitmapCreatorWithdrawn(address account, uint256 amount);
    event FounderWithdrawn(address account, uint256 amount);

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////// Schedule ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    uint256 public publicSaleStartTimestamp;

    function isPublicSaleOpen() public view returns (bool) {
        return
            block.timestamp > publicSaleStartTimestamp &&
            publicSaleStartTimestamp != 0;
    }

    modifier whenPublicSaleOpen() {
        if (!isPublicSaleOpen()) revert PublicSaleNotOpen();
        _;
    }

    modifier whenPublicSaleClosed() {
        if (isPublicSaleOpen()) revert PublicSaleNotOpen();
        _;
    }

    function openPublicSale() external onlyOwner whenPublicSaleClosed {
        publicSaleStartTimestamp = block.timestamp;
        emit PublicSaleOpened(publicSaleStartTimestamp);
    }

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////// Token ///////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    address public renderingContractAddress;
    IBlitoadzRenderer renderer;

    function setRenderingContractAddress(address _renderingContractAddress)
        public
        onlyOwner
    {
        renderingContractAddress = _renderingContractAddress;
        renderer = IBlitoadzRenderer(renderingContractAddress);
        emit RendererChanged(renderingContractAddress);
    }

    constructor(
        string memory name_,
        string memory symbol_,
        address _rendererAddress,
        address[] memory _founders,
        Founder[] memory _foundersData,
        uint256 _blitmapCreatorShares,
        address _blitmap
    ) ERC721A(name_, symbol_) {
        setRenderingContractAddress(_rendererAddress);

        for (uint256 i = 0; i < _founders.length; i++) {
            founders[_founders[i]] = _foundersData[i];
        }

        blitmapCreatorShares = _blitmapCreatorShares;
        blitmap = IBlitmap(_blitmap);
    }

    function _mint(
        address to,
        uint256[] calldata toadzIds,
        uint256[] calldata blitmapIds,
        uint256[] calldata paletteOrders,
        bool isBlitoadzPayable
    ) internal {
        for (uint256 i = 0; i < toadzIds.length; i++) {
            uint256 toadzId = toadzIds[i];
            uint256 blitmapId = blitmapIds[i];
            if (blitoadzExist[toadzId * BLITMAP_COUNT + blitmapId])
                revert BlitoadzExists();
            if (toadzId > TOADZ_COUNT - 1) revert ToadzIndexOutOfBounds();
            if (blitmapId > BLITMAP_COUNT - 1) revert BlitmapIndexOutOfBounds();
            blitoadz.push(
                BlitoadzTypes.Blitoadz(
                    uint8(toadzId % type(uint8).max),
                    uint8(blitmapId % type(uint8).max),
                    uint8(paletteOrders[i] % type(uint8).max),
                    !isBlitoadzPayable
                )
            );
            blitoadzExist[toadzId * BLITMAP_COUNT + blitmapId] = true;
        }

        _safeMint(to, toadzIds.length);
    }

    function mintPublicSale(
        uint256[] calldata toadzIds,
        uint256[] calldata blitmapIds,
        uint256[] calldata paletteOrders
    ) external payable whenPublicSaleOpen nonReentrant {
        if (toadzIds.length != blitmapIds.length)
            revert ToadzAndBlitmapLengthMismatch();
        if (msg.value != MINT_PUBLIC_PRICE * toadzIds.length)
            revert IncorrectPrice();

        _mint(_msgSender(), toadzIds, blitmapIds, paletteOrders, true);
        receivedAmount += MINT_PUBLIC_PRICE * toadzIds.length;
    }

    function mintAllocation(
        uint256[] calldata toadzIds,
        uint256[] calldata blitmapIds,
        uint256[] calldata paletteOrders
    ) external nonReentrant {
        if (toadzIds.length != blitmapIds.length)
            revert ToadzAndBlitmapLengthMismatch();
        if (founders[_msgSender()].remainingAllocation < toadzIds.length)
            revert AllocationExceeded();
        founders[_msgSender()].remainingAllocation -= uint8(
            toadzIds.length % type(uint8).max
        );
        _mint(_msgSender(), toadzIds, blitmapIds, paletteOrders, false);
    }

    function getUnclaimedBlitoadzForCreator(address creator)
        external
        view
        returns (uint256[] memory)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < blitoadz.length; i++) {
            if (
                blitmap.tokenCreatorOf(blitoadz[i].blitmapId) == creator &&
                !blitoadz[i].withdrawn
            ) {
                count++;
            }
        }
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < blitoadz.length; i++) {
            if (
                blitmap.tokenCreatorOf(blitoadz[i].blitmapId) == creator &&
                !blitoadz[i].withdrawn
            ) {
                result[count - 1] = blitoadz[i].toadzId;
                count--;
            }
        }
        return result;
    }

    function withdrawBlitmapCreator(uint256[] calldata tokenIds)
        external
        nonReentrant
        returns (bool)
    {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (
                blitmap.tokenCreatorOf(blitoadz[tokenIds[i]].blitmapId) !=
                _msgSender()
            ) {
                revert WithdrawalQueryForTokenNotOwnedByCreator();
            }
            if (blitoadz[tokenIds[i]].withdrawn) {
                revert WithdrawalQueryForTokenAlreadyWithdrawn();
            }
            blitoadz[tokenIds[i]].withdrawn = true;
        }
        uint256 value = (tokenIds.length *
            MINT_PUBLIC_PRICE *
            blitmapCreatorShares) / BLITOADZ_COUNT;
        (bool success, ) = _msgSender().call{value: value}("");
        if (!success) revert WithdrawalFailed();

        emit BlitmapCreatorWithdrawn(_msgSender(), value);
        return success;
    }

    function withdrawBlitmapCreator() external nonReentrant returns (bool) {
        uint256 count = 0;
        for (uint256 i = 0; i < blitoadz.length; i++) {
            if (
                blitmap.tokenCreatorOf(blitoadz[i].blitmapId) == _msgSender() &&
                !blitoadz[i].withdrawn
            ) {
                count++;
                blitoadz[i].withdrawn = true;
            }
        }
        if (count == 0) revert NothingToWithdraw();
        uint256 value = (count * MINT_PUBLIC_PRICE * blitmapCreatorShares) /
            BLITOADZ_COUNT;
        (bool success, ) = _msgSender().call{value: value}("");
        if (!success) revert WithdrawalFailed();

        emit BlitmapCreatorWithdrawn(_msgSender(), value);
        return success;
    }

    function withdrawFounder() external nonReentrant returns (bool) {
        uint256 value = (receivedAmount * founders[_msgSender()].shares) /
            BLITOADZ_COUNT -
            founders[_msgSender()].withdrawnAmount;
        if (value == 0) revert NothingToWithdraw();
        founders[_msgSender()].withdrawnAmount += uint128(
            value % type(uint128).max
        );
        (bool success, ) = _msgSender().call{value: value}("");
        if (!success) revert WithdrawalFailed();

        emit FounderWithdrawn(_msgSender(), value);
        return success;
    }

    function tokenURI(uint8 toadzId, uint8 blitmapId)
        external
        view
        returns (string memory)
    {
        for (uint256 i = 0; i < blitoadz.length; i++) {
            if (
                blitoadz[i].toadzId == toadzId &&
                blitoadz[i].blitmapId == blitmapId
            ) {
                return tokenURI(i);
            }
        }
        revert BlitoadzDoesNotExist();
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if (!_exists(_tokenId)) revert URIQueryForNonexistentToken();
        if (renderingContractAddress == address(0)) {
            return "";
        }

        return renderer.tokenURI(blitoadz[_tokenId]);
    }

    function exists(uint256 _tokenId) external view returns (bool) {
        return _exists(_tokenId);
    }

    receive() external payable {}
}
