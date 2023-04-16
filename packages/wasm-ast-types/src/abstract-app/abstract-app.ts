import * as t from '@babel/types';
import { camel, pascal } from 'case';
import {
  abstractClassDeclaration,
  arrowFunctionExpression,
  bindMethod,
  classDeclaration,
  classProperty,
  createExtractTypeAnnotation,
  getMessageProperties,
  getResponseType,
  identifier,
  promiseTypeAnnotation,
  shorthandProperty
} from '../utils';
import { ExecuteMsg, QueryMsg } from '../types';
import { createTypedObjectParams } from '../utils/types';
import { RenderContext } from '../context';
import { getWasmMethodArgs } from '../client/client';

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
    abstractClassDeclaration(className, staticMethods, [], null)
  );
};

const classVariables = {
  moduleId: t.identifier('moduleId'),
  queryClient: t.identifier('queryClient')
};

const ABSTRACT_QUERY_CLIENT = 'AbstractQueryClient';
const ABSTRACT_ACCOUNT_QUERY_CLIENT = 'AbstractAccountQueryClient';

function extractCamelcasedQueryParams(jsonschema, underscoreName: string) {
  const queryParams = Object.keys(
    jsonschema.properties[underscoreName]?.properties ?? {}
  );

  // the actual type of the ref
  const methodParam = t.identifier('params');
  methodParam.typeAnnotation = createExtractTypeAnnotation(
    underscoreName,
    'QueryMsg'
  );

  const parameters = queryParams.length ? [methodParam] : [];
  return parameters;
}

/**
 * The address and connect methods in the interface.
 */
const staticInterfaceMethods = () => {
  return [
    t.tsPropertySignature(
      t.identifier('connect'),
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
          // Return
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier('ConnectedVaultManager'))
          )
        )
      )
    ),
    t.tsPropertySignature(
      t.identifier('address'),
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

export const createAppQueryInterface = (
  context: RenderContext,
  className: string,
  queryMsg: QueryMsg
) => {
  const methods = getMessageProperties(queryMsg).map((jsonschema) => {
    const underscoreName = Object.keys(jsonschema.properties)[0];
    const methodName = camel(underscoreName);
    const responseType = getResponseType(context, underscoreName);
    const parameters = extractCamelcasedQueryParams(jsonschema, underscoreName);

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
      t.identifier(className),
      null,
      [],
      t.tSInterfaceBody([
        t.tSPropertySignature(
          classVariables.moduleId,
          t.tsTypeAnnotation(t.tsStringKeyword())
        ),
        t.tSPropertySignature(
          classVariables.queryClient,
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier(ABSTRACT_QUERY_CLIENT))
          )
        ),
        ...methods,
        ...staticInterfaceMethods()
      ])
    )
  );
};

