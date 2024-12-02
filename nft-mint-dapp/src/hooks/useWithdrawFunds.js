import { getNFTMintContract } from "../constants/contract"; // Adjust the path to your files
import { toast } from "react-toastify";
import { getProvider } from "../constants/provider";

const withdrawFunds = async (walletProvider) => {
    try {
        // Get a provider connected to the user's wallet
        const signer = await getProvider(walletProvider).getSigner();

        // Instantiate the contract with the signer
        const nftContract = getNFTMintContract(signer);

        // Call the withdraw function
        const tx = await nftContract.withdraw();
        toast.info("Transaction initiated...");

        // Wait for the transaction to complete
        const receipt = await tx.wait();

        // Notify the user on success
        toast.success("Funds withdrawn successfully!");
        console.log("Transaction receipt:", receipt);
    } catch (error) {
        console.error("Error withdrawing funds:", error);

        // Display an error message
        const errorMessage = error.reason || "Transaction failed. Check console for details.";
        toast.error(errorMessage);
    }
};

export default withdrawFunds;
