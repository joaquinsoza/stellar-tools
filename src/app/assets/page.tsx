"use client";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Link as ChakraLink,
  ButtonGroup,
  Skeleton,
  Avatar,
  Text,
  VStack,
  Heading,
  useMediaQuery,
} from "@chakra-ui/react";
import { useMergedAssetLists } from "@/hooks/useMergedAssetsList";
import { useState } from "react";
import { Asset, AssetListDescriptor } from "@/types/external";
import { useRouter } from "next/navigation";
import { shortenAddress } from "@/helpers/address";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (nextPage: number) => void;
}

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const maxPagesToShow = 5;
  let startPage, endPage;

  if (totalPages <= maxPagesToShow) {
    // less than maxPagesToShow total pages so show all
    startPage = 1;
    endPage = totalPages;
  } else {
    // more than maxPagesToShow total pages so calculate start and end pages
    const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
    const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
    if (currentPage <= maxPagesBeforeCurrentPage) {
      // current page near the start
      startPage = 1;
      endPage = maxPagesToShow;
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      // current page near the end
      startPage = totalPages - maxPagesToShow + 1;
      endPage = totalPages;
    } else {
      // current page somewhere in the middle
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }

  return (
    <ButtonGroup variant="outline">
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
        <Button
          key={startPage + i}
          onClick={() => onPageChange(startPage + i)}
          isActive={currentPage === startPage + i}
        >
          {startPage + i}
        </Button>
      ))}
    </ButtonGroup>
  );
};

const AssetsTable = ({ assets }: { assets: Asset[] | undefined }) => {
  const [assetsPerPage, setAssetsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  if (!assets) return;

  const lastAssetIndex = currentPage * assetsPerPage;
  const firstAssetIndex = lastAssetIndex - assetsPerPage;
  const currentAssets = assets.slice(firstAssetIndex, lastAssetIndex);

  const totalPages = Math.ceil(assets.length / assetsPerPage);
  const changePage = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Box>
      <Table variant="simple">
        <Thead bg={"Background"}>
          <Tr>
            {isMobile ? (
              <>
                <Th>Icon</Th>
                <Th>Code</Th>
                <Th>Contract</Th>
              </>
            ) : (
              <>
                <Th>Icon</Th>
                <Th>Code</Th>
                <Th>Name</Th>
                <Th>Contract</Th>
                <Th>Domain</Th>
              </>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {currentAssets.map((asset) => (
            <Tr
              key={asset.contract || `${asset.code}-${asset.issuer}`}
              onClick={() =>
                router.push(
                  `/assets/${asset.contract || `${asset.code}-${asset.issuer}`}`
                )
              }
              cursor="pointer"
              bg={"Background"}
              _hover={{ background: "ButtonFace" }}
            >
              {isMobile ? (
                <>
                  <Td>
                    <Avatar size={"sm"} src={asset.icon} />
                  </Td>
                  <Td>{asset.code}</Td>
                  <Td>{shortenAddress(asset.contract)}</Td>
                </>
              ) : (
                <>
                  <Td>
                    <Avatar size={"sm"} src={asset.icon} />
                  </Td>
                  <Td>{asset.code}</Td>
                  <Td>{asset.name}</Td>
                  <Td>{shortenAddress(asset.contract)}</Td>
                  <Td>{asset.domain}</Td>
                </>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex justifyContent="center" mt={4}>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={changePage}
        />
      </Flex>
    </Box>
  );
};

export default function Assets() {
  const { providers, assets, isLoading } = useMergedAssetLists();

  return (
    <VStack spacing={4} align="center" px={{ base: 1, md: 6 }}>
      <Heading as="h1" size="xl">
        Assets Directory
      </Heading>
      <Text color="gray.600" maxW="4xl" textAlign="center">
        Explore a comprehensive directory of assets, curated from various
        trusted providers including{" "}
        {(providers as AssetListDescriptor[])?.map((provider, index, array) =>
          index === array.length - 1
            ? `and ${provider.provider}.`
            : `${provider.provider}, `
        )}{" "}
        Discover and manage assets efficiently in one unified location. For
        specific assets not listed, please use the search section.
      </Text>
      <Skeleton height={"full"} isLoaded={!isLoading} width="full">
        <AssetsTable assets={assets} />
      </Skeleton>
    </VStack>
  );
}
