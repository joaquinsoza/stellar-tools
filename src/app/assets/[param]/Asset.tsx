"use client";
import { AssetCard } from "@/components/Assets/AssetCard";
import { isAddress, isCodeIssuerPair } from "@/helpers/address";
import { UseAssetProps, useAsset } from "@/hooks/useAsset";
import {
  UseAssetInformationProps,
  useAssetInformation,
} from "@/hooks/useAssetInformation";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import {
  Box,
  VStack,
  HStack,
  Link,
  Button,
  Text,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import { useSorobanReact } from "@soroban-react/core";
import { useParams } from "next/navigation";

export default function Asset() {
  const { address, serverHorizon } = useSorobanReact();
  const copyToClipboard = useCopyToClipboard();
  const { param } = useParams<{ param: string }>();

  let assetProps: UseAssetProps = {};
  let assetInformationProps: UseAssetInformationProps = {};

  if (isAddress(param)) {
    assetProps.contract = param;
  } else if (isCodeIssuerPair(param)) {
    const [code, issuer] = param.split(/[-:]/);
    assetProps = { code, issuer };
    assetInformationProps = { code, issuer };
  }

  const asset = useAsset(assetProps);
  if (asset) {
    assetInformationProps = { code: asset.code, issuer: asset.issuer };
  }
  const { data: assetInformation } = useAssetInformation(assetInformationProps);
  console.log("🚀 « assetInformation:", assetInformation);
  const name = asset?.name
    ? asset.name
    : asset?.code
    ? asset.code
    : assetInformation?.asset_code;

  const issuer = asset?.issuer ? asset.issuer : assetInformation?.asset_issuer;

  return (
    <VStack spacing={4} align="stretch">
      <AssetCard />
      <VStack spacing={1} align="flex-start">
        <Text>{asset?.comment}</Text>
        <Text>Issuer: {issuer}</Text>
        <Text>{asset?.decimals}</Text>
        <Text>{asset?.domain}</Text>
        <Text>{asset?.org}</Text>
        <Text>Supply: {assetInformation?.amount}</Text>
        <Text>Holders: {assetInformation?.num_accounts}</Text>
        <Text>Flags: {JSON.stringify(assetInformation?.flags)}</Text>
      </VStack>
      <HStack justifyContent="space-around">
        <Button colorScheme="pink" size="lg">
          Deploy on Soroban
        </Button>
        <Button colorScheme="pink" size="lg">
          Bump Contract
        </Button>
      </HStack>
      <Text fontSize="lg" fontWeight="semibold">
        Balance: {0}
      </Text>
      <HStack justifyContent="space-around">
        <Link href="#" fontSize="sm">
          See on stellar.expert
        </Link>
        <Link href="#" fontSize="sm">
          See on stellarchain.io
        </Link>
        <Link href="#" fontSize="sm">
          Swap on soroswap
        </Link>
      </HStack>
      <Box>
        <Text fontSize="lg" fontWeight="semibold">
          Transactions
        </Text>
        <Box position="relative" p={4}>
          <Stack spacing={3}>
            <Skeleton height="35px" speed={2.2} />
            <Skeleton height="35px" speed={2.1} />
            <Skeleton height="35px" speed={2} />
          </Stack>
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            backdropFilter="blur(8px)"
            zIndex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="xl">Coming soon...</Text>
          </Box>
        </Box>
      </Box>
    </VStack>
  );
}
