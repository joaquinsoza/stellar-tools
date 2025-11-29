export interface AssetType {
  code: string;
  issuer: string;
  contract: string;
  name: string;
  org: string;
  domain: string;
  icon: string;
  decimals: number;
}

// Mock asset data - will be replaced with actual fetching logic later
const MOCK_ASSETS: AssetType[] = [
  {
    code: "XLM",
    issuer: "",
    contract: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
    name: "Stellar Lumens",
    org: "Stellar Development Foundation",
    domain: "stellar.org",
    icon: "https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png",
    decimals: 7,
  },
  {
    code: "AQUA",
    issuer: "GBNZILSTVQZ4R7IKQDGHYGY2QXL5QOFJYQMXPKWRRM5PAV7Y4M67AQUA",
    contract: "CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK",
    name: "AQUA",
    org: "aqua.network",
    domain: "aqua.network",
    icon: "https://aqua.network/assets/img/aqua-logo.png",
    decimals: 7,
  },
  {
    code: "USDC",
    issuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
    contract: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
    name: "USD Coin",
    org: "Centre",
    domain: "centre.io",
    icon: "https://www.centre.io/images/usdc/usdc-icon-86074d9d49.png",
    decimals: 7,
  },
  {
    code: "yUSDC",
    issuer: "GDGTVWSM4MGS4T7Z6W4RPWOCHE2I6RDFCIFZGS3DOA63LWQTRNZNTTFF",
    contract: "CCKW6SMINDG6TUWJROIZ535EW2ZUJQEDGSKNIK3FBK26PAMBZDVDHGKU",
    name: "yUSDC",
    org: "YBX Protocol",
    domain: "ybx.finance",
    icon: "https://ybx.finance/assets/yusdc.png",
    decimals: 7,
  },
  {
    code: "EURC",
    issuer: "GDHU6WRG4IEQXM5NZ4BMPKOXHW76MZM4Y2IEMFDVXBSDP6SJY4ITNPP2",
    contract: "CB7IXRJCBNUZGLGPFZWB3YKPASQULGWEGC362X3ISCZLKFC2Q4TQYUKI",
    name: "EURC",
    org: "Circle",
    domain: "circle.com",
    icon: "https://www.circle.com/hubfs/Brand/EURC/EURC-icon.png",
    decimals: 7,
  },
  {
    code: "BTC",
    issuer: "GDPJALI4AZKUU2W426U5WKMAT6CN3AJRPIIRYR2YM54TL2GDWO5O2MZM",
    contract: "CAP4DHZH7AWI64VPKPQCRWXOEVLDJ6RZADMQUGFFED5ZGSPP7GYHPNJ6",
    name: "Bitcoin",
    org: "Ultra Stellar",
    domain: "ultrastellar.com",
    icon: "https://ultracapital.xyz/assets/icons/btc.png",
    decimals: 7,
  },
  {
    code: "ETH",
    issuer: "GBFXOHVAS43OIWNIO7XLRJAHT3BICFEIKOJLZVXNT572MISM4CMGSOCC",
    contract: "CAZG324WD7YJHKBL67FXEZ6SH6VMTXONNY6NJVXOSD7V5KXQIOOYA5UC",
    name: "Ethereum",
    org: "Ultra Stellar",
    domain: "ultrastellar.com",
    icon: "https://ultracapital.xyz/assets/icons/eth.png",
    decimals: 7,
  },
  {
    code: "yXLM",
    issuer: "GARDNV3Q7YGT4AKSDF25LT32YSCMU2YCZOIZKQ5RG5E7WDVQP6CFF5FA",
    contract: "CDTKPWPLOURQA2SGAALU2SO7YLCBUG7RJMGAYPGFFTAPZCGK36ZO4FRO",
    name: "yXLM",
    org: "Ultra Stellar",
    domain: "ultrastellar.com",
    icon: "https://ultrastellar.com/static/media/yXLM.7f799c84bb66c69b2dc4.png",
    decimals: 7,
  },
];

const MOCK_PROVIDERS = [
  { provider: "Stellar Asset Lists" },
  { provider: "StellarTerm" },
];

export function useMergedAssetLists() {
  return {
    providers: MOCK_PROVIDERS,
    assets: MOCK_ASSETS,
    isLoading: false,
    isError: false,
  };
}
