"use client";
import { Tab } from "@headlessui/react";
import { AssetActionPanel } from "@/components/Assets/AssetActionPanel";
import { AssetCard } from "@/components/Assets/AssetCard";
import { isAddress, isCodeIssuerPair } from "@/helpers/address";
import { UseAssetProps, useAsset } from "@/hooks/useAsset";
import {
  UseAssetInformationProps,
  useAssetInformation,
} from "@/hooks/useAssetInformation";
import { useParams } from "next/navigation";
import { DexPoolTable } from "@/components/Assets/pools/DexPoolTable";
import { AssetInfo } from "@/components/Assets/tabs/info/AssetInfo";
import { CommingSoon } from "@/components/DisabledComponents/CommingSoon";

const tabClasses = ({ selected }: { selected: boolean }) =>
  `flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
    selected
      ? "bg-pink-500 text-white"
      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
  }`;

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

  const name = asset?.name || asset?.code || assetInformation?.asset_code;
  const issuer = asset?.issuer || assetInformation?.asset_issuer;

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Asset Card */}
        <AssetCard
          name={name}
          icon={asset?.icon}
          code={asset?.code}
          contract={asset?.contract}
          domain={asset?.domain}
          issuer={issuer}
        />

        {/* Tabs Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <Tab.Group>
            <Tab.List className="flex gap-1 p-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-t-xl">
              <Tab className={tabClasses}>Info</Tab>
              <Tab className={tabClasses}>Pools</Tab>
              <Tab className={tabClasses}>Transactions</Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <AssetInfo
                  asset={asset}
                  assetInformation={assetInformation}
                  issuer={issuer}
                />
              </Tab.Panel>
              <Tab.Panel>
                {asset ? (
                  <DexPoolTable asset={asset} />
                ) : (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    Loading asset data...
                  </div>
                )}
              </Tab.Panel>
              <Tab.Panel>
                <div className="relative p-4">
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                      />
                    ))}
                  </div>
                  <CommingSoon />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* Action Panel - Mobile (after tabs) */}
        <div className="lg:hidden">
          <AssetActionPanel asset={asset} />
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block lg:w-72 flex-shrink-0">
        <div className="sticky top-4">
          <AssetActionPanel asset={asset} />
        </div>
      </div>
    </div>
  );
}
