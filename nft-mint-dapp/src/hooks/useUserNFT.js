import { useEffect, useState } from "react";
import { readOnlyProvider } from "../constants/provider";
import { getNFTMintContract } from "../constants/contract";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { ethers } from "ethers";

const useMyOrder = () => {
    const [data, setData] = useState({ nft: [], loading: true, error: null });
    const { address } = useWeb3ModalAccount();

    const contract = getNFTMintContract(readOnlyProvider);

    useEffect(() => {
        const fetchUserNFTs = async () => {
            try {
                if (!address) {
                    throw new Error("Connect your wallet to view NFTs");
                }

                // Fetch minted NFTs data from contract
                const [tokenIds, uris, quantities, fees] = await contract.getUserMintedNFT(address);

                // Format the data into a more usable structure
                const mintedNFTs = tokenIds.map((tokenId, index) => ({
                    tokenId: tokenId,
                    uri: uris[index],
                    quantity: Number(quantities[index]),
                    mintingFee: ethers.formatEther(fees[index]), // Convert fee from Wei to ETH
                }));

                setData({ nft: mintedNFTs, loading: false, error: null });
            } catch (error) {
                console.error("Error fetching user NFTs:", error);
                setData({ nft: [], loading: false, error: error.message });
            }
        };

        fetchUserNFTs();
    }, [address, contract]);

    return data;
};

export default useMyOrder;
