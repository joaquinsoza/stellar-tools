"use client";
import { useTokens } from "@/hooks/useTokens";
import { useState } from "react";
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

const AssetsTable = ({ assets }: { assets: any[] | undefined }) => {
  const [assetsPerPage, setAssetsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  if (!assets) return;

  const lastAssetIndex = currentPage * assetsPerPage;
  const firstAssetIndex = lastAssetIndex - assetsPerPage;
  const currentAssets = assets.slice(firstAssetIndex, lastAssetIndex);

  const totalPages = Math.ceil(assets.length / assetsPerPage);
  const changePage = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Icon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contract</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">Domain</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentAssets.map((asset) => (
              <tr
                key={asset.contract || `${asset.code}-${asset.issuer}`}
                onClick={() =>
                  router.push(
                    `/assets/${asset.contract || `${asset.code}-${asset.issuer}`}`
                  )
                }
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={asset.icon?.trim()}
                    alt={asset.code}
                    className="w-8 h-8 rounded-full"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {asset.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                  {asset.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {shortenAddress(asset.contract)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                  {asset.domain}
                </td>
              </tr>
            ))}
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

export default function Assets() {
  const { tokens, isLoading } = useTokens();

  return (
    <div className="flex flex-col items-center space-y-4 px-1 md:px-6">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100">
        Assets Directory
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-4xl text-center">
        Explore a comprehensive directory of assets from the Soroswap ecosystem.
        Discover and manage assets efficiently in one unified location. For
        specific assets not listed, please use the search section.
      </p>
      <div className={`w-full ${isLoading ? 'animate-pulse' : ''}`}>
        {isLoading ? (
          <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg"></div>
        ) : (
          <AssetsTable assets={tokens} />
        )}
      </div>
    </div>
  );
}
