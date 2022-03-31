// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

library Strings {
    function join(string[] memory a, string memory glue)
        public
        pure
        returns (string memory)
    {
        string memory result = "";
        for (uint256 i = 0; i < a.length; i++) {
            if (i > 0) {
                result = string.concat(result, glue);
            }
            result = string.concat(result, a[i]);
        }
        return result;
    }

    function join(string[] memory a) public pure returns (string memory) {
        return join(a, "");
    }
}
