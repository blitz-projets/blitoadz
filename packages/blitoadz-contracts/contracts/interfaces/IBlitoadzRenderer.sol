// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "./BlitoadzTypes.sol";

interface IBlitoadzRenderer {
    function tokenURI(BlitoadzTypes.Blitoadz calldata blitoadz)
        external
        view
        returns (string memory);
}
