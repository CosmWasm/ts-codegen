import * as t from '@babel/types';
import { camel } from 'case';
import { abstractClassDeclaration, arrowFunctionExpression, getMessageProperties } from '../utils';
import { ExecuteMsg, QueryMsg } from '../types';
import { createTypedObjectParams } from '../utils/types';
import { RenderContext } from '../context';
import { getWasmMethodArgs } from '../client/client';
import { Expression, Identifier, PatternLike, TSAsExpression } from '@babel/types';

export const createMsgBuilderClass = (
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

/**
 * CamelCasedProperties<Extract<ExecuteMsg, { exec_on_module: unknown }>['exec_on_module']>
 */
function createExtractTypeAnnotation(underscoreName: string, msgTitle: string) {
  return t.tsTypeAnnotation(
    t.tsTypeReference(
      t.identifier('CamelCasedProperties'),
      t.tsTypeParameterInstantiation([
        t.tsIndexedAccessType(
          t.tsTypeReference(t.identifier('Extract'),
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
  const param = createTypedObjectParams(
    context,
    jsonschema.properties[underscoreName]
  );
  const args = getWasmMethodArgs(
    context,
    jsonschema.properties[underscoreName]
  );

  // what the underscore named property in the message is assigned to
  let actionValue: Expression
  if (param?.type === 'Identifier') {
    actionValue = t.identifier(param.name);
  } else {
    actionValue = t.tsAsExpression(t.objectExpression(args), t.tsTypeReference(t.identifier('const')));
  }


  // TODO: this is a hack to get the type annotation to work
  // all type annotations in the future should be the extracted and camelized type
  if (
    param &&
    param.typeAnnotation.type === 'TSTypeAnnotation' &&
    param.typeAnnotation.typeAnnotation.type === 'TSTypeLiteral'
  ) {
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
              t.identifier(underscoreName),
              actionValue
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
