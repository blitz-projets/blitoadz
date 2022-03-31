// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@0xsequence/sstore2/contracts/SSTORE2.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "solidity-bytes-utils/contracts/BytesLib.sol";

import "../interfaces/IBlitoadzRenderer.sol";
import "../interfaces/IBlitmap.sol";

import {PaletteRenderer} from "../lib/PaletteRenderer.sol";
import {Strings} from "../lib/Strings.sol";

/*  @title Blitoadz Renderer
    @author Clement Walter
    @dev Encode each one of the 56 toadz in a single byte with a leading 57 uint16 for indexes.
         Color palettes is dropped because blitmap colors are used instead.
*/
contract BlitoadzRenderer is Ownable, ReentrancyGuard, IBlitoadzRenderer {
    // We have a total of 4 * 6 = 24 bits = 3 bytes for coordinates + 1 byte for the color
    // Hence each rect is 4 bytes
    uint8 public constant BITS_PER_FILL_INDEX = 2;
    uint16 public constant IMAGE_WIDTH = 36;
    string public constant STYLE =
        "%3cstyle%3erect{shape-rendering:crispEdges}%3c/style%3e";

    address public toadz; // 57 uint16 leading indexes followed by the actual 56 toadz images
    address public toadzNames; // 57 uint16 leading indexes followed by the actual 56 toadz names
    IBlitmap blitmap;

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////  Rendering mechanics  /////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    constructor(address _blitmap) {
        blitmap = IBlitmap(_blitmap);
    }

    function setToadz(bytes calldata _toadz) external onlyOwner {
        toadz = PaletteRenderer.storeBytes(_toadz);
    }

    function setToadzNames(bytes calldata _toadzNames) external onlyOwner {
        toadzNames = PaletteRenderer.storeBytes(_toadzNames);
    }

    function getToadzName(uint256 _index) public view returns (string memory) {
        uint16 start = BytesLib.toUint16(
            SSTORE2.read(toadzNames, 2 * _index, 2 * _index + 2),
            0
        );
        uint16 end = BytesLib.toUint16(
            SSTORE2.read(toadzNames, 2 * _index + 2, 2 * _index + 4),
            0
        );
        return string(SSTORE2.read(toadzNames, start + 57 * 2, end + 57 * 2));
    }

    function decodeRow(
        uint256 rowIndex,
        bytes memory _row,
        string[] memory palette
    ) internal pure returns (string memory) {
        string[] memory row = new string[](IMAGE_WIDTH / 4);
        for (uint256 i = 0; i < IMAGE_WIDTH; i += 4) {
            row[i / 4] = PaletteRenderer.decode1ByteTo4Pixels(
                rowIndex * IMAGE_WIDTH + i,
                _row[i / 4],
                palette,
                IMAGE_WIDTH
            );
        }
        return Strings.join(row);
    }

    function decodeImage(bytes memory _image, string[] memory palette)
        internal
        pure
        returns (string memory)
    {
        string[] memory image = new string[](IMAGE_WIDTH);
        uint256 start = 0;
        for (uint256 i = 0; i < IMAGE_WIDTH; i++) {
            image[i] = decodeRow(
                i,
                BytesLib.slice(
                    _image,
                    start,
                    (BITS_PER_FILL_INDEX * IMAGE_WIDTH) / 8
                ),
                palette
            );
            start += (BITS_PER_FILL_INDEX * IMAGE_WIDTH) / 8;
        }
        return Strings.join(image);
    }

    ////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////  Blitoadz  ///////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    /// @dev Decode the rect and returns it as a plain string to be used in the svg rect attribute.
    function getBlitoadz(
        uint256 toadzId,
        uint256 blitmapId,
        uint8 paletteOrder
    ) public view returns (string memory) {
        bytes memory toadzBytes = PaletteRenderer.getImageBytes(
            toadz,
            toadzId,
            BITS_PER_FILL_INDEX,
            IMAGE_WIDTH * IMAGE_WIDTH
        );
        bytes memory palette = BytesLib.slice(
            blitmap.tokenDataOf(blitmapId),
            0,
            12
        );
        string[] memory paletteHex = PaletteRenderer.getPalette(palette);
        uint8[4] memory paletteOrderArray = [
            paletteOrder >> 6,
            (paletteOrder >> 4) & 0x3,
            (paletteOrder >> 2) & 0x3,
            paletteOrder & 0x3
        ];
        string[] memory paletteHexOrdered = new string[](4);
        for (uint256 i = 0; i < 4; i++) {
            paletteHexOrdered[i] = paletteHex[paletteOrderArray[i]];
        }

        return
            string.concat(
                PaletteRenderer.SVG_TAG_START,
                decodeImage(toadzBytes, paletteHexOrdered),
                STYLE,
                PaletteRenderer.SVG_TAG_END
            );
    }

    function getImageURI(
        uint256 toadzId,
        uint256 blitmapId,
        uint8 paletteOrder
    ) public view returns (string memory) {
        return
            string.concat(
                "data:image/svg+xml,",
                getBlitoadz(toadzId, blitmapId, paletteOrder)
            );
    }

    function tokenURI(
        uint256 toadzId,
        uint256 blitmapId,
        uint8 paletteOrder
    ) public view returns (string memory) {
        return
            string.concat(
                "data:application/json,",
                '{"image_data": "',
                getImageURI(toadzId, blitmapId, paletteOrder),
                '"',
                ',"description": "Blitoadz are a blitmap and CrypToadz cross-breed, paving the way toward a new blitzverse. Oh - and they\'re fully on-chain."',
                ',"name": "',
                getToadzName(toadzId),
                " ",
                blitmap.tokenNameOf(blitmapId),
                '"}'
            );
    }
}
