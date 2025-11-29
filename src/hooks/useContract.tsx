export interface LedgerContractInfo {
  isActive: boolean;
  remaining: string;
  expiresOnLedger?: number;
  modifiedOnLedger?: number;
  currentLedgerSeq?: number;
}

// Mock function - will be replaced with actual Soroban RPC calls later
export const getContractLedgerInfo = async (
  contract: string
): Promise<LedgerContractInfo> => {
  // Return mock data for now
  return {
    isActive: true,
    remaining: "-- Days",
    expiresOnLedger: undefined,
    modifiedOnLedger: undefined,
    currentLedgerSeq: undefined,
  };
};
