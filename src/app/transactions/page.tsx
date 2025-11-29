"use client";
import { useState } from "react";
import { shortenAddress, shortenText } from "@/helpers/address";
import { useTransactionHistory, Payment } from "@/hooks/useTransactionHistory";

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
    <div className="flex gap-1">
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
        <button
          key={startPage + i}
          onClick={() => onPageChange(startPage + i)}
          className={`px-3 py-2 border rounded-md transition-colors ${
            currentPage === startPage + i
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {startPage + i}
        </button>
      ))}
    </div>
  );
};

const PaymentsTable = ({ payments }: { payments: Payment[] }) => {
  const [assetsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  if (!payments || payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No transactions yet</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Connect your wallet to see your transaction history</p>
      </div>
    );
  }

  const lastAssetIndex = currentPage * assetsPerPage;
  const firstAssetIndex = lastAssetIndex - assetsPerPage;
  const currentPayments = payments.slice(firstAssetIndex, lastAssetIndex);

  const totalPages = Math.ceil(payments.length / assetsPerPage);
  const changePage = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">TxHash</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
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
                <tr
                  key={payment.id}
                  onClick={() =>
                    window.open(
                      `https://stellar.expert/explorer/public/tx/${payment.transaction_hash}`
                    )
                  }
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {created_at}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    {payment.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {payment.asset_type === "native"
                      ? "XLM"
                      : payment.asset_code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    {shortenAddress(payment.from)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    {shortenAddress(payment.to)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    {payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {shortenText(payment.transaction_hash)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={changePage}
        />
      </div>
    </div>
  );
};

export default function TransactionsPage() {
  const { payments, isLoading } = useTransactionHistory();

  return (
    <div className="flex flex-col items-center space-y-4 px-1 md:px-6">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100">
        Transactions
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-4xl text-center">
        take a look at your transactions history and export to any format you
        might need
      </p>
      <div className={`w-full ${isLoading ? 'animate-pulse' : ''}`}>
        {isLoading ? (
          <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg"></div>
        ) : (
          <PaymentsTable payments={payments} />
        )}
      </div>
    </div>
  );
}
