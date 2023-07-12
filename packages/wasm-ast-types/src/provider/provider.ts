import * as t from "@babel/types";
import { pascal } from "case";

export const createProvider = (name: string) => {
  return t.exportNamedDeclaration(
    t.classDeclaration(
      t.identifier(pascal(name)),
      t.identifier("ContractBase"),
      t.classBody([
        t.classMethod(
          "constructor",
          t.identifier("constructor"),
          [
            t.objectPattern([
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
            ]),
          ],
          t.blockStatement(
            [
              t.expressionStatement(
                t.callExpression(t.super(), [
                  t.identifier("address"),
                  t.identifier("cosmWasmClient"),
                  t.identifier("signingCosmWasmClient"),
                ])
              ),
            ],
            []
          )
        ),
      ])
    )
  );
};
