import { identifier } from './babel';
import * as t from '@babel/types';

export const OPTIONAL_FUNDS_PARAM = identifier(
  '_funds',
  t.tsTypeAnnotation(t.tsArrayType(t.tsTypeReference(t.identifier('Coin')))),
  true
);
export const FIXED_EXECUTE_PARAMS = [
  identifier(
    'fee',
    t.tsTypeAnnotation(
      t.tsUnionType([
        t.tsNumberKeyword(),
        t.tsTypeReference(t.identifier('StdFee')),
        t.tsLiteralType(t.stringLiteral('auto'))
      ])
    ),
    true
  ),
  identifier('memo', t.tsTypeAnnotation(t.tsStringKeyword()), true),
  OPTIONAL_FUNDS_PARAM
];
