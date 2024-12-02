import { Dialog, Button, Flex, Text, TextField } from "@radix-ui/themes";
import useMintNFT from "../hooks/usePurchase";
import { useState } from "react";

const Popup = ({ tokenId, availableQuantity, mintingFee }) => {
    const handleMint = useMintNFT();
    const [selectedQuantity, setSelectedQuantity] = useState("");

    const handleConfirm = () => {
        if (!selectedQuantity || selectedQuantity <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }
        if (selectedQuantity > availableQuantity) {
            alert("Selected quantity exceeds available stock.");
            return;
        }
        handleMint(tokenId, selectedQuantity, mintingFee);
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger className="bg-blue-600 w-full text-white text-center text-lg py-2">
                <Button>Mint</Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 450 }}>
                <Dialog.Title>Confirm Minting</Dialog.Title>

                <Flex direction="column" gap="3" mt="6">
                    <label>
                        <Text as="div" size="2" mb="1" weight="light">
                            Choose quantity (Available: {availableQuantity})
                        </Text>

                        <TextField.Input
                            value={selectedQuantity}
                            type="number"
                            onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                            placeholder="Enter quantity"
                        />
                    </label>

                    <Text size="2" weight="medium">
                        Token ID: {tokenId}
                    </Text>
                    <Text size="2" weight="medium">
                        Minting Fee per NFT: {mintingFee} ETH
                    </Text>
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button
                            variant="soft"
                            color="blue"
                            onClick={handleConfirm}
                        >
                            Confirm Mint
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default Popup;
