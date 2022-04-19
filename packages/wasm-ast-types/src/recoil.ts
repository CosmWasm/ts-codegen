import * as t from '@babel/types';
import { camel, pascal } from 'case';
import {
  bindMethod,
  typedIdentifier,
  promiseTypeAnnotation,
  classDeclaration,
  classProperty,
  arrowFunctionExpression
} from './utils'

import { getMessageProperties } from './wasm';

interface QueryMsg {
  $schema: string;
  title: "QueryMsg";
  oneOf?: any;
  allOf?: any;
  anyOf?: any;
}
interface ExecuteMsg {
  $schema: string;
  title: "ExecuteMsg" | "ExecuteMsg_for_Empty";
  oneOf?: any;
  allOf?: any;
  anyOf?: any;
}

export const createWasmRecoilMethod = (jsonschema: any) => {

  const underscoreName = Object.keys(jsonschema.properties)[0];
  const methodName = camel(underscoreName);
  const responseType = pascal(`${methodName}Response`);
  const properties = jsonschema.properties[underscoreName].properties ?? {};

  if (Object.keys(properties).length > 0) {

  } else {

  }

};

const callExpression = (
  callee: t.Expression | t.V8IntrinsicIdentifier,
  _arguments: (t.Expression | t.SpreadElement | t.ArgumentPlaceholder)[],
  typeParameters: t.TSTypeParameterInstantiation
) => {
  const callExpr = t.callExpression(callee, _arguments);
  callExpr.typeParameters = typeParameters;
  return callExpr;
};

// const tsIndexedAccessType = (
//   objectType: t.TSType, indexType: t.TSType, typeParameters: t.TSTypeParameterInstantiation
// ) => {
//   const el = t.tsIndexedAccessType(
//     objectType,
//     indexType
//     );
// el.type
//   return el;
// };

export const createRecoilSelectors = (contractName: string, queryMsg: QueryMsg) => {
  const propertyNames = getMessageProperties(queryMsg)
    .map(method => Object.keys(method.properties)?.[0])
    .filter(Boolean);

  const methods = getMessageProperties(queryMsg)
    .map(schema => createWasmRecoilMethod(schema))

  return t.exportNamedDeclaration(
    t.variableDeclaration(
      'const',
      [t.variableDeclarator(
        t.identifier('governanceModulesSelector'),
        callExpression(
          t.identifier('selectorFamily'),
          [
            t.objectExpression(
              [
                t.objectProperty(
                  t.identifier('key'),
                  t.stringLiteral('cwGovernaneceGovernanceModules')
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
                          ),
                          t.restElement(
                            t.identifier('params')
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
                                        t.identifier('contractAddress')
                                      ]
                                    )
                                  ]
                                )
                              )
                            ]),
                          t.ifStatement(
                            t.unaryExpression('!', t.identifier('client')),
                            t.returnStatement(
                              null
                            ),
                            null
                          ),
                          t.returnStatement(
                            t.awaitExpression(
                              t.callExpression(
                                t.memberExpression(
                                  t.identifier('client'),
                                  t.identifier('governanceModules')
                                ),
                                [
                                  t.identifier('params')
                                ]
                              )
                            )
                          )
                        ]
                      )
                    )
                  )
                )
              ]
            )
          ],
          t.tsTypeParameterInstantiation(
            [
              t.tsUnionType(
                [
                  t.tsTypeReference(
                    t.identifier('GovernanceModulesResponse')
                  ),
                  t.tsUndefinedKeyword()
                ]
              ),
              t.tsIntersectionType(
                [
                  t.tsIndexedAccessType(
                    t.tsTypeReference(
                      t.identifier('Parameters'),
                      t.tsTypeParameterInstantiation(
                        [
                          t.tsIndexedAccessType(
                            t.tsTypeReference(
                              t.identifier('QueryClient')
                            ),
                            t.tsLiteralType(
                              t.stringLiteral('governanceModules')
                            )
                          )
                        ]
                      )
                    ),
                    t.tsLiteralType(
                      t.numericLiteral(0)
                    )
                  ),
                  t.tsTypeLiteral(
                    [
                      t.tsPropertySignature(
                        t.identifier('contractAddress'),
                        t.tsTypeAnnotation(
                          t.tsStringKeyword()
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