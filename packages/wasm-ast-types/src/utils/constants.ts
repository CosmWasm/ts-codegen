import { identifier } from './babel';
import * as t from '@babel/types';

export const OPTIONAL_FUNDS_PARAM = identifier(
  '_funds',
  t.tsTypeAnnotation(t.tsArrayType(t.tsTypeReference(t.identifier('Coin')))),
  true
);

export const FEE_PARAM = identifier(
  'fee',
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
  'memo',
  t.tsTypeAnnotation(t.tsStringKeyword()),
  true
);

export const OPTIONAL_FIXED_EXECUTE_PARAMS = [
  OPTIONAL_FEE_PARAM,
  OPTIONAL_MEMO_PARAM,
  OPTIONAL_FUNDS_PARAM
];
