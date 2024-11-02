use soroban_sdk::{BytesN, String};

use crate::test::FactoryTest;

#[test]
fn test_create_deflationary_success() {
  let test = FactoryTest::setup();

  test.env.mock_all_auths();

  test.factory_contract.initialize(
    &test.admin, 
    &test.token.address, 
    &test.fee_receiver, 
    &300_000_000_0i128,
    &test.defla_wasm_hash,
  );

  let salt = BytesN::from_array(&test.env, &[0; 32]);

  let mint_amount = 3000_000_000_0i128;

  test.token_admin_client.mint(&test.caller,&mint_amount);
  let balance = test.token.balance(&test.caller);
  assert_eq!(balance, mint_amount);

  test.factory_contract.create_deflationary_token(
    &test.caller, 
    &7u32,
    &String::from_str(&test.env, "DeflationaryToken"),
    &String::from_str(&test.env, "DFT"),
    &100i128,
    &salt,
  );
}