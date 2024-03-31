// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract MyEpicNFT is ERC721URIStorage {
    uint256 private _tokenIds;

    string baseSvgFirst =
        "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: black; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
    string baseSvgSecond =
        "' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWords = [
        "delicious",
        "smelly",
        "dashing",
        "berserk",
        "crazy",
        "sticky",
        "squirmy",
        "slimy"
    ];

    string[] secondWords = [
        "Wet",
        "Dysfunctional",
        "Little",
        "Chilly",
        "Silly",
        "Salty",
        "Sour",
        "Sweet",
        "Spicy"
    ];

    string[] thirdWords = [
        "Penguin",
        "Cat",
        "Dog",
        "Fish",
        "Bird",
        "Elephant",
        "Giraffe",
        "Lion",
        "Tiger",
        "Bear",
        "Jonathan"
    ];

    string[] colours = [
        "green",
        "cyan",
        "red",
        "yellow",
        "purple",
        "orange",
        "pink",
        "white",
        "brown"
    ];

    event NewEpicNFTMinted(address sender, uint256 tokenId);

    constructor() ERC721("SquareNFT", "SQUARE") {
        console.log("This is my NFT contract. Whoa!");
    }

    function pickRandomFirstWord(
        uint256 tokenId
    ) public view returns (string memory) {
        uint256 rand = random(
            string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId)))
        );
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(
        uint256 tokenId
    ) public view returns (string memory) {
        uint256 rand = random(
            string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId)))
        );
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    function pickRandomThirdWord(
        uint256 tokenId
    ) public view returns (string memory) {
        uint256 rand = random(
            string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId)))
        );
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function pickRandomColour(
        uint256 tokenId
    ) public view returns (string memory) {
        uint256 rand = random(
            string(abi.encodePacked("COLOUR", Strings.toString(tokenId)))
        );
        rand = rand % colours.length;
        return colours[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function getTotalNFTsMintedSoFar() public view returns (uint256) {
        return _tokenIds;
    }

    function makeAnEpicNFT() public {
        uint256 newItemId = _tokenIds;

        string memory colour = pickRandomColour(newItemId);
        string memory first = pickRandomFirstWord(newItemId);
        string memory second = pickRandomSecondWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);
        string memory combinedWord = string(
            abi.encodePacked(first, second, third)
        );

        string memory finalSvg = string(
            abi.encodePacked(
                baseSvgFirst,
                colour,
                baseSvgSecond,
                combinedWord,
                "</text></svg>"
            )
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        combinedWord,
                        '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
                        Strings.toString(newItemId),
                        '", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, finalTokenUri);

        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );

        ++_tokenIds;

        emit NewEpicNFTMinted(msg.sender, newItemId);
    }
}
