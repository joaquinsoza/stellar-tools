import { FC } from "react";
import { shortenAddress } from "@/helpers/address";
import { InfoCard } from "./InfoCard";

type AssetInfoProps = {
  asset: any;
  assetInformation: any;
  issuer?: string;
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
    <div className="flex flex-col space-y-1 items-start">
      {asset?.comment && (
        <p className="italic text-gray-500">
          List provider comment: {`"${asset?.comment}"`}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-center w-4/5">
        {cardsInfo.map((cardInfo) => (
          <InfoCard
            title={cardInfo.title}
            content={cardInfo.content}
            icon={cardInfo.icon}
            key={cardInfo.title}
          />
        ))}
      </div>
    </div>
  );
};
