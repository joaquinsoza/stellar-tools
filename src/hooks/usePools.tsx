import { useSorobanReact } from "@soroban-react/core";
import { Asset } from "@stellar/stellar-sdk";
import { useEffect, useState } from "react";
import { Asset as AssetType } from "@stellar-asset-lists/sdk";
import { Pool } from "@/common/types/types";

export function usePoolsForAsset(asset: AssetType) {
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
