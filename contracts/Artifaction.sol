//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Artifaction is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public price = 0.05 ether;
    uint256 public maxCollection = 10000;

    constructor() ERC721("Artifaction", "ART") {}

    function mintArt(string memory tokenURI) public {
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();
        _safeMint(_msgSender(), newTokenId);

        _setTokenURI(newTokenId, tokenURI);
    }

    function setNewTokenURI(uint256 tokenId, string memory tokenURI) external onlyOwner {
        require(tokenId != 0);

        _setTokenURI(tokenId, tokenURI);
    }
}
