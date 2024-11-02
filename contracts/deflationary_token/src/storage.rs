use soroban_sdk::Env;

use crate::storage_types::DataKey;

pub fn read_burn_fee(e: &Env) -> i128 {
    let key = DataKey::BurnFeeBPS;
    e.storage().instance().get::<DataKey, i128>(&key).unwrap()
}

pub fn set_burn_fee(e: &Env, amount: i128) {
    let key = DataKey::BurnFeeBPS;
    e.storage().instance().set(&key, &amount);
}