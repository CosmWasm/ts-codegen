import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

import query_msg from './__fixtures__/schema/query_msg.json';
import execute_msg from './__fixtures__/schema/execute_msg_for__empty.json';

import {
  createQueryClass,
  createMutationClass
} from './wasm'

const expectCode = (ast) => {
  expect(
    generate(ast).code
  ).toMatchSnapshot();
}

const printCode = (ast) => {
  console.log(
    generate(ast).code
  );
}

it('query classes', () => {
  expectCode(createQueryClass(
    'SG721QueryClient',
    'SG721ReadOnlyInstance',
    query_msg
  ))
});

it('mutation classes', () => {
  expectCode(createMutationClass(
    'SG721Client',
    'SG721Instance',
    // execute_msg
    query_msg
  ))
});
