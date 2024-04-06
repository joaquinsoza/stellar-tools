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

export function ConnectedWallet() {
  const sorobanContext = useSorobanReact();
  const { address, disconnect, activeChain, serverHorizon } = sorobanContext;
  const [nativeBalance, setNativeBalance] = useState<number | undefined>();

  useEffect(() => {
    const getNativeBalance = async () => {
      const account = await serverHorizon?.loadAccount(address!);
      console.log("🚀 « account:", account?.balances);
      const balance = account?.balances.find(
        (item) => item.asset_type === "native"
      );
      console.log("🚀 « balance:", balance);
      if (balance?.balance !== "0") {
        setNativeBalance(Number(balance?.balance));
      }
    };
    getNativeBalance();
  }, [address, serverHorizon, sorobanContext]);

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <Menu>
      {nativeBalance && (
        <Button colorScheme={"pink"}>{nativeBalance.toFixed(3)} XLM</Button>
      )}
      <MenuButton
        isActive
        as={Button}
        rightIcon={<BiChevronDown />}
        colorScheme="pink"
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
