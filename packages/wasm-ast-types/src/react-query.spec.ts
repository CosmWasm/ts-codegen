import * as t from '@babel/types';
import generate from '@babel/generator';
import query_msg from './../../../__fixtures__/basic/query_msg.json';
import execute_msg from './../../../__fixtures__/basic/execute_msg_for__empty.json';
import { RenderContext } from './utils/types';

import {
  createReactQueryHooks,
  createReactQueryMutationHooks,
} from './react-query'


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

const execCtx = new RenderContext(execute_msg);
const queryCtx = new RenderContext(query_msg);

it('createReactQueryHooks', () => {
  expectCode(t.program(
    createReactQueryHooks(
      {
        context: queryCtx,
        queryMsg: query_msg,
        contractName: 'Sg721',
        QueryClient: 'Sg721QueryClient'
      }
    )))
  expectCode(t.program(
    createReactQueryHooks(
      {
        context: queryCtx,
        queryMsg: query_msg,
        contractName: 'Sg721',
        QueryClient: 'Sg721QueryClient',
        options: { optionalClient: true }
      }
    )))
  expectCode(t.program(
    createReactQueryHooks(
      {
        context: queryCtx,
        queryMsg: query_msg,
        contractName: 'Sg721',
        QueryClient: 'Sg721QueryClient',
        options: { v4: true }
      }
    )))
  expectCode(t.program(
    createReactQueryHooks(
      {
        context: queryCtx,
        queryMsg: query_msg,
        contractName: 'Sg721',
        QueryClient: 'Sg721QueryClient',
        options: { optionalClient: true, v4: true }
      }
    )))
  expectCode(t.program(
    createReactQueryMutationHooks(
      {
        context: execCtx,
        execMsg: execute_msg,
        contractName: 'Sg721',
        ExecuteClient: 'Sg721Client',
      }
    )))
});

