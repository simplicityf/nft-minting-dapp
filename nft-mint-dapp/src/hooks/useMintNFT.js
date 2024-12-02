import { useCallback } from "react";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { getProvider } from "../constants/provider";
import { toast } from "react-toastify"
import { getNFTMintContract } from "../constants/contract";
import { ethers } from "ethers";

const useMintNFT = () => {
    const { walletProvider } = useWeb3ModalProvider();
    // const { address } = useWeb3ModalAccount();

    return useCallback(async (imageIPFS, quantity, price) => {
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();
        const amount = ethers.toBigInt(price);

        const value = amount*BigInt(quantity)
        console.log(amount);

        const contract = getNFTMintContract(signer);

        try {
            const transaction = await contract.postNFT(imageIPFS, quantity, amount, {value:value});
            console.log("transaction: ", transaction);
            const receipt = await transaction.wait();

            console.log("receipt: ", receipt);

            if (receipt.status) {
                return toast.success("Added successfully!");
            }

            toast.error("Minting failed!");
        } catch (error) {
            console.log("error :", error);
        }
    }, [walletProvider])
    };

export default useMintNFT