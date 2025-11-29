"use client";
import { useTokens, AssetType } from "@/hooks/useTokens";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { shortenAddress } from "@/helpers/address";
import { FiArrowUp } from "react-icons/fi";
import Image from "next/image";

const ITEMS_PER_LOAD = 20;

const AssetIcon = ({ src, code }: { src?: string; code: string }) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const trimmedSrc = src?.trim();

  const fallback = (
    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
        {code.charAt(0)}
      </span>
    </div>
  );

  if (!trimmedSrc || error) {
    return <div className="w-8 h-8 flex-shrink-0">{fallback}</div>;
  }

  return (
    <div className="w-8 h-8 relative flex-shrink-0">
      {!loaded && fallback}
      <Image
        src={trimmedSrc}
        alt={code}
        width={32}
        height={32}
        className={`rounded-full absolute inset-0 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
};

const TableSkeleton = ({ rows = 10 }: { rows?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg animate-pulse">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex-shrink-0" />
        <div className="flex-1 flex items-center gap-4">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded hidden md:block" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded" />
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-600 rounded hidden md:block" />
        </div>
      </div>
    ))}
  </div>
);

const ScrollToTop = ({ visible }: { visible: boolean }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 p-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg transition-all z-50"
      aria-label="Scroll to top"
    >
      <FiArrowUp className="w-5 h-5" />
    </button>
  );
};

interface AssetsListProps {
  assets: AssetType[];
}

const AssetsList = ({ assets }: AssetsListProps) => {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const visibleAssets = assets.slice(0, visibleCount);
  const hasMore = visibleCount < assets.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_LOAD, assets.length));
    }
  }, [hasMore, assets.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMore, hasMore]);

  // Scroll position tracker for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Counter */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Showing {visibleAssets.length} of {assets.length} tokens
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                Name
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contract
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                Domain
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {visibleAssets.map((asset) => (
              <tr
                key={asset.contract || `${asset.code}-${asset.issuer}`}
                onClick={() =>
                  router.push(`/assets/${asset.contract || `${asset.code}-${asset.issuer}`}`)
                }
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-4 md:px-6 py-3 whitespace-nowrap h-16">
                  <div className="flex items-center gap-3">
                    <AssetIcon src={asset.icon} code={asset.code} />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {asset.code}
                    </span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell h-16">
                  {asset.name}
                </td>
                <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 h-16">
                  {shortenAddress(asset.contract)}
                </td>
                <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell h-16">
                  {asset.domain}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-pink-500 rounded-full animate-spin" />
            <span className="text-sm">Loading more...</span>
          </div>
        </div>
      )}

      {/* End of list */}
      {!hasMore && assets.length > ITEMS_PER_LOAD && (
        <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
          You&apos;ve reached the end
        </div>
      )}

      <ScrollToTop visible={showScrollTop} />
    </div>
  );
};

export default function Assets() {
  const { tokens, isLoading } = useTokens();

  return (
    <div className="flex flex-col items-center space-y-6 px-2 md:px-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Assets Directory
          </h1>
          {!isLoading && tokens.length > 0 && (
            <span className="px-2.5 py-1 text-sm font-medium bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full">
              {tokens.length}
            </span>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          Explore assets from the Soroswap ecosystem. Use the search bar for specific tokens.
        </p>
      </div>

      <div className="w-full">
        {isLoading ? <TableSkeleton /> : <AssetsList assets={tokens} />}
      </div>
    </div>
  );
}
