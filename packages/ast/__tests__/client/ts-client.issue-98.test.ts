import { ExecuteMsg } from '@cosmwasm/ts-codegen-types';
import {
    createQueryClass,
    createExecuteClass,
    createExecuteInterface,
    createTypeInterface
} from '../../src';

import { expectCode, makeContext, globIdlBasedContracts } from '../../test-utils';

const contract = globIdlBasedContracts('issues/98').find(c => c.name === '/schema.json')!;

const message = contract.content.query
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
        'SG721QueryClient',
        'SG721ReadOnlyInstance',
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
        'SG721Client',
        'SG721Instance',
        null,
        // @ts-ignore
        message as ExecuteMsg
    ))
});

it('execute interfaces no extends', () => {
    expectCode(createExecuteInterface(
        ctx,
        'SG721Instance',
        null,
        // @ts-ignore
        message
    ))
});
