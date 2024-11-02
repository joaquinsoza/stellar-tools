#![cfg(test)]
extern crate std;
use crate::{StellarToolsFactory, StellarToolsFactoryClient};
use soroban_sdk::token::{
    StellarAssetClient as SorobanTokenAdminClient, TokenClient as SorobanTokenClient,
};
use soroban_sdk::BytesN;
use soroban_sdk::{
    Env, 
    Address, 
    testutils::Address as _,
};

// Stellar Tools Factory Contract
fn create_st_factory<'a>(e: &Env) -> StellarToolsFactoryClient<'a> {
    StellarToolsFactoryClient::new(e, &e.register_contract(None, StellarToolsFactory {}))
}

// Deflationary Token Contract
mod deflationary_token_contract {
  soroban_sdk::contractimport!(file = "../deflationary_token/target/wasm32-unknown-unknown/release/deflationary_token.wasm");
}

// Create Test Token
pub(crate) fn create_token_contract<'a>(e: &Env, admin: &Address) -> SorobanTokenClient<'a> {
    SorobanTokenClient::new(e, &e.register_stellar_asset_contract(admin.clone()))
}

pub(crate) fn get_token_admin_client<'a>(
    e: &Env,
    address: &Address,
) -> SorobanTokenAdminClient<'a> {
    SorobanTokenAdminClient::new(e, address)
}

pub struct FactoryTest<'a> {
    env: Env,
    factory_contract: StellarToolsFactoryClient<'a>,
    admin: Address,
    caller: Address,
    fee_receiver: Address,
    defla_wasm_hash: BytesN<32>,
    token_admin_client: SorobanTokenAdminClient<'a>,
    token: SorobanTokenClient<'a>,
}

impl<'a> FactoryTest<'a> {
    fn setup() -> Self {
        let env = Env::default();
        env.budget().reset_unlimited();
        // env.mock_all_auths();
        let factory_contract = create_st_factory(&env);
        
        let admin = Address::generate(&env);
        let caller = Address::generate(&env);
        let fee_receiver = Address::generate(&env);

        let defla_wasm_hash = env.deployer().upload_contract_wasm(deflationary_token_contract::WASM);

        let token_admin = Address::generate(&env);
        let token = create_token_contract(&env, &token_admin);
        let token_admin_client = get_token_admin_client(&env, &token.address.clone());

        FactoryTest {
            env,
            factory_contract,
            admin,
            caller,
            fee_receiver,
            defla_wasm_hash,
            token_admin_client,
            token,
        }
    }
}

mod admin;
mod initialize;
mod create_deflationary;