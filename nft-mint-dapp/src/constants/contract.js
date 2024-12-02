import { ethers } from "ethers";
import Abi from "./nftmintabi.json";


export const getNFTMintContract = (providerOrSigner) =>
    new ethers.Contract(
        import.meta.env.VITE_contract_address,
        Abi,
        providerOrSigner
    );
