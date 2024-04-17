import {
  createMessageBuilderClass,
} from '../../src'
import { expectCode, getLegacyFixture, getMsgExecuteLegacyFixture, getMsgQueryLegacyFixture, makeContext } from '../../test-utils';

const queryMsg = getMsgQueryLegacyFixture('basic', '/query_msg.json')
const execMsg = getMsgExecuteLegacyFixture('basic', '/execute_msg_for__empty.json')
const ownership = getLegacyFixture('basic', '/ownership.json')


it('execute class', () => {
  const ctx = makeContext(execMsg);
  expectCode(createMessageBuilderClass(ctx, 'SG721MessageBuilder', execMsg))
});


it('query class', () => {
  const ctx = makeContext(queryMsg);
  expectCode(createMessageBuilderClass(ctx, 'SG721MessageBuilder', queryMsg))
});

it('ownership', () => {
  const ctx = makeContext(ownership);
  // @ts-ignore
  expectCode(createMessageBuilderClass(ctx, 'Ownership', ownership))
});
