import { shortenAddress } from "@/helpers/address";
import { useClipboard } from "@/hooks/useClipboard";
import Link from "next/link";
import { BiCopy } from "react-icons/bi";
import { IoChevronDown } from "react-icons/io5";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

const SOROSWAP_URL: string = "https://app.soroswap.finance/swap/";
const STELLAR_CHAIN_URL: string = "https://stellarchain.io/assets/";
const STELLAR_EXPERT_URL: string =
  "https://stellar.expert/explorer/public/asset/";

interface AssetCardProps {
  name?: string;
  icon?: string;
  code?: string;
  contract?: string;
  domain?: string;
  issuer?: string;
}

export function AssetCard({
  name,
  icon,
  code,
  contract,
  domain,
  issuer,
}: AssetCardProps) {
  const copyToClipboard = useClipboard();
  const stellarParams = `${code}-${issuer}`;
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRedirectToExternalLink = (url: string, params: string) => {
    window.open(url + `${params}`, "_blank");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-center">
          {/* Left section - Avatar and Info */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {icon ? (
                <Image
                  src={icon}
                  alt={name || code || "Asset"}
                  width={64}
                  height={64}
                  className="rounded-full md:w-20 md:h-20 w-12 h-12"
                />
              ) : (
                <div className="w-12 h-12 md:w-20 md:h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-lg md:text-2xl font-medium text-gray-700 dark:text-gray-300">
                    {(name || code)?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 truncate">
                  {name || "Asset name"}
                </h3>
                {name !== code && (
                  <span className="text-xs md:text-sm text-gray-400">
                    ({code})
                  </span>
                )}
              </div>
              <Link
                href={`https://${domain}`}
                target="_blank"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {domain || "Asset Domain"}
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="flex justify-center h-20">
            <div className="border-l border-gray-300 dark:border-gray-600"></div>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center">
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-2">
                {/* Dropdown Menu */}
                <Menu as="div" className="relative">
                  <MenuButton className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                    See on
                    <IoChevronDown className="ml-2 h-4 w-4" />
                  </MenuButton>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none rounded-md">
                      <div className="py-1">
                        <MenuItem>
                          {({ focus }) => (
                            <button
                              onClick={() =>
                                handleRedirectToExternalLink(
                                  STELLAR_CHAIN_URL,
                                  stellarParams
                                )
                              }
                              className={`${
                                focus ? 'bg-gray-100 dark:bg-gray-600' : ''
                              } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                            >
                              Stellar chain
                            </button>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ focus }) => (
                            <button
                              onClick={() =>
                                handleRedirectToExternalLink(
                                  STELLAR_EXPERT_URL,
                                  stellarParams
                                )
                              }
                              className={`${
                                focus ? 'bg-gray-100 dark:bg-gray-600' : ''
                              } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                            >
                              Stellar expert
                            </button>
                          )}
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Transition>
                </Menu>

                {/* Swap Button */}
                <button
                  onClick={() =>
                    handleRedirectToExternalLink(SOROSWAP_URL, contract!)
                  }
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Swap on Soroswap
                </button>
              </div>

              {/* Contract ID */}
              <div
                className="flex items-center space-x-2 cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() =>
                  copyToClipboard(contract, `${code} address copied!`)
                }
                title="Copy to clipboard"
              >
                <span className="text-sm">CONTRACT ID:</span>
                <BiCopy className="w-4 h-4" />
                <span className="text-sm">
                  {shortenAddress(contract!)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
