// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SocialBattleNFT is ERC721URIStorage {
    // Counter for token IDs
    uint256 private _nextTokenId;

    // Mapping to track if an address has already minted
    mapping(address => bool) public hasMinted;
    
    // Mapping to track user's token ID
    mapping(address => uint256) public userTokenId;

    constructor() ERC721("SocialBattle", "SBAT") {}

    function mintNFT(string memory tokenURI) public returns (uint256) {
        require(!hasMinted[msg.sender], "Address has already minted");
        
        uint256 newTokenId = _nextTokenId;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        hasMinted[msg.sender] = true;
        userTokenId[msg.sender] = newTokenId;
        _nextTokenId++;

        return newTokenId;
    }

    function getUserTokenId(address user) public view returns (uint256) {
        require(hasMinted[user], "User has not minted an NFT");
        return userTokenId[user];
    }
} 