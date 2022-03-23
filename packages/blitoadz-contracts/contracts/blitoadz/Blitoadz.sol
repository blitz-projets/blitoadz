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
error WithdrawalQueryForNonexistentToken();
error AllocationExceeded();
error BlitoadzDoesNotExist();

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
    ////////////////////////// Marketplaces ////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    address public opensea;
    address public looksrare;

    /// @notice Set opensea to `opensea_`.
    function setOpensea(address opensea_) external onlyOwner {
        opensea = opensea_;
    }

    /// @notice Set looksrare to `looksrare_`.
    function setLooksrare(address looksrare_) external onlyOwner {
        looksrare = looksrare_;
    }

    /// @dev Modified for opensea and looksrare pre-approve.
    function isApprovedForAll(address owner, address operator)
        public
        view
        override(ERC721A)
        returns (bool)
    {
        return
            operator == address(ProxyRegistry(opensea).proxies(owner)) ||
            operator == looksrare ||
            super.isApprovedForAll(owner, operator);
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
        address _opensea,
        address _looksrare,
        address[] memory _founders,
        Founder[] memory _foundersData,
        uint256 _blitmapCreatorShares,
        address _blitmap
    ) ERC721A(name_, symbol_) {
        setRenderingContractAddress(_rendererAddress);
        opensea = _opensea;
        looksrare = _looksrare;

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

    function withdrawBlitmapCreator(uint256[] calldata tokenIds)
        external
        nonReentrant
        returns (bool)
    {
        uint256 value = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (!_exists(tokenIds[i]))
                revert WithdrawalQueryForNonexistentToken();
            if (
                blitmap.tokenCreatorOf(blitoadz[tokenIds[i]].blitmapId) !=
                _msgSender()
            ) {
                continue;
            }
            if (blitoadz[tokenIds[i]].withdrawn) {
                continue;
            }
            value++;
            blitoadz[tokenIds[i]].withdrawn = true;
        }
        if (value == 0) revert NothingToWithdraw();
        value =
            (value * MINT_PUBLIC_PRICE * blitmapCreatorShares) /
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
