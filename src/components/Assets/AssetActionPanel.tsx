import { useAssetForAccount } from "@/hooks/useAsset";
import {
  Card,
  VStack,
  Text,
  Skeleton,
  Box,
  Button,
  useToast,
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

interface AssetActionProps {
  asset?: Asset;
}

export function AssetActionPanel({ asset }: AssetActionProps) {
  const sorobanContext = useSorobanReact();
  const toast = useToast();
  const { assetForAccount, isLoading } = useAssetForAccount(asset);

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
    <Card flex={1} height={"full"} rounded={"2xl"} p={4}>
      <VStack justifyContent="flex-start" height="100%" alignItems={"stretch"}>
        <Box bg={"Highlight"} rounded={"lg"} p={2}>
          <Text fontSize={"lg"} fontWeight={500}>
            Balance:
          </Text>
          <Skeleton isLoaded={!isLoading} fadeDuration={1}>
            <Text>
              {assetForAccount?.balance} {asset?.code}
            </Text>
          </Skeleton>
          {assetForAccount?.limit && (
            <>
              <Text fontSize={"lg"} fontWeight={500}>
                Limit:
              </Text>
              <Skeleton isLoaded={!isLoading} fadeDuration={1}>
                <Text>
                  {assetForAccount?.limit} {asset?.code}
                </Text>
              </Skeleton>
            </>
          )}
        </Box>
        <ManageTrustlineButton asset={asset} />
        <Button
          onClick={handleDeployToSoroban}
          colorScheme="pink"
          size="lg"
          isDisabled={isDeployedOnSoroban}
          isLoading={isDeploying}
        >
          Deploy on Soroban
        </Button>
        <Button
          onClick={handleBumpContractInstance}
          colorScheme="pink"
          size="lg"
          isLoading={isBumping}
        >
          Bump Contract
        </Button>
      </VStack>
      <ConnectWalletToUse />
    </Card>
  );
}
