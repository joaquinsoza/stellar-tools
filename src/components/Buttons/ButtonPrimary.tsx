"use client";
import React from "react";
import { Button } from "@chakra-ui/react";
import { useSorobanReact } from "@soroban-react/core";
import { ConnectWalletButton } from "./ConnectWalletButton";

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
  size,
  width,
  height,
  variant,
  isDisabled,
}: ButtonPrimaryProps) {
  const { address } = useSorobanReact();

  return (
    <>
      {!address && requiresWallet ? (
        <ConnectWalletButton />
      ) : (
        <Button
          colorScheme="pink"
          variant={variant ?? "solid"}
          onClick={onClick}
          size={size ?? "md"}
          width={width ?? "full"}
          height={height ?? 8}
          isLoading={isLoading}
          isDisabled={isDisabled}
        >
          {label}
        </Button>
      )}
    </>
  );
}
