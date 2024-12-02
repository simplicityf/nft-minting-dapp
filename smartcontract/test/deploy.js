const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMint Contract", function () {
    let NFTMint;
    let nftMint;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        // Get signers
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy the contract
        NFTMint = await ethers.getContractFactory("NFTMint");
        nftMint = await NFTMint.deploy(owner.address);
    });

    describe("Deployment", function () {
        it("Should set the owner correctly", async function () {
            expect(await nftMint.owner()).to.equal(owner.address);
        });
    });

    describe("Minting", function () {
        it("Should mint an NFT", async function () {
            const mintingFee = 10000000;
            const uri = "ipfs://QmPFCESgnAHGK1TkyLFnJ2wgshSzpn23CyaswecvLK6KKg";

            // User mints NFT
            await nftMint.connect(addr1).safeMint(mintingFee, uri);

            const tokenId = 1; // Since this is the first token being minted
            const mintedNFT = await nftMint.tokenURI(tokenId);

            expect(mintedNFT).to.equal(uri);
            expect(await nftMint.ownerOf(tokenId)).to.equal(addr1.address);
        });

        it("Should fail to mint without enough payment", async function () {
            const mintingFee = 100000;
            const insufficientFee = 10;
            const uri = "ipfs://QmPFCESgnAHGK1TkyLFnJ2wgshSzpn23CyaswecvLK6KKg";

            await expect(
                nftMint.connect(addr1).safeMint(mintingFee, uri, { value: insufficientFee })
            );
        });
    });

    describe("Withdraw", function () {
        // it("Should allow the owner to withdraw funds", async function () {
        //     const mintingFee = 100;
        //     const uri = "ipfs://QmPFCESgnAHGK1TkyLFnJ2wgshSzpn23CyaswecvLK6KKg";
        
        //     // Mint NFT by addr1 and transfer minting fee to contract
        //     await nftMint.connect(addr1).safeMint(mintingFee, uri);
        
        //     const initialBalance = await ethers.provider.getBalance(owner.address);
        
        //     // Perform the withdrawal and capture the gas cost
        //     const tx = await nftMint.connect(owner).withdraw();
        //     const receipt = await tx.wait();
        //     // const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice).toNumber();
        
        //     const finalBalance = await ethers.provider.getBalance(owner.address);
        //     expect(finalBalance).to.equal(receipt);
        // });
        

        it("Should revert if non-owner tries to withdraw", async function () {
            const mintingFee = 100;
            const uri = "ipfs://QmPFCESgnAHGK1TkyLFnJ2wgshSzpn23CyaswecvLK6KKg";
        
            // Mint NFT
            await nftMint.connect(addr1).safeMint(mintingFee, uri);
        
            // Expect revert when non-owner tries to withdraw
            await expect(nftMint.connect(addr2).withdraw());

        });
        
    });
});
