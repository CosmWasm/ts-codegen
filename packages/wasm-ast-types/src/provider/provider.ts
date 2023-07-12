import * as t from "@babel/types";
import { pascal } from "case";
import { tsObjectPattern } from "../utils";

export const createProvider = (name: string, methods: t.ClassMethod[]) => {
  return t.exportNamedDeclaration(
    t.classDeclaration(
      t.identifier(pascal(name)),
      t.identifier("ContractBase"),
      t.classBody([
        t.classMethod(
          "constructor",
          t.identifier("constructor"),
          [
            tsObjectPattern(
              [
                t.objectProperty(
                  t.identifier("address"),
                  t.identifier("address"),
                  false,
                  true
                ),
                t.objectProperty(
                  t.identifier("cosmWasmClient"),
                  t.identifier("cosmWasmClient"),
                  false,
                  true
                ),
                t.objectProperty(
                  t.identifier("signingCosmWasmClient"),
                  t.identifier("signingCosmWasmClient"),
                  false,
                  true
                ),
              ],
              t.tsTypeAnnotation(
                t.tsTypeReference(t.identifier("IContractConstructor"))
              )
            ),
          ],
          t.blockStatement([
            t.expressionStatement(
              t.callExpression(t.super(), [
                t.identifier("address"),
                t.identifier("cosmWasmClient"),
                t.identifier("signingCosmWasmClient"),
              ])
            ),
          ])
        ),
        ...methods,
      ])
    )
  );
};

export const createProviderFunction = (
  functionName: string,
  classname: string
) => {
  return t.classMethod(
    "method",
    t.identifier(`get${functionName}`),
    [t.identifier("contractAddr")],
    t.blockStatement([
      t.returnStatement(
        t.callExpression(t.identifier(`get${functionName}Default`), [
          t.thisExpression(),
          t.identifier("contractAddr"),
          t.identifier(classname),
        ])
      ),
    ])
  );
};
