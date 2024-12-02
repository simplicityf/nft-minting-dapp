// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMint is ERC721, ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    mapping(uint256 => uint256) public tokenQuantities;
    mapping(uint256 => uint256) public tokenMintingFees;
    mapping(uint256 => bool) private validTokens;
    mapping(address => uint256[]) private userMintedNFTs;
    mapping(address => uint256[]) private ownerPostedNFTs;

    event NFTMinted(
        address indexed minter,
        uint256 tokenId,
        uint256 quantity
    );
    event NFTPosted(
        address indexed owner,
        uint256 tokenId,
        string tokenURI,
        uint256 quantity,
        uint256 mintingFee
    );
    event FundsWithdrawn(address indexed owner, uint256 amount);

    constructor(address initialOwner) ERC721("NFTMint", "DEMI") Ownable(initialOwner) {
        tokenCounter = 1;
    }

    function postNFT(
        string memory uri,
        uint256 quantity,
        uint256 mintingFee
    ) external onlyOwner payable {
        require(quantity > 0, "Quantity must be greater than 0");
        
        uint256 tokenId = tokenCounter++;
        tokenQuantities[tokenId] = quantity;
        tokenMintingFees[tokenId] = mintingFee;

        require(msg.value >= tokenMintingFees[tokenId], "Insufficient Fund");


        validTokens[tokenId] = true;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        ownerPostedNFTs[msg.sender].push(tokenId);

        emit NFTPosted(msg.sender, tokenId, uri, quantity, mintingFee);
    }

    function mintPostedNFT(uint256 tokenId, uint256 quantity) external payable {
        require(validTokens[tokenId], "NFT not available for minting");
        require(
        quantity > 0 && quantity <= tokenQuantities[tokenId],
        "Invalid quantity requested"
        );

        uint256 requiredFee = tokenMintingFees[tokenId] * quantity;
        require(msg.value >= requiredFee, "Insufficient minting fee");

        // Assign tokens to the user
        for (uint256 i = 0; i < quantity; i++) {
        // Transfer ownership for each token
        _transfer(owner(), msg.sender, tokenId);
        }

        // Update token quantities
        tokenQuantities[tokenId] -= quantity;

        // Record user's minted tokens
        userMintedNFTs[msg.sender].push(tokenId);

        emit NFTMinted(msg.sender, tokenId, quantity);
    }


    function getAllOwnerPostedNFTs()
        external
        view
        returns (uint256[] memory)
    {
        return ownerPostedNFTs[msg.sender];
    }

    function getUserMintedNFT(address user)
        external
        view
        returns (
        uint256[] memory tokenIds,
        string[] memory uris,
        uint256[] memory quantities,
        uint256[] memory fees
        )
    {
    uint256[] memory userTokens = userMintedNFTs[user];
    uint256 length = userTokens.length;

    string[] memory tokenURIs = new string[](length);
    uint256[] memory tokenQuantitiesArray = new uint256[](length);
    uint256[] memory tokenFeesArray = new uint256[](length);

    for (uint256 i = 0; i < length; i++) {
        uint256 tokenId = userTokens[i];
        tokenURIs[i] = tokenURI(tokenId);
        tokenQuantitiesArray[i] = tokenQuantities[tokenId];
        tokenFeesArray[i] = tokenMintingFees[tokenId];
    }

    return (userTokens, tokenURIs, tokenQuantitiesArray, tokenFeesArray);
}


    function getTokenDetails(uint256 tokenId)
        external
        view
        returns (
            string memory uri,
            uint256 quantity,
            uint256 mintingFee
        )
    {
        require(validTokens[tokenId], "Token does not exist");
        return (
            tokenURI(tokenId),
            tokenQuantities[tokenId],
            tokenMintingFees[tokenId]
        );
    }

    function getTokenCounter() external view returns (uint256) {
        return tokenCounter;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // Explicitly override supportsInterface
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
        emit FundsWithdrawn(owner(), balance);
    }
}
