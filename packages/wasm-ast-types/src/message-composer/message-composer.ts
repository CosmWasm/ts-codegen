import * as t from '@babel/types';
import { Expression } from '@babel/types';
import { camel } from 'case';
import {
  arrowFunctionExpression,
  bindMethod,
  classDeclaration,
  classProperty,
  getMessageProperties,
  identifier,
  OPTIONAL_FUNDS_PARAM,
  typedIdentifier
} from '../utils';
import { ExecuteMsg, JSONSchema } from '../types';
import { createTypedObjectParams } from '../utils/types';
import { RenderContext } from '../context';
import { getWasmMethodArgs } from '../client/client';

const ABSTRACT_MODULE_MSG = t.variableDeclaration('const', [
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
]);
const createWasmExecMethodMessageComposer = (
  context: RenderContext,
  jsonschema: any
) => {
  context.addUtils([
    'Coin',
    'MsgExecuteContractEncodeObject',
    'MsgExecuteContract',
    'toUtf8',
    'AppExecuteMsg',
    'AppExecuteMsgFactory'
  ]);

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

  const isAbstractApp = context.options.abstractApp?.enabled;

  const constantParams = [
    OPTIONAL_FUNDS_PARAM
  ];

  return t.classProperty(
    t.identifier(methodName),
    arrowFunctionExpression(
      obj
        ? [
            // props
            obj,
            ...constantParams
          ]
        : constantParams,
      t.blockStatement([
        // TODO: use msg-builder
        t.variableDeclaration('const', [
          t.variableDeclarator(
            t.identifier('msg'),
            t.objectExpression([
              t.objectProperty(
                t.identifier(underscoreName),
                t.objectExpression(args)
              )
            ])
          )
        ]),
        ...(isAbstractApp ? [ABSTRACT_MODULE_MSG] : []),
        t.returnStatement(
          t.objectExpression([
            t.objectProperty(
              t.identifier('typeUrl'),
              t.stringLiteral('/cosmwasm.wasm.v1.MsgExecuteContract')
            ),
            t.objectProperty(
              t.identifier('value'),
              t.callExpression(
                t.memberExpression(
                  t.identifier('MsgExecuteContract'),
                  t.identifier('fromPartial')
                ),
                [
                  t.objectExpression([
                    t.objectProperty(
                      t.identifier('sender'),
                      t.memberExpression(
                        t.thisExpression(),
                        t.identifier('sender')
                      )
                    ),
                    t.objectProperty(
                      t.identifier('contract'),
                      t.memberExpression(
                        t.thisExpression(),
                        t.identifier('contractAddress')
                      )
                    ),
                    t.objectProperty(
                      t.identifier('msg'),
                      t.callExpression(t.identifier('toUtf8'), [
                        t.callExpression(
                          t.memberExpression(
                            t.identifier('JSON'),
                            t.identifier('stringify')
                          ),
                          [t.identifier(isAbstractApp ? 'moduleMsg' : 'msg')]
                        )
                      ])
                    ),
                    t.objectProperty(
                      t.identifier('funds'),
                      t.identifier('funds_')
                    )
                  ])
                ]
              )
            )
          ])
        )
      ]),
      // return type
      t.tsTypeAnnotation(
        t.tsTypeReference(t.identifier('MsgExecuteContractEncodeObject'))
      ),
      false
    )
  );
};

export const createMessageComposerClass = (
  context: RenderContext,
  className: string,
  implementsClassName: string,
  execMsg: ExecuteMsg
) => {
  const propertyNames = getMessageProperties(execMsg)
    .map((method) => Object.keys(method.properties)?.[0])
    .filter(Boolean);

  const bindings = propertyNames.map(camel).map(bindMethod);

  const methods = getMessageProperties(execMsg).map((schema) => {
    return createWasmExecMethodMessageComposer(context, schema);
  });

  const blockStmt = [];

  [].push.apply(blockStmt, [
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

  return t.exportNamedDeclaration(
    classDeclaration(
      className,
      [
        // sender
        classProperty('sender', t.tsTypeAnnotation(t.tsStringKeyword())),

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
      null
    )
  );
};

export const createMessageComposerInterface = (
  context: RenderContext,
  className: string,
  execMsg: ExecuteMsg
) => {
  const methods = getMessageProperties(execMsg).map((jsonschema) => {
    const underscoreName = Object.keys(jsonschema.properties)[0];
    const methodName = camel(underscoreName);
    return createPropertyFunctionWithObjectParamsForMessageComposer(
      context,
      methodName,
      'MsgExecuteContractEncodeObject',
      jsonschema.properties[underscoreName]
    );
  });

  const extendsAst = [];

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

const createPropertyFunctionWithObjectParamsForMessageComposer = (
  context: RenderContext,
  methodName: string,
  responseType: string,
  jsonschema: JSONSchema
) => {
  const obj = createTypedObjectParams(context, jsonschema);
  const fixedParams = [OPTIONAL_FUNDS_PARAM];
  const func = {
    type: 'TSFunctionType',
    typeAnnotation: t.tsTypeAnnotation(
      t.tsTypeReference(t.identifier(responseType))
    ),
    parameters: obj ? [obj, ...fixedParams] : fixedParams
  };

  return t.tSPropertySignature(
    t.identifier(methodName),
    t.tsTypeAnnotation(
      // @ts-ignore:next-line
      func
    )
  );
};
