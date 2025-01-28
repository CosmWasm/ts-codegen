# ast

## working with ASTs

### 1 edit the fixture

edit `./scripts/fixture.ts`, for example:

```js
// ./scripts/fixture.ts
export interface InstantiateMsg {
    admin?: string | null;
    members: Member[];
}
```

### 2 run AST generator

```
yarn test:ast
```

### 3 look at the JSON produced

```
code ./scripts/test-output.json
```

We use the npm module `ast-stringify` to strip out unneccesary props, and generate a JSON for reference.

You will see a `File` and `Program`... only concern yourself with the `body[]`:

```json
{
  "type": "File",
  "errors": [],
  "program": {
    "type": "Program",
    "sourceType": "module",
    "interpreter": null,
    "body": [
      {
        "type": "ExportNamedDeclaration",
        "exportKind": "type",
        "specifiers": [],
        "source": null,
        "declaration": {
          "type": "TSInterfaceDeclaration",
          "id": {
            "type": "Identifier",
            "name": "InstantiateMsg"
          },
          "body": {
            "type": "TSInterfaceBody",
            "body": [
              {
                "type": "TSPropertySignature",
                "key": {
                  "type": "Identifier",
                  "name": "admin"
                },
                "computed": false,
                "optional": true,
                "typeAnnotation": {
                  "type": "TSTypeAnnotation",
                  "typeAnnotation": {
                    "type": "TSUnionType",
                    "types": [
                      {
                        "type": "TSStringKeyword"
                      },
                      {
                        "type": "TSNullKeyword"
                      }
                    ]
                  }
                }
              },
              {
                "type": "TSPropertySignature",
                "key": {
                  "type": "Identifier",
                  "name": "members"
                },
                "computed": false,
                "typeAnnotation": {
                  "type": "TSTypeAnnotation",
                  "typeAnnotation": {
                    "type": "TSArrayType",
                    "elementType": {
                      "type": "TSTypeReference",
                      "typeName": {
                        "type": "Identifier",
                        "name": "Member"
                      }
                    }
                  }
                }
              }
            ]
          }
        }
      }
    ],
    "directives": []
  },
  "comments": []
}
```

### 4 code with `@babel/types` using the JSON as a reference

NOTE: 4 continued ideally you should be writing a test with your generator!

```js
import * as t from '@babel/types';

export const createNewGenerator = () => {
    return t.exportNamedDeclaration(
        t.tsInterfaceDeclaration(
            t.identifier('InstantiateMsg'),
            null,
            [],
            t.tsInterfaceBody([
                // ... more code ...
            ])
        )
    );
};
```

## Interchain JavaScript Stack 

A unified toolkit for building applications and smart contracts in the Interchain ecosystem ⚛️

| Category              | Tools                                                                                                                  | Description                                                                                           |
|----------------------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| **Chain Information**   | [**Chain Registry**](https://github.com/hyperweb-io/chain-registry), [**Utils**](https://www.npmjs.com/package/@chain-registry/utils), [**Client**](https://www.npmjs.com/package/@chain-registry/client) | Everything from token symbols, logos, and IBC denominations for all assets you want to support in your application. |
| **Wallet Connectors**| [**Interchain Kit**](https://github.com/hyperweb-io/interchain-kit)<sup>beta</sup>, [**Cosmos Kit**](https://github.com/hyperweb-io/cosmos-kit) | Experience the convenience of connecting with a variety of web3 wallets through a single, streamlined interface. |
| **Signing Clients**          | [**InterchainJS**](https://github.com/hyperweb-io/interchainjs)<sup>beta</sup>, [**CosmJS**](https://github.com/cosmos/cosmjs) | A single, universal signing interface for any network |
| **SDK Clients**              | [**Telescope**](https://github.com/hyperweb-io/telescope)                                                          | Your Frontend Companion for Building with TypeScript with Cosmos SDK Modules. |
| **Starter Kits**     | [**Create Interchain App**](https://github.com/hyperweb-io/create-interchain-app)<sup>beta</sup>, [**Create Cosmos App**](https://github.com/hyperweb-io/create-cosmos-app) | Set up a modern Interchain app by running one command. |
| **UI Kits**          | [**Interchain UI**](https://github.com/hyperweb-io/interchain-ui)                                                   | The Interchain Design System, empowering developers with a flexible, easy-to-use UI kit. |
| **Testing Frameworks**          | [**Starship**](https://github.com/hyperweb-io/starship)                                                             | Unified Testing and Development for the Interchain. |
| **TypeScript Smart Contracts** | [**Create Hyperweb App**](https://github.com/hyperweb-io/create-hyperweb-app)                              | Build and deploy full-stack blockchain applications with TypeScript |
| **CosmWasm Contracts** | [**CosmWasm TS Codegen**](https://github.com/CosmWasm/ts-codegen)                                                   | Convert your CosmWasm smart contracts into dev-friendly TypeScript classes. |

## Credits

🛠 Built by Hyperweb (formerly Cosmology) — if you like our tools, please checkout and contribute to [our github ⚛️](https://github.com/hyperweb-io)

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating this software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the code, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.
