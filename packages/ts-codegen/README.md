# @cosmwasm/ts-codegen

Generate TypeScript SDKs for your CosmWasm smart contracts

<p align="center">
  <img width="120" src="https://user-images.githubusercontent.com/545047/191621556-6f1baa40-15ff-4465-8d80-63b3ff9bc23a.svg">
</p>

<p align="center" width="100%">
  <a href="https://github.com/CosmWasm/ts-codegen/actions/workflows/run-tests.yaml">
    <img height="20" src="https://github.com/CosmWasm/ts-codegen/actions/workflows/run-tests.yaml/badge.svg" />
  </a>
   <a href="https://www.npmjs.com/package/@cosmwasm/ts-codegen"><img height="20" src="https://img.shields.io/npm/dt/@cosmwasm/ts-codegen"></a>
   <a href="https://github.com/CosmWasm/ts-codegen/blob/main/LICENSE-MIT"><img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
   <a href="https://github.com/CosmWasm/ts-codegen/blob/main/LICENSE-Apache"><img height="20" src="https://img.shields.io/badge/license-Apache-blue.svg"></a>
   <a href="https://www.npmjs.com/package/@cosmwasm/ts-codegen"><img height="20" src="https://img.shields.io/github/package-json/v/CosmWasm/ts-codegen?filename=packages%2Fts-codegen%2Fpackage.json"></a>
</p>


```
npm install @cosmwasm/ts-codegen
```

The quickest and easiest way to interact with CosmWasm Contracts. `@cosmwasm/ts-codegen` converts your CosmWasm smart contracts into dev-friendly TypeScript classes so you can focus on shipping code.

