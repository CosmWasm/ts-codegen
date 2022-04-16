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

const classDeclaration = (name: string, body: any[], implementsExressions: TSExpressionWithTypeArguments[] = []) => {
    const declaration = t.classDeclaration(
        t.identifier(name),
        null,
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

it('classes', async () => {
    printCode(
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
                            t.classMethod('constructor', t.identifier('constructor'), [], t.blockStatement(
                                [
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
                                        t.identifier('owner')
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
                                    )
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
