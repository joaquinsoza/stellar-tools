import { useUserContext } from "@/contexts/UserContext";

export const useAccount = () => {
  const { address } = useUserContext();

  // Mock data - will be replaced with actual Horizon API calls later
  return {
    account: address ? { balances: [] } : undefined,
    isLoading: false,
    isError: false,
  };
};
