import contract from '../../../../../__fixtures__/issues/103/schema.json';

import {
    createQueryClass,
    createExecuteClass,
    createExecuteInterface,
    createTypeInterface
} from '../client'
import { expectCode, printCode, makeContext } from '../../../test-utils';

const queryMessage = contract.query
const executeMessage = contract.execute
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
            contract.query
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
            contract.query
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
