import * as t from '@babel/types';
import { camel, pascal } from 'case';
import {
  abstractClassDeclaration,
  arrowFunctionExpression,
  bindMethod,
  classDeclaration,
  classProperty,
  getMessageProperties,
  getResponseType,
  shorthandProperty,
  typedIdentifier
} from '../utils';
import { ExecuteMsg, QueryMsg } from '../types';
import { createTypedObjectParams } from '../utils/types';
import { RenderContext } from '../context';
import { createWasmQueryMethod, getWasmMethodArgs } from '../client/client';

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
  queryClient: t.identifier('queryClient'),
};

const ABSTRACT_QUERY_CLIENT = 'AbstractQueryClient';

const ABSTRACT_ACCOUNT_QUERY_CLIENT = 'AbstractAccountQueryClient';
export const createReadOnlyAppManager = (
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

  methods.push(
    t.classProperty(
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
      t.tsTypeAnnotation(
        t.tsTypeReference(
          t.identifier('Promise'),
          t.tsTypeParameterInstantiation([
            t.tsTypeReference(t.identifier('JsonObject'))
          ])
        )
      ),
      [t.decorator(t.identifier('private'))]
    )
  );

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

  const parameters = queryParams.length ? [methodParam] : [];

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
      t.tsTypeAnnotation(
        t.tsTypeReference(
          t.identifier('Promise'),
          t.tsTypeParameterInstantiation([
            t.tSTypeReference(t.identifier(responseType))
          ])
        )
      ),
      true
    )
  );
};

/**
 * CamelCasedProperties<Extract<ExecuteMsg, { exec_on_module: unknown }>['exec_on_module']>
 */
function createExtractTypeAnnotation(underscoreName: string, msgTitle: string) {
  return t.tsTypeAnnotation(
    t.tsTypeReference(
      t.identifier('CamelCasedProperties'),
      t.tsTypeParameterInstantiation([
        t.tsIndexedAccessType(
          t.tsTypeReference(
            t.identifier('Extract'),
            t.tsTypeParameterInstantiation([
              t.tsTypeReference(t.identifier(msgTitle)),
              t.tsTypeLiteral([
                t.tsPropertySignature(
                  t.identifier(underscoreName),
                  t.tsTypeAnnotation(t.tsUnknownKeyword())
                )
              ])
            ])
          ),
          t.tsLiteralType(t.stringLiteral(underscoreName))
        )
      ])
    )
  );
}

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
