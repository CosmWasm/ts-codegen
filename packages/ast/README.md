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

We use the npm module `ast-stringify` to strip out unnecessary props, and generate a JSON for reference.

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
