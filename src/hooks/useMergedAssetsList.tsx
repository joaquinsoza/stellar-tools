import useSWR from "swr";
import _ from "lodash";
// @ts-ignore
import * as StellarAssetListsSdk from "@stellar-asset-lists/sdk";
import { Asset, Networks } from "@stellar/stellar-sdk";
import {
  Asset as AssetType,
  AssetListDescriptor,
  AssetList,
} from "@/types/external";
import { xlmAsset } from "@/components/constants/xlmAsset";

export function useMergedAssetLists() {
  // Fetch the catalogue using SWR.
  const { data: catalogue, error: catalogueError } = useSWR(
    "catalogue",
    StellarAssetListsSdk.fetchAvailableAssetLists
  );

  // Once the catalogue is available, fetch all asset lists and merge them.
  const { data, error: assetListsError } = useSWR(
    () => catalogue?.map((entry: AssetListDescriptor) => entry.url),
    async (urls) => {
      const lists = await Promise.all(
        urls.map(StellarAssetListsSdk.fetchAssetList)
      );
      let mergedAssets = _.flatten(lists.map((list: AssetList) => list.assets));

      // Enhance assets without a contract.
      mergedAssets = mergedAssets.map((asset) => {
        if (!asset.contract && asset.code && asset.issuer) {
          try {
            const newAsset = new Asset(asset.code, asset.issuer);
            const contract = newAsset.contractId(Networks.PUBLIC);
            return { ...asset, contract };
          } catch (error) {
            console.error("Error generating contract for asset:", asset, error);
          }
        }

        return asset;
      });

      mergedAssets.unshift(xlmAsset);

      // Remove duplicates, preferring entries with contracts.
      return _.uniqWith(mergedAssets, (a, b) => {
        // If both have a contract, compare using it.
        if (a.contract && b.contract) {
          return a.contract === b.contract;
        }
        // Otherwise, compare using code and issuer.
        return a.code === b.code && a.issuer === b.issuer;
      });
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    providers: catalogue,
    assets: data,
    isLoading: !catalogue && !catalogueError,
    isError: catalogueError || assetListsError,
  };
}
