export interface Payment {
  id: string;
  created_at: string;
  type: string;
  asset_type: string;
  asset_code?: string;
  from: string;
  to: string;
  amount: string;
  transaction_hash: string;
}

interface AccountHistory {
  transactions: unknown[];
  operations: unknown[];
  payments: Payment[];
}

// Mock function - will be replaced with actual Horizon API calls later
export async function getAccountHistory(
  address: string
): Promise<AccountHistory> {
  return {
    transactions: [],
    operations: [],
    payments: [],
  };
}

export function useTransactionHistory() {
  // Mock data - will be replaced with actual data fetching later
  return {
    transactions: [] as unknown[],
    operations: [] as unknown[],
    payments: [] as Payment[],
    isLoading: false,
    isError: false,
    refetch: () => {},
  };
}
