import { shortenAddress } from "@/helpers/address";
import { useClipboard } from "@/hooks/useClipboard";
import Link from "next/link";
import { BiCopy } from "react-icons/bi";
import { IoChevronDown } from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

const SOROSWAP_URL = "https://app.soroswap.finance/swap/";
const STELLAR_CHAIN_URL = "https://stellarchain.io/assets/";
const STELLAR_EXPERT_URL = "https://stellar.expert/explorer/public/asset/";

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
  const [imgError, setImgError] = useState(false);

  const handleExternalLink = (url: string, params: string) => {
    window.open(url + params, "_blank");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-5">
      {/* Top Section: Icon, Name, Domain */}
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          {icon && !imgError ? (
            <Image
              src={icon.trim()}
              alt={name || code || "Asset"}
              width={48}
              height={48}
              className="rounded-full w-12 h-12"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                {(name || code)?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Name & Domain */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
              {name || "Unknown Asset"}
            </h1>
            {name !== code && code && (
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                {code}
              </span>
            )}
          </div>
          {domain && (
            <Link
              href={`https://${domain}`}
              target="_blank"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 inline-flex items-center gap-1"
            >
              {domain}
              <FiExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Contract ID */}
      {contract && (
        <button
          onClick={() => copyToClipboard(contract, "Contract copied!")}
          className="mt-4 w-full flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              Contract
            </span>
            <span className="text-sm font-mono text-gray-700 dark:text-gray-200 truncate">
              {shortenAddress(contract)}
            </span>
          </div>
          <BiCopy className="w-4 h-4 text-gray-400 group-hover:text-pink-500 flex-shrink-0" />
        </button>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        {/* See on Dropdown */}
        <Menu as="div" className="relative">
          <MenuButton className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
            See on
            <IoChevronDown className="w-4 h-4" />
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
            <MenuItems className="absolute left-0 z-10 mt-1 w-44 bg-white dark:bg-gray-700 shadow-lg rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => handleExternalLink(STELLAR_CHAIN_URL, stellarParams)}
                    className={`${
                      focus ? "bg-gray-100 dark:bg-gray-600" : ""
                    } w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200`}
                  >
                    Stellar Chain
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => handleExternalLink(STELLAR_EXPERT_URL, stellarParams)}
                    className={`${
                      focus ? "bg-gray-100 dark:bg-gray-600" : ""
                    } w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200`}
                  >
                    Stellar Expert
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>

        {/* Swap Button */}
        <button
          onClick={() => contract && handleExternalLink(SOROSWAP_URL, contract)}
          disabled={!contract}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          Swap on Soroswap
          <FiExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
