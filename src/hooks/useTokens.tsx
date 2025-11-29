import useSWR from "swr";

export interface AssetType {
  code: string;
  issuer: string;
  contract: string;
  name: string;
  org: string;
  domain: string;
  icon: string;
  decimals: number;
}

interface TokensResponse {
  assets: AssetType[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTokens() {
  const { data, error, isLoading } = useSWR<TokensResponse>(
    "/api/tokens",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    tokens: data?.assets ?? [],
    isLoading,
    isError: !!error,
  };
}
