import { useAssetForAccount } from "@/hooks/useAsset";
import { AssetType } from "@/hooks/useTokens";
import { ManageTrustlineButton } from "../Buttons/ManageTrustlineButton";
import { ConnectWalletToUse } from "../DisabledComponents/ConnectWalletToUse";
import { useState } from "react";
import { FaWallet } from "react-icons/fa";

interface AssetActionProps {
  asset?: AssetType;
}

export function AssetActionPanel({ asset }: AssetActionProps) {
  const { assetForAccount, contractInfo } = useAssetForAccount(asset);

  const [isDeployedOnSoroban] = useState<boolean>(true);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [isBumping, setIsBumping] = useState<boolean>(false);

  const handleDeployToSoroban = () => {
    if (!asset?.code || !asset?.issuer) return;
    setIsDeploying(true);
    // Will be implemented when blockchain integration is added back
    setTimeout(() => setIsDeploying(false), 1000);
  };

  const handleBumpContractInstance = async () => {
    if (!asset?.contract) return;
    setIsBumping(true);
    // Will be implemented when blockchain integration is added back
    setTimeout(() => setIsBumping(false), 1000);
  };

  const contractStatus = contractInfo.isActive
    ? "Active"
    : isDeployedOnSoroban
    ? "Expired"
    : "Not Deployed";

  const statusColor = contractInfo.isActive
    ? "text-green-500"
    : isDeployedOnSoroban
    ? "text-yellow-500"
    : "text-gray-400";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      {/* Header with Icon */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-pink-50 dark:bg-pink-900/30 p-2 rounded-lg">
          <FaWallet className="w-5 h-5 text-pink-500" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Your Wallet
        </h3>
      </div>

      {/* Balance - Prominent */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {assetForAccount?.balance || "0.00"}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {asset?.code || "---"} Balance
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-y border-gray-100 dark:border-gray-700">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
            Limit
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {assetForAccount?.limit ?? "0"}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
            Contract
          </div>
          <div className={`text-sm font-medium ${statusColor}`}>
            {contractStatus}
          </div>
        </div>
      </div>

      {/* Time Remaining - Subtle */}
      {contractInfo.remaining && contractInfo.remaining !== "N/A" && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Expires in {contractInfo.remaining}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <ManageTrustlineButton asset={asset} />
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleBumpContractInstance}
            disabled={!isDeployedOnSoroban || isBumping}
            className={`px-3 py-2 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors ${
              !isDeployedOnSoroban || isBumping
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {isBumping ? "Bumping..." : "Bump"}
          </button>
          <button
            onClick={handleDeployToSoroban}
            disabled={isDeployedOnSoroban || isDeploying}
            className={`px-3 py-2 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors ${
              isDeployedOnSoroban || isDeploying
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {isDeploying ? "Deploying..." : "Deploy"}
          </button>
        </div>
      </div>

      <ConnectWalletToUse />
    </div>
  );
}
