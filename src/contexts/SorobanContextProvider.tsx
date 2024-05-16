import { standalone, testnet, mainnet } from "@soroban-react/chains";
import { SorobanReactProvider } from "@soroban-react/core";
import { freighter } from "@soroban-react/freighter";
import { xbull } from "@soroban-react/xbull";
import { lobstr } from "@soroban-react/lobstr";
import { ChainMetadata, Connector, WalletChain } from "@soroban-react/types";

const chains: ChainMetadata[] =
  process.env.NODE_ENV === "production"
    ? [mainnet, testnet]
    : [standalone, testnet, mainnet];

const findWalletChainByName = (name: string): WalletChain | undefined => {
  return chains.find((chain) => chain.id === name);
};

// Get the active chain based on the environment variable or default to testnet
const activeChainName = process.env.NEXT_PUBLIC_DEFAULT_NETWORK || "testnet";
const activeChain: WalletChain =
  findWalletChainByName(activeChainName) || testnet;

// Set allowed connectors
const connectors: Connector[] = [freighter(), xbull(), lobstr()];

export default function MySorobanReactProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SorobanReactProvider
      chains={chains}
      appName={"Stellar Tools"}
      connectors={connectors}
      activeChain={activeChain}
      autoconnect
    >
      {children}
    </SorobanReactProvider>
  );
}
