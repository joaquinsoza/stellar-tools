"use client";
import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Image,
  Text,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { useSorobanReact } from "@soroban-react/core";
import { Connector } from "@soroban-react/types";

export function ConnectWalletButton() {
  const sorobanContext = useSorobanReact();
  const { setActiveConnectorAndConnect } = sorobanContext;
  const supportedWallets = sorobanContext.connectors;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorMessage, setErrorMessage] = useState<string | false>(false);

  const findWalletIcon = (walletId: string) => {
    switch (walletId) {
      case "freighter":
        return "/images/freighter-wallet.png";

      case "xbull":
        return "/images/xbull-wallet.png";

      case "lobstr":
        return "https://stellar.creit.tech/wallet-icons/lobstr.svg";
    }
  };

  const connectWallet = (wallet: Connector) => {
    const connect =
      setActiveConnectorAndConnect && setActiveConnectorAndConnect(wallet);
    try {
      connect;
      onClose();
    } catch (err) {
      const errorMessage = `${err}`;
      if (errorMessage.includes(`Error: Wallet hasn't been set upp`)) {
        setErrorMessage(
          "Error: Wallet hasn't been set up. Please set up your xBull wallet."
        );
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <Button colorScheme="pink" variant="solid" onClick={onOpen}>
        Connect Wallet
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"sm"} isCentered>
        <ModalOverlay backdropFilter="blur(5px) hue-rotate(-20deg)" />
        <ModalContent rounded={"2xl"}>
          <Flex justifyContent={"space-evenly"}>
            <ModalHeader whiteSpace="nowrap" as={"b"}>
              Connect a Wallet
            </ModalHeader>
            <ModalCloseButton />
          </Flex>
          <ModalBody>
            <VStack spacing={4}>
              {supportedWallets.map((wallet: Connector) => (
                <Button
                  key={wallet.id}
                  onClick={() => connectWallet(wallet)}
                  width="full"
                  h={16}
                  variant="ghost"
                  justifyContent={"left"}
                  fontSize={"lg"}
                >
                  <HStack spacing={3}>
                    <Image
                      boxSize="24px"
                      src={findWalletIcon(wallet.id)}
                      alt="xBull"
                    />
                    <Text>{wallet.name}</Text>
                  </HStack>
                </Button>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>{errorMessage}</ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
