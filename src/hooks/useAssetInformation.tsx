import { useSorobanReact } from "@soroban-react/core";
import useSWR from "swr";

const fetchAssetOnHorizon = async (
  code: string,
  issuer: string,
  serverHorizon: any
) => {
  try {
    const assetResponse = await serverHorizon
      .assets()
      .forCode(code)
      .forIssuer(issuer)
      .call();
    return assetResponse;
  } catch (err) {
    throw new Error("Error fetching asset from horizon server");
  }
};

export interface UseAssetInformationProps {
  contract?: string;
  code?: string;
  issuer?: string;
}

export function useAssetInformation({
  contract,
  code,
  issuer,
}: UseAssetInformationProps) {
  const { serverHorizon } = useSorobanReact();
  // TODO: If contract is provided it should also try and get information from Soroban
  const {
    data: dataFromHorizon,
    error,
    isLoading,
  } = useSWR(
    code && issuer && serverHorizon
      ? ["asset", code, issuer, serverHorizon]
      : null,
    () => {
      if (
        typeof code === "string" &&
        typeof issuer === "string" &&
        serverHorizon
      ) {
        return fetchAssetOnHorizon(code, issuer, serverHorizon);
      }
      throw new Error("Invalid parameters for fetchAssetOnHorizon");
    },
    {
      shouldRetryOnError: false,
    }
  );

  return {
    data: dataFromHorizon?.records[0],
    isLoading,
    error,
  };
}
