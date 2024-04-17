import query_msg from '../../../../../__fixtures__/daodao/cw-admin-factory/query_msg.json';

import {
    createQueryClass,
    createQueryInterface
} from '../client'
import { expectCode, makeContext } from '../../../test-utils';

const ctx = makeContext(query_msg);

it('query classes', () => {
    expectCode(createQueryClass(
        ctx,
        'SG721QueryClient',
        'SG721ReadOnlyInstance',
        query_msg
    ))
});

it('query interface', () => {
    expectCode(
        createQueryInterface(
            ctx,
            'ReadOnlyInstance',
            query_msg
        )
    )
});
