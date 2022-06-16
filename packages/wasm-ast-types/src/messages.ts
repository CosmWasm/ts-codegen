import * as t from '@babel/types';
import { camel, pascal } from 'case';
import {
    bindMethod,
    typedIdentifier,
    promiseTypeAnnotation,
    classDeclaration,
    classProperty,
    arrowFunctionExpression,
    getMessageProperties
} from './utils'

import {
    QueryMsg,
    ExecuteMsg
} from './types';
import { getPropertyType, createTypedObjectParams } from './utils/types';
import { identifier, tsTypeOperator, propertySignature } from './utils/babel';

const createWasmExecMethodPartial = (
    jsonschema: any
) => {

    const underscoreName = Object.keys(jsonschema.properties)[0];
    const methodName = camel(underscoreName);
    const properties = jsonschema.properties[underscoreName].properties ?? {};
    const obj = createTypedObjectParams(jsonschema.properties[underscoreName]);
    const args = Object.keys(properties).map(prop => {
        return t.objectProperty(
            t.identifier(prop),
            t.identifier(camel(prop)),
            false,
            prop === camel(prop)
        );
    });

    const constantParams = [
        // t.assignmentPattern(
        //     identifier(
        //         'fee',
        //         t.tsTypeAnnotation(
        //             t.tsUnionType(
        //                 [
        //                     t.tSNumberKeyword(),
        //                     t.tsTypeReference(
        //                         t.identifier('StdFee')
        //                     ),
        //                     t.tsLiteralType(
        //                         t.stringLiteral('auto')
        //                     )
        //                 ]
        //             )
        //         ),
        //         false
        //     ),
        //     t.stringLiteral('auto')
        // ),
        // identifier('memo', t.tsTypeAnnotation(
        //     t.tsStringKeyword()
        // ), true),
        identifier('funds', t.tsTypeAnnotation(
            tsTypeOperator(
                t.tsArrayType(
                    t.tsTypeReference(
                        t.identifier('Coin')
                    )
                ),
                'readonly'
            )
        ), true)
    ];

    return t.classProperty(
        t.identifier(methodName),
        arrowFunctionExpression(
            obj ? [
                // props
                obj,
                ...constantParams
            ] : constantParams,
            t.blockStatement(
                [
                    t.returnStatement(

                        t.objectExpression([
                            t.objectProperty(
                                t.identifier('typeUrl'),
                                t.stringLiteral('/cosmwasm.wasm.v1.MsgExecuteContract')
                            ),
                            t.objectProperty(
                                t.identifier('value'),
                                t.callExpression(
                                    t.memberExpression(
                                        t.identifier('MsgExecuteContract'),
                                        t.identifier('fromPartial')
                                    ),
                                    [
                                        t.objectExpression([
                                            t.objectProperty(
                                                t.identifier('sender'),
                                                t.memberExpression(
                                                    t.thisExpression(),
                                                    t.identifier('sender')
                                                )
                                            ),
                                            t.objectProperty(
                                                t.identifier('contract'),
                                                t.memberExpression(
                                                    t.thisExpression(),
                                                    t.identifier('contractAddress')
                                                )
                                            ),
                                            t.objectProperty(
                                                t.identifier('msg'),
                                                t.callExpression(
                                                    t.identifier('toUtf8'),
                                                    [
                                                        t.callExpression(
                                                            t.memberExpression(
                                                                t.identifier('JSON'),
                                                                t.identifier('stringify')
                                                            ),
                                                            [
                                                                t.objectExpression(

                                                                    [
                                                                        t.objectProperty(
                                                                            t.identifier(underscoreName), t.objectExpression(args)
                                                                        )
                                                                    ]

                                                                )
                                                            ]
                                                        )
                                                    ]
                                                )
                                            ),
                                            t.objectProperty(
                                                t.identifier('funds'),
                                                t.identifier('funds'),
                                                false,
                                                true
                                            ),
                                        ])
                                    ]
                                )
                            )
                        ])
                    )
                ]
            ),
            // return type
            t.tsTypeAnnotation(
                t.tsTypeReference(
                    t.identifier('MsgExecuteContractEncodeObject')
                )
            ),
            false
        )
    );

}

