import { identifier } from './babel';
import * as t from '@babel/types';

export const OPTIONAL_FUNDS_PARAM = identifier(
  'funds_',
  t.tsTypeAnnotation(t.tsArrayType(t.tsTypeReference(t.identifier('Coin')))),
  true
);

export const FEE_PARAM = identifier(
  'fee_',
  t.tsTypeAnnotation(
    t.tsUnionType([
      t.tsNumberKeyword(),
      t.tsTypeReference(t.identifier('StdFee')),
      t.tsLiteralType(t.stringLiteral('auto'))
    ])
  )
);

export const OPTIONAL_FEE_PARAM: t.Identifier = {
  ...FEE_PARAM,
  optional: true
};

export const OPTIONAL_MEMO_PARAM = identifier(
  'memo_',
  t.tsTypeAnnotation(t.tsStringKeyword()),
  true
);

export const OPTIONAL_FIXED_EXECUTE_PARAMS = [
  OPTIONAL_FEE_PARAM,
  OPTIONAL_MEMO_PARAM,
  OPTIONAL_FUNDS_PARAM
];

export const PROVIDER_TYPES = {
  SIGNING_CLIENT_TYPE: "client",
  QUERY_CLIENT_TYPE: "queryClient",
  MESSAGE_COMPOSER_TYPE : 'message-composer',
  PROVIDER_TYPE : 'provider'
};
