use cw_storage_plus::Item;

pub const FROZEN_TOKEN_METADATA: Item<bool> = Item::new("frozen_token_metadata");
pub const ENABLE_UPDATABLE: Item<bool> = Item::new("enable_updatable");
