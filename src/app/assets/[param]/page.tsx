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
import { useClipboard } from "@/hooks/useClipboard";
import { useParams } from "next/navigation";
import { DexPoolTable } from "@/components/Assets/pools/DexPoolTable";
import { AssetInfo } from "@/components/Assets/tabs/info/AssetInfo";
import { CommingSoon } from "@/components/DisabledComponents/CommingSoon";

type PoolsTable = {
  asset?: any;
};

const PoolsTable = ({ asset }: PoolsTable) => {
  return (
    <Tab.Panel>
      {asset ? (
        <DexPoolTable asset={asset} />
      ) : (
        <p className="text-gray-600 dark:text-gray-400">Select an asset to view pools.</p>
      )}
    </Tab.Panel>
  );
};

export default function Asset() {
  const copyToClipboard = useClipboard();
  const { param } = useParams<{ param: string }>();
  let temporalSkeletons = Array.from({ length: 8 }, (_, i) => i);

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
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Asset Card */}
      <div className="md:col-span-4">
        <AssetCard
          name={name}
          icon={asset?.icon}
          code={asset?.code}
          contract={asset?.contract}
          domain={asset?.domain}
          issuer={issuer}
        />
      </div>
      
      {/* Action Panel */}
      <div className="md:col-span-1 md:row-span-2">
        <AssetActionPanel asset={asset} />
      </div>
      
      {/* Tabs Section */}
      <div className="md:col-span-4">
        <Tab.Group>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full h-full">
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 dark:bg-blue-900/40 p-1">
              <Tab className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? 'bg-white dark:bg-gray-700 shadow text-blue-700 dark:text-blue-400'
                    : 'text-blue-600 dark:text-blue-300 hover:bg-white/[0.12] hover:text-blue-800 dark:hover:text-white'
                }`
              }>
                Info
              </Tab>
              <Tab className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? 'bg-white dark:bg-gray-700 shadow text-blue-700 dark:text-blue-400'
                    : 'text-blue-600 dark:text-blue-300 hover:bg-white/[0.12] hover:text-blue-800 dark:hover:text-white'
                }`
              }>
                Pools
              </Tab>
              <Tab className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                  selected
                    ? 'bg-white dark:bg-gray-700 shadow text-blue-700 dark:text-blue-400'
                    : 'text-blue-600 dark:text-blue-300 hover:bg-white/[0.12] hover:text-blue-800 dark:hover:text-white'
                }`
              }>
                Transactions
              </Tab>
            </Tab.List>
            <Tab.Panels className="min-h-[400px]">
              <Tab.Panel>
                <AssetInfo
                  asset={asset!}
                  assetInformation={assetInformation}
                  issuer={issuer}
                />
              </Tab.Panel>
              <PoolsTable asset={asset!} />
              <Tab.Panel>
                <div className="relative p-4 h-96">
                  <div className="space-y-3">
                    {temporalSkeletons.map((i) => (
                      <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ))}
                  </div>
                  <div className="max-h-96">
                    <CommingSoon />
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </div>
        </Tab.Group>
      </div>
    </div>
  );
}
