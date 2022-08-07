# @cosmwasm/ts-codegen

Generate TypeScript SDKs for your CosmWasm smart contracts

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

The quickest and easiest way to interact with CosmWasm Contracts. `@cosmwasm/ts-codegen` converts your CosmWasm smart contracts into dev-friendly TypeScript classes so you can focus on shipping code.

## Table of contents

- [@cosmwasm/ts-codegen](#cosmwasmts-codegen)
  - [Table of contents](#table-of-contents)
- [QuickStart](#quickstart)
- [Usage](#usage)
    - [Generate TS Clients](#generate)
    - [React Query](#react-query)
    - [Recoil](#recoil)
    - [Message Composer](#message-composer)
- [Example Output](#example-output)
- [JSON Schema](#json-schema)
    - [JSON Schema Generation](#json-schema-generation)
    - [Exporting Schemas](#exporting-schemas)
- [Developing](#developing)
- [Related](#related)
### Quickstart 

Clone your project and `cd` into your contracts folder

```sh
git clone git@github.com:public-awesome/stargaze-contracts.git
cd stargaze-contracts/contracts/sg721/
```

Run `cosmwasm-ts-codegen` to generate your code.

```sh
cosmwasm-ts-codegen generate --schema ./schema --out ./ts --name SG721
```

The output will be in the folder specified by `--out`, enjoy!

## usage

Get started quickly using our `cli` by globally installing via npm:

```
npm install -g @cosmwasm/ts-codegen
```
### generate

Generate a basic TS client for your contracts. The `generate` command will make types which will be essential for your bindings.

This command also generates a `QueryClient` for queries as well as a `Client` for queries and mutations. 

[see example output code](https://gist.github.com/pyramation/ba67ec56e4e2a39cadea55430f9993e5)


```sh
cosmwasm-ts-codegen generate \
    --schema ./schema \
    --out ./ts \
    --name MyContractName
 ```

for programmatic usage, you can use the `tsClient` function:

```ts
import { tsClient } from '@cosmwasm/ts-codegen';
declare const tsClient = (name: string, schemas: any[], outPath: string) => Promise<void>;
```

### react query

Generate [react-query v3](https://react-query-v3.tanstack.com/) or [react-query v4](https://tanstack.com/query/v4/) bindings for your contracts with the `react-query` command.

[see example output code](https://gist.github.com/pyramation/a3bf4aa7b60a31287d0720ca1bb5473b)


Example without optional client, using v3, without mutations:

```sh
cosmwasm-ts-codegen react-query \
    --schema ./schema \
    --out ./ts \
    --name MyContractName \
    --no-optionalClient \
    --no-v4 \
    --no-mutations
```

Example with optional client, using v4, with mutations:

```sh
cosmwasm-ts-codegen react-query \
    --schema ./schema \
    --out ./ts \
    --name MyContractName \
    --optionalClient \
    --v4 \
    --mutations
```

For programmatic usage, you can use the `reactQuery` function:

```ts
import { reactQuery } from '@cosmwasm/ts-codegen';
declare const reactQuery = (
  contractName: string,
  schemas: any[],
  outPath: string,
  reactQueryOptions?: ReactQueryOptions
) => Promise<void>;
```

#### React Query Options

  | option                         | description                                                         |
  | ------------------------------ | ------------------------------------------------------------------- |
  | `reactQuery.optionalClient`    | allows contract client to be undefined as the component renders     |
  | `reactQuery.v4`                | uses `@tanstack/react-query` and syntax instead of v3 `react-query` |
  | `reactQuery.mutations`         | also generate mutations                                             |
  | `reactQuery.camelize`          | use camelCase style for property names                            |

### recoil

Generate [recoil](https://recoiljs.org/) bindings for your contracts with the `recoil` command.

[see example output code](https://gist.github.com/pyramation/48b28a75def1a16b233b369297f05f0e)


```sh
cosmwasm-ts-codegen recoil \
    --schema ./schema \
    --out ./ts \
    --name MyContractName 
```

for programmatic usage, you can use the `recoil` function:

```ts
import { recoil } from '@cosmwasm/ts-codegen';
declare const recoil = (
  name: string,
  schemas: any[],
  outPath: string
) => Promise<void>;
```
### Message Composer

Generate pure message objects with the proper `utf8` encoding and `typeUrl` configured that you can broadcast yourself via `cosmjs` with the `from-partial` command.

[see example output code](https://gist.github.com/pyramation/f50869d1ecdb6d6ced2bc0a44c6ff492)

```sh
cosmwasm-ts-codegen from-partial \
    --schema ./schema \
    --out ./ts \
    --name MyContractName 
```

for programmatic usage, you can use the `fromPartial` function:

```ts
import { fromPartial } from '@cosmwasm/ts-codegen';
declare const fromPartial = (name: string, schemas: any[], outPath: string) => Promise<void>;
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


### JSON Schema

We generate code from the [JSON Schema](https://json-schema.org/) exported from CosmWasm smart contracts.
### JSON Schema Generation

Currently you have to have the JSON Schema output. Here is an example to start.

First, get the Rust contracts and run `cargo build`:

```sh
git clone git@github.com:public-awesome/stargaze-contracts.git
cd stargaze-contracts
cargo build
```

now build the schema with `cargo schema`

```sh
cd contracts/sg721/
cargo schema
```
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

## Developing

### Initial setup

```
yarn 
yarn bootstrap
```

### Building

```
yarn build
```

### Tests

Then `cd` into a package and run the tests

```
cd ./packages/wasm-ast-types
yarn test:watch
```

### Working with ASTs

See the [docs](https://github.com/CosmWasm/ts-codegen/blob/main/packages/wasm-ast-types/README.md) in the `wasm-ast-types` package.

## Related

Checkout these related projects:

* [@osmonauts/telescope](https://github.com/osmosis-labs/telescope) a "babel for the Cosmos", Telescope is a TypeScript Transpiler for Cosmos Protobufs.
