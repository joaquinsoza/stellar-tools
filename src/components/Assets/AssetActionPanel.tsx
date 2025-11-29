import { useAssetForAccount } from "@/hooks/useAsset";
import { AssetType } from "@/hooks/useMergedAssetsList";
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

  return (
    <div className="flex flex-col space-y-4 w-64">
      <div className="bg-white rounded-2xl p-4 min-h-96 shadow-md">
        <div className="flex flex-col items-center justify-start space-y-6">
          {/* Wallet Icon */}
          <div className="bg-blue-50 p-4 rounded-full">
            <FaWallet className="w-8 h-8 text-blue-400" />
          </div>

          {/* Wallet Header */}
          <h3 className="text-xl font-bold">
            Your Wallet
          </h3>

          <div className="flex flex-col space-y-1 items-start">
            {/* Balance Section */}
            <div className="flex flex-col space-y-1 items-start">
              <span className="text-lg font-semibold">
                {assetForAccount?.balance || "0.000000"} {asset?.code || "ETH"}
              </span>
              <span className="text-sm text-gray-500">
                BALANCE
              </span>
            </div>

            {/* Limit Section */}
            <div className="flex flex-col space-y-1 items-start">
              <span className="text-lg font-semibold">
                {assetForAccount?.limit ?? "0"} {asset?.code || "ETH"}
              </span>
              <span className="text-sm text-gray-500">
                LIMIT
              </span>
            </div>
          </div>

          {/* Contract Status */}
          <div className="flex items-center justify-between w-full space-x-4">
            <div className="flex flex-col items-start">
              <span className="text-sm text-blue-500 font-semibold">
                {contractInfo.isActive
                  ? "Active"
                  : isDeployedOnSoroban
                  ? "Expired"
                  : "Not Deployed"}
              </span>
              <span className="text-xs text-gray-500">
                CONTRACT
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {contractInfo.remaining}
              </span>
              <span className="text-xs text-gray-500">
                TIME REMAINING
              </span>
            </div>
          </div>
        </div>
        <ConnectWalletToUse />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-md">
        {/* Action Buttons */}
        <div className="flex flex-col space-y-4 w-full">
          <button
            onClick={handleBumpContractInstance}
            disabled={!isDeployedOnSoroban || isBumping}
            className={`w-full h-8 border border-pink-500 text-pink-500 rounded-md text-sm transition-colors ${
              !isDeployedOnSoroban || isBumping
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-pink-50'
            }`}
          >
            {isBumping ? 'Bumping...' : 'Bump Contract'}
          </button>
          <button
            onClick={handleDeployToSoroban}
            disabled={isDeployedOnSoroban || isDeploying}
            className={`w-full h-8 border border-pink-500 text-pink-500 rounded-md text-sm transition-colors ${
              isDeployedOnSoroban || isDeploying
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-pink-50'
            }`}
          >
            {isDeploying ? 'Deploying...' : 'Deploy on Soroban'}
          </button>
          <ManageTrustlineButton asset={asset} />
        </div>
        <ConnectWalletToUse />
      </div>
    </div>
  );
}
