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
}

export function ButtonPrimary({
  label,
  onClick,
  isLoading,
  requiresWallet,
}: ButtonPrimaryProps) {
  const { address } = useSorobanReact();

  return (
    <>
      {!address && requiresWallet ? (
        <ConnectWalletButton />
      ) : (
        <Button
          colorScheme="pink"
          variant="solid"
          onClick={onClick}
          isLoading={isLoading}
        >
          {label}
        </Button>
      )}
    </>
  );
}
