"use client";
import {
  Box,
  Link as ChakraLink,
  Text,
  VStack,
  Heading,
  InputGroup,
  Input,
  HStack,
  useToast,
  Divider,
  Badge,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { isAddress, shortenAddress } from "@/helpers/address";
import { ButtonPrimary } from "@/components/Buttons/ButtonPrimary";
import { bumpContractInstance, restoreContract } from "@/helpers/soroban";
import { useSorobanReact } from "@soroban-react/core";
import { getContractLedgerInfo } from "@/hooks/useContract";

export default function ContractsPage() {
  const sorobanContext = useSorobanReact();
  const toast = useToast();
  const [contractAddress, setContractAddress] = useState<string>("");
  const [isBumping, setIsBumping] = useState<boolean>(false);
  const [ledgerInfo, setLedgerInfo] = useState<any>(null);
  const [loadingInfo, setLoadingInfo] = useState<boolean>(false);

  const handleBumpContractInstance = async () => {
    if (!isAddress(contractAddress)) return;
    setIsBumping(true);
    bumpContractInstance(contractAddress, sorobanContext)
      .then((resp) => {
        console.log(resp);
        toast({
          title: "Contract TTL extended!",
          description: `You have successfully extended ${shortenAddress(
            contractAddress
          )} TTL.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
        setIsBumping(false);
        refetchLedgerInfo(); // Refresh ledger info after bumping
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
          title: "Contract restored!",
          description: `You have successfully restored ${shortenAddress(
            contractAddress
          )}`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
        setIsBumping(false);
        refetchLedgerInfo(); // Refresh ledger info after restoring
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

  const refetchLedgerInfo = async () => {
    if (!isAddress(contractAddress)) return;
    setLoadingInfo(true);
    const info = await getContractLedgerInfo(contractAddress);
    setLedgerInfo(info);
    setLoadingInfo(false);
  };

  useEffect(() => {
    if (isAddress(contractAddress)) {
      refetchLedgerInfo();
    }
  }, [contractAddress]);

  return (
    <VStack spacing={6} align="center" px={{ base: 4, md: 8 }} py={8}>
      <Heading as="h1" size="xl" mb={4}>
        Contract Management
      </Heading>
      <Text color="gray.600" textAlign="center" maxW="lg">
        View and manage the time-to-live for any contract address on the Soroban
        network.
      </Text>

      {/* Contract Ledger Info */}
      <Box
        width="100%"
        maxW="lg"
        p={6}
        rounded="md"
        boxShadow="lg"
        bg="gray.50"
      >
        <Heading as="h2" size="md" mb={4} color="blue.500">
          Contract Ledger Information
        </Heading>

        {loadingInfo ? (
          <Flex justify="center">
            <Spinner size="lg" />
          </Flex>
        ) : ledgerInfo ? (
          <VStack spacing={3} align="start">
            <HStack>
              <Text fontWeight="bold">Status:</Text>
              <Badge colorScheme={ledgerInfo.isActive ? "green" : "red"}>
                {ledgerInfo.isActive ? "Active" : "Expired"}
              </Badge>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Time Remaining:</Text>
              <Text>{ledgerInfo.remaining}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Expires On Ledger:</Text>
              <Text>{ledgerInfo?.expiresOnLedger}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Last Modified Ledger:</Text>
              <Text>{ledgerInfo?.modifiedOnLedger}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Current Ledger:</Text>
              <Text>{ledgerInfo?.currentLedgerSeq}</Text>
            </HStack>
          </VStack>
        ) : (
          <Text color="gray.500">
            Enter a valid contract address to view details.
          </Text>
        )}
      </Box>

      <Divider />

      {/* Input and Action Buttons */}
      <VStack spacing={4} align="center" width="100%" maxW="lg">
        <InputGroup>
          <Input
            type="text"
            placeholder="Enter Contract Address"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            size="lg"
          />
        </InputGroup>
        <HStack spacing={4} width="100%">
          <ButtonPrimary
            label="Bump Contract"
            onClick={handleBumpContractInstance}
            isLoading={isBumping}
            isDisabled={!isAddress(contractAddress)}
            width="full"
            requiresWallet
          />
          <ButtonPrimary
            label="Restore Contract"
            onClick={handleRestoreContract}
            isLoading={isBumping}
            isDisabled={!isAddress(contractAddress) || ledgerInfo?.isActive}
            width="full"
            requiresWallet
          />
        </HStack>
      </VStack>
    </VStack>
  );
}
