import {
    createQueryClass,
    createExecuteClass,
    createExecuteInterface,
    createTypeInterface
} from '../../src';

import { expectCode, globLegacyContracts, makeContext } from '../../test-utils';

const globbed = globLegacyContracts('issues/103').find(c => c.name === '/schema.json')!;
const contract = globbed.content;


// @ts-ignore
const queryMessage = contract.query;
// @ts-ignore
const executeMessage = contract.execute;
const queryCtx = makeContext(queryMessage);
const executeCtx = makeContext(executeMessage);

describe('query', () => {
    it('execute_msg_for__empty', () => {
        expectCode(createTypeInterface(
            queryCtx,
            queryMessage
        ))
    })


    it('query classes', () => {
        expectCode(createQueryClass(
            queryCtx,
            'QueryClient',
            'ReadOnlyInstance',
            queryMessage
        ))
    });

    it('query classes response', () => {
        expectCode(createTypeInterface(
            queryCtx,
            queryMessage
        ))
    });

    it('execute classes array types', () => {
        expectCode(createExecuteClass(
            queryCtx,
            'Client',
            'Instance',
            null,
            queryMessage
        ))
    });

    it('execute interfaces no extends', () => {
        expectCode(createExecuteInterface(
            queryCtx,
            'SG721Instance',
            null,
            queryMessage
        ))
    });

});

describe('execute', () => {
    it('execute_msg_for__empty', () => {
        expectCode(createTypeInterface(
            executeCtx,
            executeMessage
        ))
    })


    it('query classes', () => {
        expectCode(createQueryClass(
            executeCtx,
            'QueryClient',
            'ReadOnlyInstance',
            executeMessage
        ))
    });

    it('query classes response', () => {
        expectCode(createTypeInterface(
            executeCtx,
            // @ts-ignore
            queryMessage
        ))
    });

    it('execute classes array types', () => {
        expectCode(createExecuteClass(
            executeCtx,
            'Client',
            'Instance',
            null,
            executeMessage
        ))
    });

    it('execute interfaces no extends', () => {
        expectCode(createExecuteInterface(
            executeCtx,
            'SG721Instance',
            null,
            executeMessage
        ))
    });

});
