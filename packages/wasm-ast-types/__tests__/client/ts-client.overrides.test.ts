import execute_msg_for__empty from '../../../../../__fixtures__/sg721/execute_msg_for__empty.json';
import {
    createQueryClass,
    createExecuteClass,
    createExecuteInterface,
    createTypeInterface
} from '../client'
import { expectCode, makeContext } from '../../../test-utils';

const ctx = makeContext(execute_msg_for__empty);

describe('exec', () => {

})

it('Impl, execExtends, noExtendsClass', () => {
    ctx.options.client.noImplicitOverride = false;
    ctx.options.client.execExtendsQuery = true;
    expectCode(createExecuteClass(
        ctx,
        'SG721Client',
        'SG721Instance',
        null,
        execute_msg_for__empty
    ))
});

it('Impl, execExtends, ExtendsClass', () => {
    ctx.options.client.noImplicitOverride = false;
    ctx.options.client.execExtendsQuery = true;
    expectCode(createExecuteClass(
        ctx,
        'SG721Client',
        'SG721Instance',
        'ExtendsClassName',
        execute_msg_for__empty
    ))
});

it('noImpl, execExtends, ExtendsClass', () => {
    ctx.options.client.noImplicitOverride = true;
    ctx.options.client.execExtendsQuery = true;
    expectCode(createExecuteClass(
        ctx,
        'SG721Client',
        'SG721Instance',
        'ExtendsClassName',
        execute_msg_for__empty
    ))
});

it('noImpl, noExecExtends, ExtendsClass', () => {
    ctx.options.client.noImplicitOverride = true;
    ctx.options.client.execExtendsQuery = false;
    expectCode(createExecuteClass(
        ctx,
        'SG721Client',
        'SG721Instance',
        'ExtendsClassName',
        execute_msg_for__empty
    ))
});

it('noImpl, noExecExtends, noExtendsClass', () => {
    ctx.options.client.noImplicitOverride = true;
    ctx.options.client.execExtendsQuery = false;
    expectCode(createExecuteClass(
        ctx,
        'SG721Client',
        'SG721Instance',
        null,
        execute_msg_for__empty
    ))
});
