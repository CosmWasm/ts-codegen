import type { Expression } from '@babel/types';
import * as t from '@babel/types';
import { camel, pascal } from 'case';
import { ExecuteMsg, QueryMsg } from '../types';
import { callExpression, getMessageProperties, identifier, tsObjectPattern, tsPropertySignature } from '../utils';
import {
    omitTypeReference,
    optionalConditionalExpression,
    propertySignature,
    shorthandProperty,
    typeRefOrUnionWithUndefined
} from '../utils/babel';
import { getParamsTypeAnnotation, getPropertyType } from '../utils/types';
import { ReactQueryOptions, RenderContext } from '../context';
import { JSONSchema } from '../types';
import { FIXED_EXECUTE_PARAMS } from '../client';
import { ArgumentPlaceholder, JSXNamespacedName, SpreadElement } from '@babel/types';

interface ReactQueryHookQuery {
    context: RenderContext,
    hookName: string;
    hookParamsTypeName: string;
    hookKeyName: string;
    queryKeysName: string
    responseType: string;
    methodName: string;
    jsonschema: any;
}

interface ReactQueryHooks {
    context: RenderContext;
    queryMsg: QueryMsg;
    contractName: string;
    QueryClient: string;
}

export const createReactQueryHooks = ({
    context,
    queryMsg,
    contractName,
    QueryClient
}: ReactQueryHooks) => {
    const options = context.options.reactQuery;

  const genericQueryInterfaceName = `${pascal(contractName)}ReactQuery`;
  const underscoreNames: string[] = getMessageProperties(queryMsg).map((schema) => (Object.keys(schema.properties)[0]))

  const body = []

  const queryKeysName = `${camel(contractName)}QueryKeys`
  if (options.queryKeys) {
    body.push(
      createReactQueryKeys({
        context,
        queryKeysName,
        camelContractName: camel(contractName),
        underscoreNames,
      }))
  }

  body.push(
      createReactQueryHookGenericInterface({
        context,
        QueryClient,
        genericQueryInterfaceName,
      }))

    body.push(...getMessageProperties(queryMsg)
        .reduce((m, schema) => {
            // list_voters
            const underscoreName = Object.keys(schema.properties)[0];
            // listVoters
            const methodName = camel(underscoreName);
            // Cw3FlexMultisigListVotersQuery
            const hookParamsTypeName = `${pascal(contractName)}${pascal(methodName)}Query`;
            // useCw3FlexMultisigListVotersQuery
            const hookName = `use${hookParamsTypeName}`;
            // listVotersResponse
            const responseType = pascal(`${methodName}Response`);
            // cw3FlexMultisigListVoters
            const getterKey = camel(`${contractName}${pascal(methodName)}`);
            const jsonschema = schema.properties[underscoreName];
            return [
                createReactQueryHookInterface({
                    context,
                    hookParamsTypeName,
                    responseType,
                    queryInterfaceName: genericQueryInterfaceName,
                    QueryClient,
                    jsonschema,
                }),
                createReactQueryHook({
                    context,
                    methodName,
                    hookName,
                    hookParamsTypeName,
                    queryKeysName,
                    responseType,
                    hookKeyName: getterKey,
                    jsonschema
                }),
                ...m,
            ]
        }, [])
    );

    return body
};


