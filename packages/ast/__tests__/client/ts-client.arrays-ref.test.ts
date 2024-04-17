import {
    createQueryClass,
    createExecuteClass,
    createExecuteInterface,
    createTypeInterface
} from '../../src'
import { expectCode, getMsgExecuteLegacyFixture, getMsgQueryLegacyFixture, makeContext } from '../../test-utils';

const queryMsg = getMsgQueryLegacyFixture('misc/schema', '/arrays-ref.json');
const execMsg = getMsgExecuteLegacyFixture('misc/schema', '/arrays-ref.json');
const ctx = makeContext(queryMsg);

it('execute_msg_for__empty', () => {
    expectCode(createTypeInterface(
        ctx,
        queryMsg
    ))
})


it('query classes', () => {
    expectCode(createQueryClass(
        ctx,
        'SG721QueryClient',
        'SG721ReadOnlyInstance',
        queryMsg
    ))
});

it('execute classes array types', () => {
    expectCode(createExecuteClass(
        ctx,
        'SG721Client',
        'SG721Instance',
        null,
        execMsg
    ))
});

it('execute interfaces no extends', () => {
    expectCode(createExecuteInterface(
        ctx,
        'SG721Instance',
        null,
        execMsg
    ))
});
