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

const tsPropertySignature = (
    key: t.Expression,
    typeAnnotation: t.TSTypeAnnotation,
    optional: boolean
) => {
    const obj = t.tsPropertySignature(key, typeAnnotation);
    obj.optional = optional;
    return obj
};

export const createReactQueryHook = () => {
    return t.exportNamedDeclaration(t.tsInterfaceDeclaration(
        t.identifier('Sg721CollectionInfoQuery'),
        null,
        [],
        t.tsInterfaceBody(
            [
                t.tsPropertySignature(
                    t.identifier('client'),
                    t.tsTypeAnnotation(
                        t.tsTypeReference(
                            t.identifier('Sg721QueryClient'),
                            t.tsTypeParameterInstantiation(
                                [
                                    t.tsTypeReference(
                                        t.identifier('CollectionInfoResponse')
                                    ),
                                    t.tsTypeReference(t.identifier('Error')),
                                    t.tsTypeReference(
                                        t.identifier('CollectionInfoResponse')
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
            ]
        )
    ))

};

