"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useSorobanReact } from "@soroban-react/core";
import { BiChevronDown } from "react-icons/bi";
import { shortenAddress } from "@/helpers/address";
import { useAssetForAccount } from "@/hooks/useAsset";
import { xlmAsset } from "./constants/xlmAsset";

export function ConnectedWallet() {
  const sorobanContext = useSorobanReact();
  const { address, disconnect, activeChain, serverHorizon } = sorobanContext;
  const { assetForAccount } = useAssetForAccount(xlmAsset);

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <Menu>
      {assetForAccount && (
        <Button
          fontSize={{ base: "sm", md: "md" }}
          size={{ base: "sm", md: "md" }}
          colorScheme={"pink"}
        >
          {Number(assetForAccount.balance).toFixed(3)} XLM
        </Button>
      )}
      <MenuButton
        isActive
        as={Button}
        rightIcon={<BiChevronDown />}
        colorScheme="pink"
        fontSize={{ base: "sm", md: "md" }}
        size={{ base: "sm", md: "md" }}
      >
        {shortenAddress(address!)}
      </MenuButton>
      <MenuList>
        <MenuItem>Network: {activeChain?.name}</MenuItem>
        <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
      </MenuList>
    </Menu>
  );
}
