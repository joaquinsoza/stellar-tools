"use client";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  Skeleton,
  Image,
  Button,
} from "@chakra-ui/react";
import { usePoolsForAsset } from "@/hooks/usePools";
import React, { useEffect, useRef } from "react";
import {
  generateStellarXUrl,
  getAssetPair,
  calculatePrice,
} from "@/components/utils/Assets/Pool";
import { useSorobanReact } from "@soroban-react/core";
import { Asset, Horizon } from "@stellar/stellar-sdk";

import { Asset as AssetType } from "@stellar-asset-lists/sdk";

type DexPoolTableProps = {
  asset: AssetType;
};

export function DexPoolTable({ asset }: DexPoolTableProps) {
  const { serverHorizon } = useSorobanReact();
  const newAsset = new Asset(asset?.code, asset?.issuer);
  const call = serverHorizon?.liquidityPools().forAssets(newAsset).call();
  const { pools, loading, loadMore } = usePoolsForAsset(call);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  const handleScroll = () => {
    if (scrollRef.current && !loading) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        loadMore();
      }
    }
  };

  useEffect(() => {
    const currentScrollRef = scrollRef.current;

    if (currentScrollRef) {
      currentScrollRef.addEventListener("scroll", handleScroll);
      return () => {
        currentScrollRef.removeEventListener("scroll", handleScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loadMore]);

  useEffect(() => {
    if (pools.length > 0) {
      setIsInitialLoad(false);
    }
  }, [pools]);

  return (
    <Box
      ref={scrollRef}
      maxHeight={250}
      maxWidth={1300}
      overflowY="auto"
      borderWidth="1px"
      borderRadius="lg"
      padding="4"
    >
      {isInitialLoad && loading ? (
        <Box>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton height="40px" my="10px" key={index} />
          ))}
        </Box>
      ) : (
        <Table variant="simple">
          <Thead bg="Background">
            <Tr>
              <Th>
                <Image
                  src="/images/stellarx.svg"
                  alt="StellarX"
                  width={20}
                  height={20}
                />
              </Th>
              <Th>Pair</Th>
              <Th>Price</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pools.length > 0 ? (
              pools.map((pool) => (
                <Tr
                  key={pool.id}
                  cursor="pointer"
                  bg="Background"
                  _hover={{ background: "ButtonFace" }}
                >
                  <Td>
                    <Button
                      onClick={() =>
                        window.open(
                          generateStellarXUrl(pool.reserves),
                          "_blank"
                        )
                      }
                    >
                      view on StellarX
                    </Button>
                  </Td>
                  <Td>{getAssetPair(pool.reserves)}</Td>
                  <Td>{calculatePrice(pool.reserves)}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                  >
                    <Text>Actually dont have pools.</Text>
                  </Box>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      )}
      {loading && !isInitialLoad && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <Spinner size="md" />
        </Box>
      )}
    </Box>
  );
}
