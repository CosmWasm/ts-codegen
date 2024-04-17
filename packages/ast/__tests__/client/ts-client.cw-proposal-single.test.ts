import {
    createQueryClass,
    createExecuteClass,
    createExecuteInterface,
    createTypeInterface
} from '../../src'
import { expectCode, getMsgExecuteLegacyFixture, getMsgQueryLegacyFixture, makeContext } from '../../test-utils';

const execMsg = getMsgExecuteLegacyFixture('daodao/cw-proposal-single', '/execute_msg.json');
const queryMsg = getMsgQueryLegacyFixture('daodao/cw-proposal-single', '/query_msg.json');

it('execute_msg_for', () => {
    const ctx = makeContext(execMsg);
    expectCode(createTypeInterface(
        ctx,
        execMsg
    ))
})


it('query classes', () => {
    const ctx = makeContext(queryMsg);
    expectCode(createQueryClass(
        ctx,
        'SG721QueryClient',
        'SG721ReadOnlyInstance',
        queryMsg
    ))
});

it('execute classes array types', () => {
    const ctx = makeContext(execMsg);
    expectCode(createExecuteClass(
        ctx,
        'SG721Client',
        'SG721Instance',
        null,
        execMsg
    ))
});

it('execute interfaces no extends', () => {
    const ctx = makeContext(execMsg);
    expectCode(createExecuteInterface(
        ctx,
        'SG721Instance',
        null,
        execMsg
    ))
});
