import { useState } from "react";
import { Pool } from "@/common/types/types";

export function usePoolsForAsset() {
  const [pools] = useState<Pool[]>([]);
  const [loading] = useState(false);

  const loadMore = async () => {
    // Will be implemented when blockchain integration is added back
  };

  return { pools, loading, loadMore };
}
