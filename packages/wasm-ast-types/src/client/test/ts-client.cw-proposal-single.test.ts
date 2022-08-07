import execute_msg from '../../../../../__fixtures__/daodao/cw-proposal-single/execute_msg.json';
import query_msg from '../../../../../__fixtures__/daodao/cw-proposal-single/query_msg.json';

import {
    createQueryClass,
    createExecuteClass,
    createExecuteInterface,
    createTypeInterface
} from '../client'
import { RenderContext } from '../../context';
import { expectCode } from '../../../test-utils';

it('execute_msg_for', () => {
    const ctx = new RenderContext(execute_msg);
    expectCode(createTypeInterface(
        ctx,
        execute_msg
    ))
})


it('query classes', () => {
    const ctx = new RenderContext(query_msg);
    expectCode(createQueryClass(
        ctx,
        'SG721QueryClient',
        'SG721ReadOnlyInstance',
        query_msg
    ))
});

it('execute classes array types', () => {
    const ctx = new RenderContext(execute_msg);
    expectCode(createExecuteClass(
        ctx,
        'SG721Client',
        'SG721Instance',
        null,
        execute_msg
    ))
});

it('execute interfaces no extends', () => {
    const ctx = new RenderContext(execute_msg);
    expectCode(createExecuteInterface(
        ctx,
        'SG721Instance',
        null,
        execute_msg
    ))
});
