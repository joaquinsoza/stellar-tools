import { useSorobanReact } from "@soroban-react/core";
import { Asset, Horizon } from "@stellar/stellar-sdk";
import { useEffect, useState } from "react";
import { Asset as AssetType } from "@stellar-asset-lists/sdk";

interface Pool {
  id: string;
  fee: number;
  type: string;
  total_shares: string;
  reserves: Array<{ asset: string; amount: string }>;
}

//TODO: delete when the another usePools is finished

export function usePoolsForAsset(asset?: AssetType): Pool[] | undefined {
  const { serverHorizon } = useSorobanReact();
  const [pools, setPools] = useState<Pool[] | undefined>(undefined);
  console.log("🚀 « asset:", asset);
  useEffect(() => {
    const fetchPoolsForAsset = async () => {
      try {
        if (!asset) return;
        const newAsset = new Asset(asset.code, asset.issuer);
        const response = await serverHorizon
          ?.liquidityPools()
          .forAssets(newAsset)
          .call();

        const poolsData = response?.records.map((record) => ({
          id: record.id,
          fee: record.fee_bp,
          type: record.type,
          total_shares: record.total_shares,
          reserves: record.reserves.map((reserve) => ({
            asset: reserve.asset,
            amount: reserve.amount,
          })),
        }));

        setPools(poolsData);
      } catch (error) {
        console.error("Error fetching pools for asset:", error);
      }
    };

    fetchPoolsForAsset();
  }, [asset, serverHorizon]);

  return pools;
}

export function usePoolsTest3(asset: AssetType) {
  const { serverHorizon } = useSorobanReact();
  const [pools, setPools] = useState<Pool[]>([]);
  const newAsset = new Asset(asset?.code, asset?.issuer);
  const [next, setNext] = useState(() =>
    serverHorizon?.liquidityPools().forAssets(newAsset).call()
  );
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || !next) {
      return;
    }

    setLoading(true);
    try {
      const response = await next;

      setPools((prevPools) => {
        const newPools = response.records.map((record) => ({
          id: record.id,
          fee: record.fee_bp,
          type: record.type,
          total_shares: record.total_shares,
          reserves: record.reserves.map((reserve) => ({
            asset: reserve.asset,
            amount: reserve.amount,
          })),
        }));

        const uniquePools = Array.from(
          new Set([
            ...prevPools.map((pool) => JSON.stringify(pool)),
            ...newPools.map((pool) => JSON.stringify(pool)),
          ])
        );

        return uniquePools.map((pool) => JSON.parse(pool));
      });
      setNext(response.next);
    } catch (error) {
      console.error("Error loading pools:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMore();
  }, []);
  return { pools, loading, loadMore };
}
