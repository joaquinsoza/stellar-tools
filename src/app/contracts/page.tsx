"use client";
import {
  Link as ChakraLink,
  Text,
  VStack,
  Heading,
  InputGroup,
  Input,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { isAddress, shortenAddress } from "@/helpers/address";
import { ButtonPrimary } from "@/components/Buttons/ButtonPrimary";
import { bumpContractInstance, restoreContract } from "@/helpers/soroban";
import { useSorobanReact } from "@soroban-react/core";

export default function ContractsPage() {
  const sorobanContext = useSorobanReact();
  const toast = useToast();
  const [contractAddress, setcontractAddress] = useState<string>("");
  const [isBumping, setIsBumping] = useState<boolean>(false);

  const handleBumpContractInstance = async () => {
    if (!isAddress(contractAddress)) return;
    setIsBumping(true);
    bumpContractInstance(contractAddress, sorobanContext)
      .then((resp) => {
        console.log(resp);
        toast({
          title: "Asset ttl extended!",
          description: `You have successfully extended ${shortenAddress(
            contractAddress
          )} TTL.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
        setIsBumping(false);
      })
      .catch((error) => {
        console.log("🚀 « error:", error);
        toast({
          title: "Error",
          description: `${error}`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
        setIsBumping(false);
      });
  };

  const handleRestoreContract = async () => {
    if (!isAddress(contractAddress)) return;
    setIsBumping(true);
    restoreContract(contractAddress, sorobanContext)
      .then((resp) => {
        console.log(resp);
        toast({
          title: "Asset ttl extended!",
          description: `You have successfully restored ${shortenAddress(
            contractAddress
          )}`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
        setIsBumping(false);
      })
      .catch((error) => {
        console.log("🚀 « error:", error);
        toast({
          title: "Error",
          description: `${error}`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
        setIsBumping(false);
      });
  };

  return (
    <VStack spacing={4} align="center" px={{ base: 1, md: 6 }}>
      <Heading as="h1" size="xl">
        Bump any contract
      </Heading>
      <Text color="gray.600" maxW="4xl" textAlign="center">
        Bump any contract address time to live
      </Text>
      <HStack w={"full"}>
        <InputGroup>
          <Input
            type="text"
            placeholder="Contract address"
            value={contractAddress}
            onChange={(e) => setcontractAddress(e.target.value)}
          />
        </InputGroup>
        <ButtonPrimary
          label="Bump Contract"
          onClick={handleBumpContractInstance}
          isLoading={isBumping}
          requiresWallet
        />
        <ButtonPrimary
          label="Restore Contract"
          onClick={handleRestoreContract}
          isLoading={isBumping}
          requiresWallet
        />
      </HStack>
    </VStack>
  );
}
