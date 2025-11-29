"use client";

import { FiHome, FiX } from "react-icons/fi";
import { IconType } from "react-icons";
import Image from "next/image";
import React, { useContext } from "react";
import { BiCoinStack } from "react-icons/bi";
import Link from "next/link";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { NavItem } from "./NavItem";
import { SidebarContext } from "@/context/sidebar/SidebarContext";
import { IoReceiptOutline } from "react-icons/io5";
import { RiContractLine } from "react-icons/ri";

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
  requiresWallet?: boolean;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, href: "/" },
  { name: "Assets", icon: BiCoinStack, href: "/assets" },
  { name: "Contracts", icon: RiContractLine, href: "/contracts" },
  {
    name: "Transactions",
    icon: IoReceiptOutline,
    href: "/transactions",
    requiresWallet: true,
  },
];

interface SidebarProps {
  onClose: () => void;
  className?: string;
}

export const SidebarContent = ({ onClose, className = "", ...rest }: SidebarProps) => {
  const { isOpen, setIsOpen } = useContext(SidebarContext);

  return (
    <div
      className={`
        transition-all duration-300 ease-in-out
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-700
        ${isOpen ? 'w-60' : 'w-20'}
        md:${isOpen ? 'w-60' : 'w-20'}
        base:w-full
        fixed h-full overflow-hidden z-50
        ${className}
      `}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      {...rest}
    >
      <div className={`flex h-20 items-center ${isOpen ? 'pl-5 justify-between' : 'justify-center'} border-b border-gray-200 dark:border-gray-700`}>
        <div className={`flex items-center ${isOpen ? 'gap-4' : ''} rounded-lg`}>
          <Image
            width={45}
            height={45}
            alt="StellarTools"
            src="/stellartools.svg"
          />
          {isOpen && (
            <h1 className="font-roboto text-lg font-medium whitespace-nowrap overflow-hidden text-gray-900 dark:text-gray-100">
              STELLAR TOOLS
            </h1>
          )}
        </div>
        {isOpen && (
          <button
            className="flex md:hidden mr-8 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
            onClick={onClose}
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="py-4">
        {LinkItems.map((link) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            href={link.href}
            requiresWallet={link.requiresWallet}
            onClick={onClose}
          >
            {link.name}
          </NavItem>
        ))}
      </div>
      
      <div className="absolute bottom-0 w-full">
        <div className={`flex justify-center pb-4 ${isOpen ? 'space-x-4' : 'flex-col items-center space-y-4'}`}>
          <Link
            href="https://github.com/joaquinsoza/stellar-tools"
            target="_blank"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <FaGithub className="w-6 h-6" />
          </Link>
          <Link
            href="https://discord.gg/Bq8qSteFSz"
            target="_blank"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <FaDiscord className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
};
