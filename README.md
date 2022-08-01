# @cosmwasm/ts-codegen

TypeScript bindings for CosmWasm smart contracts

<p align="center">
  <img width="120" src="https://user-images.githubusercontent.com/545047/163705368-bc899f6d-a2de-43ee-889b-dbf44e17f288.png">
</p>

<p align="center" width="100%">
  <a href="https://github.com/CosmWasm/ts-codegen/actions/workflows/run-tests.yaml">
    <img height="20" src="https://github.com/CosmWasm/ts-codegen/actions/workflows/run-tests.yaml/badge.svg" />
  </a>
   <a href="https://github.com/CosmWasm/ts-codegen/blob/main/LICENSE-MIT"><img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
   <a href="https://github.com/CosmWasm/ts-codegen/blob/main/LICENSE-Apache"><img height="20" src="https://img.shields.io/badge/license-Apache-blue.svg"></a>
   <a href="https://www.npmjs.com/package/@cosmwasm/ts-codegen"><img height="20" src="https://img.shields.io/github/package-json/v/CosmWasm/ts-codegen?filename=packages%2Fts-codegen%2Fpackage.json"></a>
</p>

```
npm install -g @cosmwasm/ts-codegen
```

`@cosmwasm/ts-codegen` converts your CosmWasm smart contracts into TypeScript classes and functions so you can focus on shipping code.

## usage

```
 cosmwasm-ts-codegen generate \
    --schema ./schema \
    --out ./src \
    --name MyContractName
 ```

### example 

```
git clone git@github.com:public-awesome/stargaze-contracts.git
cd stargaze-contracts/contracts/sg721/
cosmwasm-ts-codegen generate --schema ./schema --out ./ts --name SG721
```

### JSON Schema Generation

Currently you have to have the JSON Schema output. Here is an example to start:

```sh
## get the Rust contracts
git clone git@github.com:public-awesome/stargaze-contracts.git
cd stargaze-contracts
cargo build

## now build the schema
cd contracts/sg721/
cargo schema
```

### Example Output

- `cosmwasm-ts-codegen generate`

https://gist.github.com/pyramation/ba67ec56e4e2a39cadea55430f9993e5

- `cosmwasm-ts-codegen from-partial`

https://gist.github.com/pyramation/f50869d1ecdb6d6ced2bc0a44c6ff492

- `cosmwasm-ts-codegen react-query`

https://gist.github.com/pyramation/a3bf4aa7b60a31287d0720ca1bb5473b

- `cosmwasm-ts-codegen recoil`

https://gist.github.com/pyramation/48b28a75def1a16b233b369297f05f0e


### Exporting Schemas

#### `cosmwasm_std` Examples

```rs
use cosmwasm_std::{Addr, CosmosMsg, Empty};

export_schema_with_title(&schema_for!(MinterData), &out_dir, "MinterResponse");
export_schema_with_title(&schema_for!(Addr), &out_dir, "StakingResponse");
export_schema_with_title(&schema_for!(Addr), &out_dir, "DaoResponse");
export_schema_with_title(
      &schema_for!(CosmosMsg<Empty>),
      &out_dir,
      "CosmosMsg_for_Empty",
);
```