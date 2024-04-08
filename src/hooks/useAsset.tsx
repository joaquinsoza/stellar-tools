import { Asset } from "@/types/external";
import { useMergedAssetLists } from "./useMergedAssetsList";
import { useAccountBalances } from "./useBalances";
import { useEffect, useState } from "react";

type MyBalanceLineAsset = {
  balance: string;
  limit?: string;
  buying_liabilities?: string;
  selling_liabilities?: string;
  last_modified_ledger?: number;
  is_authorized?: boolean;
  is_authorized_to_maintain_liabilities?: boolean;
  asset_type: "credit_alphanum4" | "credit_alphanum12";
  asset_code?: string;
  asset_issuer?: string;
};
export interface UseAssetProps {
  contract?: string;
  code?: string;
  issuer?: string;
}

export function useAsset({
  contract,
  code,
  issuer,
}: UseAssetProps): Asset | undefined {
  const { assets } = useMergedAssetLists();

  // If a contract address is provided, find the asset by contract.
  if (contract) {
    return assets?.find((ast) => ast.contract === contract);
  }

  // If a code and issuer pair is provided, find the asset by code and issuer.
  if (code && issuer) {
    return assets?.find((ast) => ast.code === code && ast.issuer === issuer);
  }

  // If neither is found, return undefined. TODO: Should look the token in the blockchain
  return undefined;
}

export const useAssetForAccount = (asset?: Asset) => {
  const { balances, isLoading, isError } = useAccountBalances();

  const [assetForAccount, setAssetForAccount] = useState<any>(null);

  useEffect(() => {
    if (!balances || !asset) return;

    const foundAsset = balances.find((b: any): b is MyBalanceLineAsset => {
      if (asset.contract && b.asset_type === "native") {
        return (
          asset.contract ===
          "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA"
        );
      }

      return (
        b.asset_type !== "native" &&
        b.asset_code === asset.code &&
        b.asset_issuer === asset.issuer
      );
    });

    setAssetForAccount(foundAsset);
  }, [balances, asset]);
  return {
    assetForAccount,
    isLoading,
    isError,
  };
};
