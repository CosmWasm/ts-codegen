import * as t from '@babel/types';
import { camel } from 'case';
import {
  arrowFunctionExpression,
  bindMethod,
  classDeclaration,
  classProperty,
  getMessageProperties,
  createExtractTypeAnnotation,
  OPTIONAL_FIXED_EXECUTE_PARAMS,
  OPTIONAL_FUNDS_PARAM,
  promiseTypeAnnotation,
  typedIdentifier
} from '../utils';

import { ExecuteMsg, JSONSchema, QueryMsg } from '../types';

import {
  createTypedObjectParams,
  getPropertyType,
  getResponseType,
  getType
} from '../utils/types';
import { RenderContext } from '../context';
import { identifier, propertySignature } from '../utils/babel';
import { FEE_PARAM, OPTIONAL_MEMO_PARAM } from '../utils/constants';

export const CONSTANT_EXEC_PARAMS = [
  t.assignmentPattern(FEE_PARAM, t.stringLiteral('auto')),
  OPTIONAL_MEMO_PARAM,
  OPTIONAL_FUNDS_PARAM
];

export const createWasmQueryMethod = (
  context: RenderContext,
  jsonschema: any
) => {
  const underscoreName = Object.keys(jsonschema.properties)[0];
  const methodName = camel(underscoreName);
  const responseType = getResponseType(context, underscoreName);

  const param = createTypedObjectParams(
    context,
    jsonschema.properties[underscoreName]
  );

  const args = getWasmMethodArgs(
    context,
    jsonschema.properties[underscoreName]
  );

  const msgAction = t.identifier(underscoreName);
  // If the param is an identifier, we can just use it as is
  const msgActionValue =
    param?.type === 'Identifier'
      ? t.identifier(param.name)
      : t.objectExpression(args);

  return t.classProperty(
    t.identifier(methodName),
    arrowFunctionExpression(
      param ? [param] : [],
      t.blockStatement([
        t.returnStatement(
          t.callExpression(
            t.memberExpression(
              t.memberExpression(t.thisExpression(), t.identifier('client')),
              t.identifier('queryContractSmart')
            ),
            [
              t.memberExpression(
                t.thisExpression(),
                t.identifier('contractAddress')
              ),
              t.objectExpression([t.objectProperty(msgAction, msgActionValue)])
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

export const createQueryClass = (
  context: RenderContext,
  className: string,
  implementsClassName: string,
  queryMsg: QueryMsg
) => {
  context.addUtil('CosmWasmClient');

  const propertyNames = getMessageProperties(queryMsg)
    .map((method) => Object.keys(method.properties)?.[0])
    .filter(Boolean);

  const bindings = propertyNames.map(camel).map(bindMethod);

  const methods = getMessageProperties(queryMsg).map((schema) => {
    return createWasmQueryMethod(context, schema);
  });

  return t.exportNamedDeclaration(
    classDeclaration(
      className,
      [
        // client
        classProperty(
          'client',
          t.tsTypeAnnotation(t.tsTypeReference(t.identifier('CosmWasmClient')))
        ),

        // contractAddress
        classProperty(
          'contractAddress',
          t.tsTypeAnnotation(t.tsStringKeyword())
        ),

        // constructor
        t.classMethod(
          'constructor',
          t.identifier('constructor'),
          [
            typedIdentifier(
              'client',
              t.tsTypeAnnotation(
                t.tsTypeReference(t.identifier('CosmWasmClient'))
              )
            ),
            typedIdentifier(
              'contractAddress',
              t.tsTypeAnnotation(t.tsStringKeyword())
            )
          ],
          t.blockStatement([
            // client/contract set
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(t.thisExpression(), t.identifier('client')),
                t.identifier('client')
              )
            ),
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(
                  t.thisExpression(),
                  t.identifier('contractAddress')
                ),
                t.identifier('contractAddress')
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

export const getWasmMethodArgs = (
  context: RenderContext,
  jsonschema: JSONSchema
) => {
  let keys = Object.keys(jsonschema.properties ?? {});

  // only 1 degree $ref-lookup
  if (!keys.length && jsonschema.$ref) {
    const obj = context.refLookup(jsonschema.$ref);
    // properties
    if (obj) {
      keys = Object.keys(obj.properties ?? {});
    }

    // tuple struct or otherwise, use the name of the reference
    if (!keys.length && obj?.oneOf) {
      // TODO????? ADAIR
    }
  }

  const args = keys.map((prop) => {
    return t.objectProperty(
      t.identifier(prop),
      t.identifier(camel(prop)),
      false,
      prop === camel(prop)
    );
  });

  return args;
};

export const createWasmExecMethod = (
  context: RenderContext,
  jsonschema: JSONSchema
) => {
  context.addUtil('ExecuteResult');
  context.addUtil('StdFee');
  context.addUtil('Coin');

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
  // If the param is an identifier, we can just use it as is
  const msgActionValue =
    param?.type === 'Identifier'
      ? t.identifier(param.name)
      : t.objectExpression(args);

  return t.classProperty(
    t.identifier(methodName),
    arrowFunctionExpression(
      param
        ? [
            // props
            param,
            ...CONSTANT_EXEC_PARAMS
          ]
        : CONSTANT_EXEC_PARAMS,
      t.blockStatement([
        t.returnStatement(
          t.awaitExpression(
            t.callExpression(
              t.memberExpression(
                t.memberExpression(t.thisExpression(), t.identifier('client')),
                t.identifier('execute')
              ),
              [
                t.memberExpression(t.thisExpression(), t.identifier('sender')),
                t.memberExpression(
                  t.thisExpression(),
                  t.identifier('contractAddress')
                ),
                t.objectExpression([
                  t.objectProperty(msgAction, msgActionValue)
                ]),
                t.identifier('fee'),
                t.identifier('memo'),
                t.identifier('_funds')
              ]
            )
          )
        )
      ]),
      // return type
      t.tsTypeAnnotation(
        t.tsTypeReference(
          t.identifier('Promise'),
          t.tsTypeParameterInstantiation([
            t.tSTypeReference(t.identifier('ExecuteResult'))
          ])
        )
      ),
      true
    )
  );
};

export const createExecuteClass = (
  context: RenderContext,
  className: string,
  implementsClassName: string,
  extendsClassName: string | null,
  execMsg: ExecuteMsg
) => {
  context.addUtil('SigningCosmWasmClient');

  const propertyNames = getMessageProperties(execMsg)
    .map((method) => Object.keys(method.properties)?.[0])
    .filter(Boolean);

  const bindings = propertyNames.map(camel).map(bindMethod);

  const methods = getMessageProperties(execMsg).map((schema) => {
    return createWasmExecMethod(context, schema);
  });

  const blockStmt = [];

  if (extendsClassName) {
    blockStmt.push(
      // super()
      t.expressionStatement(
        t.callExpression(t.super(), [
          t.identifier('client'),
          t.identifier('contractAddress')
        ])
      )
    );
  }

  [].push.apply(blockStmt, [
    // client/contract set
    t.expressionStatement(
      t.assignmentExpression(
        '=',
        t.memberExpression(t.thisExpression(), t.identifier('client')),
        t.identifier('client')
      )
    ),
    t.expressionStatement(
      t.assignmentExpression(
        '=',
        t.memberExpression(t.thisExpression(), t.identifier('sender')),
        t.identifier('sender')
      )
    ),
    t.expressionStatement(
      t.assignmentExpression(
        '=',
        t.memberExpression(t.thisExpression(), t.identifier('contractAddress')),
        t.identifier('contractAddress')
      )
    ),
    ...bindings
  ]);

  const noImplicitOverride =
    context.options.client.noImplicitOverride &&
    extendsClassName &&
    context.options.client.execExtendsQuery;

  return t.exportNamedDeclaration(
    classDeclaration(
      className,
      [
        // client
        classProperty(
          'client',
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier('SigningCosmWasmClient'))
          ),
          false,
          false,
          noImplicitOverride
        ),

        // sender
        classProperty('sender', t.tsTypeAnnotation(t.tsStringKeyword())),

        // contractAddress
        classProperty(
          'contractAddress',
          t.tsTypeAnnotation(t.tsStringKeyword()),
          false,
          false,
          noImplicitOverride
        ),

        // constructor
        t.classMethod(
          'constructor',
          t.identifier('constructor'),
          [
            typedIdentifier(
              'client',
              t.tsTypeAnnotation(
                t.tsTypeReference(t.identifier('SigningCosmWasmClient'))
              )
            ),
            typedIdentifier('sender', t.tsTypeAnnotation(t.tsStringKeyword())),
            typedIdentifier(
              'contractAddress',
              t.tsTypeAnnotation(t.tsStringKeyword())
            )
          ],
          t.blockStatement(blockStmt)
        ),
        ...methods
      ],
      [t.tSExpressionWithTypeArguments(t.identifier(implementsClassName))],
      extendsClassName ? t.identifier(extendsClassName) : null
    )
  );
};

export const createExecuteInterface = (
  context: RenderContext,
  className: string,
  extendsClassName: string | null,
  execMsg: ExecuteMsg
) => {
  const methods = getMessageProperties(execMsg).map((jsonschema) => {
    const underscoreName = Object.keys(jsonschema.properties)[0];
    const methodName = camel(underscoreName);
    return createPropertyFunctionWithObjectParamsForExec(
      context,
      methodName,
      'ExecuteResult',
      jsonschema.properties[underscoreName]
    );
  });

  const extendsAst = extendsClassName
    ? [t.tSExpressionWithTypeArguments(t.identifier(extendsClassName))]
    : [];

  return t.exportNamedDeclaration(
    t.tsInterfaceDeclaration(
      t.identifier(className),
      null,
      extendsAst,
      t.tSInterfaceBody([
        // contract address
        t.tSPropertySignature(
          t.identifier('contractAddress'),
          t.tsTypeAnnotation(t.tsStringKeyword())
        ),

        // contract address
        t.tSPropertySignature(
          t.identifier('sender'),
          t.tsTypeAnnotation(t.tsStringKeyword())
        ),

        ...methods
      ])
    )
  );
};

export const createPropertyFunctionWithExtractedParams = (
  context: RenderContext,
  methodName: string,
  responseType: string,
  msgTitle: string,
  jsonschema: JSONSchema
) => {
  const obj = createTypedObjectParams(context, jsonschema);

  if (obj) {
    // obj.typeAnnotation = createExtractTypeAnnotation(methodName, msgTitle)
  }

  const func = {
    type: 'TSFunctionType',
    typeAnnotation: promiseTypeAnnotation(responseType),
    parameters: []
  };

  return t.tSPropertySignature(
    t.identifier(methodName),
    t.tsTypeAnnotation(
      // @ts-ignore:next-line
      func
    )
  );
};

export const createPropertyFunctionWithObjectParams = (
  context: RenderContext,
  methodName: string,
  responseType: string,
  jsonschema: JSONSchema
) => {
  const obj = createTypedObjectParams(context, jsonschema);

  const func = {
    type: 'TSFunctionType',
    typeAnnotation: promiseTypeAnnotation(responseType),
    parameters: obj ? [obj] : []
  };

  return t.tSPropertySignature(
    t.identifier(methodName),
    t.tsTypeAnnotation(
      // @ts-ignore:next-line
      func
    )
  );
};

export const createPropertyFunctionWithObjectParamsForExec = (
  context: RenderContext,
  methodName: string,
  responseType: string,
  jsonschema: JSONSchema
) => {
  context.addUtil('Coin');

  const obj = createTypedObjectParams(context, jsonschema);

  const func = {
    type: 'TSFunctionType',
    typeAnnotation: promiseTypeAnnotation(responseType),
    parameters: obj
      ? [obj, ...OPTIONAL_FIXED_EXECUTE_PARAMS]
      : OPTIONAL_FIXED_EXECUTE_PARAMS
  };

  return t.tSPropertySignature(
    t.identifier(methodName),
    t.tsTypeAnnotation(
      // @ts-ignore:next-line
      func
    )
  );
};

export const createQueryInterface = (
  context: RenderContext,
  className: string,
  queryMsg: QueryMsg
) => {
  const methods = getMessageProperties(queryMsg).map((jsonschema) => {
    const underscoreName = Object.keys(jsonschema.properties)[0];
    const methodName = camel(underscoreName);
    const responseType = getResponseType(context, underscoreName);
    return createPropertyFunctionWithObjectParams(
      context,
      methodName,
      responseType,
      jsonschema.properties[underscoreName]
    );
  });

  return t.exportNamedDeclaration(
    t.tsInterfaceDeclaration(
      t.identifier(className),
      null,
      [],
      t.tSInterfaceBody([
        t.tSPropertySignature(
          t.identifier('contractAddress'),
          t.tsTypeAnnotation(t.tsStringKeyword())
        ),
        ...methods
      ])
    )
  );
};

export const createTypeOrInterface = (
  context: RenderContext,
  Type: string,
  jsonschema: JSONSchema
) => {
  if (jsonschema.type !== 'object') {
    if (!jsonschema.type) {
      return t.exportNamedDeclaration(
        t.tsTypeAliasDeclaration(
          t.identifier(Type),
          null,
          t.tsTypeReference(t.identifier(jsonschema.title))
        )
      );
    }

    return t.exportNamedDeclaration(
      t.tsTypeAliasDeclaration(
        t.identifier(Type),
        null,
        getType(jsonschema.type)
      )
    );
  }
  const props = Object.keys(jsonschema.properties ?? {}).map((prop) => {
    const { type, optional } = getPropertyType(context, jsonschema, prop);
    return propertySignature(camel(prop), t.tsTypeAnnotation(type), optional);
  });

  return t.exportNamedDeclaration(
    t.tsInterfaceDeclaration(
      t.identifier(Type),
      null,
      [],
      t.tsInterfaceBody(
        // @ts-ignore:next-line
        [...props]
      )
    )
  );
};

export const createTypeInterface = (
  context: RenderContext,
  jsonschema: JSONSchema
) => {
  const Type = jsonschema.title;
  return createTypeOrInterface(context, Type, jsonschema);
};
