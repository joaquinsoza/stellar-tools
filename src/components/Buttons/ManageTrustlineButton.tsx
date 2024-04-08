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
  Text,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { Asset as AssetType } from "@/types/external";
import { useAssetForAccount } from "@/hooks/useAsset";
import { setTrustline } from "@soroban-react/contracts";
import {
  Asset,
  Networks,
  Operation,
  TimeoutInfinite,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { useAccount } from "@/hooks/useAccount";
import { useSorobanReact } from "@soroban-react/core";

interface ManageTrustlineProps {
  asset?: AssetType;
}

export function ManageTrustlineButton({ asset }: ManageTrustlineProps) {
  const sorobanContext = useSorobanReact();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { assetForAccount, isLoading } = useAssetForAccount(asset);
  const [newLimit, setNewLimit] = useState("");
  const [submittingTx, setSubmittingTx] = useState<boolean>(false);
  const { account } = useAccount();

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setNewLimit(event.target.value);

  const handleSubmit = async () => {
    if (!asset || !account) return;
    if (Number(newLimit) < Number(assetForAccount?.balance)) {
      toast({
        title: "Error",
        description: "New limit cannot be lower than your current balance.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }
    try {
      setSubmittingTx(true);
      console.log("creating operation");
      const operation = Operation.changeTrust({
        source: account?.accountId(),
        limit: newLimit,
        asset: new Asset(asset?.code, asset?.issuer),
      });
      console.log("🚀 « operation:", operation);

      const txn = new TransactionBuilder(account, {
        fee: "100",
        timebounds: { minTime: 0, maxTime: 0 },
        networkPassphrase: Networks.PUBLIC,
      })
        .addOperation(operation)
        .setTimeout(TimeoutInfinite)
        .build();

      console.log("🚀 « txn:", txn);

      const signed = await sorobanContext.activeConnector?.signTransaction(
        txn.toXDR(),
        {
          networkPassphrase: Networks.PUBLIC,
        }
      );
      console.log("🚀 « signed:", signed);

      const transactionToSubmit = TransactionBuilder.fromXDR(
        signed!,
        Networks.PUBLIC
      );
      console.log("🚀 « transactionToSubmit:", transactionToSubmit);

      let response = await sorobanContext?.serverHorizon?.submitTransaction(
        transactionToSubmit
      );
      console.log("🚀 « response:", response);
      if (response) {
        toast({
          title: newLimit === "0" ? "Trustline Revoked" : "Trustline Updated",
          description:
            newLimit === "0"
              ? "You have successfully revoked the trustline."
              : `The new trustline limit of ${newLimit} has been set.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
        setSubmittingTx(false);
        onClose();
      }
      return response;
    } catch (error) {
      console.log("🚀 « error:", error);
      setSubmittingTx(false);
      toast({
        title: "Error",
        description: `${error}`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  return (
    <>
      <Button colorScheme="pink" variant="solid" onClick={onOpen}>
        Manage Trustline
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={
          submittingTx ? () => console.log("submitting tx cant close") : onClose
        }
        size={"md"}
        isCentered
      >
        <ModalOverlay backdropFilter="blur(5px) hue-rotate(10deg)" />
        <ModalContent rounded={"2xl"}>
          <ModalHeader>Adjust Trustline</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>Current limit: {assetForAccount?.limit || "Not set"}</Text>
              <Text fontSize="sm" color="gray.500">
                Enter a new limit for your trustline. Setting the limit to 0
                will revoke the trustline. Note that the limit cannot be lower
                than your current balance ({assetForAccount?.balance ?? 0}).
              </Text>
              <Input
                placeholder="New limit"
                value={newLimit}
                onChange={handleLimitChange}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button disabled={submittingTx} onClick={handleSubmit}>
              {submittingTx ? <Spinner /> : "Update Trustline"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
