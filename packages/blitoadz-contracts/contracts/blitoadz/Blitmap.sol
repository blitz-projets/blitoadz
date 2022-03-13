// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;
import "solidity-bytes-utils/contracts/BytesLib.sol";

contract Blitmap {
    bytes _tokenData;

    constructor(bytes memory tokenData) {
        _tokenData = tokenData;
    }

    function tokenDataOf(uint256 tokenId) public view returns (bytes memory) {
        return BytesLib.slice(_tokenData, tokenId * 12, 12);
    }
}
