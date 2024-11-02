#![no_std]

mod deflationary;
mod events;
mod storage;
mod error;

use soroban_sdk::{
    contract, contractimpl, token::TokenClient, Address, BytesN, Env, String
};
use error::FactoryError;
use deflationary::create_contract;
use storage::{ extend_instance_ttl, get_admin, get_deflationary_wasm_hash, get_fee_amount, get_fee_asset, get_fee_receiver, has_admin, put_admin, put_deflationary_wasm_hash, put_fee_amount, put_fee_asset, put_fee_receiver };

fn check_initialized(e: &Env) -> Result<(), FactoryError> {
    if !has_admin(e) {
        return Err(FactoryError::NotInitialized)
    } 
    Ok(())
}

pub trait FactoryTrait {
    fn initialize(
        e: Env, 
        admin: Address,
        fee_asset: Address,
        fee_receiver: Address,
        fee_amount: i128,
        deflationary_wasm_hash: BytesN<32>
    ) -> Result<(), FactoryError>;

    fn create_deflationary_token(
        e: Env, 
        caller: Address,
        decimal: u32, 
        name: String,
        symbol: String,
        burn_fee_bps: i128,
        salt: BytesN<32>
    ) -> Result<Address, FactoryError>;

    fn set_new_admin(e: Env, new_admin: Address) -> Result<(), FactoryError>;

    fn set_fee_receiver(e: Env, new_fee_receiver: Address) -> Result<(), FactoryError>;

    fn set_fee_amount(e: Env, new_fee_amount: i128) -> Result<(), FactoryError>;
    
    fn admin(e: Env) -> Result<Address, FactoryError>;
    
    fn fee_receiver(e: Env) -> Result<Address, FactoryError>;

    fn fee_amount(e: Env) -> Result<i128, FactoryError>;
}

#[contract]
struct StellarToolsFactory;

#[contractimpl]
impl FactoryTrait for StellarToolsFactory {

    fn initialize(
        e: Env, 
        admin: Address,
        fee_asset: Address,
        fee_receiver: Address,
        fee_amount: i128,
        deflationary_wasm_hash: BytesN<32>
    ) -> Result<(), FactoryError> {
        if has_admin(&e) {
            return Err(FactoryError::AlreadyInitialized);
        }

        put_admin(&e, &admin);
        put_fee_asset(&e, &fee_asset);
        put_fee_receiver(&e, &fee_receiver);
        put_fee_amount(&e, &fee_amount);
        put_deflationary_wasm_hash(&e, deflationary_wasm_hash);

        events::emit_initialized(&e, admin, fee_receiver, fee_amount, fee_asset);
        extend_instance_ttl(&e);
        Ok(())
    }

    fn create_deflationary_token(
        e: Env, 
        caller: Address,
        decimal: u32, 
        name: String,
        symbol: String,
        burn_fee_bps: i128,
        salt: BytesN<32>
    ) -> Result<Address, FactoryError> {
        check_initialized(&e)?;
        extend_instance_ttl(&e);
        caller.require_auth();

        let deflationary_wasm_hash = get_deflationary_wasm_hash(&e)?;
        let contract_address = create_contract(&e, deflationary_wasm_hash, salt);

        deflationary::Client::new(&e, &contract_address).initialize(
            &caller,
            &decimal,
            &name,
            &symbol,
            &burn_fee_bps,
        );

        // Send fee to fee_receiver
        let fee_receiver = get_fee_receiver(&e);
        let fee_amount = get_fee_amount(&e);
        let fee_asset = get_fee_asset(&e);

        let xlm_client = TokenClient::new(&e, &fee_asset);
        xlm_client.transfer(&caller, &fee_receiver, &fee_amount);

        events::emit_create_deflationary_token(&e, name, symbol, decimal, contract_address.clone(), burn_fee_bps, caller);
        Ok(contract_address)
    }

    fn set_new_admin(e: Env, new_admin: Address) -> Result<(), FactoryError> {
        check_initialized(&e)?;
        extend_instance_ttl(&e);
        let admin = get_admin(&e);
        admin.require_auth();

        put_admin(&e, &new_admin);
        events::emit_new_admin(&e, new_admin);
        Ok(())
    }

    fn set_fee_receiver(e: Env, new_fee_receiver: Address) -> Result<(), FactoryError> {
        check_initialized(&e)?;
        extend_instance_ttl(&e);
        let admin = get_admin(&e);
        admin.require_auth();

        put_fee_receiver(&e, &new_fee_receiver);
        events::emit_new_fee_receiver(&e, new_fee_receiver);
        Ok(())
    }

    fn set_fee_amount(e: Env, fee_amount: i128) -> Result<(), FactoryError> {
        check_initialized(&e)?;
        extend_instance_ttl(&e);
        let admin = get_admin(&e);
        admin.require_auth();

        put_fee_amount(&e, &fee_amount);
        events::emit_new_fee_amount(&e, fee_amount);
        Ok(())
    }

    fn admin(e: Env) -> Result<Address, FactoryError> {
        check_initialized(&e)?;
        extend_instance_ttl(&e);
        Ok(get_admin(&e))
    }

    fn fee_receiver(e: Env) -> Result<Address, FactoryError> {
        check_initialized(&e)?;
        extend_instance_ttl(&e);
        Ok(get_fee_receiver(&e))
    }
    
    fn fee_amount(e: Env) -> Result<i128, FactoryError> {
        check_initialized(&e)?;
        extend_instance_ttl(&e);
        Ok(get_fee_amount(&e))
    }
}

mod test;