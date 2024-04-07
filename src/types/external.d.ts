export interface AssetListDescriptor {
  name: string;
  provider: string;
  description: string;
  icon: string;
  url: string;
}

export type Asset = {
  name: string;
  code: string;
  org: string;
  domain: string;
  icon: string;
  decimals: number;
  comment?: string;
} & (
  | { contract: string; issuer?: string }
  | { issuer: string; contract: string }
);

export interface AssetList {
  name: string;
  provider: string;
  description: string;
  version: string;
  feedback: string;
  assets: Asset[];
}

declare module "@stellar-asset-lists/sdk" {
  export function fetchAvailableAssetLists(): Promise<AssetListDescriptor[]>;
  export function fetchAssetList(url: string): Promise<AssetList>;
  export function setAssetListResolverOptions(options: {
    catalogueUrl: string;
    ipfsGatewayUrl: string;
  }): void;
}
