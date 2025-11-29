"use client";
import { usePoolsForAsset } from "@/hooks/usePools";
import { AssetType } from "@/hooks/useMergedAssetsList";
import React, { useRef } from "react";

type DexPoolTableProps = {
  asset: AssetType;
};

export function DexPoolTable({ asset }: DexPoolTableProps) {
  const { pools, loading } = usePoolsForAsset();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="max-h-96 max-w-7xl overflow-y-auto border border-gray-200 rounded-lg p-4"
    >
      {loading ? (
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
                Action
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
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View Pool
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">--</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">--</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>
                  <div className="flex justify-center items-center h-full py-8">
                    <span className="text-gray-500">No pools available yet.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
