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
  Icon,
  UnorderedList,
  ListItem,
  HStack,
} from "@chakra-ui/react";
import { Asset as AssetType } from "@stellar-asset-lists/sdk";
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
import { FaPencil } from "react-icons/fa6";

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
  const haveBalance = assetForAccount?.balance
    ? Number(assetForAccount?.balance) !== 0
    : false;

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setNewLimit(event.target.value);

  const handleRevokeChange = () => {
    setNewLimit("0");
    handleSubmit();
  };

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
      <Button
        colorScheme="pink"
        width={"full"}
        variant="solid"
        onClick={onOpen}
        justifyContent={"space-around"}
      >
        <Icon as={FaPencil} boxSize={4} />
        Manage Trustline
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={
          submittingTx
            ? () => console.log("submitting tx cant close")
            : () => {
                onClose();
                setNewLimit("");
              }
        }
        size={"md"}
        isCentered
      >
        <ModalOverlay backdropFilter="blur(5px) hue-rotate(10deg)" />
        <ModalContent rounded={"2xl"}>
          <ModalHeader>Adjust Trustline</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack alignItems="baseline" mb={5}>
              <Text letterSpacing={0.5} color="gray">
                CURRENT LIMIT
              </Text>
              <Text fontWeight="bold">
                {assetForAccount?.limit || "NOT SET"}
              </Text>
            </VStack>
            <VStack spacing={4}>
              <Text fontSize="sm" color="gray.500">
                <UnorderedList>
                  <ListItem>
                    Enter a new limit for your trustline. Setting the limit to 0
                    will revoke the trustline.
                  </ListItem>
                  <ListItem>
                    Note that the limit cannot be lower than your current
                    balance ({assetForAccount?.balance ?? 0}).
                  </ListItem>
                </UnorderedList>
              </Text>
              <Input
                placeholder="New limit"
                value={newLimit}
                onChange={handleLimitChange}
              />
            </VStack>
          </ModalBody>
          <ModalFooter gap={5}>
            <Button
              isDisabled={!haveBalance || submittingTx}
              onClick={handleRevokeChange}
              variant="outline"
              colorScheme="blue"
            >
              {submittingTx ? <Spinner /> : "Revoke Trustline"}
            </Button>
            <Button
              isDisabled={submittingTx}
              onClick={handleSubmit}
              colorScheme="blue"
            >
              {submittingTx ? <Spinner /> : "Update Trustline"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
