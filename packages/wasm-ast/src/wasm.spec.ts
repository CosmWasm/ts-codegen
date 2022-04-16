import { contractClass } from './wasm';
import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

import { TSTypeAnnotation, TSExpressionWithTypeArguments } from '@babel/types';

const expectCode = (ast) => {
  expect(
    generate(ast).code
  ).toMatchSnapshot();
}

const printCode = (ast) => {
  console.log(
    generate(ast).code
  );
}

const typedIdentifier = (name: string, typeAnnotation: TSTypeAnnotation, optional: boolean = false) => {
  const type = t.identifier(name);
  type.typeAnnotation = typeAnnotation;
  type.optional = optional;
  return type;
}

const promiseTypeAnnotation = (name) => {
  return t.tsTypeAnnotation(
    t.tsTypeReference(
      t.identifier('Promise'),
      t.tsTypeParameterInstantiation(
        [
          t.tsTypeReference(t.identifier(name))
        ]
      )
    )
  );
}

it('top import', async () => {
  expectCode(
    importStmt([
      'CosmWasmClient',
      'ExecuteResult',
      'SigningCosmWasmClient'
    ], '@cosmjs/cosmwasm-stargate')
  );
});

it('interfaces', async () => {
  expectCode(
    t.program(
      [
        t.exportNamedDeclaration(
          t.tsInterfaceDeclaration(
            t.identifier('SG721ReadOnlyInstance'),
            null,
            [],
            t.tSInterfaceBody(
              [
                t.tSPropertySignature(
                  t.identifier('contractAddress'),
                  t.tsTypeAnnotation(
                    t.tsStringKeyword()
                  )
                ),
                // methods

                t.tSPropertySignature(
                  t.identifier('tokens'),
                  t.tsTypeAnnotation(
                    t.tsFunctionType(
                      null,
                      [
                        typedIdentifier('owner', t.tsTypeAnnotation(
                          t.tsStringKeyword()
                        )),
                        typedIdentifier('startAfter', t.tsTypeAnnotation(
                          t.tsStringKeyword()
                        ), true),
                        typedIdentifier('limit', t.tsTypeAnnotation(
                          t.tsStringKeyword()
                        ), true)
                      ],
                      promiseTypeAnnotation('TokensResponse')
                    )
                  )
                )
              ]
            )
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
            t.tSInterfaceBody(
              [

                // contract address

                t.tSPropertySignature(
                  t.identifier('contractAddress'),
                  t.tsTypeAnnotation(
                    t.tsStringKeyword()
                  )
                ),

                // METHOD
                t.tSPropertySignature(
                  t.identifier('mint'),
                  t.tsTypeAnnotation(
                    t.tsFunctionType(
                      null,
                      [
                        typedIdentifier('sender', t.tsTypeAnnotation(
                          t.tsStringKeyword()
                        )),
                        typedIdentifier('anotherProp', t.tsTypeAnnotation(
                          t.tsStringKeyword()
                        )),
                        typedIdentifier('prop3', t.tsTypeAnnotation(
                          t.tsStringKeyword()
                        ))
                      ],
                      promiseTypeAnnotation('ExecuteResult')
                    )
                  )
                )
              ]
            )
          )
        )

      ]
    )
  )

});

const classDeclaration = (name: string, body: any[], implementsExressions: TSExpressionWithTypeArguments[] = [], superClass: t.Identifier = null) => {
  const declaration = t.classDeclaration(
    t.identifier(name),
    superClass,
    t.classBody(body)
  );
  if (implementsExressions.length) {
    declaration.implements = implementsExressions;
  }
  return declaration;
};

const classProperty = (name: string, typeAnnotation: TSTypeAnnotation = null, isReadonly: boolean = false, isStatic: boolean = false) => {
  const prop = t.classProperty(t.identifier(name));
  if (isReadonly) prop.readonly = true;
  if (isStatic) prop.static = true;
  if (typeAnnotation) prop.typeAnnotation = typeAnnotation;
  return prop;
};

const bindMethod = (name: string) => {
  return t.expressionStatement(
    t.assignmentExpression('=', t.memberExpression(
      t.thisExpression(),
      t.identifier(name)
    ),
      t.callExpression(
        t.memberExpression(
          t.memberExpression(
            t.thisExpression(),
            t.identifier(name)
          ),
          t.identifier('bind')
        ),
        [
          t.thisExpression()
        ]
      )
    )
  )
}

