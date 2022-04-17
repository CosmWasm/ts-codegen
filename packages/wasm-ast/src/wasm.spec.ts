import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

import query_msg from './__fixtures__/schema/query_msg.json';
import execute_msg from './__fixtures__/schema/execute_msg_for__empty.json';

import {
  createQueryClass,
  createQueryInterface,
  createExecuteClass,
  createExecuteInterface
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

it('execute classes', () => {
  expectCode(createExecuteClass(
    'SG721Client',
    'SG721Instance',
    'SG721QueryClient',
    execute_msg
  ))
});

it('execute interfaces', () => {
  expectCode(createExecuteInterface(
    'SG721Instance',
    'SG721ReadOnlyInstance',
    execute_msg
  ))
});

it('query interfaces', () => {
  printCode(createQueryInterface(
    'SG721ReadOnlyInstance',
    query_msg
  ))
});
