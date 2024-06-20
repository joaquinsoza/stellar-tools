import { useEffect, useState } from "react";
import { Pool } from "@/common/types/types";
import { ServerApi } from "@stellar/stellar-sdk/lib/horizon/server_api";

//TODO: improve reusability
export function usePoolsForAsset(
  call:
    | Promise<ServerApi.CollectionPage<ServerApi.LiquidityPoolRecord>>
    | undefined
) {
  const [pools, setPools] = useState<Pool[]>([]);
  const [next, setNext] = useState(() => call);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { pools, loading, loadMore };
}
