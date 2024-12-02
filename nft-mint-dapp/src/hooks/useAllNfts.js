import { useEffect, useState } from "react";
import { readOnlyProvider } from "../constants/provider";
import { getNFTMintContract } from "../constants/contract";
import { ethers } from "ethers";

const useAllNfts = () => {
    const [data, setData] = useState({ nfts: [], loading: true, error: null });
    const contract = getNFTMintContract(readOnlyProvider);

    useEffect(() => {
        const fetchNFTs = async () => {
            try {
                // Get total NFTs as a BigInt
                const totalNFTs = await contract.tokenCounter();
                console.log("Total NFTs (BigInt):", totalNFTs);

                // Convert BigInt to a regular number for iteration
                const totalNFTsNumber = Number(totalNFTs);

                const fetchedNFTs = await Promise.all(
                    Array.from({ length: totalNFTsNumber }, (_, i) => i + 1).map(async (tokenId) => {
                        try {
                            const [uri, quantity, mintingFee] = await contract.getTokenDetails(tokenId);

                            return {
                                tokenId: tokenId,
                                imageIPFS: uri,
                                mintingFee: ethers.formatEther(mintingFee),
                                quantity: Number(quantity),
                            };
                        } catch (error) {
                            console.error(`Error fetching details for token ${tokenId}:`, error);
                            return null; // Skip tokens with errors
                        }
                    })
                );

                setData({ nfts: fetchedNFTs.filter(Boolean), loading: false, error: null }); // Filter out nulls
            } catch (error) {
                console.error("Error fetching NFTs:", error.message);
                setData({ nfts: [], loading: false, error: error.message });
            }
        };

        fetchNFTs();
    }, [contract]);

    return data;
};

export default useAllNfts;



