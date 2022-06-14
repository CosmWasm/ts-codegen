import * as t from '@babel/types';
import { camel, pascal } from 'case';
import {
  bindMethod,
  typedIdentifier,
  promiseTypeAnnotation,
  classDeclaration,
  classProperty,
  arrowFunctionExpression,
  getMessageProperties
} from './utils'

import {
  QueryMsg,
  ExecuteMsg
} from './types';

import { getPropertyType, getType } from './utils/types';
import { identifier, tsTypeOperator, propertySignature } from './utils/babel';

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

  const propertyNames = getMessageProperties(queryMsg)
    .map(method => Object.keys(method.properties)?.[0])
    .filter(Boolean);

  const bindings = propertyNames
    .map(camel)
    .map(bindMethod);

  const methods = getMessageProperties(queryMsg)
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

  const constantParams = [
    t.assignmentPattern(
      identifier(
        'fee',
        t.tsTypeAnnotation(
          t.tsUnionType(
            [
              t.tSNumberKeyword(),
              t.tsTypeReference(
                t.identifier('StdFee')
              ),
              t.tsLiteralType(
                t.stringLiteral('auto')
              )
            ]
          )
        ),
        false
      ),
      t.stringLiteral('auto')
    ),
    identifier('memo', t.tsTypeAnnotation(
      t.tsStringKeyword()
    ), true),
    identifier('funds', t.tsTypeAnnotation(
      tsTypeOperator(
        t.tsArrayType(
          t.tsTypeReference(
            t.identifier('Coin')
          )
        ),
        'readonly'
      )
    ), true)
  ];

  return t.classProperty(
    t.identifier(methodName),
    arrowFunctionExpression(
      obj ? [
        // props
        obj,
        ...constantParams
      ] : constantParams,
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
                  t.identifier('fee'),
                  t.identifier('memo'),
                  t.identifier('funds')
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

  const propertyNames = getMessageProperties(execMsg)
    .map(method => Object.keys(method.properties)?.[0])
    .filter(Boolean);

  const bindings = propertyNames
    .map(camel)
    .map(bindMethod);

  const methods = getMessageProperties(execMsg)
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

  const methods = getMessageProperties(execMsg)
    .map(jsonschema => {
      const underscoreName = Object.keys(jsonschema.properties)[0];
      const methodName = camel(underscoreName);
      return createPropertyFunctionWithObjectParamsForExec(
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

          ...methods,
        ]
      )
    )
  );
};

export const createTypedObjectParams = (jsonschema: any, camelize: boolean = true) => {
  const keys = Object.keys(jsonschema.properties ?? {});
  if (!keys.length) return;

  const typedParams = keys.map(prop => {
    const { type, optional } = getPropertyType(jsonschema, prop);
    return propertySignature(
      camelize ? camel(prop) : prop,
      t.tsTypeAnnotation(
        type
      ),
      optional
    )
  });
  const params = keys.map(prop => {
    return t.objectProperty(
      camelize ? t.identifier(camel(prop)) : t.identifier(prop),
      camelize ? t.identifier(camel(prop)) : t.identifier(prop),
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

export const createPropertyFunctionWithObjectParamsForExec = (methodName: string, responseType: string, jsonschema: any) => {
  const obj = createTypedObjectParams(jsonschema);
  const fixedParams = [
    identifier('fee', t.tsTypeAnnotation(
      t.tsUnionType(
        [
          t.tsNumberKeyword(),
          t.tsTypeReference(
            t.identifier('StdFee')
          ),
          t.tsLiteralType(
            t.stringLiteral('auto')
          )
        ]
      )
    ), true),
    identifier('memo', t.tsTypeAnnotation(
      t.tsStringKeyword()
    ), true),
    identifier('funds', t.tsTypeAnnotation(
      tsTypeOperator(
        t.tsArrayType(
          t.tsTypeReference(
            t.identifier('Coin')
          )
        ),
        'readonly'
      )
    ), true)
  ];
  const func = {
    type: 'TSFunctionType',
    typeAnnotation: promiseTypeAnnotation(responseType),
    parameters: obj ? [
      obj,
      ...fixedParams

    ] : fixedParams
  }

  return t.tSPropertySignature(
    t.identifier(methodName),
    t.tsTypeAnnotation(
      func
    )
  );
};

export const createQueryInterface = (className: string, queryMsg: QueryMsg) => {
  const methods = getMessageProperties(queryMsg)
    .map(jsonschema => {
      const underscoreName = Object.keys(jsonschema.properties)[0];
      const methodName = camel(underscoreName);
      const responseType = pascal(`${methodName}Response`);
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