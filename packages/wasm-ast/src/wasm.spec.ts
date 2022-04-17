import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

import query_msg from './__fixtures__/schema/query_msg.json';
import execute_msg from './__fixtures__/schema/execute_msg_for__empty.json';

import {
  readonlyClass
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

it('readonly classes', () => {
  printCode(readonlyClass(
    'SG721QueryClient',
    'SG721ReadOnlyInstance',
    query_msg
  ))
});
