import useSWR from "swr";
import _ from "lodash";
import {
  fetchAvailableAssetLists,
  fetchAssetList,
} from "@stellar-asset-lists/sdk";

export function useMergedAssetLists() {
  // Fetch the catalogue using SWR.
  const { data: catalogue, error: catalogueError } = useSWR(
    "catalogue",
    fetchAvailableAssetLists
  );

  // Once the catalogue is available, fetch all asset lists and merge them.
  const { data, error: assetListsError } = useSWR(
    () => catalogue?.map((entry) => entry.url),
    async (urls) => {
      const lists = await Promise.all(urls.map(fetchAssetList));
      const mergedAssets = _.flatten(lists.map((list) => list.assets));

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
    assets: data,
    isLoading: !catalogue && !catalogueError,
    isError: catalogueError || assetListsError,
  };
}
