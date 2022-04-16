import { contractClass } from './wasm';
import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

import { TSTypeAnnotation } from '@babel/types';

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

it('class', async () => {

    printCode(
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
