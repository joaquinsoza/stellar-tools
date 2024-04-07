import { Asset } from "@/types/external";
import { useMergedAssetLists } from "./useMergedAssetsList";

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
