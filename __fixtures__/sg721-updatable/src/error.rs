use cosmwasm_std::StdError;
use cw_utils::PaymentError;
use sg1::FeeError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("{0}")]
    Payment(#[from] PaymentError),

    #[error("{0}")]
    Base(#[from] sg721_base::ContractError),

    #[error("{0}")]
    Fee(#[from] FeeError),

    #[error("TokenIdNotFound")]
    TokenIdNotFound {},

    #[error("TokenMetadataFrozen")]
    TokenMetadataFrozen {},

    #[error("NotEnableUpdatable")]
    NotEnableUpdatable {},

    #[error("AlreadyEnableUpdatable")]
    AlreadyEnableUpdatable {},
}
