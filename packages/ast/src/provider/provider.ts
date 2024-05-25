import * as t from '@babel/types';
import { camel, pascal } from 'case';

import { ProviderInfo } from '../types';
import { identifier, tsObjectPattern } from '../utils';
import { PROVIDER_TYPES } from '../utils/constants';

export const createProvider = (
  name: string,
  providerInfos: {
    [key: string]: ProviderInfo;
  }
) => {
  const classDeclaration = t.classDeclaration(
    t.identifier(name),
    t.identifier('ContractBase'),
    t.classBody([
      t.classMethod(
        'constructor',
        t.identifier('constructor'),
        [
          tsObjectPattern(
            [
              t.objectProperty(
                t.identifier('address'),
                t.identifier('address'),
                false,
                true
              ),
              t.objectProperty(
                t.identifier('cosmWasmClient'),
                t.identifier('cosmWasmClient'),
                false,
                true
              ),
              t.objectProperty(
                t.identifier('signingCosmWasmClient'),
                t.identifier('signingCosmWasmClient'),
                false,
                true
              ),
            ],
            t.tsTypeAnnotation(
              t.tsTypeReference(t.identifier('IContractConstructor'))
            )
          ),
        ],
        t.blockStatement([
          t.expressionStatement(
            t.callExpression(t.super(), [
              t.identifier('address'),
              t.identifier('cosmWasmClient'),
              t.identifier('signingCosmWasmClient'),
              t.identifier(
                providerInfos[PROVIDER_TYPES.SIGNING_CLIENT_TYPE]
                  ? providerInfos[PROVIDER_TYPES.SIGNING_CLIENT_TYPE].classname
                  : 'undefined'
              ),
              t.identifier(
                providerInfos[PROVIDER_TYPES.QUERY_CLIENT_TYPE]
                  ? providerInfos[PROVIDER_TYPES.QUERY_CLIENT_TYPE].classname
                  : 'undefined'
              ),
              t.identifier(
                providerInfos[PROVIDER_TYPES.MESSAGE_COMPOSER_TYPE]
                  ? providerInfos[PROVIDER_TYPES.MESSAGE_COMPOSER_TYPE]
                    .classname
                  : 'undefined'
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
          : 'IEmptyClient'
      )
    ),
    t.tsTypeReference(
      t.identifier(
        providerInfos[PROVIDER_TYPES.QUERY_CLIENT_TYPE]
          ? providerInfos[PROVIDER_TYPES.QUERY_CLIENT_TYPE].classname
          : 'IEmptyClient'
      )
    ),
    t.tsTypeReference(
      t.identifier(
        providerInfos[PROVIDER_TYPES.MESSAGE_COMPOSER_TYPE]
          ? providerInfos[PROVIDER_TYPES.MESSAGE_COMPOSER_TYPE].classname
          : 'IEmptyClient'
      )
    ),
  ]);

  return t.exportNamedDeclaration(classDeclaration);
};

export const createIContractsContext = (providerInfos: {
  [key: string]: {
    [key: string]: ProviderInfo;
  };
}) => {
  const properties: t.TSTypeElement[] = [];

  for (const key in providerInfos) {
    if (Object.prototype.hasOwnProperty.call(providerInfos, key)) {
      const contractProviderInfo = providerInfos[key];

      properties.push(createProperty(key, contractProviderInfo));
    }
  }

  return t.exportNamedDeclaration(
    t.tsInterfaceDeclaration(
      t.identifier('IContractsContext'),
      null,
      null,
      t.tsInterfaceBody(properties)
    )
  );
};

let PROVIDER_MAPPING: Record<string, string> = {};

PROVIDER_MAPPING[PROVIDER_TYPES.SIGNING_CLIENT_TYPE] = 'ISigningClientProvider';
PROVIDER_MAPPING[PROVIDER_TYPES.QUERY_CLIENT_TYPE] = 'IQueryClientProvider';
PROVIDER_MAPPING[PROVIDER_TYPES.MESSAGE_COMPOSER_TYPE] =
  'IMessageComposerProvider';

export const createProperty = (
  name: string,
  providerInfos: {
    [key: string]: ProviderInfo;
  }
): t.TSTypeElement => {
  let typeAnnotation: t.TSTypeAnnotation = null;

  const keys = Object.keys(providerInfos);

  if (keys?.length == 1) {
    const key = keys[0];

    typeAnnotation = t.tsTypeAnnotation(
      t.tsTypeReference(
        t.identifier(PROVIDER_MAPPING[key]),
        t.tsTypeParameterInstantiation([
          t.tsTypeReference(t.identifier(providerInfos[key].classname)),
        ])
      )
    );
  } else {
    const typeRefs: t.TSTypeReference[] = [];

    for (const key of keys) {
      typeRefs.push(
        t.tsTypeReference(
          t.identifier(PROVIDER_MAPPING[key]),
          t.tsTypeParameterInstantiation([
            t.tsTypeReference(t.identifier(providerInfos[key].classname)),
          ])
        )
      );
    }

    typeAnnotation = t.tsTypeAnnotation(t.tsIntersectionType(typeRefs));
  }

  return t.tsPropertySignature(t.identifier(camel(name)), typeAnnotation);
};

export const createGettingProviders = (providerInfos: {
  [key: string]: {
    [key: string]: ProviderInfo;
  };
}) => {
  const properties = [];

  for (const key of Object.keys(providerInfos)) {
    properties.push(
      t.objectProperty(
        t.identifier(camel(key)),
        t.newExpression(t.identifier(pascal(key)), [
          t.objectExpression([
            t.objectProperty(
              t.identifier('address'),
              t.identifier('address'),
              false,
              true
            ),
            t.objectProperty(
              t.identifier('cosmWasmClient'),
              t.identifier('cosmWasmClient'),
              false,
              true
            ),
            t.objectProperty(
              t.identifier('signingCosmWasmClient'),
              t.identifier('signingCosmWasmClient'),
              false,
              true
            ),
          ]),
        ])
      )
    );
  }

  return t.exportNamedDeclaration(
    t.variableDeclaration('const', [
      t.variableDeclarator(
        t.identifier('getProviders'),
        t.arrowFunctionExpression(
          [
            identifier(
              'address?',
              t.tsTypeAnnotation(t.tsTypeReference(t.identifier('string')))
            ),
            identifier(
              'cosmWasmClient?',
              t.tsTypeAnnotation(t.tsTypeReference(t.identifier('CosmWasmClient')))
            ),
            identifier(
              'signingCosmWasmClient?',
              t.tsTypeAnnotation(t.tsTypeReference(t.identifier('SigningCosmWasmClient')))
            ),
          ],
          t.objectExpression(properties)
        )
      ),
    ])
  );
};
