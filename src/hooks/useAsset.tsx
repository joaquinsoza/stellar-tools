import { useMergedAssetLists, AssetType } from "./useMergedAssetsList";
import { useEffect, useState } from "react";

export interface UseAssetProps {
  contract?: string;
  code?: string;
  issuer?: string;
}

export interface LedgerContractInfo {
  isActive: boolean;
  remaining: string;
  expiresOnLedger?: number;
  modifiedOnLedger?: number;
  currentLedgerSeq?: number;
}

export function useAsset({
  contract,
  code,
  issuer,
}: UseAssetProps): AssetType | undefined {
  const { assets } = useMergedAssetLists();
  const [asset, setAsset] = useState<AssetType | undefined>(undefined);

  useEffect(() => {
    if (!assets) return;

    // Find asset by contract
    if (contract) {
      const foundAsset = assets.find((ast: AssetType) => ast.contract === contract);
      if (foundAsset) {
        setAsset(foundAsset);
        return;
      }
    }

    // Find asset by code and issuer
    if (code && issuer) {
      const foundAsset = assets.find(
        (ast: AssetType) => ast.code === code && ast.issuer === issuer
      );
      if (foundAsset) {
        setAsset(foundAsset);
        return;
      }
    }

    // Find asset by code only (for XLM)
    if (code && !issuer) {
      const foundAsset = assets.find((ast: AssetType) => ast.code === code);
      if (foundAsset) {
        setAsset(foundAsset);
        return;
      }
    }

    setAsset(undefined);
  }, [contract, code, issuer, assets]);

  return asset;
}

export interface AssetBalance {
  balance: string;
  limit?: string;
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
}

export const useAssetForAccount = (asset?: AssetType) => {
  // Mock data - will be replaced with actual wallet balance fetching later
  const [contractInfo] = useState<LedgerContractInfo>({
    isActive: true,
    remaining: "-- Days",
    expiresOnLedger: undefined,
    modifiedOnLedger: undefined,
  });

  const refetch = () => {
    // Will be implemented when blockchain integration is added back
  };

  return {
    assetForAccount: null as AssetBalance | null, // No wallet balance without blockchain connection
    contractInfo,
    isLoading: false,
    isError: false,
    refetch,
  };
};
