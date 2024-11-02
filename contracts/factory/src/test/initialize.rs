use soroban_sdk::{BytesN, String};

use crate::error::FactoryError;
use crate::test::FactoryTest;

#[test]
fn test_initialize_and_get_storage() {
    let test = FactoryTest::setup();

    test.factory_contract.initialize(
        &test.admin, 
        &test.token.address, 
        &test.fee_receiver, 
        &300i128,
        &test.defla_wasm_hash,
    );

    let factory_admin = test.factory_contract.admin();
    let factory_fee_receiver = test.factory_contract.fee_receiver();
  
    assert_eq!(factory_admin, test.admin);
    assert_eq!(factory_fee_receiver, test.fee_receiver);
}

#[test]
fn test_get_storage_not_yet_initialized() {
    let test = FactoryTest::setup();
    let factory_admin = test.factory_contract.try_admin();
    let factory_fee_receiver = test.factory_contract.try_fee_receiver();

    assert_eq!(factory_admin, Err(Ok(FactoryError::NotInitialized)));
    assert_eq!(factory_fee_receiver, Err(Ok(FactoryError::NotInitialized)));
}

#[test]
fn test_initialize_twice() {
    let test = FactoryTest::setup();

    test.factory_contract.initialize(
        &test.admin, 
        &test.token.address, 
        &test.fee_receiver, 
        &300i128,
        &test.defla_wasm_hash,
    );

    let result_second_init = test.factory_contract.try_initialize(
        &test.admin, 
        &test.token.address, 
        &test.fee_receiver, 
        &300i128,
        &test.defla_wasm_hash,
    );

    assert_eq!(
        result_second_init,
        Err(Ok(FactoryError::AlreadyInitialized))
    );
}

#[test]
fn test_create_deflationary_not_yet_initialized() {
    let test = FactoryTest::setup();

    let salt = BytesN::from_array(&test.env, &[0; 32]);
    
    let result = test.factory_contract.try_create_deflationary_token(
        &test.caller, 
        &7u32,
        &String::from_str(&test.env, "DeflationaryToken"),
        &String::from_str(&test.env, "DFT"),
        &100i128,
        &salt,
    );

    assert_eq!(result, Err(Ok(FactoryError::NotInitialized)));
}