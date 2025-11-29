import { Horizon, rpc } from "@stellar/stellar-sdk";

export const serverHorizon = new Horizon.Server("https://horizon.stellar.org");

export const serverSoroban = new rpc.Server(
  process.env.NEXT_PUBLIC_SOROBAN_MAINNET_RPC ?? ""
);
