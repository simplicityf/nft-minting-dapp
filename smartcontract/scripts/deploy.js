// const hre = require("hardhat")
const { ethers } = require("hardhat");


async function main() {
    // Get the signer (account to deploy contract)
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy the NFTMint contract
    const NFTMint = await ethers.getContractFactory("NFTMint");
    const mintingFee = 1
    const value = mintingFee * 10 
    const quantity = 1
    const uri = "QmQLJsCnkCpASqxBw5G1si3Cb757WYEjDk7BJ2jmWUft6V"
    const nftMint = await NFTMint.deploy(deployer.address);
    const nftMintAddress = await nftMint.getAddress()

    console.log("NFTMint contract deployed to:", nftMintAddress);

    // Set minting fee
    await nftMint.postNFT(uri, quantity, mintingFee, {value: value});

    console.log("Minting fee and first NFT have been set.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
