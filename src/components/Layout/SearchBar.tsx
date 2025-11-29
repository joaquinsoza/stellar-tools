"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { IoMdSearch } from "react-icons/io";
import { useTokens } from "@/hooks/useTokens";
import Link from "next/link";
import Image from "next/image";

const SearchBar = () => {
  const { tokens } = useTokens();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredAssets = useMemo(() => {
    return tokens?.filter((asset) => {
      const term = searchTerm.toLowerCase();
      const matchesCodeIssuer =
        asset.code && asset.issuer
          ? `${asset.code}:${asset.issuer}`.toLowerCase().includes(term)
          : false;
      const matchesContract = asset.contract?.toLowerCase().includes(term);
      const matchesOrg = asset.org?.toLowerCase().includes(term);
      const matchesName = asset.name?.toLowerCase().includes(term);
      const matchesDomain = asset.domain?.toLowerCase().includes(term);

      return (
        matchesCodeIssuer ||
        matchesContract ||
        matchesOrg ||
        matchesName ||
        matchesDomain
      );
    });
  }, [searchTerm, tokens]);

  const getRedirectUrl = (asset: any) => { // TODO: Set an asset type
    if (asset.contract) {
      return `/assets/${asset.contract}`;
    } else if (!asset.contract) {
      return `/assets/${asset.code}-${asset.issuer}`;
    }
    // Fallback or additional conditions here
    return "#"; // Placeholder: adjust according to logic
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div ref={popoverRef} className="w-full relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IoMdSearch className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Type address, symbol, CODE:ISSUER"
          value={searchTerm}
          onChange={handleInputChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
        />
      </div>

      {/* Dropdown Results */}
      {filteredAssets && filteredAssets.length > 0 && searchTerm.length > 0 && isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md border border-gray-200 dark:border-gray-600 overflow-auto">
          <div className="p-4">
            {filteredAssets.map((asset: any, index: number) => (
              <Link key={index} href={getRedirectUrl(asset)} onClick={handleClose}>
                <div className="flex py-2 items-center justify-start gap-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex-shrink-0">
                    {asset.icon ? (
                      <Image 
                        src={asset.icon} 
                        alt={asset.name || asset.code} 
                        width={40} 
                        height={40} 
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {(asset.name || asset.code)?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-2 items-center">
                      {asset.name ? (
                        <>
                          <span className="font-bold text-gray-900 dark:text-gray-100">{asset.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{asset.code}</span>
                        </>
                      ) : (
                        <span className="font-bold text-gray-900 dark:text-gray-100">{asset.code}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{asset.domain}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-500 truncate">{asset.contract}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
