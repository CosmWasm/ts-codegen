import contract from '../../../../../__fixtures__/issues/103/schema.json';

import {
    createQueryClass,
    createExecuteClass,
    createExecuteInterface,
    createTypeInterface
} from '../client'
import { expectCode, printCode, makeContext } from '../../../test-utils';

const message = contract.query
const ctx = makeContext(message);

it('execute_msg_for__empty', () => {
    expectCode(createTypeInterface(
        ctx,
        message
    ))
})


it('query classes', () => {
    expectCode(createQueryClass(
        ctx,
        'QueryClient',
        'ReadOnlyInstance',
        message
    ))
});

// it('query classes response', () => {
//     expectCode(createTypeInterface(
//         ctx,
//         contract.responses.all_debt_shares
//     ))
// });

it('execute classes array types', () => {
    expectCode(createExecuteClass(
        ctx,
        'Client',
        'Instance',
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