🎥 [Checkout our video playlist](https://www.youtube.com/watch?v=D_A5V2PfNLA&list=PL-lMkVv7GZwz1KO3jANwr5W4MoziruXwK) to learn how to use `ts-codegen`!
## Table of contents

- [@cosmwasm/ts-codegen](#cosmwasmts-codegen)
  - [Table of contents](#table-of-contents)
- [Usage](#usage)
    - [Programmatic Usage](#programmatic-usage)
    - [Types](#types)
    - [TS Clients](#client)
    - [React Query](#react-query)
    - [Recoil](#recoil)
    - [Message Composer](#message-composer)
    - [Message Builder](#message-builder)
    - [Use Contracts Hook](#use-contracts-hooks-usage)
    - [Bundles](#bundles)
    - [CLI Usage and Examples](#cli-usage-and-examples)
    - [Advanced Usage](#advanced-usage)
- [JSON Schema](#json-schema)
    - [JSON Schema Generation](#json-schema-generation)
    - [Exporting Schemas](#exporting-schemas)
- [Developing](#developing)
- [Related](#related)

## Usage

### Programmatic Usage

For production usage, we recommend setting up a build script that uses the main entry point:

```ts
import codegen from '@cosmwasm/ts-codegen';

codegen({
  contracts: [
    {
      name: 'SG721',
      dir: './path/to/sg721/schema'
    },
    {
      name: 'Minter',
      dir: './path/to/Minter/schema'
    }
  ],
  outPath: './path/to/code/src/',

  // options are completely optional ;)
  options: {
    bundle: {
      bundleFile: 'index.ts',
      scope: 'contracts'
    },
    types: {
      enabled: true
    },
    client: {
      enabled: true
    },
    reactQuery: {
      enabled: true,
      optionalClient: true,
      version: 'v4',
      mutations: true,
      queryKeys: true,
      queryFactory: true,
    },
    recoil: {
      enabled: false
    },
    messageComposer: {
      enabled: false
    },
    messageBuilder: {
      enabled: false
    },
    useContractsHook: {
      enabled: false
    }
  }
}).then(() => {
  console.log('✨ all done!');
});
```
#### Types

Typescript types and interfaces are generated in separate files so they can be imported into various generated plugins.

[see example output code](https://github.com/CosmWasm/ts-codegen/blob/main/__output__/sg721/Sg721.types.ts)

#### Types Options

| option                   | description                                          |
| ------------------------ | ---------------------------------------------------- |
| `types.enabled`          | enable type generation                               |
| `types.aliasExecuteMsg`  | generate a type alias based on the contract name     |
| `types.aliasEntryPoints` | generate type aliases for the entry points based on the contract name     |

### Client

The `client` plugin will generate TS client classes for your contracts. This option generates a `QueryClient` for queries as well as a `Client` for queries and mutations.

[see example output code](https://github.com/CosmWasm/ts-codegen/blob/main/__output__/sg721/Sg721.client.ts )

#### Client Options

| option                                  | description                                          |
| --------------------------------------- | ---------------------------------------------------  |
| `client.enabled`                        | generate TS client classes for your contracts        |
| `client.execExtendsQuery`               | execute should extend query message clients          |
| `client.noImplicitOverride`             | should match your tsconfig noImplicitOverride option |


### React Query

Generate [react-query v3](https://react-query-v3.tanstack.com/) or [react-query v4](https://tanstack.com/query/v4/) bindings for your contracts with the `react-query` command.

[see example output code](https://github.com/CosmWasm/ts-codegen/blob/main/__output__/sg721/Sg721.react-query.ts)

#### React Query Options

| option                      | description                                                                  |
| --------------------------- | ---------------------------------------------------------------------------- |
| `reactQuery.enabled`        | enable the react-query plugin                                                |
| `reactQuery.optionalClient` | allows contract client to be undefined as the component renders              |
| `reactQuery.queryKeys`      | generates a const queryKeys object for use with invalidations and set values |
| `reactQuery.queryFactory`   | generates a const queryFactory object for useQueries and prefetchQueries use |
| `reactQuery.version`        | `v4` uses `@tanstack/react-query` and `v3` uses `react-query`                |
| `reactQuery.mutations`      | also generate mutations                                                      |
| `reactQuery.camelize`       | use camelCase style for property names                                       |


### Recoil

Generate [recoil](https://recoiljs.org/) bindings for your contracts with the `recoil` command.

[see example output code](https://github.com/CosmWasm/ts-codegen/blob/main/__output__/sg721/Sg721.recoil.ts)

#### Recoil Options

| option                         | description                                                         |
| ------------------------------ | ------------------------------------------------------------------- |
| `recoil.enabled`               | enable the recoil plugin                                            |

### Message Composer

Generate pure message objects with the proper `utf8` encoding and `typeUrl` configured that you can broadcast yourself via `cosmjs` with the `message-composer` command.

[see example output code](https://github.com/CosmWasm/ts-codegen/blob/main/__output__/sg721/Sg721.message-composer.ts)

#### Message Composer Options

| option                         | description                                                         |
| ------------------------------ | ------------------------------------------------------------------- |
| `messageComposer.enabled`      | enable the messageComposer plugin                                   |

### Message Builder

Generate raw message jsons for use in your application with the `message-builder` command.

[see example output code](https://github.com/CosmWasm/ts-codegen/blob/main/__output__/sg721/Sg721.message-builder.ts)

#### Message Builder Options

| option                   | description                        |
|------------------------- | ---------------------------------- |
| `messageBuilder.enabled` | enable the messageBuilder plugin   |


### `useContracts` Hook

Generates `useContracts` hook to easily access contracts, already equipped with a signing client

| option                           | description                             |
| -------------------------------- | --------------------------------------- |
| `useContractsHook.enabled`       | enable the `useContracts` plugin        |

#### Example Output

- [Provider](https://github.com/CosmWasm/ts-codegen/blob/main/__output__/builder/bundler_test/contracts/Factory.provider.ts)
- [Contract Providers](https://github.com/CosmWasm/ts-codegen/blob/main/__output__/builder/bundler_test/contracts/contractContextProviders.ts)
- [Contract Context](https://github.com/CosmWasm/ts-codegen/blob/main/__output__/builder/bundler_test/contracts/contracts-context.tsx)
- [Context Base](https://github.com/CosmWasm/ts-codegen/blob/main/__output__/builder/bundler_test/contracts/contractContextBase.ts)

#### Use Contracts Provider Usage

```tsx
import { useChain } from '@cosmos-kit/react';
import { ContractsProvider } from '../path/to/codegen/contracts-context';

export default function YourComponent() {

  const {
    address,
    getCosmWasmClient,
    getSigningCosmWasmClient
  } = useChain(chainName);

  return (
    <ContractsProvider
      contractsConfig={{
        address,
        getCosmWasmClient,
        getSigningCosmWasmClient,
      }}
    >
        <SomeCoolComponent />
    </ContractsProvider>
  )
};
```

#### Use Contracts Provider Babel/TSC config

If you're using Babel, please make sure include `'@babel/preset-react'` in devDeps and presets in `.babelrc.js`:

```js
 presets: [
   '@babel/typescript',
   '@babel/env',
   '@babel/preset-react',
 ]
```

For `tsc`, you should set the `jsx` option to `'react'` in your `tsconfig.json`.

#### Use Contracts Hooks Usage

Once enabled, you can get contracts very simply:

```ts
const { marketplace } = useContracts();
```

```ts
const marketplaceClient = marketplace.signingClient(marketplaceContract);
await marketplaceClient.updateAskPrice({
  collection: token.collectionAddr,
  price: {
    amount,
    denom,
  },
  tokenId,
});
```

### Bundles

The bundler will make a nice package of all your contracts. For example:

```ts
const {
  MinterQueryClient,
  useMinterConfigQuery
} = contracts.Minter;

const { CwAdminFactoryClient } = contracts.CwAdminFactory;
```
#### Bundler Options

| option                | description                                                                      |
| --------------------- | -------------------------------------------------------------------------------- |
| `bundle.enabled`      | enable the bundler plugin                                                        |
| `bundle.scope`        | name of the scope, defaults to `contracts` (you can use `.` to make more scopes) |
| `bundle.bundleFile`   | name of the bundle file                                                          |

#### Coding Style

| option                | description                          | default |
| --------------------- | ------------------------------------ | ------- |
| `useShorthandCtor`    |  Enable using shorthand constructor. | true    |

Using shorthand constructor (Might not be transpiled correctly with babel):

```ts
  constructor(
    protected address: string | undefined,
    protected cosmWasmClient: CosmWasmClient | undefined,
    protected signingCosmWasmClient: SigningCosmWasmClient | undefined,
    private TSign?: new (
      client: SigningCosmWasmClient,
      sender: string,
      contractAddress: string
    ) => TSign,
    private TQuery?: new (
      client: CosmWasmClient,
      contractAddress: string
    ) => TQuery,
    private TMsgComposer?: new (
      sender: string,
      contractAddress: string
    ) => TMsgComposer
  ) {}
```

Without using shorthand constructor:

```ts
  address: string | undefined;
  ...
  TMsgComposer?: new (
    sender: string,
    contractAddress: string
  ) => TMsgComposer;

  constructor(
    address: string | undefined,
    ...
    TMsgComposer?: new (
      sender: string,
      contractAddress: string
    ) => TMsgComposer
  ) {
    this.address = address;
    ...
    this.TMsgComposer = TMsgComposer;
  }
```

### CLI Usage and Examples

You can get started quickly using our `cli` by globally installing via npm:

```
npm install @cosmwasm/ts-codegen
```

Clone your project and `cd` into your contracts folder

```sh
git clone https://github.com/cosmology-tech/launchpad.git
cd launchpad/contracts/whitelists/whitelist
```

Run `cosmwasm-ts-codegen` to generate your code.

```sh
cosmwasm-ts-codegen generate \
          --plugin client \
          --schema ./schema \
          --out ./ts \
          --name Whitelist \
          --no-bundle
```

The output will be in the folder specified by `--out`, enjoy!

#### Interactive prompt

The CLI is interactive, and if you don't specify an option, it will interactively prompt you.

```sh
cosmwasm-ts-codegen generate
? [plugin] which plugins? (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯ client
 ◯ recoil
 ◯ react-query
 ◯ message-composer
 ```

In this example, you can press space bar to select a number of plugins you wish you enable.
#### Specifying Plugins

Additionally, it will also show you the name of the field (in this case `plugin`) so you can specify the parameter (for example when using CI/CD) on the comand line. Here is an exampl with `--plugin` set to `client` via CLI:

```sh
cosmwasm-ts-codegen generate \
    --plugin client
    --schema ./schema \
    --out ./ts \
    --name MyContractName
 ```

You can specify multiple `--plugin` options using the `generate` command:

```sh
cosmwasm-ts-codegen generate \
          --plugin client \
          --plugin recoil \
          --schema ./schema \
          --out ./ts \
          --name SG721
```

#### Bypassing the Prompt

All options can be provided so you can bypass the prompt.

For confirm options, you can pass `--no-<name>` to set the value to false. Here is an example without optional client, using v3 for `react-query`, without mutations:

```sh
cosmwasm-ts-codegen generate \
    --plugin client \
    --plugin react-query \
    --schema ./schema \
    --out ./ts \
    --name MyContractName \
    --version v3 \
    --no-optionalClient \
    --no-mutations
```

Example with optional client, using v4, with mutations:

```sh
cosmwasm-ts-codegen generate \
    --plugin react-query \
    --schema ./schema \
    --out ./ts \
    --name MyContractName \
    --optionalClient \
    --version v4 \
    --mutations
```

#### Types Only Option

If needed, you can generate only the types with the `typesOnly` option;

```sh
cosmwasm-ts-codegen generate \
          --typesOnly \
          --schema ./schema \
          --out ./ts \
          --name SG721
```

#### Client via CLI

```sh
cosmwasm-ts-codegen generate \
    --plugin client
    --schema ./schema \
    --out ./ts \
    --name MyContractName
```


#### React Query via CLI

Here is an example without optional client, using v3 for `react-query`, without mutations:

```sh
cosmwasm-ts-codegen generate \
    --plugin client \
    --plugin react-query \
    --schema ./schema \
    --out ./ts \
    --name MyContractName \
    --version v3 \
    --no-optionalClient \
    --no-mutations
```

Example with optional client, using v4, with mutations:

```sh
cosmwasm-ts-codegen generate \
    --plugin react-query \
    --schema ./schema \
    --out ./ts \
    --name MyContractName \
    --optionalClient \
    --version v4 \
    --mutations
```

#### Recoil via CLI

```sh
cosmwasm-ts-codegen generate \
    --plugin recoil \
    --schema ./schema \
    --out ./ts \
    --name MyContractName
```

#### Message Composer via CLI

```sh
cosmwasm-ts-codegen generate \
    --plugin message-composer \
    --schema ./schema \
    --out ./ts \
    --name MyContractName
```

#### Message Builder via CLI

```sh
cosmwasm-ts-codegen generate \
    --plugin message-builder \
    --schema ./schema \
    --out ./ts \
    --name MyContractName
```


### Advanced Usage

for lower-level access, you can import the various plugins directly:

```ts
import {
  generateTypes,
  generateClient,
  generateReactQuery,
  generateRecoil,
  generateMessageComposer
} from '@cosmwasm/ts-codegen';
```

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
#### `cosmwasm v1.1` Example

Using the new `write_api` method, you can export schemas:

```rs
use cosmwasm_schema::write_api;

use cw4_group::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};

fn main() {
    write_api! {
        instantiate: InstantiateMsg,
        execute: ExecuteMsg,
        query: QueryMsg,
    }
}
```

#### `cosmwasm_std` Example

Here is a legacy example:

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
cd ./packages/ast
yarn test:watch
```

### Working with ASTs

See the [docs](https://github.com/CosmWasm/ts-codegen/blob/main/packages/ast/README.md) in the `wasm-ast-types` package.

## Related

Checkout these related projects:

* [@cosmology/telescope](https://github.com/cosmology-tech/telescope) Your Frontend Companion for Building with TypeScript with Cosmos SDK Modules.
* [@cosmwasm/ts-codegen](https://github.com/CosmWasm/ts-codegen) Convert your CosmWasm smart contracts into dev-friendly TypeScript classes.
* [chain-registry](https://github.com/cosmology-tech/chain-registry) Everything from token symbols, logos, and IBC denominations for all assets you want to support in your application.
* [cosmos-kit](https://github.com/cosmology-tech/cosmos-kit) Experience the convenience of connecting with a variety of web3 wallets through a single, streamlined interface.
* [create-cosmos-app](https://github.com/cosmology-tech/create-cosmos-app) Set up a modern Cosmos app by running one command.
* [interchain-ui](https://github.com/cosmology-tech/interchain-ui) The Interchain Design System, empowering developers with a flexible, easy-to-use UI kit.
* [starship](https://github.com/cosmology-tech/starship) Unified Testing and Development for the Interchain.

## Credits

🛠 Built by Cosmology — if you like our tools, please consider delegating to [our validator ⚛️](https://cosmology.zone/validator)


## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating this software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the code, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.
