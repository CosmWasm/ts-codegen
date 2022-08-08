import * as t from '@babel/types';
import query_msg from '../../../../__fixtures__/basic/query_msg.json';
import execute_msg from '../../../../__fixtures__/basic/execute_msg_for__empty.json';
import { RenderContext } from '../context';

import {
  createReactQueryHooks,
  createReactQueryMutationHooks,
} from './react-query'
import { expectCode } from '../../test-utils';

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
        context: new RenderContext(query_msg, {
          reactQuery: {
            optionalClient: true
          }
        }),
        queryMsg: query_msg,
        contractName: 'Sg721',
        QueryClient: 'Sg721QueryClient'
      }
    )))
  expectCode(t.program(
    createReactQueryHooks(
      {
        context: new RenderContext(query_msg, {
          reactQuery: {
            version: 'v4'
          }
        }),
        queryMsg: query_msg,
        contractName: 'Sg721',
        QueryClient: 'Sg721QueryClient'
      }
    )))
  expectCode(t.program(
    createReactQueryHooks(
      {
        context: new RenderContext(query_msg, {
          reactQuery: {
            optionalClient: true,
            version: 'v4'
          }
        }),
        queryMsg: query_msg,
        contractName: 'Sg721',
        QueryClient: 'Sg721QueryClient'
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

