import { useAssetForAccount } from "@/hooks/useAsset";
import {
  Card,
  VStack,
  Text,
  Skeleton,
  Box,
  Button,
  useToast,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { Asset } from "@stellar-asset-lists/sdk";
import { ManageTrustlineButton } from "../Buttons/ManageTrustlineButton";
import { ConnectWalletToUse } from "../DisabledComponents/ConnectWalletToUse";
import {
  bumpContractInstance,
  deployStellarAsset,
  getTokenDecimals,
  getTokenName,
  getTokenSymbol,
} from "@/helpers/soroban";
import { useSorobanReact } from "@soroban-react/core";
import { useState } from "react";
import { wrapStellarAsset } from "@soroban-react/contracts";
import { Address, nativeToScVal } from "@stellar/stellar-sdk";
import { FaWallet } from "react-icons/fa";

interface AssetActionProps {
  asset?: Asset;
}

export function AssetActionPanel({ asset }: AssetActionProps) {
  const sorobanContext = useSorobanReact();
  const toast = useToast();
  const { assetForAccount, isLoading, contractInfo, refetch } =
    useAssetForAccount(asset);

  const [isDeployedOnSoroban, setIsDeployedOnSoroban] = useState<boolean>(true);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  const [isBumping, setIsBumping] = useState<boolean>(false);

  getTokenName(sorobanContext, asset?.contract).then((resp) =>
    resp ? setIsDeployedOnSoroban(true) : setIsDeployedOnSoroban(false)
  );

  const handleDeployToSoroban = () => {
    if (!asset?.code || !asset?.issuer) return;
    setIsDeploying(true);
    deployStellarAsset(asset, sorobanContext)
      .then((resp) => {
        console.log("then", resp);
        toast({
          title: "Asset deployed!",
          description: `You have successfully deployed ${asset.code} to Soroban.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
        refetch();
        setIsDeploying(false);
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
        refetch();
        setIsDeploying(false);
      });
  };

  const handleBumpContractInstance = async () => {
    if (!asset?.contract) return;
    setIsBumping(true);
    bumpContractInstance(asset?.contract, sorobanContext)
      .then((resp) => {
        console.log(resp);
        toast({
          title: "Asset ttl extended!",
          description: `You have successfully extended ${asset.code} instance TTL.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
        refetch();
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
        refetch();
        setIsBumping(false);
      });
  };

  return (
    <VStack spacing={4} width="250px">
      <Card
        flex={1}
        rounded={"2xl"}
        p={4}
        width={"full"}
        minH={"372px"}
        boxShadow="md"
      >
        <VStack justifyContent="flex-start" alignItems={"center"} spacing={6}>
          {/* Wallet Icon */}
          <Box bg="blue.50" p={4} rounded="full">
            <Icon as={FaWallet} boxSize={8} color="blue.400" />
          </Box>

          {/* Wallet Header */}
          <Text fontSize="xl" fontWeight="bold">
            Your Wallet
          </Text>

          <VStack spacing={1} alignItems="left">
            {/* Balance Section */}
            <VStack spacing={1} alignItems="left">
              <Text fontSize="lg" fontWeight="semibold">
                {assetForAccount?.balance || "0.000000"} {asset?.code || "ETH"}
              </Text>
              <Text fontSize="sm" color="gray.500">
                BALANCE
              </Text>
            </VStack>

            {/* Limit Section */}
            <VStack spacing={1} alignItems="left">
              <Text fontSize="lg" fontWeight="semibold">
                {assetForAccount?.limit ?? "0"} {asset?.code || "ETH"}
              </Text>
              <Text fontSize="sm" color="gray.500">
                LIMIT
              </Text>
            </VStack>
          </VStack>

          {/* Contract Status */}
          <HStack
            spacing={4}
            alignItems="center"
            width={"full"}
            justifyContent={"space-between"}
          >
            <VStack spacing={0} alignItems="left">
              <Text fontSize="sm" color="blue.500" fontWeight="semibold">
                {contractInfo.isActive
                  ? "Active"
                  : isDeployedOnSoroban
                  ? "Expired"
                  : "Not Deployed"}
              </Text>
              <Text fontSize="xs" color="gray.500">
                CONTRACT
              </Text>
            </VStack>
            <VStack spacing={0} alignItems="left">
              <Text fontSize="sm" fontWeight="medium">
                {contractInfo.remaining}
              </Text>
              <Text fontSize="xs" color="gray.500">
                TIME REMAINING
              </Text>
            </VStack>
          </HStack>
        </VStack>
        <ConnectWalletToUse />
      </Card>
      <Card flex={1} width={"full"} rounded={"2xl"} p={6} boxShadow="md">
        {/* Action Buttons */}
        <VStack spacing={4} width="full">
          <Button
            onClick={handleBumpContractInstance}
            colorScheme="pink"
            size="sm"
            width={"full"}
            height={8}
            isLoading={isBumping}
            isDisabled={!isDeployedOnSoroban}
            variant={"outline"}
          >
            Bump Contract
          </Button>
          <Button
            onClick={handleDeployToSoroban}
            colorScheme="pink"
            size="sm"
            width={"full"}
            height={8}
            variant={"outline"}
            isDisabled={isDeployedOnSoroban}
            isLoading={isDeploying}
          >
            Deploy on Soroban
          </Button>
          <ManageTrustlineButton asset={asset} />
        </VStack>
        <ConnectWalletToUse />
      </Card>
    </VStack>
  );
}
