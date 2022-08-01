import * as t from '@babel/types';
import { camel, pascal } from 'case';
import {
  callExpression,
  getMessageProperties
} from './utils';

import {
  QueryMsg
} from './types';

export const createWasmRecoilMethod = (jsonschema: any) => {

  const underscoreName = Object.keys(jsonschema.properties)[0];
  const methodName = camel(underscoreName);
  const responseType = pascal(`${methodName}Response`);
  const properties = jsonschema.properties[underscoreName].properties ?? {};

  if (Object.keys(properties).length > 0) {

  } else {

  }

};

export const createRecoilSelector = (
  keyPrefix: string,
  QueryClient: string,
  methodName: string
) => {

  // const propertyNames = getMessageProperties(queryMsg)
  //   .map(method => Object.keys(method.properties)?.[0])
  //   .filter(Boolean);

  // const methods = getMessageProperties(queryMsg)
  //   .map(schema => createWasmRecoilMethod(schema))

  const selectorName = camel(`${methodName}Selector`);
  const responseType = pascal(`${methodName}Response`);
  const getterKey = camel(`${keyPrefix}${pascal(methodName)}`);

  return t.exportNamedDeclaration(
    t.variableDeclaration(
      'const',
      [t.variableDeclarator(
        t.identifier(selectorName),
        callExpression(
          t.identifier('selectorFamily'),
          [
            t.objectExpression(
              [
                t.objectProperty(
                  t.identifier('key'),
                  t.stringLiteral(getterKey)
                ),
                t.objectProperty(
                  t.identifier('get'),
                  t.arrowFunctionExpression(
                    [
                      t.objectPattern(
                        [
                          t.objectProperty(
                            t.identifier('params'),
                            t.identifier('params'),
                            false,
                            true
                          ),
                          t.restElement(
                            t.identifier('queryClientParams')
                          )
                        ]
                      )
                    ],
                    t.arrowFunctionExpression(
                      [
                        t.objectPattern(
                          [
                            t.objectProperty(
                              t.identifier('get'),
                              t.identifier('get'),
                              false,
                              true
                            )
                          ]
                        )
                      ],
                      t.blockStatement(
                        [
                          t.variableDeclaration('const',
                            [
                              t.variableDeclarator(
                                t.identifier('client'),
                                t.callExpression(
                                  t.identifier('get'),
                                  [
                                    t.callExpression(
                                      t.identifier('queryClient'),
                                      [
                                        t.identifier('queryClientParams')
                                      ]
                                    )
                                  ]
                                )
                              )
                            ]),
                          t.returnStatement(
                            t.awaitExpression(
                              t.callExpression(
                                t.memberExpression(
                                  t.identifier('client'),
                                  t.identifier(methodName)
                                ),
                                [
                                  // t.identifier('params')
                                  t.spreadElement(
                                    t.identifier('params')
                                  )
                                ]
                              )
                            )
                          )
                        ]
                      ),
                      true
                    )
                  )
                )
              ]
            )
          ],
          t.tsTypeParameterInstantiation(
            [
              t.tsTypeReference(
                t.identifier(responseType)
              ),
              t.tsIntersectionType(
                [
                  t.tsTypeReference(
                    t.identifier('QueryClientParams')
                  ),
                  t.tsTypeLiteral(
                    [
                      t.tsPropertySignature(
                        t.identifier('params'),
                        t.tsTypeAnnotation(
                          t.tsTypeReference(
                            t.identifier('Parameters'),
                            t.tsTypeParameterInstantiation(
                              [
                                t.tsIndexedAccessType(
                                  t.tsTypeReference(
                                    t.identifier(QueryClient)
                                  ),
                                  t.tsLiteralType(
                                    t.stringLiteral(methodName)
                                  )
                                )
                              ]
                            )
                          )
                        )
                      )
                    ]
                  )
                ]
              )
            ]
          )
        )
      )]
    )
  )

};

export const createRecoilSelectors = (
  keyPrefix: string,
  QueryClient: string,
  queryMsg: QueryMsg
) => {
  return getMessageProperties(queryMsg)
    .map(schema => {

      const underscoreName = Object.keys(schema.properties)[0];
      const methodName = camel(underscoreName);

      return createRecoilSelector(
        keyPrefix,
        QueryClient,
        methodName
      );

    });
};

export const createRecoilQueryClientType = () => ({
  "type": "TSTypeAliasDeclaration",
  "id": {
    "type": "Identifier",
    "name": "QueryClientParams"
  },
  "typeAnnotation": {
    "type": "TSTypeLiteral",
    "members": [
      {
        "type": "TSPropertySignature",
        "key": {
          "type": "Identifier",
          "name": "contractAddress"
        },
        "computed": false,
        "typeAnnotation": {
          "type": "TSTypeAnnotation",
          "typeAnnotation": {
            "type": "TSStringKeyword"
          }
        }
      }
    ]
  }
});

export const createRecoilQueryClient = (
  keyPrefix: string,
  QueryClient: string
) => {

  const getterKey = camel(`${keyPrefix}${'QueryClient'}`);

  return t.exportNamedDeclaration(
    t.variableDeclaration(
      'const',
      [t.variableDeclarator(
        t.identifier('queryClient'),
        callExpression(
          t.identifier('selectorFamily'),
          [
            t.objectExpression(
              [
                t.objectProperty(
                  t.identifier('key'),
                  t.stringLiteral(getterKey)
                ),
                t.objectProperty(
                  t.identifier('get'),
                  t.arrowFunctionExpression(
                    [
                      t.objectPattern(
                        [
                          t.objectProperty(
                            t.identifier('contractAddress'),
                            t.identifier('contractAddress'),
                            false,
                            true
                          )
                        ]
                      )
                    ],
                    t.arrowFunctionExpression(
                      [
                        t.objectPattern(
                          [
                            t.objectProperty(
                              t.identifier('get'),
                              t.identifier('get'),
                              false,
                              true
                            )
                          ]
                        )
                      ],
                      t.blockStatement(
                        [
                          t.variableDeclaration('const',
                            [
                              t.variableDeclarator(
                                t.identifier('client'),
                                t.callExpression(
                                  t.identifier('get'),
                                  [
                                    t.identifier('cosmWasmClient')
                                  ]
                                )
                              )
                            ]),
                          t.returnStatement(
                            t.newExpression(
                              t.identifier(QueryClient),
                              [
                                t.identifier('client'),
                                t.identifier('contractAddress')
                              ]
                            )
                          )
                        ]
                      ),
                      false
                    )
                  )
                )
              ]
            )
          ],
          t.tsTypeParameterInstantiation(
            [
              t.tsTypeReference(
                t.identifier(QueryClient)
              ),
              t.tsTypeReference(
                t.identifier('QueryClientParams')
              )
            ]
          )
        )
      )]
    )
  )

};
