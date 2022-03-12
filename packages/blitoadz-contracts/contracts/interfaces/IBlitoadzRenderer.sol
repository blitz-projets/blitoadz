// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

interface IBlitoadzRenderer {
    function tokenURI(uint256 toadzId, uint256 blitmapId)
        external
        view
        returns (string memory);
}
