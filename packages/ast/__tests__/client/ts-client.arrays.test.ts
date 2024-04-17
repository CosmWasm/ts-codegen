import {
    createQueryClass,
    createExecuteClass,
    createExecuteInterface,
    createTypeInterface
} from '../../src'
import { expectCode, getMsgExecuteLegacyFixture, getMsgQueryLegacyFixture, makeContext } from '../../test-utils';
import { getPropertyType } from '../../src/utils';
const queryMsg = getMsgQueryLegacyFixture('misc/schema', '/arrays.json');
const execMsg = getMsgExecuteLegacyFixture('misc/schema', '/arrays.json');
const ctx = makeContext(queryMsg);

it('getPropertyType', () => {
    const ast = getPropertyType(
        ctx,
        // @ts-ignore
        queryMsg.oneOf[0].properties.update_edges,
        'edges3'
    );
    expectCode(ast.type)
    // printCode(ast.type)
})

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
