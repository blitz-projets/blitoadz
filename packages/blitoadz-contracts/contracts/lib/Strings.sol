// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "hardhat/console.sol";

library Strings {
    function join(string[] memory a, string memory glue)
        public
        view
        returns (string memory)
    {
        bytes memory tempBytes;
        uint256 memoryPointer;
        uint256 stringLength;

        assembly {
            // Get a location of some free memory and store it in tempBytes as
            // Solidity does for memory variables.
            tempBytes := mload(0x40)

            // Skip the first 32 bytes where we store the length of the result
            memoryPointer := add(tempBytes, 0x20)

            // Load the length (first 32 bytes)
            let inputLength := mload(a)
            let inputData := add(a, 0x20)
            let end := add(inputData, mul(inputLength, 0x20))

            // Initialize the length of the final string
            stringLength := 0

            // Iterate over all strings (a string is itself an array in solidity).
            for {
                let pointer := inputData
            } lt(pointer, end) {
                pointer := add(pointer, 0x20)
            } {
                let currentStringArray := mload(pointer)
                let currentStringLength := mload(currentStringArray)
                let currentString := mload(add(currentStringArray, 0x20))

                stringLength := add(stringLength, currentStringLength)
                mstore(memoryPointer, currentString)
                memoryPointer := add(memoryPointer, currentStringLength)
            }

            mstore(tempBytes, stringLength)
            mstore(0x40, and(add(memoryPointer, 31), not(31)))
        }
        console.log("tempBytes", string(tempBytes));
        console.log("memoryPointer", memoryPointer);
        console.log("stringLength", stringLength);
        return string(tempBytes);
    }

    function join(string[] memory a) public view returns (string memory) {
        return join(a, "");
    }

    function joinConcatLoop(string[] memory a)
        public
        pure
        returns (string memory)
    {
        string memory result = "";
        for (uint256 i = 0; i < a.length; i++) {
            result = string.concat(result, a[i]);
        }
        return result;
    }
}
