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
import { Asset } from "@stellar-asset-lists/sdk";
import React, { useEffect, useRef } from "react";
import {
  generateStellarXUrl,
  getAssetPair,
  calculatePrice,
} from "@/components/utils/Assets/Pool";

type DexPoolTableProps = {
  asset: Asset;
};

export const DexPoolTable = ({ asset }: DexPoolTableProps) => {
  const { pools, loading, loadMore } = usePoolsForAsset(asset);
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
    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
      return () => {
        scrollRef.current?.removeEventListener("scroll", handleScroll);
      };
    }
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
};
