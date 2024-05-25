import * as t from '@babel/types';

import { importStmt } from '../../src/utils/babel';
import {
  arrowFunctionExpression,
  bindMethod,
  classDeclaration,
  classProperty,
  promiseTypeAnnotation,
  typedIdentifier
} from '../../src/utils/babel';
import { expectCode } from '../../test-utils';

it('top import', async () => {
  expectCode(
    importStmt(
      ['CosmWasmClient', 'ExecuteResult', 'SigningCosmWasmClient'],
      '@cosmjs/cosmwasm-stargate'
    )
  );
});

it('interfaces', async () => {
  expectCode(
    t.program([
      t.exportNamedDeclaration(
        t.tsInterfaceDeclaration(
          t.identifier('SG721ReadOnlyInstance'),
          null,
          [],
          t.tSInterfaceBody([
            t.tSPropertySignature(
              t.identifier('contractAddress'),
              t.tsTypeAnnotation(t.tsStringKeyword())
            ),
            // methods

            t.tSPropertySignature(
              t.identifier('tokens'),
              t.tsTypeAnnotation(
                t.tsFunctionType(
                  null,
                  [
                    typedIdentifier(
                      'owner',
                      t.tsTypeAnnotation(t.tsStringKeyword())
                    ),
                    typedIdentifier(
                      'startAfter',
                      t.tsTypeAnnotation(t.tsStringKeyword()),
                      true
                    ),
                    typedIdentifier(
                      'limit',
                      t.tsTypeAnnotation(t.tsStringKeyword()),
                      true
                    )
                  ],
                  promiseTypeAnnotation('TokensResponse')
                )
              )
            )
          ])
        )
      ),

      // extends

      t.exportNamedDeclaration(
        t.tsInterfaceDeclaration(
          t.identifier('SG721Instance'),
          null,
          [
            t.tSExpressionWithTypeArguments(
              t.identifier('SG721ReadOnlyInstance')
            )
          ],
          t.tSInterfaceBody([
            // contract address

            t.tSPropertySignature(
              t.identifier('contractAddress'),
              t.tsTypeAnnotation(t.tsStringKeyword())
            ),

            // METHOD
            t.tSPropertySignature(
              t.identifier('mint'),
              t.tsTypeAnnotation(
                t.tsFunctionType(
                  null,
                  [
                    typedIdentifier(
                      'sender',
                      t.tsTypeAnnotation(t.tsStringKeyword())
                    ),
                    typedIdentifier(
                      'anotherProp',
                      t.tsTypeAnnotation(t.tsStringKeyword())
                    ),
                    typedIdentifier(
                      'prop3',
                      t.tsTypeAnnotation(t.tsStringKeyword())
                    )
                  ],
                  promiseTypeAnnotation('ExecuteResult')
                )
              )
            )
          ])
        )
      )
    ])
  );
});

it('readonly classes', async () => {
  expectCode(
    t.program([
      t.exportNamedDeclaration(
        classDeclaration(
          'SG721QueryClient',
          [
            // client
            classProperty(
              'client',
              t.tsTypeAnnotation(
                t.tsTypeReference(t.identifier('CosmWasmClient'))
              )
            ),

            // contractAddress
            classProperty(
              'contractAddress',
              t.tsTypeAnnotation(t.tsStringKeyword())
            ),

            // constructor
            t.classMethod(
              'constructor',
              t.identifier('constructor'),
              [
                typedIdentifier(
                  'client',
                  t.tsTypeAnnotation(
                    t.tsTypeReference(t.identifier('CosmWasmClient'))
                  )
                ),
                typedIdentifier(
                  'contractAddress',
                  t.tsTypeAnnotation(t.tsStringKeyword())
                )
              ],
              t.blockStatement([
                // client/contract set
                t.expressionStatement(
                  t.assignmentExpression(
                    '=',
                    t.memberExpression(
                      t.thisExpression(),
                      t.identifier('client')
                    ),
                    t.identifier('client')
                  )
                ),
                t.expressionStatement(
                  t.assignmentExpression(
                    '=',
                    t.memberExpression(
                      t.thisExpression(),
                      t.identifier('contractAddress')
                    ),
                    t.identifier('contractAddress')
                  )
                ),

                // bindings
                bindMethod('approval'),
                bindMethod('otherProp'),
                bindMethod('hello'),
                bindMethod('mintme')
              ])
            ),

            // methods:
            t.classProperty(
              t.identifier('approval'),
              arrowFunctionExpression(
                [
                  // props
                  typedIdentifier(
                    'owner',
                    t.tsTypeAnnotation(t.tsStringKeyword())
                  ),
                  //
                  typedIdentifier(
                    'spender',
                    t.tsTypeAnnotation(t.tsStringKeyword())
                  )
                ],
                t.blockStatement([
                  t.returnStatement(
                    t.callExpression(
                      t.memberExpression(
                        t.memberExpression(
                          t.thisExpression(),
                          t.identifier('client')
                        ),
                        t.identifier('queryContractSmart')
                      ),
                      [
                        t.memberExpression(
                          t.thisExpression(),
                          t.identifier('contractAddress')
                        ),
                        t.objectExpression([
                          // props
                          t.objectProperty(
                            t.identifier('owner'),
                            t.identifier('owner'),
                            false,
                            true
                          ),

                          t.objectProperty(
                            t.identifier('spender'),
                            t.identifier('spender'),
                            false,
                            true
                          )
                        ])
                      ]
                    )
                  )
                ]),
                t.tsTypeAnnotation(
                  t.tsTypeReference(
                    t.identifier('Promise'),
                    t.tsTypeParameterInstantiation([
                      t.tSTypeReference(t.identifier('ApprovalResponse'))
                    ])
                  )
                ),
                true
              )
            )
          ],
          [
            t.tSExpressionWithTypeArguments(
              t.identifier('SG721ReadOnlyInstance')
            )
          ]
        )
      )
    ])
  );
});

