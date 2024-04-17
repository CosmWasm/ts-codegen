import { createExecuteClass, createExecuteInterface } from '../client';
import { expectCode, makeContext } from '../../../test-utils';
import ownership from '../../../../../__fixtures__/basic/ownership.json';


// it('query classes', () => {
//     const ctx = makeContext(cosmos_msg_for__empty);
//     expectCode(createQueryClass(
//         ctx,
//         'SG721QueryClient',
//         'SG721ReadOnlyInstance',
//         cosmos_msg_for__empty
//     ))
// });

it('execute interfaces no extends', () => {
  const ctx = makeContext(ownership);
  expectCode(createExecuteInterface(
    ctx,
    'OwnershipInstance',
    null,
    ownership
  ))
});

it('ownership client with tuple', () => {
    const ctx = makeContext(ownership);
    expectCode(createExecuteClass(
        ctx,
        'OwnershipClient',
        'OwnershipInstance',
        null,
        ownership
    ))
});


