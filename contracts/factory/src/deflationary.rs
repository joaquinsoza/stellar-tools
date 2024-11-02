// Import necessary types from the Soroban SDK
#![allow(unused)]
use soroban_sdk::{contracttype, contracterror, xdr::ToXdr, Address, Bytes, BytesN, Env, Vec};

soroban_sdk::contractimport!(
    file = "../deflationary_token/target/wasm32-unknown-unknown/release/deflationary_token.wasm"
);

// Define a function to create a new contract instance
pub fn create_contract(
    e: &Env, // Pass in the current environment as an argument
    deflationary_wasm_hash: BytesN<32>, // Pass in the hash of the token contract's WASM file
    salt: BytesN<32>,
) -> Address {

    // Use the deployer() method of the current environment to create a new contract instance
    e.deployer()
        .with_current_contract(e.crypto().sha256(&salt.into())) // Use the salt as a unique identifier for the new contract instance
        .deploy(deflationary_wasm_hash) // Deploy the new contract instance using the given pair_wasm_hash value
}