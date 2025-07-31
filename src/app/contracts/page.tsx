"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { isAddress, shortenAddress } from "@/helpers/address";
import { ButtonPrimary } from "@/components/Buttons/ButtonPrimary";
import { bumpContractInstance, restoreContract } from "@/helpers/soroban";
import { useSorobanReact } from "@soroban-react/core";
import { getContractLedgerInfo } from "@/hooks/useContract";

export default function ContractsPage() {
  const sorobanContext = useSorobanReact();
  const [contractAddress, setContractAddress] = useState<string>("");
  const [isBumping, setIsBumping] = useState<boolean>(false);
  const [ledgerInfo, setLedgerInfo] = useState<any>(null);
  const [loadingInfo, setLoadingInfo] = useState<boolean>(false);

  const handleBumpContractInstance = async () => {
    if (!isAddress(contractAddress)) return;
    setIsBumping(true);
    bumpContractInstance(contractAddress, sorobanContext)
      .then((resp) => {
        console.log(resp);
        toast.success(`Contract TTL extended! You have successfully extended ${shortenAddress(contractAddress)} TTL.`);
        setIsBumping(false);
        refetchLedgerInfo(); // Refresh ledger info after bumping
      })
      .catch((error) => {
        console.log("🚀 « error:", error);
        toast.error(`Error: ${error}`);
        setIsBumping(false);
      });
  };

  const handleRestoreContract = async () => {
    if (!isAddress(contractAddress)) return;
    setIsBumping(true);
    restoreContract(contractAddress, sorobanContext)
      .then((resp) => {
        console.log(resp);
        toast.success(`Contract restored! You have successfully restored ${shortenAddress(contractAddress)}`);
        setIsBumping(false);
        refetchLedgerInfo(); // Refresh ledger info after restoring
      })
      .catch((error) => {
        console.log("🚀 « error:", error);
        toast.error(`Error: ${error}`);
        setIsBumping(false);
      });
  };

  const refetchLedgerInfo = async () => {
    if (!isAddress(contractAddress)) return;
    setLoadingInfo(true);
    const info = await getContractLedgerInfo(contractAddress);
    setLedgerInfo(info);
    setLoadingInfo(false);
  };

  useEffect(() => {
    if (isAddress(contractAddress)) {
      refetchLedgerInfo();
    }
  }, [contractAddress]);

  return (
    <div className="flex flex-col items-center space-y-6 px-4 md:px-8 py-8">
      <h1 className="text-4xl font-bold mb-4">
        Contract Management
      </h1>
      <p className="text-gray-600 text-center max-w-lg">
        View and manage the time-to-live for any contract address on the Soroban
        network.
      </p>

      {/* Contract Ledger Info */}
      <div className="w-full max-w-lg p-6 rounded-md shadow-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4 text-blue-500">
          Contract Ledger Information
        </h2>

        {loadingInfo ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : ledgerInfo ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold">Status:</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                ledgerInfo.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
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
          <p className="text-gray-500">
            Enter a valid contract address to view details.
          </p>
        )}
      </div>

      <hr className="w-full max-w-lg border-gray-300" />

      {/* Input and Action Buttons */}
      <div className="flex flex-col items-center space-y-4 w-full max-w-lg">
        <div className="w-full">
          <input
            type="text"
            placeholder="Enter Contract Address"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
