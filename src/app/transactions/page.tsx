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
import { useRouter } from "next/navigation";
import { shortenAddress, shortenText } from "@/helpers/address";
import { Asset } from "@stellar-asset-lists/sdk";
import {
  getAccountHistory,
  useTransactionHistory,
} from "@/hooks/useTransactionHistory";

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

const PaymentsTable = ({ payments }: { payments: any[] | undefined }) => {
  const [assetsPerPage, setAssetsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  if (!payments) return;

  const lastAssetIndex = currentPage * assetsPerPage;
  const firstAssetIndex = lastAssetIndex - assetsPerPage;
  const currentPayments = payments.slice(firstAssetIndex, lastAssetIndex);

  const totalPages = Math.ceil(payments.length / assetsPerPage);
  const changePage = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Box>
      <Table variant="simple">
        <Thead bg={"Background"}>
          <Tr>
            {isMobile ? (
              <>
                <Th>Date</Th>
                <Th>Code</Th>
                <Th>TxHash</Th>
              </>
            ) : (
              <>
                <Th>Date</Th>
                <Th>Type</Th>
                <Th>Code</Th>
                <Th>From</Th>
                <Th>To</Th>
                <Th>Amount</Th>
                <Th>TxHash</Th>
              </>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {currentPayments.map((payment) => {
            const created_at = new Date(payment.created_at).toLocaleString(
              undefined,
              {
                day: "numeric",
                month: "short",
                year: "2-digit",
              }
            );
            return (
              <Tr
                key={payment.id}
                onClick={() =>
                  window.open(
                    `https://stellar.expert/explorer/public/tx/${payment.transaction_hash}`
                  )
                }
                cursor="pointer"
                bg={"Background"}
                _hover={{ background: "ButtonFace" }}
              >
                {isMobile ? (
                  <>
                    <Td>{created_at}</Td>
                    <Td>
                      {payment.asset_type === "native"
                        ? "XLM"
                        : payment.asset_code}
                    </Td>
                    <Td>{payment.transaction_hash}</Td>
                  </>
                ) : (
                  <>
                    <Td>{created_at}</Td>
                    <Td>{payment.type}</Td>
                    <Td>
                      {payment.asset_type === "native"
                        ? "XLM"
                        : payment.asset_code}
                    </Td>
                    <Td>{shortenAddress(payment.from)}</Td>
                    <Td>{shortenAddress(payment.to)}</Td>
                    <Td>{payment.amount}</Td>
                    <Td>{shortenText(payment.transaction_hash)}</Td>
                  </>
                )}
              </Tr>
            );
          })}
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

export default function TransactionsPage() {
  const { transactions, operations, payments, isLoading } =
    useTransactionHistory();

  return (
    <VStack spacing={4} align="center" px={{ base: 1, md: 6 }}>
      <Heading as="h1" size="xl">
        Transactions
      </Heading>
      <Text color="gray.600" maxW="4xl" textAlign="center">
        take a look at your transactions history and export to any format you
        might need
      </Text>
      <Skeleton height={"full"} isLoaded={!isLoading} width="full">
        <PaymentsTable payments={payments} />
      </Skeleton>
    </VStack>
  );
}
