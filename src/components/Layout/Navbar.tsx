"use client";

import { BiMoon, BiSun } from "react-icons/bi";
import SearchBar from "./SearchBar";
import { FiMenu } from "react-icons/fi";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "@/context/sidebar/SidebarContext";
import { useUserContext } from "@/contexts/UserContext";
import { ConnectWallet } from "../Buttons/ConnectWalletButton";
interface NavProps {
  onOpen: () => void;
}

export default function Nav({ onOpen, ...rest }: NavProps) {
  const { address } = useUserContext()
  const { isOpen } = useContext(SidebarContext);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference, default to light mode
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  return (
    <nav
      className={`
        fixed w-full bg-white dark:bg-gray-900 px-4 py-2 h-20 z-50
        transition-all duration-300 ease-in-out
        border-b border-gray-200 dark:border-gray-700
        ${isOpen ? 'md:pl-64' : 'md:pl-24'} pl-4
      `}
      {...rest}
    >
      <div className="flex h-16 items-center justify-between w-full">
        <div className="w-1/2 hidden md:flex">
          <SearchBar />
        </div>
        
        <div className="flex md:hidden">
          <Image
            alt="StellarTools"
            width={35}
            height={35}
            src="/stellartools.svg"
          />
        </div>

        <div className="flex items-center space-x-1 md:space-x-4">
          <button
            className="hidden md:flex items-center justify-center p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            onClick={toggleDarkMode}
          >
            {darkMode ? <BiSun className="w-5 h-5" /> : <BiMoon className="w-5 h-5" />}
          </button>
          
          <ConnectWallet />
          
          <button
            className="flex md:hidden p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
            onClick={onOpen}
            aria-label="open menu"
          >
            <FiMenu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
