import * as t from '@babel/types';
import { ExportNamedDeclaration } from '@babel/types';
import { camel, pascal } from 'case';
import {
  abstractClassDeclaration,
  arrowFunctionExpression,
  autoTypedObjectPattern,
  bindMethod,
  classDeclaration,
  classProperty,
  createExtractTypeAnnotation,
  OPTIONAL_FIXED_EXECUTE_PARAMS,
  getMessageProperties,
  getResponseType,
  identifier,
  promiseTypeAnnotation,
  shorthandProperty
} from '../utils';
import { ExecuteMsg, QueryMsg } from '../types';
import { createTypedObjectParams } from '../utils/types';
import { RenderContext } from '../context';
import { CONSTANT_EXEC_PARAMS, getWasmMethodArgs } from '../client/client';
import { createQueryOptionsFactory } from './query-options-factory';
import { FIXED_EXECUTE_PARAMS } from '../../types';

type ModuleType = 'app' | 'adapter';

export const createAbstractAppClass = (
  context: RenderContext,
  className: string,
  msg: ExecuteMsg | QueryMsg
): t.ExportNamedDeclaration => {
  const staticMethods = getMessageProperties(msg).map((schema) => {
    return createStaticExecMethodMsgBuilder(context, schema, msg.title);
  });

  // const blockStmt = bindings;

  return t.exportNamedDeclaration(
    abstractClassDeclaration(
      className,
      staticMethods,
      [t.tSExpressionWithTypeArguments(t.identifier(`I${className}`))],
      null
    )
  );
};

export const createAbstractAppQueryFactory = (
  context: RenderContext,
  moduleName: string,
  msg: QueryMsg
): t.ExportNamedDeclaration => {
  return createQueryOptionsFactory(context, moduleName, msg, 'abstract-app');
};

const CLASS_VARS = {
  moduleId: t.identifier('moduleId'),
  _moduleAddress: t.identifier('_moduleAddress'),
  accountWalletClient: t.identifier('accountWalletClient'),
  accountPublicClient: t.identifier('accountPublicClient')
};

const ACCOUNT_WALLET_CLIENT = 'AccountWalletClient';
const ACCOUNT_PUBLIC_CLIENT = 'AccountPublicClient';
const ADDRESS_GETTER_FN_NAME = 'getAddress';

/**
 *
 * @param type
 * @param jsonschema
 * @param underscoreName
 * @returns
 */
