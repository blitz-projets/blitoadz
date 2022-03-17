// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";
import "../interfaces/IBlitoadzRenderer.sol";
import "../interfaces/BlitoadzTypes.sol";

contract OwnableDelegateProxy {}

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}

contract Blitoadz is ERC721A, Ownable, ReentrancyGuard {
    // Constants
    uint256 public constant MINT_PUBLIC_PRICE = 0.056 ether;
    uint8 public constant TOADZ_COUNT = 56;
    uint8 public constant BLITMAP_COUNT = 100;
    uint16 public constant BLITOADZ_COUNT = 5_600;

    // Blitoadz states variables
    bool[BLITOADZ_COUNT] public blitoadzExist;
    BlitoadzTypes.Blitoadz[] public blitoadz;

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////// Schedule ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    uint256 public publicSaleStartTimestamp;

    function openPublicSale() external onlyOwner {
        publicSaleStartTimestamp = block.timestamp;
    }

    function isPublicSaleOpen() public view returns (bool) {
        return
            block.timestamp > publicSaleStartTimestamp &&
            publicSaleStartTimestamp != 0;
    }

    modifier whenPublicSaleOpen() {
        require(isPublicSaleOpen(), "Public sale not open");
        _;
    }

    modifier whenPublicSaleClosed() {
        require(!isPublicSaleOpen(), "Public sale open");
        _;
    }

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////// Marketplaces ////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    address public opensea;
    address public looksrare;
    mapping(address => bool) proxyToApproved;

    /// @notice Set opensea to `opensea_`.
    function setOpensea(address opensea_) external onlyOwner {
        opensea = opensea_;
    }

    /// @notice Set looksrare to `looksrare_`.
    function setLooksrare(address looksrare_) external onlyOwner {
        looksrare = looksrare_;
    }

    /// @notice Approve the communication and interaction with cross-collection interactions.
    function flipProxyState(address proxyAddress) public onlyOwner {
        proxyToApproved[proxyAddress] = !proxyToApproved[proxyAddress];
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
            proxyToApproved[operator] ||
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
    }

    constructor(
        string memory name_,
        string memory symbol_,
        address _rendererAddress,
        address _opensea,
        address _looksrare
    ) ERC721A(name_, symbol_) {
        setRenderingContractAddress(_rendererAddress);
        opensea = _opensea;
        looksrare = _looksrare;
    }

    function _mint(
        address to,
        uint256[] calldata toadzIds,
        uint256[] calldata blitmapIds,
        uint256[] calldata paletteOrders
    ) internal {
        for (uint256 i = 0; i < toadzIds.length; i++) {
            uint256 toadzId = toadzIds[i];
            uint256 blitmapId = blitmapIds[i];
            require(
                !blitoadzExist[toadzId * BLITMAP_COUNT + blitmapId],
                "Blitoadz already exists"
            );
            require(toadzId < TOADZ_COUNT, "Toadz id out of range");
            require(blitmapId < BLITMAP_COUNT, "Blitmap id out of range");
            blitoadz.push(
                BlitoadzTypes.Blitoadz(
                    uint8(toadzId % type(uint8).max),
                    uint8(blitmapId % type(uint8).max),
                    uint8(paletteOrders[i] % type(uint8).max)
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
        require(
            toadzIds.length == blitmapIds.length,
            "There should be one toadzId for each blitmapId"
        );
        require(
            msg.value == MINT_PUBLIC_PRICE * toadzIds.length,
            "Price does not match"
        );

        _mint(_msgSender(), toadzIds, blitmapIds, paletteOrders);
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(_tokenId), "ERC721: URI query for nonexistent token");
        if (renderingContractAddress == address(0)) {
            return "";
        }

        return renderer.tokenURI(blitoadz[_tokenId]);
    }

    function exists(uint256 _tokenId) external view returns (bool) {
        return _exists(_tokenId);
    }

    receive() external payable {}

    function withdraw() public onlyOwner {
        (bool success, ) = _msgSender().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}
