import * as t from '@babel/types';
import { camel, pascal } from 'case';
import { QueryMsg } from './types';
import {
    tsPropertySignature,
    tsObjectPattern,
    callExpression,
    getMessageProperties
} from './utils'
import { propertySignature } from './utils/babel';
import { getPropertyType } from './utils/types';
interface ReactQueryHookQuery {
    hookName: string;
    hookParamsTypeName: string;
    hookKeyName: string;
    responseType: string;
    methodName: string;
    jsonschema: any;
}

export const createReactQueryHooks = (
    queryMsg: QueryMsg,
    contractName: string,
    QueryClient: string) => {
    return getMessageProperties(queryMsg)
        .reduce((m, schema) => {
            const underscoreName = Object.keys(schema.properties)[0];
            const methodName = camel(underscoreName);
            const hookName = `use${pascal(contractName)}${pascal(methodName)}Query`;
            const hookParamsTypeName = `${pascal(contractName)}${pascal(methodName)}Query`;
            const responseType = pascal(`${methodName}Response`);
            const getterKey = camel(`${contractName}${pascal(methodName)}`);
            const jsonschema = schema.properties[underscoreName];
            return [
                createReactQueryHookInterface({
                    hookParamsTypeName,
                    responseType,
                    QueryClient,
                    jsonschema
                }),
                createReactQueryHook(
                    {
                        methodName,
                        hookName,
                        hookParamsTypeName,
                        responseType,
                        hookKeyName: getterKey,
                        jsonschema
                    }
                ),
                ...m,
            ]
        }, []);
};


export const createReactQueryHook = ({
    hookName,
    hookParamsTypeName,
    responseType,
    hookKeyName,
    methodName,
    jsonschema
}: ReactQueryHookQuery) => {

    const keys = Object.keys(jsonschema.properties ?? {});
    let args = [];
    if (keys.length) {
        args = [
            t.objectExpression([
                ...keys.map(prop => {
                    return t.objectProperty(
                        t.identifier(camel(prop)),
                        t.memberExpression(
                            t.identifier('args'),
                            t.identifier(camel(prop))
                        )
                    )
                })
            ])
        ]
    }

    let props = ['client', 'options'];
    if (keys.length) {
        props = ['client', 'args', 'options'];
    }

    return t.exportNamedDeclaration(
        t.functionDeclaration(
            t.identifier(hookName),
            [
                tsObjectPattern(
                    [
                        ...props.map(prop => {
                            return t.objectProperty(
                                t.identifier(prop),
                                t.identifier(prop),
                                false,
                                true
                            )
                        })
                    ],
                    t.tsTypeAnnotation(t.tsTypeReference(
                        t.identifier(hookParamsTypeName)
                    ))
                )
            ],
            t.blockStatement(
                [

                    t.returnStatement(
                        callExpression(
                            t.identifier('useQuery'),
                            [
                                t.arrayExpression([
                                    t.stringLiteral(hookKeyName),
                                    t.memberExpression(
                                        t.identifier('client'),
                                        t.identifier('contractAddress')
                                    )
                                ]),
                                t.arrowFunctionExpression(
                                    [],
                                    t.callExpression(
                                        t.memberExpression(
                                            t.identifier('client'),
                                            t.identifier(methodName)
                                        ),
                                        args
                                    ),
                                    false
                                ),
                                t.identifier('options')
                            ],
                            t.tsTypeParameterInstantiation(
                                [
                                    t.tsTypeReference(
                                        t.identifier(responseType)
                                    ),
                                    t.tsTypeReference(
                                        t.identifier('Error')
                                    ),
                                    t.tsTypeReference(
                                        t.identifier(responseType)
                                    ),
                                    t.tsArrayType(
                                        t.tsParenthesizedType(
                                            t.tsUnionType(
                                                [
                                                    t.tsStringKeyword(),
                                                    t.tsUndefinedKeyword()
                                                ]
                                            )
                                        )
                                    )
                                ]
                            )
                        )
                    )

                ]
            ),

        )
    )

};

interface ReactQueryHookQueryInterface {
    QueryClient: string;
    hookParamsTypeName: string;
    responseType: string;
    jsonschema: any;
}

export const createReactQueryHookInterface = ({
    QueryClient,
    hookParamsTypeName,
    responseType,
    jsonschema
}: ReactQueryHookQueryInterface) => {
    const body = [
        t.tsPropertySignature(
            t.identifier('client'),
            t.tsTypeAnnotation(
                t.tsTypeReference(
                    t.identifier(QueryClient)
                )
            )
        ),
        tsPropertySignature(
            t.identifier('options'),
            t.tsTypeAnnotation(
                t.tsTypeReference(
                    t.identifier('UseQueryOptions'),
                    t.tsTypeParameterInstantiation(
                        [
                            t.tsTypeReference(
                                t.identifier(responseType)
                            ),
                            t.tsTypeReference(t.identifier('Error')),
                            t.tsTypeReference(
                                t.identifier(responseType)
                            ),
                            t.tsArrayType(
                                t.tsParenthesizedType(
                                    t.tsUnionType(
                                        [
                                            t.tsStringKeyword(),
                                            t.tsUndefinedKeyword()
                                        ]
                                    )
                                )
                            )
                        ]
                    )
                )
            ),
            true
        )
    ];

    const props = getProps(jsonschema, true);
    if (props.length) {
        body.push(t.tsPropertySignature(
            t.identifier('args'),
            t.tsTypeAnnotation(
                t.tsTypeLiteral(props)
            )
        ))
    }


    return t.exportNamedDeclaration(t.tsInterfaceDeclaration(
        t.identifier(hookParamsTypeName),
        null,
        [],
        t.tsInterfaceBody(
            body
        )
    ))

};

const getProps = (jsonschema, camelize) => {
    const keys = Object.keys(jsonschema.properties ?? {});
    if (!keys.length) return [];

    return keys.map(prop => {
        const { type, optional } = getPropertyType(jsonschema, prop);
        return propertySignature(
            camelize ? camel(prop) : prop,
            t.tsTypeAnnotation(
                type
            ),
            optional
        )
    });
}