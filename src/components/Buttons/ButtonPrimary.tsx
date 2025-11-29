"use client";
import React from "react";
import { useUserContext } from "@/contexts/UserContext";
import { ConnectWallet } from "./ConnectWalletButton";

interface ButtonPrimaryProps {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
  requiresWallet?: boolean;
  size?: "sm" | "md" | "lg";
  width?: string;
  height?: number;
  variant?: "solid" | "outline";
  isDisabled?: boolean;
}

export function ButtonPrimary({
  label,
  onClick,
  isLoading,
  requiresWallet,
  size = "md",
  width = "full",
  height = 8,
  variant = "solid",
  isDisabled,
}: ButtonPrimaryProps) {
  const { address } = useUserContext();

  if (!address && requiresWallet) {
    return <ConnectWallet />;
  }

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  // Width classes
  const widthClass = width === "full" ? "w-full" : width;
  
  // Height class
  const heightClass = `h-${height}`;

  // Variant classes
  const variantClasses = variant === "outline" 
    ? "border-2 border-pink-500 text-pink-500 bg-transparent hover:bg-pink-50 dark:hover:bg-pink-900/20"
    : "bg-pink-500 text-white hover:bg-pink-600";

  return (
    <button
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={`
        ${sizeClasses[size]}
        ${widthClass}
        ${heightClass}
        ${variantClasses}
        rounded-md font-medium transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
        flex items-center justify-center
      `}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      ) : (
        label
      )}
    </button>
  );
}
