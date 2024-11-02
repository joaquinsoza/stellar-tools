import {
  VStack,
  Text,
  SimpleGrid,
  HStack,
  Link,
  Tooltip,
  Image,
} from "@chakra-ui/react";
import { shortenAddress } from "@/helpers/address";
import { useClipboard } from "@/hooks/useClipboard";
import { FC } from "react";
import { Asset as AssetType } from "@stellar-asset-lists/sdk";
import { InfoCard } from "./InfoCard";
type AssetInfoProps = {
  asset: AssetType;
  assetInformation: any;
  issuer: string;
};

export const AssetInfo: FC<AssetInfoProps> = ({
  asset,
  assetInformation,
  issuer,
}) => {
  const cardsInfo = [
    {
      title: "Issuer",
      content: shortenAddress(issuer),
      icon: "/icons/issuerIcon.svg",
    },
    {
      title: "Organization",
      content: asset?.org,
      icon: "/icons/organizationIcon.svg",
    },
    {
      title: "Holders",
      content: assetInformation?.num_accounts,
      icon: "/icons/holdersIcon.svg",
    },
    {
      title: "Supply",
      content: assetInformation?.amount,
      icon: "/icons/supplyIcon.svg",
    },
    {
      title: "Decimals",
      content: asset?.decimals,
      icon: "/icons/decimalsIcon.svg",
    },
  ];

  return (
    <VStack spacing={1} align="flex-start">
      {asset?.comment && (
        <Text fontStyle="italic" color="gray.500">
          List provider comment: {`"${asset?.comment}"`}
        </Text>
      )}
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        spacing={6}
        alignContent="center"
        justifyContent="center"
        alignItems="center"
        width={"80%"}
      >
        {cardsInfo.map((cardInfo) => (
          <InfoCard
            title={cardInfo.title}
            content={cardInfo.content}
            icon={cardInfo.icon}
            key={cardInfo.title}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
};
