"use client";
import { Box, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { usePoolsTest3 } from "@/hooks/usePools";
import { Asset } from "@stellar-asset-lists/sdk";
import React, { useEffect, useRef } from "react";

type DexPoolTableProps = {
  asset: Asset;
};

export const DexPoolTable = ({ asset }: DexPoolTableProps) => {
  console.log("asset", asset);
  const { pools, loading, loadMore } = usePoolsTest3(asset);
  const scrollRef = useRef<HTMLDivElement>(null);
  console.log("pools", pools);
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight && loadMore && !loading) {
        loadMore();
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
      return () => {
        scrollRef.current?.removeEventListener("scroll", handleScroll);
      };
    }
  }, [loading, loadMore]);

  return (
    <Box ref={scrollRef} height="400px" overflowY="auto">
      <Table variant="simple">
        <Thead bg={"Background"}>
          <Tr>
            <Th>ID</Th>
            <Th>Fee</Th>
            <Th>Type</Th>
            <Th>Total Shares</Th>
            <Th>Reserves</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pools?.map((pool, index) => (
            <Tr
              key={pool.id}
              cursor="pointer"
              bg={"Background"}
              _hover={{ background: "ButtonFace" }}
            >
              <Td>{pool.id}</Td>
              <Td>{pool.fee}</Td>
              <Td>{pool.type}</Td>
              <Td>{pool.total_shares}</Td>
              <Td>{JSON.stringify(pool.reserves)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {loading && <div>Loading...</div>}
      {!loadMore && <div>No more pools available.</div>}
    </Box>
  );
};
