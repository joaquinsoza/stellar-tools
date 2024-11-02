//! Definition of the Events used in the contract
use soroban_sdk::{contracttype, symbol_short, Address, Env, String};

// INITIALIZED
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InitializedEvent {
    pub admin: Address,
    pub fee_receiver: Address,
    pub fee_amount: i128,
    pub fee_asset: Address,
}

pub(crate) fn emit_initialized(e: &Env, admin: Address, fee_receiver: Address, fee_amount: i128, fee_asset: Address) {
    let event: InitializedEvent = InitializedEvent {
        admin,
        fee_receiver,
        fee_amount,
        fee_asset
    };
    e.events()
        .publish(("STFactory", symbol_short!("init")), event);
}

// CREATE DEFLATIONARY TOKEN EVENT
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CreateDeflationaryEvent {
    pub name: String, 
    pub symbol: String, 
    pub decimal: u32,
    pub contract: Address,
    pub burn_fee_bps: i128,
    pub admin: Address,
}

/// Publishes an `CreateDeflationaryEvent` to the event stream.
pub(crate) fn emit_create_deflationary_token(
    e: &Env, 
    name: String, 
    symbol: String, 
    decimal: u32,
    contract: Address,
    burn_fee_bps: i128,
    admin: Address,
) {
    let event = CreateDeflationaryEvent { 
      name,
      symbol,
      decimal,
      contract,
      burn_fee_bps,
      admin
    };

    e.events()
        .publish(("STFactory", symbol_short!("ndeflatio")), event);
}

// NEW ADMIN EVENT
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewAdminEvent {
    pub new_admin: Address,
}

pub(crate) fn emit_new_admin(e: &Env, new_admin: Address) {
    let event = NewAdminEvent { new_admin };

    e.events()
        .publish(("STFactory", symbol_short!("nadmin")), event);
}

// NEW FEE RECEIVER EVENT
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewDeFindexReceiverEvent {
    pub new_defindex_receiver: Address,
}

pub(crate) fn emit_new_fee_receiver(e: &Env, new_defindex_receiver: Address) {
    let event = NewDeFindexReceiverEvent { new_defindex_receiver };

    e.events()
        .publish(("STFactory", symbol_short!("nreceiver")), event);
}

// NEW FEE AMOUNT EVENT
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewFeeRateEvent {
    pub new_fee_amount: i128,
}

pub(crate) fn emit_new_fee_amount(e: &Env, new_fee_amount: i128) {
    let event = NewFeeRateEvent { new_fee_amount };

    e.events()
        .publish(("STFactory", symbol_short!("nfee_rate")), event);
}