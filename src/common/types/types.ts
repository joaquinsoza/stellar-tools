interface Pool {
  id: string;
  fee: number;
  type: string;
  total_shares: string;
  reserves: Array<{ asset: string; amount: string }>;
}

interface Reserve {
  asset: string;
  amount: string;
}

export type { Pool, Reserve };
