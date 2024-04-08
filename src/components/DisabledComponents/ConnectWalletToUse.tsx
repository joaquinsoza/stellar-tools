import { Box, Card, Text, VStack } from "@chakra-ui/react";
import { useSorobanReact } from "@soroban-react/core";
import { ConnectWalletButton } from "../Buttons/ConnectWalletButton";

export const ConnectWalletToUse = () => {
  const { address } = useSorobanReact();
  return (
    <Box
      hidden={Boolean(address)}
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      backdropFilter="blur(4px)"
      zIndex={1}
      display="flex"
      alignItems="center"
      justifyContent="center"
      rounded="2xl"
      padding={6}
    >
      <Card bg={"Background"} rounded={"2xl"} textAlign={"center"} p={4}>
        <VStack spacing={2}>
          <Text fontSize="xl">Get the Full Experience</Text>
          <ConnectWalletButton />
        </VStack>
      </Card>
    </Box>
  );
};
