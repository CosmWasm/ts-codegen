import message from '../../../../../__fixtures__/misc/schema/arrays.json';

import {
    createQueryClass,
    createExecuteClass,
    createExecuteInterface,
    createTypeInterface
} from '../client'
import { RenderContext } from '../../context';
import { expectCode } from '../../../test-utils';

const ctx = new RenderContext(message);

it('execute_msg_for__empty', () => {
    expectCode(createTypeInterface(
        ctx,
        message
    ))
})


it('query classes', () => {
    expectCode(createQueryClass(
        ctx,
        'SG721QueryClient',
        'SG721ReadOnlyInstance',
        message
    ))
});

it('execute classes array types', () => {
    expectCode(createExecuteClass(
        ctx,
        'SG721Client',
        'SG721Instance',
        null,
        message
    ))
});

it('execute interfaces no extends', () => {
    expectCode(createExecuteInterface(
        ctx,
        'SG721Instance',
        null,
        message
    ))
});
