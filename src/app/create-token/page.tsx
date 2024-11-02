"use client";
import {
  VStack,
  Heading,
  Text,
  Select,
  Input,
  NumberInput,
  NumberInputField,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  useToast,
  Checkbox,
} from "@chakra-ui/react";
import { useSorobanReact } from "@soroban-react/core";
import { useState } from "react";

export default function CreateTokenPage() {
  const sorobanContext = useSorobanReact();
  const toast = useToast();

  // Form state
  const [tokenType, setTokenType] = useState("soroban");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(7); // Default to 7
  const [burnFee, setBurnFee] = useState(0); // For deflationary tokens
  const [pairToken, setPairToken] = useState(""); // For liquidity generator tokens
  const [liquidityFee, setLiquidityFee] = useState(0); // For liquidity generator tokens
  const [mintAmount, setMintAmount] = useState(0); // Amount to mint
  const [recipientAddress, setRecipientAddress] = useState(""); // Address to receive the tokens
  const [disableFutureMints, setDisableFutureMints] = useState(false); // Checkbox for future mints

  const handleCreateToken = () => {
    // Choose the creation function based on token type
    switch (tokenType) {
      case "deflationary":
        handleCreateDeflationaryToken();
        break;
      case "liquidityGenerator":
        handleCreateLiquidityGeneratorToken();
        break;
      default:
        handleCreateStellarAsset();
        break;
    }
  };

  const handleCreateStellarAsset = () => {
    console.log("Creating Soroban Asset:", {
      name,
      symbol,
      decimals,
      mintAmount,
      recipientAddress,
      disableFutureMints,
    });
    toast({
      title: "Soroban Asset Created",
      description: `${name} (${symbol}) with ${decimals} decimals`,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const handleCreateDeflationaryToken = () => {
    console.log("Creating Deflationary Token:", {
      name,
      symbol,
      decimals,
      burnFee,
      mintAmount,
      recipientAddress,
      disableFutureMints,
    });
    toast({
      title: "Deflationary Token Created",
      description: `${name} (${symbol}) with ${decimals} decimals and ${burnFee} BPS burn fee`,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const handleCreateLiquidityGeneratorToken = () => {
    console.log("Creating Liquidity Generator Token:", {
      name,
      symbol,
      decimals,
      pairToken,
      liquidityFee,
      mintAmount,
      recipientAddress,
      disableFutureMints,
    });
    toast({
      title: "Liquidity Generator Token Created",
      description: `${name} (${symbol}) with ${decimals} decimals, paired with ${pairToken}, ${liquidityFee} BPS liquidity fee`,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const sorobanTokenDisabled = true;
  const deflationaryTokenDisabled = true;
  const liquidityGeneratorTokenDisbaled = true;

  return (
    <VStack spacing={6} align="center" px={{ base: 4, md: 8 }} py={8}>
      <Heading as="h1" size="xl" mb={4}>
        Create Token
      </Heading>
      <Text color="gray.600" textAlign="center" maxW="lg">
        Create your own custom token on the Soroban network. The connected
        wallet will be assigned as the admin and signer for this token. Note: A
        fee of 300 XLM will be charged for token creation.
      </Text>

      <FormControl id="tokenType">
        <FormLabel>Token Type</FormLabel>
        <Select
          value={tokenType}
          onChange={(e) => setTokenType(e.target.value)}
          placeholder="Select token type"
        >
          <option value="soroban">Soroban Token</option>
          <option value="deflationary">Deflationary Token</option>
          <option value="liquidityGenerator">Liquidity Generator Token</option>
        </Select>

        {/* Description text based on selected token type */}
        <Text mt={2} color="gray.500" fontSize="sm">
          {tokenType === "soroban" && (
            <>
              This is a standard token on the Soroban network.
              <Text as="span" color="red.500" fontWeight="bold">
                Note:
              </Text>{" "}
              Tokens created on the Soroban network cannot be used directly on
              the Stellar network.
            </>
          )}
          {tokenType === "deflationary" && (
            <>
              A Deflationary Token applies a burn fee on each transaction,
              reducing the total supply over time. Specify the burn fee in basis
              points (BPS) where 100 BPS equals 1%.
            </>
          )}
          {tokenType === "liquidityGenerator" && (
            <>
              A Liquidity Generator Token will create a liquidity pool on
              Soroswap immediately after creation. You will need to provide an
              initial amount of the selected pair token (e.g., XLM) along with
              your minted tokens to initialize the pool.
            </>
          )}
        </Text>
      </FormControl>

      <FormControl id="name">
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Token Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="symbol">
        <FormLabel>Symbol</FormLabel>
        <Input
          placeholder="Symbol (max 4 characters)"
          value={symbol}
          maxLength={4}
          onChange={(e) => setSymbol(e.target.value)}
        />
      </FormControl>

      <FormControl id="decimals">
        <FormLabel>Decimals</FormLabel>
        <NumberInput
          max={18}
          min={0}
          value={decimals}
          onChange={(valueString) => setDecimals(Number(valueString))}
        >
          <NumberInputField />
        </NumberInput>
        <FormHelperText>Decimals (max 18, default is 7)</FormHelperText>
      </FormControl>

      {/* Additional Fields for Deflationary Token */}
      {tokenType === "deflationary" && (
        <FormControl id="burnFee">
          <FormLabel>Burn Fee BPS</FormLabel>
          <NumberInput
            min={0}
            max={10000}
            value={burnFee}
            onChange={(valueString) => setBurnFee(Number(valueString))}
          >
            <NumberInputField />
          </NumberInput>
          <FormHelperText>
            Fee deducted on each transaction. 100 BPS = 1%.
          </FormHelperText>
        </FormControl>
      )}

      {/* Additional Fields for Liquidity Generator Token */}
      {tokenType === "liquidityGenerator" && (
        <>
          <FormControl id="pairToken">
            <FormLabel>Pair Token</FormLabel>
            <Input
              placeholder="Enter the other token for liquidity pool (e.g., XLM)"
              value={pairToken}
              onChange={(e) => setPairToken(e.target.value)}
            />
            <FormHelperText>
              This token will be paired with the liquidity generator token.
            </FormHelperText>
          </FormControl>

          <FormControl id="liquidityFee">
            <FormLabel>Liquidity Generation Fee BPS</FormLabel>
            <NumberInput
              min={0}
              max={10000}
              value={liquidityFee}
              onChange={(valueString) => setLiquidityFee(Number(valueString))}
            >
              <NumberInputField />
            </NumberInput>
            <FormHelperText>
              Fee for liquidity generation. 100 BPS = 1%.
            </FormHelperText>
          </FormControl>
        </>
      )}

      {/* New Fields for Mint Amount, Recipient Address, and Disable Future Mints */}
      <FormControl id="mintAmount">
        <FormLabel>Mint Amount</FormLabel>
        <NumberInput
          min={0}
          value={mintAmount}
          onChange={(valueString) => setMintAmount(Number(valueString))}
        >
          <NumberInputField />
        </NumberInput>
        <FormHelperText>
          Specify the initial amount of tokens to mint.
        </FormHelperText>
      </FormControl>

      <FormControl id="recipientAddress">
        <FormLabel>Recipient Address</FormLabel>
        <Input
          placeholder="Address where minted tokens will be sent"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
        />
      </FormControl>

      <FormControl id="disableFutureMints">
        <Checkbox
          isChecked={disableFutureMints}
          onChange={(e) => setDisableFutureMints(e.target.checked)}
        >
          Disable Future Mints
        </Checkbox>
        <FormHelperText>
          Check this box if no additional tokens should be minted after the
          initial mint.
        </FormHelperText>
      </FormControl>

      <Button
        colorScheme="pink"
        size="lg"
        onClick={handleCreateToken}
        width={"full"}
        isDisabled={
          (tokenType == "soroban" && sorobanTokenDisabled) ||
          (tokenType == "deflationary" && deflationaryTokenDisabled) ||
          (tokenType == "liquidityGenerator" && liquidityGeneratorTokenDisbaled)
        }
      >
        {(tokenType == "soroban" && sorobanTokenDisabled) ||
        (tokenType == "deflationary" && deflationaryTokenDisabled) ||
        (tokenType == "liquidityGenerator" && liquidityGeneratorTokenDisbaled)
          ? "Coming Soon"
          : "Create Token"}
      </Button>
    </VStack>
  );
}
