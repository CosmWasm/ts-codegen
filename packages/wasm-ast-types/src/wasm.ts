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

interface QueryMsg {
  $schema: string;
  title: "QueryMsg";
  oneOf: any;
}
interface ExecuteMsg {
  $schema: string;
  title: "ExecuteMsg" | "ExecuteMsg_for_Empty";
  oneOf: any;
}

const getTypeFromRef = ($ref) => {
  switch ($ref) {
    case '#/definitions/Binary':
      return t.tsTypeReference(t.identifier('BinaryType'))
    case '#/definitions/Expiration':
      return t.tsTypeReference(t.identifier('Expiration'))
    default:
      if ($ref.startsWith('#/definitions/')) {
        return t.tsTypeReference(t.identifier($ref.replace('#/definitions/', '')))
      }
      throw new Error('what is $ref: ' + $ref);
  }
}

const getArrayTypeFromRef = ($ref) => {
  return t.tsArrayType(
    getTypeFromRef($ref)
  );
}
const getArrayTypeFromType = (type) => {
  return t.tsArrayType(
    getType(type)
  );
}

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

const getPropertyType = (schema, prop) => {
  const props = schema.properties ?? {};
  let info = props[prop];

  let type = null;
  let optional = schema.required?.includes(prop);

  if (info.allOf && info.allOf.length === 1) {
    info = info.allOf[0];
  }

  if (typeof info.$ref === 'string') {
    type = getTypeFromRef(info.$ref)
  }

  if (Array.isArray(info.anyOf)) {
    // assuming 2nd is null, but let's check to ensure
    if (info.anyOf.length !== 2) {
      throw new Error('case not handled by transpiler. contact maintainers.')
    }
    const [nullableType, nullType] = info.anyOf;
    if (nullType?.type !== 'null') {
      throw new Error('case not handled by transpiler. contact maintainers.')
    }
    type = getTypeFromRef(nullableType?.$ref);
    optional = true;
  }

  if (typeof info.type === 'string') {
    if (info.type === 'array') {
      if (info.items.$ref) {
        type = getArrayTypeFromRef(info.items.$ref);
      } else {
        type = getArrayTypeFromType(info.items.type);
      }
    } else {

      type = getType(info.type);
    }
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
  if (!type) {
    throw new Error('cannot find type for ' + JSON.stringify(info))
  }
  return { type, optional };
};

const getProperty = (schema, prop) => {
  const { type, optional } = getPropertyType(schema, prop);
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

  const obj = createTypedObjectParams(jsonschema.properties[underscoreName]);

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
      obj ? [obj] : [],
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

export const createQueryClass = (
  className: string,
  implementsClassName: string,
  queryMsg: QueryMsg
) => {

  const propertyNames = queryMsg.oneOf
    .map(method => Object.keys(method.properties)?.[0])
    .filter(Boolean);

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

export const createWasmExecMethod = (
  jsonschema: any
) => {

  const underscoreName = Object.keys(jsonschema.properties)[0];
  const methodName = camel(underscoreName);
  const properties = jsonschema.properties[underscoreName].properties ?? {};
  const obj = createTypedObjectParams(jsonschema.properties[underscoreName]);
  const args = Object.keys(properties).map(prop => {
    return t.objectProperty(
      t.identifier(prop),
      t.identifier(camel(prop)),
      false,
      prop === camel(prop)
    );
  });

  return t.classProperty(
    t.identifier(methodName),
    arrowFunctionExpression(
      obj ? [
        // props
        obj
      ] : [],
      t.blockStatement(
        [
          t.returnStatement(
            t.awaitExpression(
              t.callExpression(
                t.memberExpression(
                  t.memberExpression(
                    t.thisExpression(),
                    t.identifier('client')
                  ),
                  t.identifier('execute')
                ),
                [
                  t.memberExpression(
                    t.thisExpression(),
                    t.identifier('sender')
                  ),
                  t.memberExpression(
                    t.thisExpression(),
                    t.identifier('contractAddress')
                  ),
                  t.objectExpression(
                    [
                      t.objectProperty(
                        t.identifier(underscoreName),
                        t.objectExpression([
                          ...args
                        ])
                      )

                    ]
                  ),
                  t.stringLiteral('auto')
                ]
              )
            )
          )
        ]
      ),
      // return type
      t.tsTypeAnnotation(
        t.tsTypeReference(
          t.identifier('Promise'),
          t.tsTypeParameterInstantiation(
            [
              t.tSTypeReference(
                t.identifier('ExecuteResult')
              )
            ]
          )
        )
      ),
      true
    )
  );

}

export const createExecuteClass = (
  className: string,
  implementsClassName: string,
  extendsClassName: string,
  execMsg: ExecuteMsg
) => {

  const propertyNames = execMsg.oneOf
    .map(method => Object.keys(method.properties)?.[0])
    .filter(Boolean);

  const bindings = propertyNames
    .map(camel)
    .map(bindMethod);

  const methods = execMsg.oneOf
    .map(schema => {
      return createWasmExecMethod(schema)
    });

  const blockStmt = [];

  if (extendsClassName) {
    blockStmt.push(    // super()
      t.expressionStatement(t.callExpression(
        t.super(),
        [
          t.identifier('client'),
          t.identifier('contractAddress')
        ]
      ))
    );
  }

  [].push.apply(blockStmt, [
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
          t.identifier('sender')
        ),
        t.identifier('sender')
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
  ]);

  return t.exportNamedDeclaration(
    classDeclaration(className,
      [
        // client
        classProperty('client', t.tsTypeAnnotation(
          t.tsTypeReference(t.identifier('SigningCosmWasmClient'))
        )),

        // sender
        classProperty('sender', t.tsTypeAnnotation(
          t.tsStringKeyword()
        )),

        // contractAddress
        classProperty('contractAddress', t.tsTypeAnnotation(
          t.tsStringKeyword()
        )),

        // constructor
        t.classMethod('constructor',
          t.identifier('constructor'),
          [
            typedIdentifier('client', t.tsTypeAnnotation(t.tsTypeReference(t.identifier('SigningCosmWasmClient')))),
            typedIdentifier('sender', t.tsTypeAnnotation(t.tsStringKeyword())),
            typedIdentifier('contractAddress', t.tsTypeAnnotation(t.tsStringKeyword()))
          ],
          t.blockStatement(
            blockStmt
          )),
        ...methods
      ],
      [
        t.tSExpressionWithTypeArguments(
          t.identifier(implementsClassName)
        )
      ],
      extendsClassName ? t.identifier(extendsClassName) : null
    )
  );
}

export const createExecuteInterface = (
  className: string,
  extendsClassName: string | null,
  execMsg: ExecuteMsg
) => {

  const methods = execMsg.oneOf
    .map(jsonschema => {
      const underscoreName = Object.keys(jsonschema.properties)[0];
      const methodName = camel(underscoreName);
      return createPropertyFunctionWithObjectParams(
        methodName,
        'ExecuteResult',
        jsonschema.properties[underscoreName]
      );
    });

  const extendsAst = extendsClassName ? [t.tSExpressionWithTypeArguments(
    t.identifier(extendsClassName)
  )] : []

  return t.exportNamedDeclaration(
    t.tsInterfaceDeclaration(
      t.identifier(className),
      null,
      extendsAst,
      t.tSInterfaceBody(
        [

          // contract address
          t.tSPropertySignature(
            t.identifier('contractAddress'),
            t.tsTypeAnnotation(
              t.tsStringKeyword()
            )
          ),

          // contract address
          t.tSPropertySignature(
            t.identifier('sender'),
            t.tsTypeAnnotation(
              t.tsStringKeyword()
            )
          ),
          ...methods
        ]
      )
    )
  );
};

export const createTypedObjectParams = (jsonschema: any) => {
  const keys = Object.keys(jsonschema.properties ?? {});
  if (!keys.length) return;

  const typedParams = keys.map(prop => {
    const { type, optional } = getPropertyType(jsonschema, prop);
    return t.tsPropertySignature(
      t.identifier(prop),
      t.tsTypeAnnotation(
        type
      )
    )
  });
  const params = keys.map(prop => {
    return t.objectProperty(
      t.identifier(prop),
      t.identifier(prop),
      false,
      true
    );
  });

  const obj = t.objectPattern(
    [
      ...params
    ]
  );
  obj.typeAnnotation = t.tsTypeAnnotation(
    t.tsTypeLiteral(
      [
        ...typedParams
      ]
    )
  );

  return obj;
};

export const createPropertyFunctionWithObjectParams = (methodName: string, responseType: string, jsonschema: any) => {
  const obj = createTypedObjectParams(jsonschema);

  const func = {
    type: 'TSFunctionType',
    typeAnnotation: promiseTypeAnnotation(responseType),
    parameters: obj ? [
      obj
    ] : []
  }

  return t.tSPropertySignature(
    t.identifier(methodName),
    t.tsTypeAnnotation(
      func
    )
  );
};

export const createQueryInterface = (className: string, queryMsg: QueryMsg) => {
  const methods = queryMsg.oneOf
    .map(jsonschema => {
      const underscoreName = Object.keys(jsonschema.properties)[0];
      const methodName = camel(underscoreName);
      const responseType = pascal(`${methodName}Response`);
      const obj = createTypedObjectParams(jsonschema.properties[underscoreName]);

      return createPropertyFunctionWithObjectParams(
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
      t.tSInterfaceBody(
        [
          t.tSPropertySignature(
            t.identifier('contractAddress'),
            t.tsTypeAnnotation(
              t.tsStringKeyword()
            )
          ),
          ...methods
        ]
      )
    )
  );
};

export const propertySignature = (name: string, typeAnnotation: t.TSTypeAnnotation, optional: boolean = false) => {
  const prop = t.tsPropertySignature(
    t.identifier(name),
    typeAnnotation
  );
  // prop.leadingComments = [{
  //   type: 'Comment',
  //   value: ' Data on the token itself'
  // }];
  // prop.leadingComments = [{
  //   type: 'CommentBlock',
  //   value: '* Data on the token itself'
  // }];
  return prop;
}



export const createTypeOrInterface = (Type: string, jsonschema: any) => {
  if (jsonschema.type !== 'object') {
    return t.exportNamedDeclaration(
      t.tsTypeAliasDeclaration(
        t.identifier(Type),
        null,
        getType(jsonschema.type)
      )
    )
  }
  const props = Object.keys(jsonschema.properties ?? {})
    .map(prop => {
      const { type, optional } = getPropertyType(jsonschema, prop);
      return propertySignature(camel(prop), t.tsTypeAnnotation(
        type
      ), optional);
    });


  return t.exportNamedDeclaration(
    t.tsInterfaceDeclaration(
      t.identifier(Type),
      null,
      [],
      t.tsInterfaceBody(
        [
          ...props
        ]
      )
    )
  )
};

export const createTypeInterface = (jsonschema: any) => {
  const Type = jsonschema.title;
  return createTypeOrInterface(Type, jsonschema);
};