function extractCamelcasedMethodParams(
  context: RenderContext,
  type: 'ExecuteMsg' | 'QueryMsg' | 'Object',
  jsonschema,
  underscoreName: string): Array<t.Identifier> {
  const msgSchema = jsonschema.properties[underscoreName];
  const methodParams = Object.keys(
    msgSchema?.properties ?? {}
  );

  // Logic duplicated from createTypedObjectParams
  if (!methodParams.length) {
    // is there a ref?
    if (msgSchema.$ref) {
      const obj = context.refLookup(msgSchema.$ref);
      // If there is a oneOf, then we need to create a type for it
      if (obj) {
        // the actual type of the ref
        const refType = msgSchema.$ref.split('/').pop();
        const refName = camel(refType);
        const id = t.identifier(refName);
        id.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(t.identifier(refType)));
        // return the parameter
        return [id];
      } else {
        console.error(`Could not find $ref for ${JSON.stringify(msgSchema)}, ${JSON.stringify(context.schema)}`);
        return []
      }
    }
  }

    // the actual type of the ref
    const methodParam = t.identifier('params');
    methodParam.typeAnnotation = createExtractTypeAnnotation(
      underscoreName,
      type
    );

    const parameters = methodParams.length ? [methodParam] : [];
    return parameters;
  }

  /**
   * The address and connect methods in the interface.
   */
  const staticQueryInterfaceMethods = (connectedAppClientName: string) => {
    return [
      t.tsPropertySignature(
        t.identifier(ADDRESS_GETTER_FN_NAME),
        t.tsTypeAnnotation(
          t.tsFunctionType(
            undefined,
            [],
            // return
            promiseTypeAnnotation('string')
          )
        )
      )
    ];
  };

  // TODO: there might not be any execute methods, in which case we wouldn't need the connect method
  export const createAppQueryInterface = (
    context: RenderContext,
    interfaceClassName: string,
    mutClassName: string,
    queryMsg: QueryMsg
  ) => {
    context.addUtils(['SigningCosmWasmClient', ACCOUNT_PUBLIC_CLIENT]);

    const methods = getMessageProperties(queryMsg).map((jsonschema) => {
      const underscoreName = Object.keys(jsonschema.properties)[0];
      const methodName = camel(underscoreName);
      const responseType = getResponseType(context, underscoreName);
      const parameters = extractCamelcasedMethodParams(context, 'QueryMsg', jsonschema, underscoreName);

      const func = {
        type: 'TSFunctionType',
        typeAnnotation: promiseTypeAnnotation(responseType),
        parameters
      };

      return t.tSPropertySignature(
        t.identifier(methodName),
        // @ts-ignore
        t.tsTypeAnnotation(func)
      );
    });

    return t.exportNamedDeclaration(
      t.tsInterfaceDeclaration(
        t.identifier(interfaceClassName),
        null,
        [],
        t.tSInterfaceBody([
          t.tSPropertySignature(
            CLASS_VARS.moduleId,
            t.tsTypeAnnotation(t.tsStringKeyword())
          ),
          t.tSPropertySignature(
            CLASS_VARS.accountPublicClient,
            t.tsTypeAnnotation(
              t.tsTypeReference(t.identifier(ACCOUNT_PUBLIC_CLIENT))
            )
          ),
          t.tSPropertySignature(
            CLASS_VARS._moduleAddress,
            t.tsTypeAnnotation(
              t.tsUnionType([t.tsStringKeyword(), t.tsUndefinedKeyword()])
            )
          ),
          ...methods,
          ...staticQueryInterfaceMethods(mutClassName)
        ])
      )
    );
  };

  // TODO: private
  const QUERY_APP_FN = (moduleType: ModuleType | undefined) => t.classProperty(
    t.identifier('_query'),
    arrowFunctionExpression(
      [
        identifier(
          'queryMsg',
          t.tsTypeAnnotation(t.tsTypeReference(t.identifier('QueryMsg')))
        )
      ],
      t.blockStatement(
        [
          t.returnStatement(
            t.callExpression(
              t.memberExpression(
                t.memberExpression(
                  t.thisExpression(),
                  CLASS_VARS.accountPublicClient
                ),
                t.identifier('queryModule')
              ),
              [
                t.objectExpression([
                  t.objectProperty(
                    t.identifier('moduleId'),
                    t.memberExpression(t.thisExpression(), CLASS_VARS.moduleId)
                  ),
                  t.objectProperty(
                    t.identifier('moduleType'),
                    t.stringLiteral(moduleType ?? 'app')
                  ),
                  shorthandProperty('queryMsg')
                ])
              ]
            )
          )
        ],
        []
      ),
      // TODO: better than any
      promiseTypeAnnotation('any'),
      true
    )
  );

  export const createAppExecuteInterface = (
    context: RenderContext,
    interfaceClassName: string,
    mutClassName: string,
    extendsClassName,
    executeMsg: ExecuteMsg
  ): t.ExportNamedDeclaration => {
    context.addUtils([
      'SigningCosmWasmClient',
      ACCOUNT_WALLET_CLIENT,
      'ExecuteResult',
      'AppExecuteMsg',
      'AppExecuteMsgFactory',
      'AdapterExecuteMsg',
      'AdapterExecuteMsgFactory'
    ]);


    const methods = getMessageProperties(executeMsg).map((jsonschema) => {
      const underscoreName = Object.keys(jsonschema.properties)[0];
      const methodName = camel(underscoreName);
      const parameters = extractCamelcasedMethodParams(context, 'ExecuteMsg', jsonschema, underscoreName);

      const func = {
        type: 'TSFunctionType',
        typeAnnotation: promiseTypeAnnotation('ExecuteResult'),
        parameters: parameters
          ? [...parameters, ...OPTIONAL_FIXED_EXECUTE_PARAMS]
          : OPTIONAL_FIXED_EXECUTE_PARAMS
      };

      return t.tSPropertySignature(
        t.identifier(methodName),
        // @ts-ignore
        t.tsTypeAnnotation(func)
      );
    });

    const extendsDeclaration = extendsClassName
      ? [t.tSExpressionWithTypeArguments(t.identifier(extendsClassName))]
      : [];

    return t.exportNamedDeclaration(
      t.tsInterfaceDeclaration(
        t.identifier(interfaceClassName),
        null,
        extendsDeclaration,
        t.tSInterfaceBody([
          t.tSPropertySignature(
            CLASS_VARS.accountWalletClient,
            t.tsTypeAnnotation(
              t.tsTypeReference(t.identifier(ACCOUNT_WALLET_CLIENT))
            )
          ),
          ...methods
        ])
      )
    );
  };

  const EXECUTE_APP_FN = (moduleType: ModuleType) => {
    const moduleMsgTypeName = moduleType === 'app' ? 'AppExecuteMsg' : 'AdapterExecuteMsg';
    const moduleMsgFactoryName = moduleType === 'app' ? 'AppExecuteMsgFactory' : 'AdapterExecuteMsgFactory';
    const moduleMsgExecName = moduleType === 'app' ? 'executeApp' : 'executeAdapter';
    const moduleMsgExecArgs = moduleType === 'app' ? t.identifier('msg') : t.objectExpression([
      t.objectProperty(t.identifier('request'), t.identifier('msg')),
      t.objectProperty(t.identifier('proxyAddress'), t.memberExpression(
        t.memberExpression(
          t.thisExpression(),
          CLASS_VARS.accountPublicClient
        ),
        t.identifier('proxyAddress')
      ))
    ])

    return t.classProperty(
      t.identifier('_execute'),
      arrowFunctionExpression(
        [
          identifier(
            'msg',
            t.tsTypeAnnotation(t.tsTypeReference(t.identifier('ExecuteMsg')))
          ),
          ...CONSTANT_EXEC_PARAMS
        ],
        t.blockStatement(
          [
            t.variableDeclaration('const', [
              t.variableDeclarator(
                t.identifier('signingCwClient'),
                t.awaitExpression(
                  t.callExpression(
                    t.memberExpression(
                      t.memberExpression(
                        t.thisExpression(),
                        CLASS_VARS.accountWalletClient
                      ),
                      t.identifier('getSigningCosmWasmClient')
                    ),
                    []
                  )
                )
              )
            ]),
            t.variableDeclaration('const', [
              t.variableDeclarator(
                t.identifier('sender'),
                t.awaitExpression(
                  t.callExpression(
                    t.memberExpression(
                      t.memberExpression(
                        t.thisExpression(),
                        CLASS_VARS.accountWalletClient
                      ),
                      t.identifier('getSenderAddress')
                    ),
                    []
                  )
                )
              )
            ]),
            t.variableDeclaration('const', [
              t.variableDeclarator(
                identifier(
                  'moduleMsg',
                  t.tsTypeAnnotation(
                    t.tSTypeReference(
                      t.identifier(moduleMsgTypeName),
                      t.tsTypeParameterInstantiation([
                        t.tsTypeReference(t.identifier('ExecuteMsg'))
                      ])
                    )
                  )
                ),
                t.callExpression(
                  t.memberExpression(
                    t.identifier(moduleMsgFactoryName),
                    t.identifier(moduleMsgExecName)
                  ),
                  [moduleMsgExecArgs]
                )
              )
            ]),
            t.returnStatement(
              t.awaitExpression(
                t.callExpression(
                  t.memberExpression(
                    t.identifier('signingCwClient'),
                    t.identifier('execute')
                  ),
                  [
                    t.identifier('sender'),
                    // get this module address
                    t.awaitExpression(
                      t.callExpression(
                        t.memberExpression(
                          t.thisExpression(),
                          t.identifier(ADDRESS_GETTER_FN_NAME)
                        ),
                        []
                      )
                    ),
                    t.identifier('moduleMsg'),
                    t.identifier('fee_'),
                    t.identifier('memo_'),
                    t.identifier('funds_')
                  ]
                )
              )
            )
          ],
          []
        ),
        // return
        promiseTypeAnnotation('ExecuteResult'),
        // async
        true
      )
    );
  }

  export const createAppQueryClass = (
    context: RenderContext,
    _moduleName: string,
    className: string,
    implementsClassName: string,
    queryMsg: QueryMsg
  ): t.ExportNamedDeclaration => {
    const moduleName = pascal(_moduleName);

    context.addUtils([ACCOUNT_PUBLIC_CLIENT, ACCOUNT_WALLET_CLIENT]);

    const propertyNames = getMessageProperties(queryMsg)
      .map((method) => Object.keys(method.properties)?.[0])
      .filter(Boolean);

    const bindings = propertyNames.map(camel).map(bindMethod);

    const methods = getMessageProperties(queryMsg).map((schema) => {
      return createAppQueryMethod(context, moduleName, schema);
    });

    methods.push(ADDRESS_ACCESSOR_FN);
    methods.push(QUERY_APP_FN(context.options.abstractApp.moduleType));

    return t.exportNamedDeclaration(
      classDeclaration(
        className,
        [
          // client
          classProperty(
            'accountPublicClient',
            t.tsTypeAnnotation(
              t.tsTypeReference(t.identifier(ACCOUNT_PUBLIC_CLIENT))
            )
          ),

          // moduleId
          classProperty('moduleId', t.tsTypeAnnotation(t.tsStringKeyword())),

          // _moduleAddress
          {
            ...classProperty(
              '_moduleAddress',
              t.tsTypeAnnotation(
                t.tsUnionType([t.tsStringKeyword(), t.tsUndefinedKeyword()])
              )
            ),
            visibility: 'private'
          },

          // constructor
          t.classMethod(
            'constructor',
            t.identifier('constructor'),
            [
              autoTypedObjectPattern([
                shorthandProperty(
                  'accountPublicClient',
                  t.tsTypeAnnotation(
                    t.tsTypeReference(t.identifier(ACCOUNT_PUBLIC_CLIENT))
                  )
                ),
                shorthandProperty(
                  'moduleId',
                  t.tsTypeAnnotation(t.tsStringKeyword())
                )
              ])
            ],
            t.blockStatement([
              t.expressionStatement(
                t.assignmentExpression(
                  '=',
                  t.memberExpression(
                    t.thisExpression(),
                    CLASS_VARS.accountPublicClient
                  ),
                  t.identifier('accountPublicClient')
                )
              ),
              t.expressionStatement(
                t.assignmentExpression(
                  '=',
                  t.memberExpression(
                    t.thisExpression(),
                    t.identifier('moduleId')
                  ),
                  t.identifier('moduleId')
                )
              ),
              ...bindings
            ])
          ),

          ...methods
        ],
        [t.tSExpressionWithTypeArguments(t.identifier(implementsClassName))]
      )
    );
  };

  const ADDRESS_ACCESSOR_FN = t.classProperty(
    t.identifier(ADDRESS_GETTER_FN_NAME),
    arrowFunctionExpression(
      [],
      t.blockStatement([
        t.ifStatement(
          t.unaryExpression(
            '!',
            t.memberExpression(t.thisExpression(), CLASS_VARS._moduleAddress)
          ),
          t.blockStatement([
            t.variableDeclaration(
              'const',
              [
                t.variableDeclarator(
                  t.identifier('address'),
                  t.awaitExpression(
                    t.callExpression(
                      t.memberExpression(
                        t.memberExpression(
                          t.thisExpression(),
                          CLASS_VARS.accountPublicClient
                        ),
                        t.identifier('getModuleAddress')
                      ),
                      [
                        t.objectExpression([
                          t.objectProperty(
                            t.identifier('id'
                            ),
                            t.memberExpression(
                              t.thisExpression(),
                              t.identifier('moduleId')
                            )
                          )
                        ])
                      ]
                    )
                  )
                )
              ]
            ),
            t.ifStatement(
              t.binaryExpression(
                '===',
                t.identifier('address'),
                t.nullLiteral()
              ),
              t.blockStatement([
                t.throwStatement(
                  t.newExpression(
                    t.identifier('Error'),
                    [t.templateLiteral(
                      [
                        t.templateElement({ raw: 'Module ', cooked: 'Module ' }, false),
                        t.templateElement({ raw: ' not installed', cooked: ' not installed' }, true)
                      ],
                      [t.memberExpression(t.thisExpression(), t.identifier('moduleId'))]
                    )]
                  )
                )
              ])
            ),
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(t.thisExpression(), CLASS_VARS._moduleAddress),
                t.identifier('address')
              )
            )
          ])
        ),
        t.returnStatement(
          // The address must be available because we just retrieved it
          t.memberExpression(t.thisExpression(), t.identifier('_moduleAddress!'))
        )
      ]),
      promiseTypeAnnotation('string'),
      true
    )
  );


  /*
    public pendingClaims = async (
      params: ExtractCamelizedParams<AutocompounderQueryMsg, 'pending_claims'>
    ): Promise<Uint128> => {
      return this._query(AutocompounderQueryMsgBuilder.pendingClaims(params))
    }
   */
  const createAppQueryMethod = (
    context: RenderContext,
    moduleName: string,
    schema: any
  ) => {
    const underscoreName = Object.keys(schema.properties)[0];
    const methodName = camel(underscoreName);
    const responseType = getResponseType(context, underscoreName);

    const queryParams = Object.keys(
      schema.properties[underscoreName]?.properties ?? {}
    );

    // the actual type of the ref
    const methodParam = t.identifier('params');
    methodParam.typeAnnotation = createExtractTypeAnnotation(
      underscoreName,
      moduleName
    );

    const parameters = extractCamelcasedMethodParams(context, 'QueryMsg', schema, underscoreName);

    return t.classProperty(
      t.identifier(methodName),
      arrowFunctionExpression(
        parameters,
        t.blockStatement([
          t.returnStatement(
            t.callExpression(
              t.memberExpression(t.thisExpression(), t.identifier('_query')),
              [
                t.callExpression(
                  t.memberExpression(
                    t.identifier(`${moduleName}QueryMsgBuilder`),
                    t.identifier(methodName)
                  ),
                  parameters
                )
              ]
            )
          )
        ]),
        promiseTypeAnnotation(responseType),
        true
      )
    );
  };

  export const createAppExecuteClass = (
    context: RenderContext,
    uncheckedModuleName: string,
    className: string,
    implementsClassName: string,
    extendsClassName: string,
    execMsg: ExecuteMsg
  ): ExportNamedDeclaration => {
    const moduleName = pascal(uncheckedModuleName);
    const moduleType = context.options.abstractApp?.moduleType ?? 'app';

    context.addUtils([
      ACCOUNT_WALLET_CLIENT,
      'StdFee',
      'Coin',
    ]);

    const propertyNames = getMessageProperties(execMsg)
      .map((method) => Object.keys(method.properties)?.[0])
      .filter(Boolean);

    const bindings = propertyNames.map(camel).map(bindMethod);

    const methods = getMessageProperties(execMsg).map((schema) => {
      return createAppExecMethod(context, moduleName, schema);
    });

    methods.push(EXECUTE_APP_FN(moduleType));

    return t.exportNamedDeclaration(
      classDeclaration(
        className,
        [
          // client
          classProperty(
            'accountWalletClient',
            t.tsTypeAnnotation(
              t.tsTypeReference(t.identifier(ACCOUNT_WALLET_CLIENT))
            )
          ),
          // constructor
          t.classMethod(
            'constructor',
            t.identifier('constructor'),
            // TODO: typing
            [
              autoTypedObjectPattern([
                shorthandProperty(
                  'accountPublicClient',
                  t.tsTypeAnnotation(
                    t.tsTypeReference(t.identifier(ACCOUNT_PUBLIC_CLIENT))
                  )
                ),
                shorthandProperty(
                  'accountWalletClient',
                  t.tsTypeAnnotation(
                    t.tsTypeReference(t.identifier(ACCOUNT_WALLET_CLIENT))
                  )
                ),
                shorthandProperty(
                  'moduleId',
                  t.tsTypeAnnotation(t.tsStringKeyword())
                )
              ])
            ],
            t.blockStatement([
              t.expressionStatement(
                // TODO!
                t.callExpression(t.super(), [
                  t.objectExpression([
                    shorthandProperty('accountPublicClient'),
                    shorthandProperty('moduleId')
                  ])
                ])
              ),
              t.expressionStatement(
                t.assignmentExpression(
                  '=',
                  t.memberExpression(
                    t.thisExpression(),
                    CLASS_VARS.accountWalletClient
                  ),
                  t.identifier('accountWalletClient')
                )
              ),
              ...bindings
            ])
          ),
          ...methods
        ],
        [t.tSExpressionWithTypeArguments(t.identifier(implementsClassName))],
        extendsClassName ? t.identifier(extendsClassName) : null
      )
    );
  };

  /*
    deposit = async (params: CamelCasedProperties<Extract<ExecuteMsg, {
      deposit: unknown;
    }>["deposit"]>, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
      return this._execute(AutocompounderExecuteMsgBuilder.deposit(params), fee, memo, _funds);
    };
   */
  const createAppExecMethod = (
    context: RenderContext,
    moduleName: string,
    schema: any
  ) => {
    const underscoreName = Object.keys(schema.properties)[0];
    const methodName = camel(underscoreName);

    const execParams = Object.keys(
      schema.properties[underscoreName]?.properties ?? {}
    );

    // the actual type of the ref
    const methodParam = t.identifier('params');
    methodParam.typeAnnotation = createExtractTypeAnnotation(
      underscoreName,
      moduleName
    );

    const methodParameters = extractCamelcasedMethodParams(context, 'ExecuteMsg', schema, underscoreName);

    return t.classProperty(
      t.identifier(methodName),
      arrowFunctionExpression(
        methodParameters
          ? [...methodParameters, ...CONSTANT_EXEC_PARAMS]
          : CONSTANT_EXEC_PARAMS,
        t.blockStatement([
          t.returnStatement(
            t.callExpression(
              t.memberExpression(t.thisExpression(), t.identifier('_execute')),
              [
                t.callExpression(
                  t.memberExpression(
                    t.identifier(`${moduleName}ExecuteMsgBuilder`),
                    t.identifier(methodName)
                  ),
                  methodParameters
                ),
                ...OPTIONAL_FIXED_EXECUTE_PARAMS
              ]
            )
          )
        ]),
        promiseTypeAnnotation('ExecuteResult'),
        true
      )
    );
  };

  const createStaticExecMethodMsgBuilder = (
    context: RenderContext,
    jsonschema: any,
    msgTitle: string
  ) => {
    const underscoreName = Object.keys(jsonschema.properties)[0];
    const methodName = camel(underscoreName);
    const param = createTypedObjectParams(
      context,
      jsonschema.properties[underscoreName]
    );
    const args = getWasmMethodArgs(
      context,
      jsonschema.properties[underscoreName]
    );

    const msgAction = t.identifier(underscoreName);

    // what the underscore named property in the message is assigned to
    let msgActionValue: t.Expression
    if (param?.type === 'Identifier') {
      msgActionValue = t.identifier(param.name);
    } else {
      msgActionValue = t.tsAsExpression(t.objectExpression(args), t.tsTypeReference(t.identifier('const')));
    }

    if (param) {
      param.typeAnnotation = createExtractTypeAnnotation(underscoreName, msgTitle);
    }

    return t.classProperty(
      t.identifier(methodName),
      arrowFunctionExpression(
        // params
        param
          ? [
            // props
            param
          ]
          : [],
        // body
        t.blockStatement([
          t.returnStatement(
            t.objectExpression([
              t.objectProperty(
                msgAction,
                msgActionValue
              )
            ])
          )
        ]),
        // return type
        t.tsTypeAnnotation(t.tsTypeReference(t.identifier(msgTitle))),
        false
      ),
      null,
      null,
      false,
      // static
      true
    );
  };
