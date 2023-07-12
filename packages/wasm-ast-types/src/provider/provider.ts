import * as t from "@babel/types";
import { pascal } from "case";
import { ProviderInfo } from "../context";
import { PROVIDER_TYPES } from "../utils/constants";
import { tsObjectPattern } from "../utils";

export const createProvider = (
  name: string,
  providerInfos: {
    [key: string]: ProviderInfo;
  }
) => {
  const classDeclaration = t.classDeclaration(
    t.identifier(name),
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
              t.identifier(
                providerInfos[PROVIDER_TYPES.SIGNING_CLIENT_TYPE]
                  ? providerInfos[PROVIDER_TYPES.SIGNING_CLIENT_TYPE].classname
                  : "undefined"
              ),
              t.identifier(
                providerInfos[PROVIDER_TYPES.QUERY_CLIENT_TYPE]
                  ? providerInfos[PROVIDER_TYPES.QUERY_CLIENT_TYPE].classname
                  : "undefined"
              ),
              t.identifier(
                providerInfos[PROVIDER_TYPES.MESSAGE_COMPOSER_TYPE]
                  ? providerInfos[PROVIDER_TYPES.MESSAGE_COMPOSER_TYPE]
                      .classname
                  : "undefined"
              ),
            ])
          ),
        ])
      ),
    ])
  );

  classDeclaration.superTypeParameters = t.tsTypeParameterInstantiation([
    t.tsTypeReference(
      t.identifier(
        providerInfos[PROVIDER_TYPES.SIGNING_CLIENT_TYPE]
          ? providerInfos[PROVIDER_TYPES.SIGNING_CLIENT_TYPE].classname
          : "EmptyClient"
      )
    ),
    t.tsTypeReference(
      t.identifier(
        providerInfos[PROVIDER_TYPES.QUERY_CLIENT_TYPE]
          ? providerInfos[PROVIDER_TYPES.QUERY_CLIENT_TYPE].classname
          : "EmptyClient"
      )
    ),
    t.tsTypeReference(
      t.identifier(
        providerInfos[PROVIDER_TYPES.MESSAGE_COMPOSER_TYPE]
          ? providerInfos[PROVIDER_TYPES.MESSAGE_COMPOSER_TYPE].classname
          : "EmptyClient"
      )
    ),
  ]);

  return t.exportNamedDeclaration(classDeclaration);
};
