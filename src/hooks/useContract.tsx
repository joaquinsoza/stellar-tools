import { Contract, scValToNative, SorobanRpc, xdr } from "@stellar/stellar-sdk";
export interface LedgerContractInfo {
  isActive: boolean;
  remaining: string;
  expiresOnLedger?: number;
  modifiedOnLedger?: number;
  currentLedgerSeq?: number;
}

export const getContractLedgerInfo = async (
  contract: string
): Promise<LedgerContractInfo> => {
  const rpc = process.env.NEXT_PUBLIC_SOROBAN_MAINNET_RPC ?? "";

  try {
    let server = new SorobanRpc.Server(rpc, { allowHttp: true });

    const instance = new Contract(contract).getFootprint();
    const ledgerEntries = await server.getLedgerEntries(instance);
    const latestLedger = await server.getLatestLedger();

    const liveUntilLedgerSeq = ledgerEntries.entries[0]?.liveUntilLedgerSeq;

    if (!liveUntilLedgerSeq || !latestLedger.sequence) {
      throw new Error("Invalid liveUntilLedgerSeq or current ledger sequence");
    }

    const daysRemaining = calculateDaysRemaining(
      latestLedger.sequence,
      liveUntilLedgerSeq
    );

    return {
      isActive: daysRemaining > 0,
      remaining: `${Math.max(0, Number(daysRemaining.toFixed(2)))} Days`,
      expiresOnLedger: liveUntilLedgerSeq,
      modifiedOnLedger: ledgerEntries.entries[0]?.lastModifiedLedgerSeq,
      currentLedgerSeq: latestLedger.sequence,
    };
  } catch (e) {
    console.error("🚀 « error:", e);

    return {
      isActive: false,
      remaining: "0 Days",
    };
  }
};

// Helper function to calculate days remaining
const calculateDaysRemaining = (
  currentLedgerSeq: number,
  liveUntilLedgerSeq: number
) => {
  const ledgersRemaining = liveUntilLedgerSeq - currentLedgerSeq;
  const secondsRemaining = ledgersRemaining * 5; // 5 seconds per ledger
  const daysRemaining = secondsRemaining / (60 * 60 * 24); // Convert to days
  return daysRemaining;
};
