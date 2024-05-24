"use client";

import { Box, Flex, Text } from "@chakra-ui/react";

// TODO: create or add pool type
type DexPoolItemProps = {
  pool: {
    id: string;
    fee: number;
    type: string;
    total_shares: string;
    reserves: Array<{ asset: string; amount: string }>;
  };
};

export const DexPoolItem = ({ pool }: DexPoolItemProps) => {
  return (
    <Box
      bg={"Background"}
      p={4}
      borderRadius={4}
      boxShadow="md"
      _hover={{ boxShadow: "lg" }}
    >
      <Flex justifyContent="space-between">
        <Text>{pool.id}</Text>
        <Text>{pool.fee}</Text>
        <Text>{pool.type}</Text>
        <Text>{pool.total_shares}</Text>
        <Text>{JSON.stringify(pool.reserves)}</Text>
      </Flex>
    </Box>
  );
};
