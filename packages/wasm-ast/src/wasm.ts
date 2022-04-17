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

const getType = (type) => {
  switch (type) {
    case 'string':
      return t.tsStringKeyword();
    case 'boolean':
      return t.tSBooleanKeyword();
    case 'integer':
      return t.tsNumberKeyword();
    default:
      throw new Error('what is type: ' + type);
  }
}

const getProperty = (schema, prop) => {
  const props = schema.properties ?? {};
  const info = props[prop];

  let type = null;
  let optional = schema.required?.includes(prop);

  if (typeof info.type === 'string') {
    type = getType(info.type);
  }
  if (Array.isArray(info.type)) {
    // assuming 2nd is null, but let's check to ensure
    if (info.type.length !== 2) {
      throw new Error('case not handled by transpiler. contact maintainers.')
    }
    const [nullableType, nullType] = info.type;
    if (nullType !== 'null') {
      throw new Error('case not handled by transpiler. contact maintainers.')
    }
    type = getType(nullableType);
    optional = true;
  }
  return typedIdentifier(camel(prop), t.tsTypeAnnotation(
    type
  ), optional);
};

export const createWasmQueryMethod = (
  jsonschema: any
) => {

  const underscoreName = Object.keys(jsonschema.properties)[0];
  const methodName = camel(underscoreName);
  const responseType = pascal(`${methodName}Response`);

  const properties = jsonschema.properties[underscoreName].properties ?? {};

  // console.log({ jsonschema, methodName, underscoreName, properties });

  const params = Object.keys(properties).map(prop => {
    return getProperty(jsonschema.properties[underscoreName], prop)
  });

  const args = Object.keys(properties).map(prop => {
    return t.objectProperty(
      t.identifier(prop),
      t.identifier(camel(prop)),
      false,
      true
    )
  });

  const actionArg =
    t.objectProperty(t.identifier(underscoreName), t.objectExpression(args));

  return t.classProperty(
    t.identifier(methodName),
    arrowFunctionExpression(
      params,
      t.blockStatement(
        [
          t.returnStatement(
            t.callExpression(
              t.memberExpression(
                t.memberExpression(
                  t.thisExpression(),
                  t.identifier('client')
                ),
                t.identifier('queryContractSmart')
              ),
              [
                t.memberExpression(t.thisExpression(), t.identifier('contractAddress')),
                t.objectExpression([
                  actionArg
                ])
              ]
            )
          )
        ]
      ),
      t.tsTypeAnnotation(
        t.tsTypeReference(
          t.identifier('Promise'),
          t.tsTypeParameterInstantiation(
            [
              t.tSTypeReference(
                t.identifier(responseType)
              )
            ]
          )
        )
      ),
      true
    )
  );
}

interface QueryMsg {
  $schema: string;
  title: "QueryMsg";
  oneOf: any;
}

export const createQueryClass = (
  className: string,
  implementsClassName: string,
  queryMsg: QueryMsg
) => {

  const propertyNames = queryMsg.oneOf
    .map(method => Object.keys(method.properties)?.[0])
    .filter(Boolean);

  console.log(propertyNames)

  const bindings = propertyNames
    .map(camel)
    .map(bindMethod);

  const methods = queryMsg.oneOf
    .map(schema => {
      return createWasmQueryMethod(schema)
    });

  return t.exportNamedDeclaration(
    classDeclaration(className,
      [
        // client
        classProperty('client', t.tsTypeAnnotation(
          t.tsTypeReference(t.identifier('CosmWasmClient'))
        )),

        // contractAddress
        classProperty('contractAddress', t.tsTypeAnnotation(
          t.tsStringKeyword()
        )),

        // constructor
        t.classMethod('constructor',
          t.identifier('constructor'),
          [
            typedIdentifier('client', t.tsTypeAnnotation(t.tsTypeReference(t.identifier('CosmWasmClient')))),
            typedIdentifier('contractAddress', t.tsTypeAnnotation(t.tsStringKeyword()))

          ],
          t.blockStatement(
            [

              // client/contract set
              t.expressionStatement(
                t.assignmentExpression(
                  '=',
                  t.memberExpression(
                    t.thisExpression(),
                    t.identifier('client')
                  ),
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

            ]
          )),

        ...methods

      ],
      [
        t.tSExpressionWithTypeArguments(
          t.identifier(implementsClassName)
        )
      ])
  );
}

export const createMutationClass = (
  className: string,
  implementsClassName: string,
  queryMsg: QueryMsg
) => {

  const propertyNames = queryMsg.oneOf
    .map(method => Object.keys(method.properties)?.[0])
    .filter(Boolean);

  console.log(propertyNames)

  const bindings = propertyNames
    .map(camel)
    .map(bindMethod);

  const methods = queryMsg.oneOf
    .map(schema => {
      return createWasmQueryMethod(schema)
    });

  return t.exportNamedDeclaration(
    classDeclaration(className,
      [
        // client
        classProperty('client', t.tsTypeAnnotation(
          t.tsTypeReference(t.identifier('CosmWasmClient'))
        )),

        // contractAddress
        classProperty('contractAddress', t.tsTypeAnnotation(
          t.tsStringKeyword()
        )),

        // constructor
        t.classMethod('constructor',
          t.identifier('constructor'),
          [
            typedIdentifier('client', t.tsTypeAnnotation(t.tsTypeReference(t.identifier('CosmWasmClient')))),
            typedIdentifier('contractAddress', t.tsTypeAnnotation(t.tsStringKeyword()))

          ],
          t.blockStatement(
            [

              // client/contract set
              t.expressionStatement(
                t.assignmentExpression(
                  '=',
                  t.memberExpression(
                    t.thisExpression(),
                    t.identifier('client')
                  ),
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

            ]
          )),

        ...methods

      ],
      [
        t.tSExpressionWithTypeArguments(
          t.identifier(implementsClassName)
        )
      ])
  );
}