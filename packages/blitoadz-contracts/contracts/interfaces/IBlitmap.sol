// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

interface IBlitmap {
    function tokenDataOf(uint256 tokenId) external view returns (bytes memory);
}
