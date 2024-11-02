"use client";
import { AssetActionPanel } from "@/components/Assets/AssetActionPanel";
import { AssetCard } from "@/components/Assets/AssetCard";
import { ManageTrustlineButton } from "@/components/Buttons/ManageTrustlineButton";
import { CommingSoon } from "@/components/DisabledComponents/CommingSoon";
import { ConnectWalletToUse } from "@/components/DisabledComponents/ConnectWalletToUse";
import { isAddress, isCodeIssuerPair, shortenAddress } from "@/helpers/address";
import { UseAssetProps, useAsset } from "@/hooks/useAsset";
import {
  UseAssetInformationProps,
  useAssetInformation,
} from "@/hooks/useAssetInformation";
import { useClipboard } from "@/hooks/useClipboard";
import {
  Box,
  VStack,
  Link,
  Button,
  Text,
  Skeleton,
  Stack,
  Card,
  Grid,
  useMediaQuery,
  GridItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  HStack,
  SimpleGrid,
  Tooltip,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { Asset as AssetType } from "@stellar-asset-lists/sdk";
import { DexPoolTable } from "@/components/Assets/pools/DexPoolTable";
import { AssetInfo } from "@/components/Assets/tabs/info/AssetInfo";

type PoolsTable = {
  asset?: AssetType;
};

const PoolsTable = ({ asset }: PoolsTable) => {
  return (
    <TabPanel>
      {asset ? (
        <DexPoolTable asset={asset} />
      ) : (
        <Text>Select an asset to view pools.</Text>
      )}
    </TabPanel>
  );
};

export default function Asset() {
  const copyToClipboard = useClipboard();
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
  const name = asset?.name
    ? asset.name
    : asset?.code
    ? asset.code
    : assetInformation?.asset_code;

  const issuer = asset?.issuer ? asset.issuer : assetInformation?.asset_issuer;

  // Example on how to get the pools, TODO: Make it so it can do an infinite scroll... more details in Issue #3

  return (
    <Grid
      templateAreas={{
        base: `
          "info"
          "moreInfo"
          "actions"
          "transactions"
        `,
        md: `
          "info actions"
          "moreInfo actions"
          "transactions transactions"
        `,
      }}
      gridTemplateColumns={{ md: "4fr 1fr" }}
      gap={4}
    >
      <GridItem gridArea="info">
        <AssetCard
          name={name}
          icon={asset?.icon}
          code={asset?.code}
          contract={asset?.contract}
          domain={asset?.domain}
          issuer={issuer}
        />
      </GridItem>
      <GridItem gridArea="actions">
        <AssetActionPanel asset={asset} />
      </GridItem>
      <GridItem gridArea="moreInfo">
        <Tabs
          rounded="2xl"
          width="100%"
          height="100%"
          bg={"Background"}
          colorScheme="pink"
        >
          <TabList>
            <Tab>Info</Tab>
            <Tab>Pools</Tab>
            <Tab>Transactions</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <AssetInfo
                asset={asset!}
                assetInformation={assetInformation}
                issuer={issuer}
              />
            </TabPanel>
            <PoolsTable asset={asset!} />
          </TabPanels>
          <TabPanels>Coming soon</TabPanels>
        </Tabs>
      </GridItem>
      <GridItem gridArea="transactions">
        <Text fontSize="lg" fontWeight="semibold">
          Transactions
        </Text>
        <Box position="relative" p={4}>
          <Stack spacing={3}>
            <Skeleton height="35px" speed={2} />
            <Skeleton height="35px" speed={2} />
            <Skeleton height="35px" speed={2} />
          </Stack>
          <CommingSoon />
        </Box>
      </GridItem>
    </Grid>
  );
}
