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

const getTypeFromRef = ($ref) => {
    switch ($ref) {
        case '#/definitions/Binary':
            return t.tsTypeReference(t.identifier('Uint8Array'))
        default:
            if ($ref.startsWith('#/definitions/')) {
                return t.tsTypeReference(t.identifier($ref.replace('#/definitions/', '')))
            }
            throw new Error('what is $ref: ' + $ref);
    }
}

const getArrayTypeFromRef = ($ref) => {
    return t.tsArrayType(
        getTypeFromRef($ref)
    );
}
const getArrayTypeFromType = (type) => {
    return t.tsArrayType(
        getType(type)
    );
}

// MARKED AS NOT DRY 
const identifier = (name: string, typeAnnotation: t.TSTypeAnnotation, optional: boolean = false) => {
    const type = t.identifier(name);
    type.typeAnnotation = typeAnnotation;
    type.optional = optional;
    return type;
}

const getType = (type) => {
    switch (type) {
        case 'string':
            return t.tsStringKeyword();
        case 'boolean':
            return t.tSBooleanKeyword();
        case 'integer':
            return t.tsNumberKeyword();
        default:
            throw new Error('what is type: ' + type);
    }
}

// MARKED AS NOT DRY 
const getPropertyType = (schema, prop) => {
    const props = schema.properties ?? {};
    let info = props[prop];

    let type = null;
    let optional = schema.required?.includes(prop);

    if (info.allOf && info.allOf.length === 1) {
        info = info.allOf[0];
    }

    if (typeof info.$ref === 'string') {
        type = getTypeFromRef(info.$ref)
    }

    if (Array.isArray(info.anyOf)) {
        // assuming 2nd is null, but let's check to ensure
        if (info.anyOf.length !== 2) {
            throw new Error('case not handled by transpiler. contact maintainers.')
        }
        const [nullableType, nullType] = info.anyOf;
        if (nullType?.type !== 'null') {
            throw new Error('case not handled by transpiler. contact maintainers.')
        }
        type = getTypeFromRef(nullableType?.$ref);
        optional = true;
    }

    if (typeof info.type === 'string') {
        if (info.type === 'array') {
            if (info.items.$ref) {
                type = getArrayTypeFromRef(info.items.$ref);
            } else {
                type = getArrayTypeFromType(info.items.type);
            }
        } else {

            type = getType(info.type);
        }
    }

    if (Array.isArray(info.type)) {
        // assuming 2nd is null, but let's check to ensure
        if (info.type.length !== 2) {
            throw new Error('case not handled by transpiler. contact maintainers.')
        }
        const [nullableType, nullType] = info.type;
        if (nullType !== 'null') {
            throw new Error('case not handled by transpiler. contact maintainers.')
        }
        type = getType(nullableType);
        optional = true;
    }
    if (!type) {
        throw new Error('cannot find type for ' + JSON.stringify(info))
    }

    if (schema.required?.includes(prop)) {
        optional = false;
    }

    return { type, optional };
};

const tsTypeOperator = (typeAnnotation: t.TSType, operator: string) => {
    const obj = t.tsTypeOperator(typeAnnotation);
    obj.operator = operator;
    return obj;
}

// MARKED AS NOT DRY 
const createWasmExecMethod = (
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
            return createWasmExecMethod(schema)
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
const propertySignature = (
    name: string,
    typeAnnotation: t.TSTypeAnnotation,
    optional: boolean = false
) => {

    // prop.leadingComments = [{
    //   type: 'Comment',
    //   value: ' Data on the token itself'
    // }];
    // prop.leadingComments = [{
    //   type: 'CommentBlock',
    //   value: '* Data on the token itself'
    // }];

    return {
        type: 'TSPropertySignature',
        key: t.identifier(name),
        typeAnnotation,
        optional
    }
};

// MARKED AS NOT DRY 
const createTypedObjectParams = (jsonschema: any, camelize: boolean = true) => {
    const keys = Object.keys(jsonschema.properties ?? {});
    if (!keys.length) return;

    const typedParams = keys.map(prop => {
        const { type, optional } = getPropertyType(jsonschema, prop);
        return propertySignature(
            camelize ? camel(prop) : prop,
            t.tsTypeAnnotation(
                type
            ),
            optional
        )
    });
    const params = keys.map(prop => {
        return t.objectProperty(
            camelize ? t.identifier(camel(prop)) : t.identifier(prop),
            camelize ? t.identifier(camel(prop)) : t.identifier(prop),
            false,
            true
        );
    });

    const obj = t.objectPattern(
        [
            ...params
        ]
    );
    obj.typeAnnotation = t.tsTypeAnnotation(
        t.tsTypeLiteral(
            [
                ...typedParams
            ]
        )
    );

    return obj;
};

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

