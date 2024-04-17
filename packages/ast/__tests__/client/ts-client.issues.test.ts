import { ExecuteMsg, QueryMsg } from '@cosmology/ts-codegen-types';
import {
    createQueryClass,
    createExecuteClass,
    createExecuteInterface,
    createTypeInterface
} from '../../src'
import { globLegacyContracts, makeContext, expectCode } from '../../test-utils';
import cases from 'jest-in-case';

const contracts = globLegacyContracts('issues/55');


cases('execute_msg_for__empty', async opts => {
    const ctx = makeContext(opts.content);
    expectCode(createTypeInterface(
        ctx,
        opts.content
    ));
}, contracts);

cases('query classes', async opts => {
    const ctx = makeContext(opts.content);
    expectCode(createQueryClass(
        ctx,
        'SG721QueryClient',
        'SG721ReadOnlyInstance',
        opts.content as QueryMsg
    ))
}, contracts);

cases('execute class', async opts => {
    const ctx = makeContext(opts.content);
    expectCode(createExecuteClass(
        ctx,
        'SG721Client',
        'SG721Instance',
        null,
        opts.content as ExecuteMsg
    ))
}, contracts);

cases('execute interface', async opts => {
    const ctx = makeContext(opts.content);
    expectCode(createExecuteInterface(
        ctx,
        'SG721Instance',
        null,
        opts.content as ExecuteMsg
    ))
}, contracts);

