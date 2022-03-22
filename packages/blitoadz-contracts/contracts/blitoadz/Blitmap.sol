// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;
import "solidity-bytes-utils/contracts/BytesLib.sol";
import "../interfaces/IBlitmap.sol";

contract Blitmap is IBlitmap {
    bytes _tokenData;
    bytes _creators;

    constructor(bytes memory tokenData, bytes memory creators) {
        _tokenData = tokenData;
        _creators = creators;
    }

    function tokenDataOf(uint256 tokenId) public view returns (bytes memory) {
        return BytesLib.slice(_tokenData, tokenId * 12, 12);
    }

    function tokenCreatorOf(uint256 tokenId) public view returns (address) {
        return BytesLib.toAddress(_creators, tokenId * 20);
    }
}
