import * as StellarSdk from "@stellar/stellar-sdk"
export const BURNER_ACCOUNT = "GALAXYVOIDAOPZTDLHILAJQKCVVFMD4IKLXLSZV5YHO7VY74IWZILUTO"

const STELLAR_ROUTER_MAINNET = 'CBZV3HBP672BV7FF3ZILVT4CNPW3N5V2WTJ2LAGOAYW5R7L2D5SLUDFZ'
const STELLAR_ROUTER_TESTNET = 'CDOY34HD6QJ3KIY2OGINWVECWOFXS5PWS3O7TRIB5Z3WA5BK6ARFSZ4T'

export const stellarRouterContracts = (networkPassphrase: StellarSdk.Networks) => {
  switch (networkPassphrase) {
    case StellarSdk.Networks.PUBLIC:
      return STELLAR_ROUTER_MAINNET

    case StellarSdk.Networks.TESTNET:
      return STELLAR_ROUTER_TESTNET
  }
}