import { RenderContext } from '../context';
import * as t from '@babel/types';
import {
  createExtractTypeAnnotation,
  createTypedObjectParams,
  getMessageProperties,
  getResponseType,
  identifier,
  shorthandProperty,
  tsObjectPattern
} from '../utils';
import { camel } from 'case';
import { ExecuteMsg, QueryMsg } from '../types';
import { getWasmMethodArgs } from '../client';

/**
 * Create a react-query factory for use in queries.
 * @param context
 * @param moduleName
 * @param queryMsg
 * @param isAbstractApp
 * @todo get rid of `isAbtsractApp` in favor of context option
 */
export function createQueryOptionsFactory(
  context: RenderContext,
  moduleName: string,
  queryMsg: QueryMsg,
  isAbstractApp: boolean
) {
  context.addUtil('createQueryKeys');

  const queryKeys = getMessageProperties(queryMsg).map((schema) => {
    return createQueryOptions(context, schema, isAbstractApp);
  });

  return t.exportNamedDeclaration(
    t.variableDeclaration('const', [
      t.variableDeclarator(
        t.identifier(`${camel(moduleName)}Queries`),
        t.callExpression(t.identifier('createQueryKeys'), [
          t.stringLiteral(moduleName),
          t.objectExpression(queryKeys)
        ])
      )
    ])
  );
}

/**
 * Query keys for Abstract app modules
 */
const ABSTRACT_APP_QUERY_KEYS = t.objectExpression([
  // Abstract account Id
  t.objectProperty(
    t.identifier('accountId'),
    t.memberExpression(
      t.memberExpression(
        t.identifier('queryClient'),
        t.identifier('accountQueryClient'),
        false
      ),
      t.identifier('accountId'),
      false
    )
  ),
  // Abstract module Id
  t.objectProperty(
    t.identifier('moduleId'),
    t.memberExpression(
      t.identifier('queryClient'),
      t.identifier('moduleId'),
      false
    )
  )
]);

/**
 * Query keys for Abstract app modules
 */
const CONTRACT_QUERY_CLIENT_KEYS = t.objectExpression([
  // Contract address
  t.objectProperty(
    t.identifier('address'),
    t.memberExpression(
      t.identifier('queryClient'),
      t.identifier('contractAddress'),
      false
    )
  )
]);

/**
 * Generate the query options for the query client.
 * @param context
 * @param jsonschema
 * @param isAbstractApp
 * TODO: get rid of isAbstractApp in favor of context option
 */
const createQueryOptions = (
  context: RenderContext,
  jsonschema: any,
  isAbstractApp: boolean
) => {
  const underscoreName = Object.keys(jsonschema.properties)[0];
  const methodName = camel(underscoreName);

  let param = createTypedObjectParams(
    context,
    jsonschema.properties[underscoreName]
  );

  // TODO: this is a hack to get the type annotation to work
  // all type annotations in the future should be the extracted and camelized type
  if (
    param &&
    param.typeAnnotation.type === 'TSTypeAnnotation' &&
    param.typeAnnotation.typeAnnotation.type === 'TSTypeLiteral'
  ) {
    param = t.identifier('params');
    param.typeAnnotation = createExtractTypeAnnotation(
      underscoreName,
      'QueryMsg'
    );
  }

  return t.objectProperty(
    t.identifier(methodName),
    t.arrowFunctionExpression(
      [
        identifier(
          'queryClient',
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier('AutocompounderQueryClient'))
          )
        ),
        ...(param ? [param] : [])
      ],
      t.objectExpression([
        t.objectProperty(
          t.identifier('queryKey'),
          t.arrayExpression([
            isAbstractApp
              ? ABSTRACT_APP_QUERY_KEYS
              : CONTRACT_QUERY_CLIENT_KEYS,
            ...(param ? [t.identifier('params')] : [])
          ])
        ),
        t.objectProperty(
          t.identifier('queryFn'),
          t.arrowFunctionExpression(
            [t.identifier('ctx')],
            t.callExpression(
              t.memberExpression(
                t.identifier('queryClient'),
                t.identifier(methodName),
                false
              ),
              param ? [t.identifier('params')] : []
            )
          )
        )
      ])
    )
  );
};
