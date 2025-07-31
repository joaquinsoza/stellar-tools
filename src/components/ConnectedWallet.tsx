"use client";
import React, { useState } from "react";
import { useSorobanReact } from "@soroban-react/core";
import { BiChevronDown } from "react-icons/bi";
import { shortenAddress } from "@/helpers/address";
import { useAssetForAccount } from "@/hooks/useAsset";
import { xlmAsset } from "./constants/xlmAsset";

export function ConnectedWallet() {
  const sorobanContext = useSorobanReact();
  const { address, disconnect, activeChain, serverHorizon } = sorobanContext;
  const { assetForAccount } = useAssetForAccount(xlmAsset);
  const [isOpen, setIsOpen] = useState(false);

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <div className="flex items-center space-x-2">
        {assetForAccount && (
          <button className="px-3 py-2 bg-pink-500 text-white rounded text-sm md:text-base">
            {Number(assetForAccount.balance).toFixed(3)} XLM
          </button>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 bg-pink-500 text-white rounded text-sm md:text-base"
        >
          {shortenAddress(address!)}
          <BiChevronDown className="ml-1" />
        </button>
      </div>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700">
              Network: {activeChain?.name}
            </div>
            <button
              onClick={handleDisconnect}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
