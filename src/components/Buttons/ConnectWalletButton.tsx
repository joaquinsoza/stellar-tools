"use client";

import { useUserContext } from "@/contexts/UserContext";
import { shortenAddress } from "@/helpers/address";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";

interface ConnectWalletProps {
  className?: string;
}

export const ConnectWallet = ({ className }: ConnectWalletProps) => {
  const { address: userAddress, connectWallet, disconnect } = useUserContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleConnectWallet = async () => {
    if (userAddress) {
      setIsDropdownOpen(!isDropdownOpen);
      return;
    }
    await connectWallet();
  };

  const handleDisconnect = () => {
    disconnect();
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <button
        className="bg-pink-500 hover:bg-pink-600 relative flex h-14 cursor-pointer items-center rounded-2xl px-2 text-center text-[20px] font-bold text-white"
        onClick={handleConnectWallet}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        {userAddress ? shortenAddress(userAddress) : "Connect Wallet"}
      </button>

      {isDropdownOpen && userAddress && (
        <div
          className="absolute top-full left-1/2 z-50 mt-1 -translate-x-1/2 transform rounded-xl bg-pink-600 p-1 shadow-lg"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="wallet-menu"
        >
          <button
            onClick={handleDisconnect}
            role="menuitem"
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <FiLogOut size={16} />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};