const QUERY_APP_FN = t.classProperty(
  t.identifier('queryApp'),
  t.arrowFunctionExpression(
    [t.identifier('queryMsg')],
    t.blockStatement(
      [
        t.returnStatement(
          t.callExpression(
            t.memberExpression(
              t.memberExpression(
                t.thisExpression(),
                classVariables.queryClient
              ),
              t.identifier('queryModule')
            ),
            [
              t.objectExpression([
                t.objectProperty(
                  t.identifier('moduleId'),
                  t.memberExpression(
                    t.thisExpression(),
                    classVariables.moduleId
                  )
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
    false
  ),
  promiseTypeAnnotation('JsonObject'),
  [t.decorator(t.identifier('private'))]
);

export const createAppQueryClass = (
  context: RenderContext,
  _moduleName: string,
  className: string,
  implementsClassName: string,
  queryMsg: QueryMsg
) => {
  const moduleName = pascal(_moduleName);

  const msgBuilderName = `${moduleName}MsgBuilder`;
  context.addUtil(ABSTRACT_QUERY_CLIENT);
  context.addUtil(ABSTRACT_ACCOUNT_QUERY_CLIENT);
  context.addUtil(msgBuilderName);

  const propertyNames = getMessageProperties(queryMsg)
    .map((method) => Object.keys(method.properties)?.[0])
    .filter(Boolean);

  const bindings = propertyNames.map(camel).map(bindMethod);

  const methods = getMessageProperties(queryMsg).map((schema) => {
    return createAppQueryMethod(context, moduleName, schema);
  });

  methods.push(QUERY_APP_FN);
  methods.push(ADDRESS_METHOD);
  methods.push(connectMethod(`${moduleName}Client`));

  return t.exportNamedDeclaration(
    classDeclaration(
      className,
      [
        // client
        classProperty(
          'queryClient',
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier(ABSTRACT_QUERY_CLIENT))
          )
        ),

        // moduleId
        classProperty('moduleId', t.tsTypeAnnotation(t.tsStringKeyword())),

        // constructor
        t.classMethod(
          'constructor',
          t.identifier('constructor'),
          [
            t.objectPattern([
              shorthandProperty('abstract'),
              shorthandProperty('accountId'),
              shorthandProperty('managerAddress'),
              shorthandProperty('proxyAddress'),
              shorthandProperty('moduleId')
            ])
          ],
          t.blockStatement([
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(
                  t.thisExpression(),
                  t.identifier('queryClient')
                ),
                t.newExpression(t.identifier(ABSTRACT_ACCOUNT_QUERY_CLIENT), [
                  t.objectExpression([
                    shorthandProperty('abstract'),
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

const ADDRESS_METHOD = t.classProperty(
  t.identifier('address'),
  t.arrowFunctionExpression(
    [],
    t.blockStatement([
      t.returnStatement(
        t.callExpression(
          t.memberExpression(
            t.memberExpression(t.thisExpression(), t.identifier('queryClient')),
            t.identifier('getModuleAddress')
          ),
          [t.memberExpression(t.thisExpression(), t.identifier('moduleId'))]
        )
      )
    ])
  ),
  t.tsTypeAnnotation(
    t.tsTypeReference(
      t.identifier('Promise'),
      t.tsTypeParameterInstantiation([t.tsStringKeyword()])
    )
  )
);

//       t.tsTypeAnnotation(t.tsTypeReference(t.identifier('VaultManager'))),
//       false,
const connectMethod = (mutClientName: string) => {
  return t.classProperty(
    t.identifier('connect'),
    t.arrowFunctionExpression(
      [t.identifier('signingClient'), t.identifier('address')],
      t.blockStatement([
        t.returnStatement(
          t.newExpression(t.identifier(mutClientName), [
            t.objectExpression([
              t.objectProperty(
                t.identifier('accountId'),
                t.memberExpression(
                  t.memberExpression(
                    t.thisExpression(),
                    t.identifier('queryClient')
                  ),
                  t.identifier('accountId')
                )
              ),
              t.objectProperty(
                t.identifier('managerAddress'),
                t.memberExpression(
                  t.memberExpression(
                    t.thisExpression(),
                    classVariables.queryClient
                  ),
                  t.identifier('managerAddress')
                )
              ),
              t.objectProperty(
                t.identifier('proxyAddress'),
                t.memberExpression(
                  t.memberExpression(
                    t.thisExpression(),
                    classVariables.queryClient
                  ),
                  t.identifier('proxyAddress')
                )
              ),
              t.objectProperty(
                t.identifier('abstract'),
                t.callExpression(
                  t.memberExpression(
                    t.memberExpression(
                      t.memberExpression(
                        t.thisExpression(),
                        classVariables.queryClient
                      ),
                      t.identifier('abstract')
                    ),
                    t.identifier('upgrade')
                  ),
                  [t.identifier('signingClient'), t.identifier('address')]
                )
              )
            ])
          ])
        )
      ])
    ),
    t.tsTypeAnnotation(t.tsTypeReference(t.identifier(mutClientName))),
    []
  );
};

/*
  public pendingClaims = async (
    params: ExtractCamelizedParams<AutocompounderQueryMsg, 'pending_claims'>
  ): Promise<Uint128> => {
    return this.queryApp(AutocompounderQueryMsgBuilder.pendingClaims(params))
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

  const parameters = extractCamelcasedQueryParams(schema, underscoreName);

  return t.classProperty(
    t.identifier(methodName),
    arrowFunctionExpression(
      parameters,
      t.blockStatement([
        t.returnStatement(
          t.callExpression(
            t.memberExpression(t.thisExpression(), t.identifier('queryApp')),
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
