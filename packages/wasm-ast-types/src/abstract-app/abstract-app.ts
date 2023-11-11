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
  accountClient: t.identifier('accountClient'),
  accountQueryClient: t.identifier('accountQueryClient')
};

const ABSTRACT_ACCOUNT_CLIENT = 'AbstractAccountClient';
const ABSTRACT_CLIENT = 'AbstractClient';
const ABSTRACT_QUERY_CLIENT = 'AbstractQueryClient';
const ABSTRACT_ACCOUNT_ID = 'AbstractAccountId';
const ABSTRACT_ACCOUNT_QUERY_CLIENT = 'AbstractAccountQueryClient';
const ADDRESS_GETTER_FN_NAME = 'getAddress';

function extractCamelcasedMethodParams(
  type: 'ExecuteMsg' | 'QueryMsg',
  jsonschema,
  underscoreName: string
) {
  const methadParams = Object.keys(
    jsonschema.properties[underscoreName]?.properties ?? {}
  );

  // the actual type of the ref
  const methodParam = t.identifier('params');
  methodParam.typeAnnotation = createExtractTypeAnnotation(
    underscoreName,
    type
  );

  const parameters = methadParams.length ? [methodParam] : [];
  return parameters;
}

/**
 * The address and connect methods in the interface.
 */
const staticQueryInterfaceMethods = (connectedAppClientName: string) => {
  return [
    t.tsPropertySignature(
      t.identifier('connectSigningClient'),
      t.tsTypeAnnotation(
        t.tsFunctionType(
          undefined,
          // params
          [
            identifier(
              'signingClient',
              t.tsTypeAnnotation(
                t.tsTypeReference(t.identifier('SigningCosmWasmClient'))
              )
            ),
            identifier('address', t.tsTypeAnnotation(t.tsStringKeyword()))
          ],
          // Return the connected app client
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier(connectedAppClientName))
          )
        )
      )
    ),
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
  context.addUtils(['SigningCosmWasmClient', ABSTRACT_QUERY_CLIENT]);

  const methods = getMessageProperties(queryMsg).map((jsonschema) => {
    const underscoreName = Object.keys(jsonschema.properties)[0];
    const methodName = camel(underscoreName);
    const responseType = getResponseType(context, underscoreName);
    const parameters = extractCamelcasedMethodParams(
      'QueryMsg',
      jsonschema,
      underscoreName
    );

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
          CLASS_VARS.accountQueryClient,
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier(ABSTRACT_ACCOUNT_QUERY_CLIENT))
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
const QUERY_APP_FN = t.classProperty(
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
                CLASS_VARS.accountQueryClient
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
                  t.stringLiteral('app')
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
    ABSTRACT_ACCOUNT_CLIENT,
    'ExecuteResult',
    'AppExecuteMsg',
    'AppExecuteMsgFactory'
  ]);

  const methods = getMessageProperties(executeMsg).map((jsonschema) => {
    const underscoreName = Object.keys(jsonschema.properties)[0];
    const methodName = camel(underscoreName);
    const parameters = extractCamelcasedMethodParams(
      'ExecuteMsg',
      jsonschema,
      underscoreName
    );

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
          CLASS_VARS.accountClient,
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier(ABSTRACT_ACCOUNT_CLIENT))
          )
        ),
        ...methods
      ])
    )
  );
};

