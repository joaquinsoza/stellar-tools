# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development**: `npm run dev` - Start the Next.js development server on http://localhost:3000
- **Build**: `npm run build` - Build the production application
- **Production**: `npm start` - Start the production server
- **Lint**: `npm run lint` - Run ESLint to check code quality

## Architecture Overview

This is a Next.js application built for the Stellar ecosystem, providing tools for asset management, contract interaction, and blockchain data visualization.

### Core Technology Stack

- **Framework**: Next.js 14 with App Router
- **UI**: Chakra UI with Emotion for styling
- **Blockchain**: Stellar SDK and Soroban React ecosystem
- **Wallet Integration**: Freighter, xBull, and Lobstr wallets via Soroban React connectors
- **Data Fetching**: SWR for client-side data fetching

### Key Architectural Components

**Wallet & Network Management**:
- `SorobanContextProvider.tsx` manages wallet connections and network switching
- Supports mainnet, testnet, and standalone networks based on environment
- Network selection via `NEXT_PUBLIC_DEFAULT_NETWORK` environment variable

**Asset Management System**:
- `useAsset.tsx` hook handles both Stellar classic assets (code/issuer) and Soroban contracts
- `useMergedAssetsList.tsx` combines multiple asset lists for comprehensive asset discovery
- Assets can be fetched from local lists or dynamically from the blockchain
- Automatic contract ID generation for classic assets

**Service Layer**:
- `stellarServer.ts` configures Horizon and Soroban RPC connections
- Uses `NEXT_PUBLIC_SOROBAN_MAINNET_RPC` for Soroban RPC endpoint configuration

### Application Structure

The app follows Next.js App Router conventions:
- `/assets` - Asset exploration and management
- `/assets/[param]` - Individual asset details with action panels
- `/contracts` - Contract interaction tools  
- `/transactions` - Transaction history and management
- `/search` - Asset and contract search functionality

### Component Organization

- `Layout/` - Navigation, sidebar, and main layout components
- `Assets/` - Asset-specific components including action panels and info tabs
- `Buttons/` - Reusable button components including wallet connection and trustline management
- `hooks/` - Custom React hooks for blockchain data fetching and wallet state
- `helpers/` - Utility functions for Soroban contract interaction and address formatting

### Environment Configuration

- Production builds use mainnet and testnet networks only
- Development includes standalone network for local testing
- Default network configurable via `NEXT_PUBLIC_DEFAULT_NETWORK`
- Soroban RPC endpoint via `NEXT_PUBLIC_SOROBAN_MAINNET_RPC`