it('mutation classes', async () => {
  expectCode(
    t.program([
      t.exportNamedDeclaration(
        classDeclaration(
          'SG721Client',
          [
            // client
            classProperty(
              'client',
              t.tsTypeAnnotation(
                t.tsTypeReference(t.identifier('SigningCosmWasmClient'))
              )
            ),

            // contractAddress
            classProperty(
              'contractAddress',
              t.tsTypeAnnotation(t.tsStringKeyword())
            ),

            // constructor
            t.classMethod(
              'constructor',
              t.identifier('constructor'),
              [
                typedIdentifier(
                  'client',
                  t.tsTypeAnnotation(
                    t.tsTypeReference(t.identifier('SigningCosmWasmClient'))
                  )
                ),
                typedIdentifier(
                  'contractAddress',
                  t.tsTypeAnnotation(t.tsStringKeyword())
                )
              ],
              t.blockStatement([
                // super()
                t.expressionStatement(
                  t.callExpression(t.super(), [
                    t.identifier('client'),
                    t.identifier('contractAddress')
                  ])
                ),

                // client/contract set
                t.expressionStatement(
                  t.assignmentExpression(
                    '=',
                    t.memberExpression(
                      t.thisExpression(),
                      t.identifier('client')
                    ),
                    t.identifier('client')
                  )
                ),
                t.expressionStatement(
                  t.assignmentExpression(
                    '=',
                    t.memberExpression(
                      t.thisExpression(),
                      t.identifier('contractAddress')
                    ),
                    t.identifier('contractAddress')
                  )
                ),

                // bindings
                bindMethod('approval'),
                bindMethod('otherProp'),
                bindMethod('hello'),
                bindMethod('mintme')
              ])
            ),

            // methods:
            t.classProperty(
              t.identifier('mint'),
              arrowFunctionExpression(
                [
                  // props
                  typedIdentifier(
                    'sender',
                    t.tsTypeAnnotation(t.tsStringKeyword())
                  ),
                  typedIdentifier(
                    'tokenId',
                    t.tsTypeAnnotation(t.tsStringKeyword())
                  ),
                  typedIdentifier(
                    'owner',
                    t.tsTypeAnnotation(t.tsStringKeyword())
                  ),
                  typedIdentifier(
                    'token_uri',
                    t.tsTypeAnnotation(t.tsStringKeyword())
                  )
                ],
                t.blockStatement([
                  t.returnStatement(
                    t.awaitExpression(
                      t.callExpression(
                        t.memberExpression(
                          t.memberExpression(
                            t.thisExpression(),
                            t.identifier('client')
                          ),
                          t.identifier('execute')
                        ),
                        [
                          t.identifier('sender'),
                          t.memberExpression(
                            t.thisExpression(),
                            t.identifier('contractAddress')
                          ),
                          t.objectExpression([
                            t.objectProperty(
                              t.identifier('mint'),
                              t.objectExpression([
                                t.objectProperty(
                                  t.identifier('token_id'),
                                  t.identifier('tokenId')
                                ),
                                t.objectProperty(
                                  t.identifier('owner'),
                                  t.identifier('owner')
                                ),
                                t.objectProperty(
                                  t.identifier('token_uri'),
                                  t.identifier('token_uri')
                                ),
                                t.objectProperty(
                                  t.identifier('expression'),
                                  t.objectExpression([])
                                )
                              ])
                            )
                          ]),
                          t.stringLiteral('auto')
                        ]
                      )
                    )
                  )
                ]),
                // return type
                t.tsTypeAnnotation(
                  t.tsTypeReference(
                    t.identifier('Promise'),
                    t.tsTypeParameterInstantiation([
                      t.tSTypeReference(t.identifier('ExecuteResult'))
                    ])
                  )
                ),
                true
              )
            )
          ],
          [
            t.tSExpressionWithTypeArguments(
              t.identifier('SG721ReadOnlyInstance')
            )
          ],
          t.identifier('SG721QueryClient')
        )
      )
    ])
  );
});

it('object parms', () => {
  const obj = t.objectPattern([
    t.objectProperty(
      t.identifier('includeExpired'),
      t.identifier('includeExpired'),
      false,
      true
    ),
    t.objectProperty(
      t.identifier('tokenId'),
      t.identifier('tokenId'),
      false,
      true
    )
  ]);
  obj.typeAnnotation = t.tsTypeAnnotation(
    t.tsTypeLiteral([
      t.tsPropertySignature(
        t.identifier('includeExpired'),
        t.tsTypeAnnotation(t.tsBooleanKeyword())
      ),
      t.tsPropertySignature(
        t.identifier('tokenId'),
        t.tsTypeAnnotation(t.tsStringKeyword())
      )
    ])
  );
  expectCode(
    t.program([
      t.expressionStatement(
        t.assignmentExpression(
          '=',
          t.identifier('ownerOf'),
          arrowFunctionExpression(
            [obj],
            t.blockStatement(
              [
                // body
              ],
              []
            ),
            t.tsTypeAnnotation(
              t.tsTypeReference(
                t.identifier('Promise'),
                t.tsTypeParameterInstantiation([
                  t.tsTypeReference(t.identifier('OwnerOfResponse'))
                ])
              )
            )
          )
        )
      )
    ])
  );
});