export const createReactQueryHook = ({
    context,
    hookName,
    hookParamsTypeName,
    responseType,
    hookKeyName,
    queryKeysName,
    methodName,
    jsonschema
}: ReactQueryHookQuery) => {

    context.addUtil('useQuery');
    context.addUtil('UseQueryOptions');

    const options = context.options.reactQuery;
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
                                    generateUseQueryQueryKey({hookKeyName, queryKeysName, methodName, props, options }),
                                t.arrowFunctionExpression(
                                    [],
                                    optionalConditionalExpression(
                                        t.identifier('client'),
                                        t.callExpression(
                                            t.memberExpression(
                                                t.identifier('client'),
                                                t.identifier(methodName)
                                            ),
                                            args
                                        ),
                                        t.callExpression(
                                            t.memberExpression(
                                                t.identifier('Promise'),
                                                t.identifier('reject'),
                                            ),
                                            [
                                                t.newExpression(
                                                    t.identifier('Error'),
                                                    [
                                                        t.stringLiteral('Invalid client')
                                                    ]
                                                )
                                            ]
                                        ),
                                        options.optionalClient
                                    ),
                                    false
                                ),
                                options.optionalClient
                                    ? t.objectExpression([
                                        t.spreadElement(t.identifier('options')),
                                        t.objectProperty(
                                            t.identifier('enabled'),
                                            t.logicalExpression(
                                                '&&',
                                                t.unaryExpression(
                                                    '!',
                                                    t.unaryExpression('!', t.identifier('client'))
                                                ),
                                                t.conditionalExpression(
                                                    // explicitly check for undefined
                                                    t.binaryExpression(
                                                        '!=',
                                                        t.optionalMemberExpression(
                                                            t.identifier('options'),
                                                            t.identifier('enabled'),
                                                            false,
                                                            true
                                                        ),
                                                        t.identifier('undefined')
                                                    ),
                                                    t.memberExpression(
                                                        t.identifier('options'),
                                                        t.identifier('enabled')
                                                    ),
                                                    t.booleanLiteral(true)
                                                )

                                            )),
                                    ])
                                    : t.identifier('options'),
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

interface ReactQueryMutationHookInterface {
    context: RenderContext;
    ExecuteClient: string;
    mutationHookParamsTypeName: string;
    jsonschema: JSONSchema;
    useMutationTypeParameter: t.TSTypeParameterInstantiation;
}

/**
 * Example:
```
export interface Cw4UpdateMembersMutation {
  client: Cw4GroupClient
  args: {
    tokenId: string
    remove: string[]
  }
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, Pick<Cw4UpdateMembersMutation, 'args'>>,
    'mutationFn'
  >
}
```
 */
export const createReactQueryMutationArgsInterface = ({
    context,
    ExecuteClient,
    mutationHookParamsTypeName,
    useMutationTypeParameter,
    jsonschema,
}: ReactQueryMutationHookInterface) => {

    const typedUseMutationOptions = t.tsTypeReference(
        t.identifier('UseMutationOptions'),
        useMutationTypeParameter
    )

    const body = [
        tsPropertySignature(
            t.identifier('client'),
            t.tsTypeAnnotation(
                t.tsTypeReference(
                    t.identifier(ExecuteClient)
                )
            ),
            false
        ),
    ]

    const msgType: t.TSTypeAnnotation = getParamsTypeAnnotation(context, jsonschema)

    if (msgType) {
        body.push(
            t.tsPropertySignature(
                t.identifier('msg'),
                msgType
            ))
    }

    context.addUtil('StdFee')
    context.addUtil('Coin');
    //  fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]

    const optionalArgs = t.tsPropertySignature(
        t.identifier('args'),
        t.tsTypeAnnotation(
            // @ts-ignore:next-line
            t.tsTypeLiteral(FIXED_EXECUTE_PARAMS.map(param => propertySignature(
                param.name,
                // @ts-ignore:next-line
                param.typeAnnotation,
                param.optional
            )))
        )
    )

    optionalArgs.optional = true

    body.push(optionalArgs)


    return t.exportNamedDeclaration(t.tsInterfaceDeclaration(
        t.identifier(mutationHookParamsTypeName),
        null,
        [],
        t.tsInterfaceBody(
            body
        )
    ))
};


interface ReactQueryMutationHooks {
    context: RenderContext;
    execMsg: ExecuteMsg;
    contractName: string;
    ExecuteClient: string;
}

export const createReactQueryMutationHooks = ({
    context,
    execMsg,
    contractName,
    ExecuteClient
}: ReactQueryMutationHooks) => {
    // merge the user options with the defaults
    return getMessageProperties(execMsg)
        .reduce((m, schema) => {
            // update_members
            const execMethodUnderscoreName = Object.keys(schema.properties)[0];
            // updateMembers
            const execMethodName = camel(execMethodUnderscoreName);
            // Cw20UpdateMembersMutation
            const mutationHookParamsTypeName = `${pascal(contractName)}${pascal(execMethodName)}Mutation`;
            // useCw20UpdateMembersMutation
            const mutationHookName = `use${mutationHookParamsTypeName}`;

            const jsonschema = schema.properties[execMethodUnderscoreName];

            const properties = jsonschema.properties ?? {};

            // TODO: there should be a better way to do this
            const hasMsg = !!(Object.keys(properties)?.length || jsonschema?.$ref)

            // <ExecuteResult, Error, Cw4UpdateMembersMutation>
            const useMutationTypeParameter = generateMutationTypeParameter(
                context,
                mutationHookParamsTypeName
            );


            return [
                createReactQueryMutationArgsInterface({
                    context,
                    mutationHookParamsTypeName,
                    ExecuteClient,
                    jsonschema,
                    useMutationTypeParameter
                }),
                createReactQueryMutationHook({
                    context,
                    execMethodName,
                    mutationHookName,
                    mutationHookParamsTypeName,
                    hasMsg,
                    useMutationTypeParameter,
                }),
                ...m,
            ]
        }, []);
};

/**
 * Generates the mutation type parameter. If args exist, we use a pick. If not, we just return the params type.
 */
const generateMutationTypeParameter = (
    context: RenderContext,
    mutationHookParamsTypeName: string
) => {

    context.addUtil('ExecuteResult');

    return t.tsTypeParameterInstantiation([
        // Data
        t.tSTypeReference(
            t.identifier('ExecuteResult')
        ),
        // Error
        t.tsTypeReference(
            t.identifier('Error')
        ),
        // Variables
        t.tsTypeReference(
            t.identifier(mutationHookParamsTypeName)
        )
    ]);
}


interface ReactQueryMutationHook {
    context: RenderContext;
    mutationHookName: string;
    mutationHookParamsTypeName: string;
    execMethodName: string;
    useMutationTypeParameter: t.TSTypeParameterInstantiation;
    hasMsg: boolean;
}

/**
 *
 * Example:
```
export const useCw4UpdateMembersMutation = ({ client, options }: Omit<Cw4UpdateMembersMutation, 'args'>) =>
  useMutation<ExecuteResult, Error, Pick<Cw4UpdateMembersMutation, 'args'>>(
    ({ args }) => client.updateMembers(args),
    options
  )
```
 */
export const createReactQueryMutationHook = ({
    context,
    mutationHookName,
    mutationHookParamsTypeName,
    execMethodName,
    useMutationTypeParameter,
    hasMsg,
}: ReactQueryMutationHook) => {

    context.addUtil('useMutation');
    context.addUtil('UseMutationOptions');

    const useMutationFunctionArgs = [shorthandProperty('client')]
    if (hasMsg) useMutationFunctionArgs.push(shorthandProperty('msg'))
    useMutationFunctionArgs.push(
        t.objectProperty(
            t.identifier('args'),
            t.assignmentPattern(
                t.objectPattern(FIXED_EXECUTE_PARAMS.map(param => shorthandProperty(param.name))),
                t.objectExpression([])
            )
        )
    )

    return t.exportNamedDeclaration(
        t.functionDeclaration(
            t.identifier(mutationHookName),
            [
                identifier('options', t.tsTypeAnnotation(
                    omitTypeReference(
                        t.tsTypeReference(
                            t.identifier('UseMutationOptions'),
                            useMutationTypeParameter
                        ),
                        'mutationFn'
                    )
                ), true)
            ],
            t.blockStatement(
                [
                    t.returnStatement(
                        callExpression(
                            t.identifier('useMutation'),
                            [
                                t.arrowFunctionExpression(
                                    [t.objectPattern(useMutationFunctionArgs)],
                                    t.callExpression(
                                        t.memberExpression(
                                            t.identifier('client'),
                                            t.identifier(execMethodName)
                                        ),
                                        (hasMsg
                                            ? [t.identifier('msg')]
                                            : []
                                        )
                                            .concat(FIXED_EXECUTE_PARAMS.map(param => t.identifier(param.name)))
                                    ),
                                    false // not async
                                ),
                                t.identifier('options'),
                            ],
                            useMutationTypeParameter
                        )
                    )

                ]
            ),
        )
    )

};

function createReactQueryKeys({
  context,
  queryKeysName,
  camelContractName,
  underscoreNames
}: {
  context: RenderContext;
  queryKeysName: string,
  camelContractName: string;
  underscoreNames: string[];
}) {
  const options = context.options.reactQuery

  const contractAddressTypeAnnotation = t.tsTypeAnnotation(
    options.optionalClient
      ? t.tsUnionType([
        t.tsStringKeyword(),
        t.tsUndefinedKeyword()
      ])
      : t.tSStringKeyword()
  )

  return t.exportNamedDeclaration(
    t.variableDeclaration('const', [
      t.variableDeclarator(
        t.identifier(queryKeysName),
        t.objectExpression([
          // 1: contract
          t.objectProperty(
            t.identifier('contract'),
            t.tSAsExpression(
              t.arrayExpression([
                t.objectExpression([
                  t.objectProperty(
                    t.identifier('contract'),
                    t.stringLiteral(camelContractName)
                  )
                ])
              ]),
              t.tSTypeReference(t.identifier('const'))
            )
          ),
          // 2: address
          t.objectProperty(
            t.identifier('address'),
            t.arrowFunctionExpression(
              [
                identifier(
                  'contractAddress',
                  contractAddressTypeAnnotation
                )
              ],
              t.tSAsExpression(
                t.arrayExpression([
                  t.objectExpression([
                    // 1
                    t.spreadElement(
                      t.memberExpression(
                        t.memberExpression(
                          t.identifier(queryKeysName),
                          t.identifier('contract')
                        ),
                        t.numericLiteral(0),
                        true // computed
                      )
                    ),
                    t.objectProperty(
                      t.identifier('address'),
                      t.identifier('contractAddress')
                    )
                  ])
                ]),
                t.tSTypeReference(t.identifier('const'))
              )
            )
          ),
          // 3: methods
          ...underscoreNames.map((underscoreMethodName) =>
            t.objectProperty(
              // key id is the camel method name
              t.identifier(camel(underscoreMethodName)),
              t.arrowFunctionExpression(
                [
                  identifier(
                    'contractAddress',
                    contractAddressTypeAnnotation
                  ),
                  identifier(
                    'args',
                    // Record<string, unknown>
                    t.tSTypeAnnotation(
                      t.tsTypeReference(
                        t.identifier('Record'),
                        t.tsTypeParameterInstantiation([
                          t.tsStringKeyword(),
                          t.tsUnknownKeyword()
                        ])
                      )
                    ),
                    true // optional
                  )
                ],
                t.tSAsExpression(
                  t.arrayExpression([
                    t.objectExpression([
                      //...cw3FlexMultisigQueryKeys.address(contractAddress)[0]
                      t.spreadElement(
                        t.memberExpression(
                          t.callExpression(
                            t.memberExpression(
                              t.identifier(queryKeysName),
                              t.identifier('address')
                            ),
                            [t.identifier('contractAddress')]
                          ),
                          t.numericLiteral(0),
                          true // computed
                        )
                      ),
                      // method: list_voters
                      t.objectProperty(
                        t.identifier('method'),
                        t.stringLiteral(underscoreMethodName)
                      ),
                      // args
                      shorthandProperty('args')
                    ])
                  ]),
                  t.tSTypeReference(t.identifier('const'))
                )
              )
            )
          )
        ])
      )
    ])
  )
}

interface ReactQueryHookGenericInterface {
    context: RenderContext,
    QueryClient: string,
    genericQueryInterfaceName: string
}

function createReactQueryHookGenericInterface({
    context,
    QueryClient,
    genericQueryInterfaceName
}: ReactQueryHookGenericInterface) {

    const options = context.options.reactQuery;

    const genericTypeName = 'TResponse'

    context.addUtil('UseQueryOptions');

    const typedUseQueryOptions = t.tsTypeReference(
        t.identifier('UseQueryOptions'),
        t.tsTypeParameterInstantiation([
            t.tsTypeReference(
                t.identifier(genericTypeName)
            ),
            t.tsTypeReference(t.identifier('Error')),
            t.tsTypeReference(
                t.identifier(genericTypeName)
            )
        ])
    )

    const body = [
        tsPropertySignature(
            t.identifier('client'),
            t.tsTypeAnnotation(
                options.optionalClient
                    ? t.tsUnionType([
                        t.tsTypeReference(
                            t.identifier(QueryClient)
                        ),
                        t.tsUndefinedKeyword()
                    ])
                    : t.tsTypeReference(
                        t.identifier(QueryClient)
                    )
            ),
            false
        ),
        tsPropertySignature(
            t.identifier('options'),
            t.tsTypeAnnotation(
                options.version === 'v4'
                    ? t.tSIntersectionType([
                        omitTypeReference(typedUseQueryOptions, "'queryKey' | 'queryFn' | 'initialData'"),
                        t.tSTypeLiteral([
                            t.tsPropertySignature(
                                t.identifier('initialData?'),
                                t.tsTypeAnnotation(
                                    t.tsUndefinedKeyword()
                                )
                            )
                        ])
                    ])
                    : typedUseQueryOptions
            ),
            true
        )
    ];

    return t.exportNamedDeclaration(
        t.tsInterfaceDeclaration(
            t.identifier(genericQueryInterfaceName),
            t.tsTypeParameterDeclaration([
                t.tsTypeParameter(undefined, undefined, genericTypeName)
            ]),
            [],
            t.tSInterfaceBody(body)
        )
    )
}

interface ReactQueryHookQueryInterface {
    context: RenderContext,
    QueryClient: string;
    hookParamsTypeName: string;
    queryInterfaceName: string
    responseType: string;
    jsonschema: any;
}

export const createReactQueryHookInterface = ({
    context,
    QueryClient,
    hookParamsTypeName,
    queryInterfaceName,
    responseType,
    jsonschema
}: ReactQueryHookQueryInterface) => {
    // merge the user options with the defaults
    const options = context.options.reactQuery;

    const body = []

    const props = getProps(context, jsonschema);
    if (props.length) {
        body.push(t.tsPropertySignature(
            t.identifier('args'),
            t.tsTypeAnnotation(
                // @ts-ignore:next-line
                t.tsTypeLiteral(props)
            )
        ))
    }


    return t.exportNamedDeclaration(
        t.tsInterfaceDeclaration(
            t.identifier(hookParamsTypeName),
            null,
            [
                t.tSExpressionWithTypeArguments(
                    t.identifier(queryInterfaceName),
                    t.tsTypeParameterInstantiation([
                        t.tsTypeReference(t.identifier(responseType))
                    ])
                )
            ],
            t.tsInterfaceBody(
                body
            )
        )
    )
};

const getProps = (
    context: RenderContext,
    jsonschema: JSONSchema
) => {
    const keys = Object.keys(jsonschema.properties ?? {});
    if (!keys.length) return [];

    return keys.map(prop => {
        const { type, optional } = getPropertyType(context, jsonschema, prop);
        return propertySignature(
            context.options.reactQuery.camelize ? camel(prop) : prop,
            t.tsTypeAnnotation(
                type
            ),
            optional
        )
    });
}

interface GenerateUseQueryQueryKeyParams {
  hookKeyName: string;
  queryKeysName: string;
  methodName: string;
  props: string[];
  options: ReactQueryOptions;
}

const generateUseQueryQueryKey = ({
    hookKeyName,
    queryKeysName,
    methodName,
    props,
    options,
  }: GenerateUseQueryQueryKeyParams): t.ArrayExpression | t.CallExpression => {
  const { optionalClient, queryKeys } = options

  const hasArgs = props.includes('args')

  const contractAddressExpression =
    t.optionalMemberExpression(
      t.identifier('client'),
      t.identifier('contractAddress'),
      false,
      optionalClient
    )

  if (queryKeys) {

    const callArgs: Array<Expression> = [contractAddressExpression]

    if (hasArgs) callArgs.push(t.identifier('args'))

    return t.callExpression(
      t.memberExpression(
        t.identifier(queryKeysName),
        t.identifier(camel(methodName))
      ),
      callArgs
    )
  }

    const queryKey: Array<Expression> = [
      t.stringLiteral(hookKeyName),
      contractAddressExpression
    ];

    if (hasArgs) {
        queryKey.push(t.callExpression(
            t.memberExpression(
                t.identifier('JSON'),
                t.identifier('stringify')
            ),
            [
                t.identifier('args')
            ]
        ))
    }
    return t.arrayExpression(queryKey)
}
