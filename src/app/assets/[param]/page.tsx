"use client";
import { AssetCard } from "@/components/Assets/AssetCard";
import { CommingSoon } from "@/components/DisabledComponents/CommingSoon";
import { ConnectWalletToUse } from "@/components/DisabledComponents/ConnectWalletToUse";
import { isAddress, isCodeIssuerPair, shortenAddress } from "@/helpers/address";
import { UseAssetProps, useAsset, useAssetForAccount } from "@/hooks/useAsset";
import {
  UseAssetInformationProps,
  useAssetInformation,
} from "@/hooks/useAssetInformation";
import {
  Box,
  VStack,
  Link,
  Button,
  Text,
  Skeleton,
  Stack,
  Card,
  CardBody,
  Grid,
  useMediaQuery,
  GridItem,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";

export default function Asset() {
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
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const { assetForAccount, isLoading } = useAssetForAccount(asset);

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
        <Card flex={1} height={"full"} rounded={"2xl"} p={4}>
          <VStack
            justifyContent="flex-start"
            height="100%"
            alignItems={"stretch"}
          >
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
            <Button colorScheme="pink" size="lg">
              Manage Trustline
            </Button>
            <Button colorScheme="pink" size="lg">
              Deploy on Soroban
            </Button>
            <Button colorScheme="pink" size="lg">
              Bump Contract
            </Button>
          </VStack>
          <ConnectWalletToUse />
        </Card>
      </GridItem>
      <GridItem gridArea="moreInfo">
        <Card rounded="2xl" width="100%">
          <CardBody>
            <VStack spacing={1} align="flex-start">
              <Text>{asset?.comment}</Text>
              <Text>Issuer: {isMobile ? shortenAddress(issuer) : issuer}</Text>
              <Text>decimals: {asset?.decimals}</Text>
              <Text>domain: {asset?.domain}</Text>
              <Text>organization: {asset?.org}</Text>
              <Text>Supply: {assetInformation?.amount}</Text>
              <Text>Holders: {assetInformation?.num_accounts}</Text>
              {/* <Text>Flags: {JSON.stringify(assetInformation?.flags)}</Text> */}
              <Link href="#" fontSize="sm">
                See on stellar.expert
              </Link>
              <Link href="#" fontSize="sm">
                See on stellarchain.io
              </Link>
              <Link href="#" fontSize="sm">
                Swap on soroswap
              </Link>
            </VStack>
          </CardBody>
        </Card>
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