export const createFromPartialClass = (
    className: string,
    implementsClassName: string,
    execMsg: ExecuteMsg
) => {

    const propertyNames = getMessageProperties(execMsg)
        .map(method => Object.keys(method.properties)?.[0])
        .filter(Boolean);

    const bindings = propertyNames
        .map(camel)
        .map(bindMethod);

    const methods = getMessageProperties(execMsg)
        .map(schema => {
            return createWasmExecMethodPartial(schema)
        });

    const blockStmt = [];

    [].push.apply(blockStmt, [
        t.expressionStatement(
            t.assignmentExpression(
                '=',
                t.memberExpression(
                    t.thisExpression(),
                    t.identifier('sender')
                ),
                t.identifier('sender')
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
        ...bindings
    ]);

    return t.exportNamedDeclaration(
        classDeclaration(className,
            [
                // sender
                classProperty('sender', t.tsTypeAnnotation(
                    t.tsStringKeyword()
                )),

                // contractAddress
                classProperty('contractAddress', t.tsTypeAnnotation(
                    t.tsStringKeyword()
                )),

                // constructor
                t.classMethod('constructor',
                    t.identifier('constructor'),
                    [
                        typedIdentifier('sender', t.tsTypeAnnotation(t.tsStringKeyword())),
                        typedIdentifier('contractAddress', t.tsTypeAnnotation(t.tsStringKeyword()))
                    ],
                    t.blockStatement(
                        blockStmt
                    )),
                ...methods
            ],
            [
                t.tSExpressionWithTypeArguments(
                    t.identifier(implementsClassName)
                )
            ],
            null
        )
    );
}

export const createFromPartialInterface = (
    className: string,
    execMsg: ExecuteMsg
) => {

    const methods = getMessageProperties(execMsg)
        .map(jsonschema => {
            const underscoreName = Object.keys(jsonschema.properties)[0];
            const methodName = camel(underscoreName);
            return createPropertyFunctionWithObjectParamsForPartial(
                methodName,
                'MsgExecuteContractEncodeObject',
                jsonschema.properties[underscoreName]
            );
        });

    const extendsAst = [];

    return t.exportNamedDeclaration(
        t.tsInterfaceDeclaration(
            t.identifier(className),
            null,
            extendsAst,
            t.tSInterfaceBody(
                [

                    // contract address
                    t.tSPropertySignature(
                        t.identifier('contractAddress'),
                        t.tsTypeAnnotation(
                            t.tsStringKeyword()
                        )
                    ),

                    // contract address
                    t.tSPropertySignature(
                        t.identifier('sender'),
                        t.tsTypeAnnotation(
                            t.tsStringKeyword()
                        )
                    ),

                    ...methods,
                ]
            )
        )
    );
};

// MARKED AS NOT DRY 

const createPropertyFunctionWithObjectParamsForPartial = (methodName: string, responseType: string, jsonschema: any) => {
    const obj = createTypedObjectParams(jsonschema);
    const fixedParams = [
        // identifier('fee', t.tsTypeAnnotation(
        //     t.tsUnionType(
        //         [
        //             t.tsNumberKeyword(),
        //             t.tsTypeReference(
        //                 t.identifier('StdFee')
        //             ),
        //             t.tsLiteralType(
        //                 t.stringLiteral('auto')
        //             )
        //         ]
        //     )
        // ), true),
        // identifier('memo', t.tsTypeAnnotation(
        //     t.tsStringKeyword()
        // ), true),
        identifier('funds', t.tsTypeAnnotation(
            tsTypeOperator(
                t.tsArrayType(
                    t.tsTypeReference(
                        t.identifier('Coin')
                    )
                ),
                'readonly'
            )
        ), true)
    ];
    const func = {
        type: 'TSFunctionType',
        typeAnnotation: t.tsTypeAnnotation(t.tsTypeReference(
            t.identifier(responseType)
        )),
        parameters: obj ? [
            obj,
            ...fixedParams

        ] : fixedParams
    }

    return t.tSPropertySignature(
        t.identifier(methodName),
        t.tsTypeAnnotation(
            func
        )
    );
};

