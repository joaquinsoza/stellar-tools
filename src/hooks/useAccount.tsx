import useSWR from "swr";
import { SorobanContextType, useSorobanReact } from "@soroban-react/core";

const fetcher = async (sorobanContext: SorobanContextType) => {
  const { serverHorizon, address } = sorobanContext;
  if (!address) return;
  const account = await serverHorizon?.loadAccount(address);
  return account;
};

export const useAccount = () => {
  const sorobanContext = useSorobanReact();

  const { data, error } = useSWR(
    sorobanContext.address ? [sorobanContext.address] : null,
    () => fetcher(sorobanContext),
    {
      shouldRetryOnError: false,
    }
  );

  return {
    account: data,
    isLoading: !error && !data,
    isError: error,
  };
};
