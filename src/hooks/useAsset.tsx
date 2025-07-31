import { Asset as AssetType } from "@stellar-asset-lists/sdk";
import { useMergedAssetLists } from "./useMergedAssetsList";
import { useAccountBalances } from "./useBalances";
import { useCallback, useEffect, useState } from "react";
import {
  Asset,
  Contract,
  Horizon,
  Networks,
  SorobanRpc,
} from "@stellar/stellar-sdk";
import { useSorobanReact } from "@soroban-react/core";
import {
  getTokenDecimals,
  getTokenName,
  getTokenSymbol,
} from "@/helpers/soroban";
import { getContractLedgerInfo, LedgerContractInfo } from "./useContract";

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
}: UseAssetProps): AssetType | undefined {
  const sorobanContext = useSorobanReact();
  const { assets } = useMergedAssetLists();
  const [asset, setAsset] = useState<AssetType | undefined>(undefined);

  useEffect(() => {
    const fetchAssetMetadata = async () => {
      if (contract) {
        const foundAsset = assets?.find((ast: AssetType) => ast.contract === contract);
        if (foundAsset) {
          setAsset(foundAsset);
          return;
        }

        try {
          let tokenCode, tokenIssuer;
          const tokenName = await getTokenName(sorobanContext, contract);
          if (tokenName?.includes(":")) {
            const [tokenCodeFromBlockchain, tokenIssuerFromBlockchain] =
              tokenName.split(/[:]/);
            tokenCode = tokenCodeFromBlockchain;
            tokenIssuer = tokenIssuerFromBlockchain;
          } else {
            tokenCode = await getTokenSymbol(sorobanContext, contract);
          }
          setAsset({
            name: tokenName ?? "",
            code: tokenCode ?? "",
            issuer: tokenIssuer ?? "",
            contract: contract,
            org: "",
            domain: "",
            icon: "",
            decimals: await getTokenDecimals(sorobanContext, contract),
          });
        } catch (error) {}
      }

      if (code && issuer) {
        const foundAsset = assets?.find(
          (ast: AssetType) => ast.code === code && ast.issuer === issuer
        );
        if (foundAsset) {
          setAsset(foundAsset);
          return;
        }

        // Fetch from blockchain if not found in the local list
        try {
          const server = new Horizon.Server("https://horizon.stellar.org");
          const response = await server
            .assets()
            .forCode(code)
            .forIssuer(issuer)
            .call();
          if (response.records.length > 0) {
            const assetMetadata = response.records[0];
            // TODO: Should Fetch TOML data (getting cors error with some assets eg. ZI-GDBNNE67F54PTUZTCTOQYT5CQZFXA2AX6O5DCA5BVR653OP6KCWGG2Z7)
            // if (assetMetadata.toml) {
            //   try {
            //     const tomlData = await assetMetadata.toml();
            //     console.log("TOML Data:", tomlData);
            //   } catch (tomlError) {
            //     console.error("Error fetching TOML data:", tomlError);
            //   }
            // }
            let tempContract: any = new Asset(
              assetMetadata.asset_code,
              assetMetadata.asset_issuer
            );
            tempContract = tempContract.contractId(
              sorobanContext.activeChain?.networkPassphrase ?? ""
            );
            setAsset({
              name: assetMetadata.asset_code,
              code: assetMetadata.asset_code,
              issuer: assetMetadata.asset_issuer,
              contract: tempContract,
              org: "",
              domain: "",
              icon: "",
              decimals: 7,
            });
          } else {
            console.log("Asset not found.");
          }
        } catch (error) {
          console.error("Error fetching asset metadata:", error);
        }
      }
    };

    fetchAssetMetadata();
  }, [contract, code, issuer, assets, sorobanContext]);

  return asset;
}

export const useAssetForAccount = (asset?: AssetType) => {
  const { balances, isLoading, isError } = useAccountBalances();

  const [assetForAccount, setAssetForAccount] = useState<any>(null);
  const [contractInfo, setContractInfo] = useState<LedgerContractInfo>({
    isActive: true,
    remaining: "0 Days",
    expiresOnLedger: undefined,
    modifiedOnLedger: undefined,
  });

  const fetchContractInfo = useCallback(async () => {
    if (asset?.contract) {
      const info = await getContractLedgerInfo(asset.contract);
      setContractInfo(info);
    }
  }, [asset]);

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
    fetchContractInfo();
  }, [balances, asset, fetchContractInfo]);

  return {
    assetForAccount,
    contractInfo,
    isLoading,
    isError,
    refetch: fetchContractInfo,
  };
};
