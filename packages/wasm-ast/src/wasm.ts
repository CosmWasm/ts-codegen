import * as t from '@babel/types';

export const readonlyClass = () => {
  return t.exportNamedDeclaration(
    classDeclaration('SG721QueryClient',
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


              // bindings
              bindMethod('approval'),
              bindMethod('otherProp'),
              bindMethod('hello'),
              bindMethod('mintme')
            ]
          )),

        // methods:
        t.classProperty(
          t.identifier('approval'),
          arrowFunctionExpression(
            [
              // props
              typedIdentifier('owner', t.tsTypeAnnotation(
                t.tsStringKeyword()
              )),
              // 
              typedIdentifier('spender', t.tsTypeAnnotation(
                t.tsStringKeyword()
              ))
            ],
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
                        // props
                        t.objectProperty(
                          t.identifier('owner'),
                          t.identifier('owner'),
                          false,
                          true
                        ),

                        t.objectProperty(
                          t.identifier('spender'),
                          t.identifier('spender'),
                          false,
                          true
                        ),

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
                      t.identifier('ApprovalResponse')
                    )
                  ]
                )
              )
            ),
            true
          )
        )

      ],
      [
        t.tSExpressionWithTypeArguments(
          t.identifier('SG721ReadOnlyInstance')
        )
      ])
  );
}