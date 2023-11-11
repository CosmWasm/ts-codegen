import * as t from '@babel/types';
import query_msg from '../../../../__fixtures__/basic/query_msg.json';
import execute_msg from '../../../../__fixtures__/basic/execute_msg_for__empty.json';
import ownership from '../../../../__fixtures__/basic/ownership.json';


import {
  createReactQueryHooks,
  createReactQueryMutationHooks,
} from './react-query'
import { expectCode, makeContext } from '../../test-utils';

it('createReactQueryHooks', () => {
  expectCode(t.program(
    createReactQueryHooks(
      {
        context: makeContext(query_msg, {
          reactQuery: {
            version: 'v3',
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
        context: makeContext(query_msg, {
          reactQuery: {
            version: 'v3',
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
        context: makeContext(query_msg, {
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
        context: makeContext(query_msg, {
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
  expectCode(
    t.program(
      createReactQueryHooks({
        context: makeContext(query_msg, {
          reactQuery: {
            optionalClient: true,
            version: 'v4',
            queryKeys: true,
            queryFactory: true
          }
        }),
        queryMsg: query_msg,
        contractName: 'Sg721',
        QueryClient: 'Sg721QueryClient'
      })
    )
  );
  expectCode(t.program(
    createReactQueryMutationHooks(
      {
        context: makeContext(execute_msg, {
          reactQuery: {
            version: 'v3'
          }
        }),
        execMsg: execute_msg,
        contractName: 'Sg721',
        ExecuteClient: 'Sg721Client',
      }
    )))
});

it('ownership', () => {
  expectCode(t.program(
    createReactQueryMutationHooks(
      {
        context: makeContext(ownership, {
          reactQuery: {
            version: 'v3'
          }
        }),
        execMsg: ownership,
        contractName: 'Ownership',
        ExecuteClient: 'OwnershipClient',
      }
    )))
});


