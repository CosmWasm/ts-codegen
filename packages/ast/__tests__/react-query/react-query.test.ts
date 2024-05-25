import * as t from '@babel/types';

import {
  createReactQueryHooks,
  createReactQueryMutationHooks,
} from '../../src'
import { expectCode, getLegacyFixture, getMsgExecuteLegacyFixture, getMsgQueryLegacyFixture, makeContext } from '../../test-utils';

const queryMsg = getMsgQueryLegacyFixture('basic', '/query_msg.json')
const execMsg = getMsgExecuteLegacyFixture('basic', '/execute_msg_for__empty.json')
const ownership = getLegacyFixture('basic', '/ownership.json')


it('createReactQueryHooks', () => {
  expectCode(t.program(
    createReactQueryHooks(
      {
        context: makeContext(queryMsg, {
          reactQuery: {
            version: 'v3',
          }
        }),
        queryMsg: queryMsg,
        contractName: 'Sg721',
        QueryClient: 'Sg721QueryClient'
      }
    )))
  expectCode(t.program(
    createReactQueryHooks(
      {
        context: makeContext(queryMsg, {
          reactQuery: {
            version: 'v3',
            optionalClient: true
          }
        }),
        queryMsg: queryMsg,
        contractName: 'Sg721',
        QueryClient: 'Sg721QueryClient'
      }
    )))
  expectCode(t.program(
    createReactQueryHooks(
      {
        context: makeContext(queryMsg, {
          reactQuery: {
            version: 'v4'
          }
        }),
        queryMsg: queryMsg,
        contractName: 'Sg721',
        QueryClient: 'Sg721QueryClient'
      }
    )))
  expectCode(t.program(
    createReactQueryHooks(
      {
        context: makeContext(queryMsg, {
          reactQuery: {
            optionalClient: true,
            version: 'v4'
          }
        }),
        queryMsg: queryMsg,
        contractName: 'Sg721',
        QueryClient: 'Sg721QueryClient'
      }
    )))
  expectCode(
    t.program(
      createReactQueryHooks({
        context: makeContext(queryMsg, {
          reactQuery: {
            optionalClient: true,
            version: 'v4',
            queryKeys: true,
            queryFactory: true
          }
        }),
        queryMsg: queryMsg,
        contractName: 'Sg721',
        QueryClient: 'Sg721QueryClient'
      })
    )
  );
  expectCode(t.program(
    createReactQueryMutationHooks(
      {
        context: makeContext(execMsg, {
          reactQuery: {
            version: 'v3'
          }
        }),
        execMsg: execMsg,
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
        // @ts-ignore
        execMsg: ownership,
        contractName: 'Ownership',
        ExecuteClient: 'OwnershipClient',
      }
    )))
});