// TODO: 
// - [ ] pass client and contractAddress into constructor()

const arrowFunctionExpression = (
  params: (t.Identifier | t.Pattern | t.RestElement)[],
  body: t.BlockStatement,
  returnType: t.TSTypeAnnotation,
  isAsync: boolean = false
) => {
  const func = t.arrowFunctionExpression(params, body, isAsync);
  if (returnType) func.returnType = returnType;
  return func;
};

it('readonly classes', async () => {
  expectCode(
    t.program(
      [

        t.exportNamedDeclaration(
          classDeclaration('SG721QueryClient',
            [
              // client
              classProperty('client', t.tsTypeAnnotation(
                t.tsTypeReference(t.identifier('CosmWasmClient'))
              )),

              // contractAddress
              classProperty('contractAddress', t.tsTypeAnnotation(
                t.tsStringKeyword()
              )),

              // constructor
              t.classMethod('constructor',
                t.identifier('constructor'),
                [
                  typedIdentifier('client', t.tsTypeAnnotation(t.tsTypeReference(t.identifier('CosmWasmClient')))),
                  typedIdentifier('contractAddress', t.tsTypeAnnotation(t.tsStringKeyword()))

                ],
                t.blockStatement(
                  [

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
                  ]
                )),

              // methods:
              t.classProperty(
                t.identifier('approval'),
                arrowFunctionExpression(
                  [
                    // props
                    typedIdentifier('owner', t.tsTypeAnnotation(
                      t.tsStringKeyword()
                    )),
                    // 
                    typedIdentifier('spender', t.tsTypeAnnotation(
                      t.tsStringKeyword()
                    ))
                  ],
                  t.blockStatement(
                    [
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
                            t.memberExpression(t.thisExpression(), t.identifier('contractAddress')),
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
                              ),

                            ])
                          ]
                        )
                      )
                    ]
                  ),
                  t.tsTypeAnnotation(
                    t.tsTypeReference(
                      t.identifier('Promise'),
                      t.tsTypeParameterInstantiation(
                        [
                          t.tSTypeReference(
                            t.identifier('ApprovalResponse')
                          )
                        ]
                      )
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
            ])
        ),





      ]
    )
  )

});

it('mutation classes', async () => {
  printCode(
    t.program(
      [

        t.exportNamedDeclaration(
          classDeclaration('SG721Client',
            [
              // client
              classProperty('client', t.tsTypeAnnotation(
                t.tsTypeReference(t.identifier('SigningCosmWasmClient'))
              )),

              // contractAddress
              classProperty('contractAddress', t.tsTypeAnnotation(
                t.tsStringKeyword()
              )),

              // constructor
              t.classMethod('constructor',
                t.identifier('constructor'),
                [
                  typedIdentifier('client', t.tsTypeAnnotation(t.tsTypeReference(t.identifier('SigningCosmWasmClient')))),
                  typedIdentifier('contractAddress', t.tsTypeAnnotation(t.tsStringKeyword()))
                ],
                t.blockStatement(
                  [
                    // super()
                    t.expressionStatement(t.callExpression(
                      t.super(),
                      [
                        t.identifier('client'),
                        t.identifier('contractAddress')
                      ]
                    )),

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
                  ]
                )),

              // methods:
              t.classProperty(
                t.identifier('mint'),
                arrowFunctionExpression(
                  [
                    // props
                    typedIdentifier('sender', t.tsTypeAnnotation(
                      t.tsStringKeyword()
                    )),
                    typedIdentifier('tokenId', t.tsTypeAnnotation(
                      t.tsStringKeyword()
                    )),
                    typedIdentifier('owner', t.tsTypeAnnotation(
                      t.tsStringKeyword()
                    )),
                    typedIdentifier('token_uri', t.tsTypeAnnotation(
                      t.tsStringKeyword()
                    ))
                  ],
                  t.blockStatement(
                    [
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
                              t.objectExpression(
                                [
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

                                ]
                              ),
                              t.stringLiteral('auto')
                            ]
                          )
                        )
                      )
                    ]
                  ),
                  // return type
                  t.tsTypeAnnotation(
                    t.tsTypeReference(
                      t.identifier('Promise'),
                      t.tsTypeParameterInstantiation(
                        [
                          t.tSTypeReference(
                            t.identifier('ExecuteResult')
                          )
                        ]
                      )
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
        ),





      ]
    )
  )

});
