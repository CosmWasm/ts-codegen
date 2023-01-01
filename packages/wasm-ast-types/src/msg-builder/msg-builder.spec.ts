import execute_msg from '../../../../__fixtures__/basic/execute_msg_for__empty.json';
import query_msg from '../../../../__fixtures__/basic/query_msg.json';
import {
    createMsgBuilderClass,
    createMsgBuilderInterface
} from './msg-builder'
import { expectCode, makeContext } from '../../test-utils';

it('execute class', () => {
    const ctx = makeContext(execute_msg);
    expectCode(createMsgBuilderClass(ctx, 'SG721MsgBuilder', execute_msg))
});


it('query class', () => {
  const ctx = makeContext(execute_msg);
  expectCode(createMsgBuilderClass(ctx, 'SG721MsgBuilder', query_msg))
});
