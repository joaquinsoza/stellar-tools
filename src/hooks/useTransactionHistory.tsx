import useSWR from "swr";
import _ from "lodash";
// @ts-ignore
import * as StellarAssetListsSdk from "@stellar-asset-lists/sdk";
import { Asset, Networks } from "@stellar/stellar-sdk";
import { xlmAsset } from "@/components/constants/xlmAsset";
import { isAddress } from "@/helpers/address";
import { SorobanContextType, useSorobanReact } from "@soroban-react/core";

interface AccountHistory {
  transactions: any[];
  operations: any[];
  payments: any[];
}

export async function getAccountHistory(
  sorobanContext: SorobanContextType
): Promise<AccountHistory> {
  const { address, serverHorizon } = sorobanContext;
  let transactions: any[] = [];
  let operations: any[] = [];
  let payments: any[] = [];
  if (!address || !serverHorizon) return { transactions, operations, payments };

  let transactionPage = await serverHorizon
    .transactions()
    .forAccount(address)
    .order("desc")
    .limit(200)
    .call();
  // while (transactionPage.records.length > 0) {
  transactions = transactions.concat(transactionPage.records);
  //   if (transactionPage.records.length < 200) break;
  //   transactionPage = await transactionPage.next();
  // }

  let operationPage = await serverHorizon
    .operations()
    .forAccount(address)
    .order("desc")
    .limit(200)
    .call();
  // while (operationPage.records.length > 0) {
  operations = operations.concat(operationPage.records);
  //   if (operationPage.records.length < 200) break;
  //   operationPage = await operationPage.next();
  // }

  let paymentPage = await serverHorizon
    .payments()
    .forAccount(address)
    .order("desc")
    .limit(200)
    .call();
  // while (paymentPage.records.length > 0) {
  payments = payments.concat(paymentPage.records as any[]);
  //   if (paymentPage.records.length < 200) break;
  //   paymentPage = await paymentPage.next();
  // }

  return { transactions, operations, payments };
}

const fetchAccountHistory = (sorobanContext: SorobanContextType) => () =>
  getAccountHistory(sorobanContext);

export function useTransactionHistory() {
  const sorobanContext = useSorobanReact();
  // Fetch the catalogue using SWR.
  const { data, error, isLoading, mutate } = useSWR(
    sorobanContext.address ? `accountHistory-${sorobanContext.address}` : null,
    sorobanContext ? fetchAccountHistory(sorobanContext) : null
  );

  return {
    transactions: data?.transactions,
    operations: data?.operations,
    payments: data?.payments,
    isLoading: isLoading,
    isError: error,
    refetch: mutate,
  };
}
