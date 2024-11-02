use soroban_sdk::{testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation, MockAuth, MockAuthInvoke}, Address, IntoVal, Symbol};
extern crate alloc;
use alloc::vec;

use crate::test::FactoryTest;

#[test]
fn test_set_new_admin() {

    let test = FactoryTest::setup();

    test.factory_contract.initialize(
        &test.admin, 
        &test.token.address, 
        &test.fee_receiver, 
        &300i128,
        &test.defla_wasm_hash,
    );

    let new_admin = Address::generate(&test.env);
    test.factory_contract
    .mock_auths(&[
        MockAuth {
            address: &test.admin,
            invoke: 
                &MockAuthInvoke {
                    contract: &test.factory_contract.address.clone(),
                    fn_name: "set_new_admin",
                    args: (&new_admin,).into_val(&test.env),
                    sub_invokes: &[],
                },
        }
    ])
    .set_new_admin(&new_admin);

    let expected_auth = AuthorizedInvocation {
        function: AuthorizedFunction::Contract((
            test.factory_contract.address.clone(),
            Symbol::new(&test.env, "set_new_admin"),
            (
                new_admin.clone(),
            )
                .into_val(&test.env),
        )),
        sub_invocations: vec![], 
    };
    assert_eq!(test.env.auths(), vec![(test.admin, expected_auth)]);

    let fetch_admin: Address = test.factory_contract.admin();
    assert_eq!(fetch_admin, new_admin);
}

#[test]
#[should_panic(expected = "HostError: Error(Auth, InvalidAction)")] // Unauthorized
fn test_set_new_admin_by_unauthorized() {
    let test = FactoryTest::setup();

    test.factory_contract.initialize(
        &test.admin, 
        &test.token.address, 
        &test.fee_receiver, 
        &300i128,
        &test.defla_wasm_hash,
    );

    let fake_admin = Address::generate(&test.env);

    test.factory_contract
    .mock_auths(&[
        MockAuth {
            address: &fake_admin,
            invoke: 
                &MockAuthInvoke {
                    contract: &test.factory_contract.address.clone(),
                    fn_name: "set_new_admin",
                    args: (&fake_admin,).into_val(&test.env),
                    sub_invokes: &[],
                },
        }
    ])
    .set_new_admin(&fake_admin);
}