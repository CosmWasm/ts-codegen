import wagerJson from '../../../../../__fixtures__/wager/cw-wager.json';
import {
    createQueryClass,
    createExecuteClass,
    createExecuteInterface,
    createTypeInterface
} from '../client'
import { expectCode, makeContext } from '../../../test-utils';

const queryCtx = makeContext(wagerJson.query);
const executeCtx = makeContext(wagerJson.execute);

it('query', () => {
    expectCode(createTypeInterface(
        queryCtx,
        wagerJson.query
    ))
})

it('execute', () => {
    expectCode(createTypeInterface(
        executeCtx,
        wagerJson.execute
    ))
})

it('query classes', () => {
    expectCode(createQueryClass(
        queryCtx,
        'WagerQueryClient',
        'WagerReadOnlyInstance',
        wagerJson.query
    ))
});

// it('execute classes array types', () => {
//     expectCode(createExecuteClass(
//         ctx,
//         'SG721Client',
//         'SG721Instance',
//         null,
//         wagerJson
//     ))
// });

// it('execute interfaces no extends', () => {
//     expectCode(createExecuteInterface(
//         ctx,
//         'SG721Instance',
//         null,
//         wagerJson
//     ))
// });
