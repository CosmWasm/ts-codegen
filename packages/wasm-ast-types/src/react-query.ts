import * as t from '@babel/types';
import { camel, pascal } from 'case';
import { QueryMsg } from './types';
import {
    tsPropertySignature,
    tsObjectPattern,
    callExpression,
    getMessageProperties
} from './utils'
import { propertySignature, getPropertyType } from './wasm';
interface ReactQueryHookQuery {
    hookName: string;
    hookParamsTypeName: string;
    hookKeyName: string;
    responseType: string;
    methodName: string;
    jsonschema: any;
}

export const createReactQueryHooks = (queryMsg: QueryMsg) => {
    return getMessageProperties(queryMsg)
        .reduce((m, schema) => {
            const underscoreName = Object.keys(schema.properties)[0];
            const methodName = camel(underscoreName);
            const hookName = camel(`${methodName}Query`);
            const hookParamsTypeName = camel(`${methodName}Interface`);
            const responseType = pascal(`${methodName}Response`);
            const getterKey = camel(`get${pascal(methodName)}`);
            const jsonschema = schema.properties[underscoreName];
            return [
                createReactQueryHookInterface({
                    hookParamsTypeName,
                    responseType,
                    QueryClient: 'Sg721QueryClient',
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


    return t.exportNamedDeclaration(
        t.functionDeclaration(
            t.identifier(hookName),
            [
                tsObjectPattern(
                    [
                        t.objectProperty(
                            t.identifier('client'),
                            t.identifier('client'),
                            false,
                            true
                        ),
                        t.objectProperty(
                            t.identifier('args'),
                            t.identifier('args'),
                            false,
                            true
                        ),
                        t.objectProperty(
                            t.identifier('options'),
                            t.identifier('options'),
                            false,
                            true
                        )
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
                                        [
                                            t.objectExpression(
                                                [
                                                    ...Object.keys(jsonschema.properties ?? {}).map(prop => {
                                                        return t.objectProperty(
                                                            t.identifier(camel(prop)),
                                                            t.memberExpression(
                                                                t.identifier('args'),
                                                                t.identifier(camel(prop))
                                                            )
                                                        )
                                                    })
                                                ]
                                            )
                                        ]
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
    return t.exportNamedDeclaration(t.tsInterfaceDeclaration(
        t.identifier(hookParamsTypeName),
        null,
        [],
        t.tsInterfaceBody(
            [
                t.tsPropertySignature(
                    t.identifier('client'),
                    t.tsTypeAnnotation(
                        t.tsTypeReference(
                            t.identifier(QueryClient),
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
                    )
                ),
                tsPropertySignature(
                    t.identifier('options'),
                    t.tsTypeAnnotation(
                        t.tsTypeReference(
                            t.identifier('UseQueryOptions')
                        )
                    ),
                    true
                ),
                t.tsPropertySignature(
                    t.identifier('args'),
                    t.tsTypeAnnotation(
                        t.tsTypeLiteral(getProps(jsonschema, true))
                    )
                )
            ]
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