const EXECUTE_APP_FN = t.classProperty(
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
            identifier(
              'moduleMsg',
              t.tsTypeAnnotation(
                t.tSTypeReference(
                  t.identifier('AppExecuteMsg'),
                  t.tsTypeParameterInstantiation([
                    t.tsTypeReference(t.identifier('ExecuteMsg'))
                  ])
                )
              )
            ),
            t.callExpression(
              t.memberExpression(
                t.identifier('AppExecuteMsgFactory'),
                t.identifier('executeApp')
              ),
              [t.identifier('msg')]
            )
          )
        ]),
        t.returnStatement(
          t.awaitExpression(
            t.callExpression(
              t.memberExpression(
                t.memberExpression(
                  t.memberExpression(
                    t.memberExpression(
                      t.thisExpression(),
                      t.identifier('accountClient')
                    ),
                    t.identifier('abstract')
                  ),
                  t.identifier('client')
                ),
                t.identifier('execute')
              ),
              [
                t.memberExpression(
                  t.memberExpression(
                    t.thisExpression(),

                    t.identifier('accountClient')
                  ),
                  t.identifier('sender')
                ),
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
                t.identifier('fee'),
                t.identifier('memo'),
                t.identifier('_funds')
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

export const createAppQueryClass = (
  context: RenderContext,
  _moduleName: string,
  className: string,
  implementsClassName: string,
  queryMsg: QueryMsg
): t.ExportNamedDeclaration => {
  const moduleName = pascal(_moduleName);

  context.addUtils([ABSTRACT_QUERY_CLIENT, ABSTRACT_ACCOUNT_QUERY_CLIENT]);

  const propertyNames = getMessageProperties(queryMsg)
    .map((method) => Object.keys(method.properties)?.[0])
    .filter(Boolean);

  const bindings = propertyNames.map(camel).map(bindMethod);

  const methods = getMessageProperties(queryMsg).map((schema) => {
    return createAppQueryMethod(context, moduleName, schema);
  });

  methods.push(ADDRESS_ACCESSOR_FN);
  methods.push(
    connectSigningClientMethod(
      `${moduleName}${context.options.abstractApp?.clientPrefix ?? ''}Client`
    )
  );
  methods.push(QUERY_APP_FN);

  return t.exportNamedDeclaration(
    classDeclaration(
      className,
      [
        // client
        classProperty(
          'accountQueryClient',
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier(ABSTRACT_ACCOUNT_QUERY_CLIENT))
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
                'abstractQueryClient',
                t.tsTypeAnnotation(
                  t.tsTypeReference(t.identifier(ABSTRACT_QUERY_CLIENT))
                )
              ),
              shorthandProperty(
                'accountId',
                t.tsTypeAnnotation(
                  t.tsTypeReference(t.identifier(ABSTRACT_ACCOUNT_ID))
                )
              ),
              shorthandProperty(
                'managerAddress',
                t.tsTypeAnnotation(t.tsStringKeyword())
              ),
              shorthandProperty(
                'proxyAddress',
                t.tsTypeAnnotation(t.tsStringKeyword())
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
                  CLASS_VARS.accountQueryClient
                ),
                t.newExpression(t.identifier(ABSTRACT_ACCOUNT_QUERY_CLIENT), [
                  t.objectExpression([
                    t.objectProperty(
                      t.identifier('abstract'),
                      t.identifier('abstractQueryClient'),
                      false,
                      true
                    ),
                    shorthandProperty('accountId'),
                    shorthandProperty('managerAddress'),
                    shorthandProperty('proxyAddress')
                  ])
                ])
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
                        CLASS_VARS.accountQueryClient
                      ),
                      t.identifier('getModuleAddress')
                    ),
                    [
                      t.memberExpression(
                        t.thisExpression(),
                        t.identifier('moduleId')
                      )
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


const connectSigningClientMethod = (mutClientName: string) => {
  return t.classProperty(
    t.identifier('connectSigningClient'),
    arrowFunctionExpression(
      [
        identifier(
          'signingClient',
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier('SigningCosmWasmClient'))
          )
        ),
        identifier('address', t.tsTypeAnnotation(t.tsStringKeyword()))
      ],
      t.blockStatement([
        t.returnStatement(
          t.newExpression(t.identifier(mutClientName), [
            t.objectExpression([
              t.objectProperty(
                t.identifier('accountId'),
                t.memberExpression(
                  t.memberExpression(
                    t.thisExpression(),
                    CLASS_VARS.accountQueryClient
                  ),
                  t.identifier('accountId')
                )
              ),
              t.objectProperty(
                t.identifier('managerAddress'),
                t.memberExpression(
                  t.memberExpression(
                    t.thisExpression(),
                    CLASS_VARS.accountQueryClient
                  ),
                  t.identifier('managerAddress')
                )
              ),
              t.objectProperty(
                t.identifier('proxyAddress'),
                t.memberExpression(
                  t.memberExpression(
                    t.thisExpression(),
                    CLASS_VARS.accountQueryClient
                  ),
                  t.identifier('proxyAddress')
                )
              ),
              t.objectProperty(
                t.identifier('moduleId'),
                t.memberExpression(t.thisExpression(), t.identifier('moduleId'))
              ),
              t.objectProperty(
                t.identifier('abstractClient'),
                t.callExpression(
                  t.memberExpression(
                    t.memberExpression(
                      t.memberExpression(
                        t.thisExpression(),
                        CLASS_VARS.accountQueryClient
                      ),
                      t.identifier('abstract')
                    ),
                    t.identifier('connectSigningClient')
                  ),
                  [t.identifier('signingClient'), t.identifier('address')]
                )
              )
            ])
          ])
        )
      ]),
      t.tsTypeAnnotation(t.tsTypeReference(t.identifier(mutClientName)))
    )
  );
};

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

  const parameters = extractCamelcasedMethodParams(
    'QueryMsg',
    schema,
    underscoreName
  );

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

  context.addUtils([
    ABSTRACT_ACCOUNT_CLIENT,
    'StdFee',
    'Coin',
    ABSTRACT_CLIENT,
    ABSTRACT_ACCOUNT_ID
  ]);

  const propertyNames = getMessageProperties(execMsg)
    .map((method) => Object.keys(method.properties)?.[0])
    .filter(Boolean);

  const bindings = propertyNames.map(camel).map(bindMethod);

  const methods = getMessageProperties(execMsg).map((schema) => {
    return createAppExecMethod(context, moduleName, schema);
  });

  methods.push(EXECUTE_APP_FN);

  return t.exportNamedDeclaration(
    classDeclaration(
      className,
      [
        // client
        classProperty(
          'accountClient',
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier(ABSTRACT_ACCOUNT_CLIENT))
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
                'abstractClient',
                t.tsTypeAnnotation(
                  t.tsTypeReference(t.identifier(ABSTRACT_CLIENT))
                )
              ),
              shorthandProperty(
                'accountId',
                t.tsTypeAnnotation(
                  t.tsTypeReference(t.identifier(ABSTRACT_ACCOUNT_ID))
                )
              ),
              shorthandProperty(
                'managerAddress',
                t.tsTypeAnnotation(t.tsStringKeyword())
              ),
              shorthandProperty(
                'proxyAddress',
                t.tsTypeAnnotation(t.tsStringKeyword())
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
                  t.objectProperty(
                    identifier('abstractQueryClient', undefined),
                    t.identifier('abstractClient'),
                    false,
                    true
                  ),
                  shorthandProperty('accountId'),
                  shorthandProperty('managerAddress'),
                  shorthandProperty('proxyAddress'),
                  shorthandProperty('moduleId')
                ])
              ])
            ),
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(
                  t.thisExpression(),
                  CLASS_VARS.accountClient
                ),
                t.callExpression(
                  t.memberExpression(
                    t.identifier(ABSTRACT_ACCOUNT_CLIENT),
                    t.identifier('fromQueryClient')
                  ),
                  [
                    t.memberExpression(
                      t.thisExpression(),
                      CLASS_VARS.accountQueryClient
                    ),
                    t.identifier('abstractClient')
                  ]
                )
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

  const methodParameters = extractCamelcasedMethodParams(
    'ExecuteMsg',
    schema,
    underscoreName
  );

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
  const obj = createTypedObjectParams(
    context,
    jsonschema.properties[underscoreName]
  );
  const args = getWasmMethodArgs(
    context,
    jsonschema.properties[underscoreName]
  );

  if (obj)
    obj.typeAnnotation = createExtractTypeAnnotation(underscoreName, msgTitle);

  return t.classProperty(
    t.identifier(methodName),
    arrowFunctionExpression(
      // params
      obj
        ? [
            // props
            obj
          ]
        : [],
      // body
      t.blockStatement([
        t.returnStatement(
          t.objectExpression([
            t.objectProperty(
              t.identifier(underscoreName),
              t.tsAsExpression(
                t.objectExpression(args),
                t.tsTypeReference(t.identifier('const'))
              )
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
