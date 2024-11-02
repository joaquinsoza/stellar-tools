use soroban_sdk::{
    contracttype, Address, BytesN, Env, TryFromVal, Val
};
use crate::error::FactoryError;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    DeflaWasmHash,
    FeeAsset,
    FeeReceiver,
    FeeAmount,
}

const DAY_IN_LEDGERS: u32 = 17280;
const INSTANCE_BUMP_AMOUNT: u32 = 30 * DAY_IN_LEDGERS;
const INSTANCE_LIFETIME_THRESHOLD: u32 = INSTANCE_BUMP_AMOUNT - DAY_IN_LEDGERS;

const PERSISTENT_BUMP_AMOUNT: u32 = 60 * DAY_IN_LEDGERS;
const PERSISTENT_LIFETIME_THRESHOLD: u32 = PERSISTENT_BUMP_AMOUNT - DAY_IN_LEDGERS;

pub fn extend_instance_ttl(e: &Env) {
    e.storage()
        .instance()
        .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
}

/// Fetch an entry in persistent storage that has a default value if it doesn't exist
fn get_persistent_extend_or_error<V: TryFromVal<Env, Val>>(
    e: &Env,
    key: &DataKey,
    error: FactoryError
) -> Result<V, FactoryError> {
    if let Some(result) = e.storage().persistent().get(key) {
        e.storage()
            .persistent()
            .extend_ttl(key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
        result
    } else {
        return Err(error);
    }
}

pub fn get_deflationary_wasm_hash(e: &Env) -> Result<BytesN<32>, FactoryError>{
    let key = DataKey::DeflaWasmHash;
    get_persistent_extend_or_error(&e, &key, FactoryError::NotInitialized)
}

pub fn put_deflationary_wasm_hash(e: &Env, pair_wasm_hash: BytesN<32>) {
    let key = DataKey::DeflaWasmHash;
    e.storage().persistent().set(&key, &pair_wasm_hash);
    e.storage()
            .persistent()
            .extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT)
}

// Admin
pub fn has_admin(e: &Env) -> bool {
    e.storage().instance().has(&DataKey::Admin)
}

pub fn put_admin(e: &Env, admin: &Address) {
    e.storage().instance().set(&DataKey::Admin, admin);
}

pub fn get_admin(e: &Env) -> Address {
    e.storage().instance().get(&DataKey::Admin).unwrap()
}

// Fee Receiver
pub fn put_fee_receiver(e: &Env, address: &Address) {
    e.storage().instance().set(&DataKey::FeeReceiver, address);
}

pub fn get_fee_receiver(e: &Env) -> Address {
    e.storage().instance().get(&DataKey::FeeReceiver).unwrap()
}

// Fee Rate BPS (MAX BPS = 10000)
pub fn put_fee_amount(e: &Env, value: &i128) {
    e.storage().instance().set(&DataKey::FeeAmount, value);
}

pub fn get_fee_amount(e: &Env) -> i128 {
    e.storage().instance().get(&DataKey::FeeAmount).unwrap()
}

// Fee Asset
pub fn put_fee_asset(e: &Env, address: &Address) {
    e.storage().instance().set(&DataKey::FeeAsset, address);
}

pub fn get_fee_asset(e: &Env) -> Address {
    e.storage().instance().get(&DataKey::FeeAsset).unwrap()
}