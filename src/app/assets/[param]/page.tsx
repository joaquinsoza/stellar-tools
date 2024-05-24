"use client";
import { AssetActionPanel } from "@/components/Assets/AssetActionPanel";
import { AssetCard } from "@/components/Assets/AssetCard";
import { DexPoolTable } from "@/components/Assets/pools/DexPoolTable";
import { ManageTrustlineButton } from "@/components/Buttons/ManageTrustlineButton";
import { CommingSoon } from "@/components/DisabledComponents/CommingSoon";
import { ConnectWalletToUse } from "@/components/DisabledComponents/ConnectWalletToUse";
import { isAddress, isCodeIssuerPair, shortenAddress } from "@/helpers/address";
import { UseAssetProps, useAsset, useAssetForAccount } from "@/hooks/useAsset";
import {
  UseAssetInformationProps,
  useAssetInformation,
} from "@/hooks/useAssetInformation";
import { useClipboard } from "@/hooks/useClipboard";
import { usePoolsForAsset } from "@/hooks/usePools";
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
  const aa = usePoolsForAsset(asset);
  console.log("🚀 « aa:", aa);

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
        />
      </GridItem>
      <GridItem gridArea="actions">
        <AssetActionPanel asset={asset} />
      </GridItem>
      <GridItem gridArea="moreInfo">
        <Tabs
          rounded="2xl"
          width="100%"
          height={80}
          bg={"Background"}
          colorScheme="pink"
        >
          <TabList>
            <Tab>Info</Tab>
            <Tab>Pools</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack spacing={4} align="flex-start">
                {asset?.comment && (
                  <Text fontStyle="italic" color="gray.500">
                    List provider comment: {`"${asset?.comment}"`}
                  </Text>
                )}
                <SimpleGrid
                  columns={{ base: 1, md: 2 }}
                  spacing={2}
                  width="100%"
                >
                  <Tooltip label="Copy to clipboard" openDelay={500}>
                    <HStack
                      cursor={"pointer"}
                      onClick={() =>
                        copyToClipboard(
                          issuer,
                          `${asset?.code} address copied!`
                        )
                      }
                    >
                      <Text>
                        <strong>Issuer:</strong> {shortenAddress(issuer)}
                      </Text>
                    </HStack>
                  </Tooltip>
                  <Text>
                    <strong>Decimals:</strong> {asset?.decimals}
                  </Text>
                  <Text>
                    <strong>Organization:</strong> {asset?.org}
                  </Text>
                  <Text>
                    <strong>Supply:</strong> {assetInformation?.amount}
                  </Text>
                  <Text>
                    <strong>Holders:</strong> {assetInformation?.num_accounts}
                  </Text>
                </SimpleGrid>

                <HStack spacing={2}>
                  <Link
                    href={`https://stellar.expert/explorer/public/asset/${asset?.code}-${asset?.issuer}`}
                    target="_blank"
                    fontSize="sm"
                  >
                    See on stellar.expert
                  </Link>
                  <Link
                    href={`https://stellarchain.io/assets/${asset?.code}-${asset?.issuer}`}
                    target="_blank"
                    fontSize="sm"
                  >
                    See on stellarchain.io
                  </Link>
                  <Link
                    href={`https://app.soroswap.finance/swap/${asset?.contract}`}
                    target="_blank"
                    fontSize="sm"
                  >
                    Swap on soroswap
                  </Link>
                </HStack>
              </VStack>
            </TabPanel>

            <TabPanel>
              {asset && <DexPoolTable asset={asset!}></DexPoolTable>}
            </TabPanel>
          </TabPanels>
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
