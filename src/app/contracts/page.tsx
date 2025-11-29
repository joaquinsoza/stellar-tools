"use client";
import { useState } from "react";
import { isAddress } from "@/helpers/address";
import { ButtonPrimary } from "@/components/Buttons/ButtonPrimary";
import { LedgerContractInfo } from "@/hooks/useContract";

export default function ContractsPage() {
  const [contractAddress, setContractAddress] = useState<string>("");
  const [isBumping, setIsBumping] = useState<boolean>(false);
  const [ledgerInfo, setLedgerInfo] = useState<LedgerContractInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState<boolean>(false);

  const handleBumpContractInstance = async () => {
    if (!isAddress(contractAddress)) return;
    setIsBumping(true);
    // Will be implemented when blockchain integration is added back
    setTimeout(() => setIsBumping(false), 1000);
  };

  const handleRestoreContract = async () => {
    if (!isAddress(contractAddress)) return;
    setIsBumping(true);
    // Will be implemented when blockchain integration is added back
    setTimeout(() => setIsBumping(false), 1000);
  };

  const handleAddressChange = (value: string) => {
    setContractAddress(value);
    if (isAddress(value)) {
      // Mock loading state for UI demonstration
      setLoadingInfo(true);
      setTimeout(() => {
        setLedgerInfo({
          isActive: true,
          remaining: "-- Days",
          expiresOnLedger: undefined,
          modifiedOnLedger: undefined,
          currentLedgerSeq: undefined,
        });
        setLoadingInfo(false);
      }, 500);
    } else {
      setLedgerInfo(null);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 px-4 md:px-8 py-8">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Contract Management
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-lg">
        View and manage the time-to-live for any contract address on the Soroban
        network.
      </p>

      {/* Contract Ledger Info */}
      <div className="w-full max-w-lg p-6 rounded-md shadow-lg bg-gray-50 dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-blue-500">
          Contract Ledger Information
        </h2>

        {loadingInfo ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : ledgerInfo ? (
          <div className="space-y-3 text-gray-900 dark:text-gray-100">
            <div className="flex items-center space-x-2">
              <span className="font-bold">Status:</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                ledgerInfo.isActive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {ledgerInfo.isActive ? "Active" : "Expired"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">Time Remaining:</span>
              <span>{ledgerInfo.remaining}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">Current Ledger:</span>
              <span>{ledgerInfo?.currentLedgerSeq}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">Expires On Ledger:</span>
              <span>{ledgerInfo?.expiresOnLedger}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">Last Modified Ledger:</span>
              <span>{ledgerInfo?.modifiedOnLedger}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Enter a valid contract address to view details.
          </p>
        )}
      </div>

      <hr className="w-full max-w-lg border-gray-300 dark:border-gray-600" />

      {/* Input and Action Buttons */}
      <div className="flex flex-col items-center space-y-4 w-full max-w-lg">
        <div className="w-full">
          <input
            type="text"
            placeholder="Enter Contract Address"
            value={contractAddress}
            onChange={(e) => handleAddressChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="flex space-x-4 w-full">
          <ButtonPrimary
            label="Bump Contract"
            onClick={handleBumpContractInstance}
            isLoading={isBumping}
            isDisabled={!isAddress(contractAddress)}
            width="full"
            requiresWallet
          />
          <ButtonPrimary
            label="Restore Contract"
            onClick={handleRestoreContract}
            isLoading={isBumping}
            isDisabled={!isAddress(contractAddress) || ledgerInfo?.isActive}
            width="full"
            requiresWallet
          />
        </div>
      </div>
    </div>
  );
}
