use cosmwasm_schema::cw_serde;
use cosmwasm_std::Binary;
use cosmwasm_std::Timestamp;
use cw_utils::Expiration;
use sg721::{RoyaltyInfoResponse, UpdateCollectionInfoMsg};
use sg721_base::msg::QueryMsg as Sg721QueryMsg;
use sg721_base::ExecuteMsg as Sg721ExecuteMsg;

#[cw_serde]
pub enum ExecuteMsg<T, E> {
    /// Freeze token metadata so creator can no longer update token uris
    FreezeTokenMetadata {},
    /// Creator calls can update token uris
    UpdateTokenMetadata {
        token_id: String,
        token_uri: Option<String>,
    },
    /// Enable updatable for updating token metadata. One time migration fee for sg721-base to sg721-updatable.
    EnableUpdatable {},
    // Sg721Base msgs
    TransferNft {
        recipient: String,
        token_id: String,
    },
    SendNft {
        contract: String,
        token_id: String,
        msg: Binary,
    },
    Approve {
        spender: String,
        token_id: String,
        expires: Option<Expiration>,
    },
    Revoke {
        spender: String,
        token_id: String,
    },
    ApproveAll {
        operator: String,
        expires: Option<Expiration>,
    },
    RevokeAll {
        operator: String,
    },
    Burn {
        token_id: String,
    },
    UpdateCollectionInfo {
        collection_info: UpdateCollectionInfoMsg<RoyaltyInfoResponse>,
    },
    UpdateTradingStartTime(Option<Timestamp>),
    FreezeCollectionInfo {},
    Mint {
        /// Unique ID of the NFT
        token_id: String,
        /// The owner of the newly minter NFT
        owner: String,
        /// Universal resource identifier for this NFT
        /// Should point to a JSON file that conforms to the ERC721
        /// Metadata JSON Schema
        token_uri: Option<String>,
        /// Any custom extension used by this contract
        extension: T,
    },
    Extension {
        msg: E,
    },
}

impl<T, E> From<ExecuteMsg<T, E>> for Sg721ExecuteMsg
where
    T: Clone + PartialEq + Into<Option<cosmwasm_std::Empty>>,
    Option<cosmwasm_std::Empty>: From<T>,
{
    fn from(msg: ExecuteMsg<T, E>) -> Sg721ExecuteMsg {
        match msg {
            ExecuteMsg::TransferNft {
                recipient,
                token_id,
            } => Sg721ExecuteMsg::TransferNft {
                recipient,
                token_id,
            },
            ExecuteMsg::SendNft {
                contract,
                token_id,
                msg,
            } => Sg721ExecuteMsg::SendNft {
                contract,
                token_id,
                msg,
            },
            ExecuteMsg::Approve {
                spender,
                token_id,
                expires,
            } => Sg721ExecuteMsg::Approve {
                spender,
                token_id,
                expires,
            },
            ExecuteMsg::ApproveAll { operator, expires } => {
                Sg721ExecuteMsg::ApproveAll { operator, expires }
            }
            ExecuteMsg::Revoke { spender, token_id } => {
                Sg721ExecuteMsg::Revoke { spender, token_id }
            }
            ExecuteMsg::RevokeAll { operator } => Sg721ExecuteMsg::RevokeAll { operator },
            ExecuteMsg::Burn { token_id } => Sg721ExecuteMsg::Burn { token_id },
            ExecuteMsg::UpdateCollectionInfo { collection_info } => {
                Sg721ExecuteMsg::UpdateCollectionInfo { collection_info }
            }
            ExecuteMsg::FreezeCollectionInfo {} => Sg721ExecuteMsg::FreezeCollectionInfo {},
            ExecuteMsg::Mint {
                token_id,
                owner,
                token_uri,
                extension,
            } => Sg721ExecuteMsg::Mint {
                token_id,
                owner,
                token_uri,
                extension: extension.into(),
            },
            _ => unreachable!("Invalid ExecuteMsg"),
        }
    }
}

#[cw_serde]
pub enum QueryMsg {
    EnableUpdatable {},
    FreezeTokenMetadata {},
    OwnerOf {
        token_id: String,
        include_expired: Option<bool>,
    },
    Approval {
        token_id: String,
        spender: String,
        include_expired: Option<bool>,
    },
    Approvals {
        token_id: String,
        include_expired: Option<bool>,
    },
    AllOperators {
        owner: String,
        include_expired: Option<bool>,
        start_after: Option<String>,
        limit: Option<u32>,
    },
    NumTokens {},
    ContractInfo {},
    NftInfo {
        token_id: String,
    },
    AllNftInfo {
        token_id: String,
        include_expired: Option<bool>,
    },
    Tokens {
        owner: String,
        start_after: Option<String>,
        limit: Option<u32>,
    },
    AllTokens {
        start_after: Option<String>,
        limit: Option<u32>,
    },
    Minter {},
    CollectionInfo {},
}

impl From<QueryMsg> for Sg721QueryMsg {
    fn from(msg: QueryMsg) -> Sg721QueryMsg {
        match msg {
            QueryMsg::OwnerOf {
                token_id,
                include_expired,
            } => Sg721QueryMsg::OwnerOf {
                token_id,
                include_expired,
            },
            QueryMsg::Approval {
                token_id,
                spender,
                include_expired,
            } => Sg721QueryMsg::Approval {
                token_id,
                spender,
                include_expired,
            },
            QueryMsg::Approvals {
                token_id,
                include_expired,
            } => Sg721QueryMsg::Approvals {
                token_id,
                include_expired,
            },
            QueryMsg::AllOperators {
                owner,
                include_expired,
                start_after,
                limit,
            } => Sg721QueryMsg::AllOperators {
                owner,
                include_expired,
                start_after,
                limit,
            },
            QueryMsg::NumTokens {} => Sg721QueryMsg::NumTokens {},
            QueryMsg::ContractInfo {} => Sg721QueryMsg::ContractInfo {},
            QueryMsg::NftInfo { token_id } => Sg721QueryMsg::NftInfo { token_id },
            QueryMsg::AllNftInfo {
                token_id,
                include_expired,
            } => Sg721QueryMsg::AllNftInfo {
                token_id,
                include_expired,
            },
            QueryMsg::Tokens {
                owner,
                start_after,
                limit,
            } => Sg721QueryMsg::Tokens {
                owner,
                start_after,
                limit,
            },
            QueryMsg::AllTokens { start_after, limit } => {
                Sg721QueryMsg::AllTokens { start_after, limit }
            }
            QueryMsg::Minter {} => Sg721QueryMsg::Minter {},
            QueryMsg::CollectionInfo {} => Sg721QueryMsg::CollectionInfo {},
            _ => unreachable!("cannot convert {:?} to Sg721QueryMsg", msg),
        }
    }
}

#[cw_serde]
pub struct EnableUpdatableResponse {
    pub enabled: bool,
}

#[cw_serde]
pub struct FrozenTokenMetadataResponse {
    pub frozen: bool,
}
