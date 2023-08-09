import execute_msg from '../../../../__fixtures__/basic/execute_msg_for__empty.json';
import query_msg from '../../../../__fixtures__/basic/query_msg.json';
import ownership from '../../../../__fixtures__/basic/ownership.json';

import {
  createMessageBuilderClass,
} from './msg-builder'
import { expectCode, makeContext } from '../../test-utils';
import { findExecuteMsg } from '@cosmwasm/ts-codegen/src';

it('execute class', () => {
  const ctx = makeContext(execute_msg);
  expectCode(createMessageBuilderClass(ctx, 'SG721MessageBuilder', execute_msg))
});


it('query class', () => {
  const ctx = makeContext(query_msg);
  expectCode(createMessageBuilderClass(ctx, 'SG721MessageBuilder', query_msg))
});

it('ownership', () => {
  const ctx = makeContext(ownership);
  expectCode(createMessageBuilderClass(ctx, 'Ownership', ownership))
});
