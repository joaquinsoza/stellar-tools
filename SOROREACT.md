# @soroban-react Packages Usage in Stellar Tools

This document catalogues all uses of @soroban-react packages throughout the Stellar Tools project, their purposes, and locations.

## Installed Packages

The following @soroban-react packages are installed (from `package.json`):

```json
"@soroban-react/chains": "9.1.2",
"@soroban-react/contracts": "9.1.4", 
"@soroban-react/core": "9.1.4",
"@soroban-react/freighter": "9.1.2",
"@soroban-react/lobstr": "9.1.2",
"@soroban-react/types": "9.1.2",
"@soroban-react/utils": "9.1.2",
"@soroban-react/wallet-data": "9.1.4",
"@soroban-react/xbull": "9.1.2"
```

## Package Usage Analysis

### @soroban-react/core

**Purpose**: Main React context provider and hooks for Soroban integration

**Used in:**
- `src/contexts/SorobanContextProvider.tsx:2` - Import `SorobanReactProvider`
- `src/components/Assets/AssetActionPanel.tsx:12` - Import `useSorobanReact`
- `src/hooks/useTransactionHistory.tsx:8` - Import `SorobanContextType, useSorobanReact`
- `src/helpers/soroban.ts:2` - Import `SorobanContextType`
- `src/hooks/useAccount.tsx:2` - Import `SorobanContextType, useSorobanReact`
- `src/app/contracts/page.tsx:7` - Import `useSorobanReact`
- `src/components/Assets/pools/DexPoolTable.tsx:9` - Import `useSorobanReact`
- `src/hooks/useAssetInformation.tsx:1` - Import `useSorobanReact`
- `src/hooks/useAsset.tsx:12` - Import `useSorobanReact`
- `src/components/Layout/Navbar.tsx:10` - Import `useSorobanReact`
- `src/components/ConnectedWallet.tsx:3` - Import `useSorobanReact`
- `src/components/DisabledComponents/ConnectWalletToUse.tsx:1` - Import `useSorobanReact`
- `src/components/Layout/SideBar/NavItem.tsx:1` - Import `useSorobanReact`
- `src/components/Buttons/ButtonPrimary.tsx:3` - Import `useSorobanReact`
- `src/components/Buttons/ConnectWalletButton.tsx:6` - Import `useSorobanReact`

**Key Functions:**
- `SorobanReactProvider` - Root context provider for the entire app
- `useSorobanReact` - Main hook for accessing wallet connection, network info, and Soroban context
- `SorobanContextType` - TypeScript type for the Soroban context

### @soroban-react/chains

**Purpose**: Network chain configurations (mainnet, testnet, standalone)

**Used in:**
- `src/contexts/SorobanContextProvider.tsx:1` - Import `standalone, testnet, mainnet`

**Key Functions:**
- Provides network configurations for different Stellar networks
- Used to configure available chains in production vs development environments

### @soroban-react/contracts

**Purpose**: Contract interaction utilities and asset wrapping

**Used in:**
- `src/components/Assets/AssetActionPanel.tsx:14` - Import `wrapStellarAsset`
- `src/helpers/soroban.ts:1` - Import `contractInvoke`

**Key Functions:**
- `contractInvoke` - Execute contract method calls
- `wrapStellarAsset` - Convert Stellar classic assets to Soroban contract format

### @soroban-react/types

**Purpose**: TypeScript type definitions for Soroban React ecosystem

**Used in:**
- `src/contexts/SorobanContextProvider.tsx:6` - Import `ChainMetadata, Connector, WalletChain`
- `src/components/Buttons/ConnectWalletButton.tsx:7` - Import `Connector`

**Key Functions:**
- `ChainMetadata` - Type for network chain information
- `Connector` - Type for wallet connector instances
- `WalletChain` - Type for wallet-specific chain configurations

### @soroban-react/freighter

**Purpose**: Freighter wallet integration

**Used in:**
- `src/contexts/SorobanContextProvider.tsx:3` - Import `freighter`

**Key Functions:**
- `freighter()` - Creates Freighter wallet connector instance

### @soroban-react/xbull

**Purpose**: xBull wallet integration

**Used in:**
- `src/contexts/SorobanContextProvider.tsx:4` - Import `xbull`

**Key Functions:**
- `xbull()` - Creates xBull wallet connector instance

### @soroban-react/lobstr

**Purpose**: Lobstr wallet integration

**Used in:**
- `src/contexts/SorobanContextProvider.tsx:5` - Import `lobstr`

**Key Functions:**
- `lobstr()` - Creates Lobstr wallet connector instance

### @soroban-react/utils

**Purpose**: Utility functions (installed but not directly imported in source files)

**Used in:** Not directly imported in source code, likely used as dependency

### @soroban-react/wallet-data

**Purpose**: Wallet data management (installed but not directly imported in source files)

**Used in:** Not directly imported in source code, likely used as dependency

## Main Integration Patterns

### 1. Context Provider Setup
The main integration happens in `src/contexts/SorobanContextProvider.tsx` where:
- Multiple wallet connectors are configured (Freighter, xBull, Lobstr)
- Network chains are set up based on environment (production vs development)
- The root `SorobanReactProvider` wraps the entire application

### 2. Wallet Connection
Wallet connectivity is managed through:
- `src/components/Buttons/ConnectWalletButton.tsx` - UI for wallet selection and connection
- Multiple components use `useSorobanReact()` to access connection state

### 3. Contract Interactions
Smart contract operations are handled in:
- `src/helpers/soroban.ts` - Core contract interaction utilities
- `src/components/Assets/AssetActionPanel.tsx` - Asset deployment and management

### 4. Data Fetching
Blockchain data is fetched using:
- `src/hooks/useAccount.tsx` - Account information
- `src/hooks/useTransactionHistory.tsx` - Transaction history
- `src/hooks/useAsset.tsx` - Asset information
- `src/hooks/useAssetInformation.tsx` - Additional asset details

## Key Integration Points

1. **Root Provider**: `SorobanContextProvider.tsx` sets up the entire Soroban React ecosystem
2. **Wallet Management**: Three wallet types supported with unified interface
3. **Network Support**: Configurable network support (mainnet, testnet, standalone)
4. **Contract Operations**: Asset deployment, contract bumping, and token interactions
5. **State Management**: React hooks pattern for accessing Soroban context throughout the app

## Environment Configuration

The integration respects environment variables:
- `NEXT_PUBLIC_NETWORK` - Controls active network selection
- `NODE_ENV` - Determines available networks (production limits to mainnet/testnet)