"use client";
import React, { useState } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import { useSorobanReact } from "@soroban-react/core";
import { Connector } from "@soroban-react/types";

export function ConnectWalletButton() {
  const sorobanContext = useSorobanReact();
  const { setActiveConnectorAndConnect } = sorobanContext;
  const supportedWallets = sorobanContext.connectors;
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | false>(false);

  const findWalletIcon = (walletId: string) => {
    switch (walletId) {
      case "freighter":
        return "/images/freighter-wallet.png";
      case "xbull":
        return "/images/xbull-wallet.png";
      case "lobstr":
        return "https://stellar.creit.tech/wallet-icons/lobstr.svg";
      default:
        return "/images/freighter-wallet.png";
    }
  };

  const connectWallet = (wallet: Connector) => {
    try {
      setActiveConnectorAndConnect && setActiveConnectorAndConnect(wallet);
      setIsOpen(false);
    } catch (err) {
      const errorMessage = `${err}`;
      if (errorMessage.includes(`Error: Wallet hasn't been set upp`)) {
        setErrorMessage(
          "Error: Wallet hasn't been set up. Please set up your xBull wallet."
        );
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
      >
        Connect Wallet
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Connect a Wallet
                    </h3>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {supportedWallets.map((wallet: Connector) => (
                      <button
                        key={wallet.id}
                        onClick={() => connectWallet(wallet)}
                        className="w-full h-16 flex items-center justify-start px-4 py-3 text-lg hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Image
                            width={24}
                            height={24}
                            src={findWalletIcon(wallet.id)}
                            alt={wallet.name}
                            className="w-6 h-6"
                          />
                          <span className="text-gray-900 dark:text-gray-100">{wallet.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {errorMessage && (
                    <div className="mt-4 text-red-600 dark:text-red-400 text-sm">
                      {errorMessage}
                    </div>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
