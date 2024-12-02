import { useCallback } from "react";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { getProvider } from "../constants/provider.js";
import { getNFTMintContract } from "../constants/contract.js";
import { toast } from "react-toastify";
import { ethers } from "ethers";

const useMintNFT = () => {
    const { walletProvider } = useWeb3ModalProvider();

    return useCallback(
        async (tokenId, quantity, mintingFee) => {
            try {
                const readWriteProvider = getProvider(walletProvider);
                const signer = await readWriteProvider.getSigner();

                // Get contract instance
                const contract = getNFTMintContract(signer);

                // Calculate the total cost
                const priceInWei = ethers.parseEther(mintingFee.toString());
                const totalCost = priceInWei * BigInt(quantity);

                console.log("Token ID:", tokenId);
                console.log("Minting Fee (Wei):", priceInWei);
                console.log("Total Cost (Wei):", totalCost);

                // Call the mintPostedNFT function from the contract
                const transaction = await contract.mintPostedNFT(tokenId, quantity, {
                    value: totalCost
                });

                const receipt = await transaction.wait();

                if (receipt.status) {
                    toast.success("NFT minted successfully!");
                } else {
                    toast.error("Transaction failed. Check contract logic.");
                }
            } catch (error) {
                console.error("Minting error:", error);
                if (error.reason) {
                    toast.error(`Minting error: ${error.reason}`);
                } else {
                    toast.error("Unable to mint NFT.");
                }
            }
        },
        [walletProvider]
    );
};

export default useMintNFT;
