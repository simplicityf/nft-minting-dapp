import { Box, Container, Flex, Text, Card } from "@radix-ui/themes";
import { configureWeb3Modal } from "./connection";
import "@radix-ui/themes/styles.css";
import Header from "./component/Header";
import MintNFTForm from "./component/MintNFTForm";
import useAllNfts from "./hooks/useAllNfts";
import useMyOrder from "./hooks/useUserNFT";
import Popup from "./component/Popup";

configureWeb3Modal();

function App() {
    const { nfts, loading, error } = useAllNfts();
    console.log("nfts", nfts)
    const { nft, loadings, errors } = useMyOrder();

    // Filtered NFTs where quantity > 0 for AllCollections
    const availableNFTs = nfts.filter(item => Number(item.quantity) > 0);

    return (
        <Container>
            <Header />
            <main className="mt-6">
                <MintNFTForm
                    AllCollections={
                        <Flex align="center" gap="8" wrap="wrap" className="product-showcase">
                            {loading ? (
                                <Text>Loading...</Text>
                            ) : error ? (
                                <Text>{error}</Text>
                            ) : nfts.length === 0 ? (
                                <Text>No products available</Text>
                            ) : (
                                availableNFTs.map((item, index) => (
                                    <Card key={index} className="w-[20rem] p-4 shadow-lg border rounded-lg">
                                        <img
                                            src={`https://ipfs.io/ipfs/${item?.imageIPFS}`}
                                            className="w-full h-48 object-cover rounded-lg"
                                            alt={item.tokenId}
                                        />
                                        <Box className="mt-4 flex flex-col">
                                            <Text className="text-green-600 mt-2 font-bold">Price: {item?.mintingFee} ETH</Text>
                                            <Text className="text-gray-500">Quantity: {item?.quantity}</Text>


                                            <Popup
                                                className="mt-4"
                                                tokenId={item.tokenId} // Pass the specific token ID
                                                availableQuantity={item.quantity} // Available quantity of the NFT
                                                mintingFee={item.mintingFee} // Minting fee per NFT
                                            />

                                        </Box>
                                    </Card>
                                ))
                            )}
                        </Flex>
                    }

                    MyOrders={
                        <Flex align="center" gap="8" wrap="wrap" className="product-showcase">
                            {loadings ? (
                                <Text>Loading...</Text>
                            ) : errors ? (
                                <Text>{errors}</Text>
                            ) : nft.length === 0 ? (
                                <Text>No orders found</Text>
                            ) : (
                                nft.map((nft, index) => (
                                    <Card key={index} className="w-[20rem] p-4 shadow-lg border rounded-lg">
                                        <img
                                            src={`https://ipfs.io/ipfs/${nft?.uri}`}
                                            className="w-full h-48 object-cover rounded-lg"
                                            alt={nft?.tokenId}
                                        />
                                        <Box className="mt-4 flex flex-col">

                                            <Text className="text-green-600 mt-2 font-bold">Price: {nft?.mintingFee} ETH</Text>
                                            <Text className="text-gray-500">Quantity: {nft?.quantity}</Text>

                                        </Box>
                                    </Card>
                                ))
                            )}
                        </Flex>
                    }


                />
            </main>
        </Container>
    );
}

export default App;
