import { useAssetForAccount } from "@/hooks/useAsset";
import { Asset } from "@stellar-asset-lists/sdk";
import { ManageTrustlineButton } from "../Buttons/ManageTrustlineButton";
import { ConnectWalletToUse } from "../DisabledComponents/ConnectWalletToUse";
import {
  bumpContractInstance,
  deployStellarAsset,
  getTokenDecimals,
  getTokenName,
  getTokenSymbol,
} from "@/helpers/soroban";
import { useSorobanReact } from "@soroban-react/core";
import { useState } from "react";
import { wrapStellarAsset } from "@soroban-react/contracts";
import { Address, nativeToScVal } from "@stellar/stellar-sdk";
import { FaWallet } from "react-icons/fa";
import toast from "react-hot-toast";

interface AssetActionProps {
  asset?: Asset;
}

export function AssetActionPanel({ asset }: AssetActionProps) {
  const sorobanContext = useSorobanReact();
  const { assetForAccount, isLoading, contractInfo, refetch } =
    useAssetForAccount(asset);

  const [isDeployedOnSoroban, setIsDeployedOnSoroban] = useState<boolean>(true);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  const [isBumping, setIsBumping] = useState<boolean>(false);

  getTokenName(sorobanContext, asset?.contract).then((resp) =>
    resp ? setIsDeployedOnSoroban(true) : setIsDeployedOnSoroban(false)
  );

  const handleDeployToSoroban = () => {
    if (!asset?.code || !asset?.issuer) return;
    setIsDeploying(true);
    deployStellarAsset(asset, sorobanContext)
      .then((resp) => {
        console.log("then", resp);
        toast.success(`Asset deployed! You have successfully deployed ${asset.code} to Soroban.`);
        refetch();
        setIsDeploying(false);
      })
      .catch((error) => {
        console.log("🚀 « error:", error);
        toast.error(`Error: ${error}`);
        refetch();
        setIsDeploying(false);
      });
  };

  const handleBumpContractInstance = async () => {
    if (!asset?.contract) return;
    setIsBumping(true);
    bumpContractInstance(asset?.contract, sorobanContext)
      .then((resp) => {
        console.log(resp);
        toast.success(`Asset TTL extended! You have successfully extended ${asset.code} instance TTL.`);
        refetch();
        setIsBumping(false);
      })
      .catch((error) => {
        console.log("🚀 « error:", error);
        toast.error(`Error: ${error}`);
        refetch();
        setIsBumping(false);
      });
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
