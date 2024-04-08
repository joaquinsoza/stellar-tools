import { useAccount } from "./useAccount";

export const useAccountBalances = () => {
  const { account, isLoading, isError } = useAccount();

  return {
    balances: account?.balances,
    isLoading,
    isError,
  };
};
