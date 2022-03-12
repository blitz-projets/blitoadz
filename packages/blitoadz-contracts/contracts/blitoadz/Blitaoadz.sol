// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";
import "../interfaces/IBlitoadzRenderer.sol";

contract OwnableDelegateProxy {}

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}

contract Blitoadz is ERC721A, Ownable, ReentrancyGuard {
    // Constants
    uint256 public constant MINT_PUBLIC_PRICE = 0.05 ether;
    uint8 public constant MAX_MINT_PER_ADDRESS = 20;
    uint8 public constant TOADZ_COUNT = 56;
    uint8 public constant BLITMAP_COUNT = 100;
    uint16 public constant BLITOADZ_COUNT = 5_600;

    // Blitoadz states variables
    bool[BLITOADZ_COUNT] public blitoadzExist;
    uint8[] public blitoadz;

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////// Schedule ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    uint256 public publicSaleStartTimestamp;

    function openPublicSale() external onlyOwner {
        publicSaleStartTimestamp = block.timestamp;
    }

    function isPublicSaleOpen() public view returns (bool) {
        return
            block.timestamp > publicSaleStartTimestamp - 1 &&
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
        uint256[] calldata blitmapIds
    ) internal {
        for (uint256 i = 0; i < toadzIds.length; i++) {
            uint256 toadzId = toadzIds[i];
            uint256 blitmapId = blitmapIds[i];
            require(
                !blitoadzExist[toadzId * BLITMAP_COUNT + blitmapId],
                "Toadz already exists"
            );
            blitoadz.push(uint8(toadzId % type(uint8).max));
            blitoadz.push(uint8(blitmapId % type(uint8).max));
            blitoadzExist[toadzId * BLITMAP_COUNT + blitmapId] = true;
        }

        _safeMint(to, toadzIds.length);
    }

    function mintPublicSale(
        uint256[] calldata toadzIds,
        uint256[] calldata blitmapIds
    ) external payable whenPublicSaleOpen nonReentrant {
        require(
            toadzIds.length == blitmapIds.length,
            "There should be one toadzId for each blitmapId"
        );
        require(
            msg.value == MINT_PUBLIC_PRICE * toadzIds.length,
            "Price does not match"
        );
        require(
            ERC721A.balanceOf(_msgSender()) + toadzIds.length <=
                MAX_MINT_PER_ADDRESS,
            "Blitoadz: the requested quantity exceeds the maximum allowed"
        );

        _mint(_msgSender(), toadzIds, blitmapIds);
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

        uint8 toadzId = blitoadz[2 * _tokenId];
        uint8 blitmapId = blitoadz[2 * _tokenId + 1];
        return renderer.tokenURI(toadzId, blitmapId);
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
