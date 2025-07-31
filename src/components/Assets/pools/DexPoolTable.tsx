"use client";
import { usePoolsForAsset } from "@/hooks/usePools";
import React, { useEffect, useRef } from "react";
import {
  generateStellarXUrl,
  getAssetPair,
  calculatePrice,
} from "@/components/utils/Assets/Pool";
import { useSorobanReact } from "@soroban-react/core";
import { Asset, Horizon } from "@stellar/stellar-sdk";

import { Asset as AssetType } from "@stellar-asset-lists/sdk";

type DexPoolTableProps = {
  asset: AssetType;
};

export function DexPoolTable({ asset }: DexPoolTableProps) {
  const { serverHorizon } = useSorobanReact();
  const newAsset = new Asset(asset?.code, asset?.issuer);
  const call = serverHorizon?.liquidityPools().forAssets(newAsset).call();
  const { pools, loading, loadMore } = usePoolsForAsset(call);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  const handleScroll = () => {
    if (scrollRef.current && !loading) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        loadMore();
      }
    }
  };

  useEffect(() => {
    const currentScrollRef = scrollRef.current;

    if (currentScrollRef) {
      currentScrollRef.addEventListener("scroll", handleScroll);
      return () => {
        currentScrollRef.removeEventListener("scroll", handleScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loadMore]);

  useEffect(() => {
    if (pools.length > 0) {
      setIsInitialLoad(false);
    }
  }, [pools]);

  return (
    <div
      ref={scrollRef}
      className="max-h-96 max-w-7xl overflow-y-auto border border-gray-200 rounded-lg p-4"
      onScroll={handleScroll}
    >
      {isInitialLoad && loading ? (
        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-10 bg-gray-200 rounded animate-pulse my-2" />
          ))}
        </div>
      ) : (
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <img
                  src="/images/stellarx.svg"
                  alt="StellarX"
                  width={20}
                  height={20}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pools.length > 0 ? (
              pools.map((pool) => (
                <tr
                  key={pool.id}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() =>
                        window.open(
                          generateStellarXUrl(pool.reserves),
                          "_blank"
                        )
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      view on StellarX
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getAssetPair(pool.reserves)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculatePrice(pool.reserves)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>
                  <div className="flex justify-center items-center h-full py-8">
                    <span className="text-gray-500">Actually dont have pools.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {loading && !isInitialLoad && (
        <div className="flex justify-center items-center mt-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
