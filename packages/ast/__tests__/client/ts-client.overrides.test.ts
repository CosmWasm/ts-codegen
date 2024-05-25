import {
  createExecuteClass
} from '../../src';
import { expectCode, getMsgExecuteLegacyFixture, makeContext } from '../../test-utils';

const execMsg = getMsgExecuteLegacyFixture('sg721', '/execute_msg_for__empty.json');
const ctx = makeContext(execMsg);

it('Impl, execExtends, noExtendsClass', () => {
  ctx.options.client.noImplicitOverride = false;
  ctx.options.client.execExtendsQuery = true;
  expectCode(createExecuteClass(
    ctx,
    'SG721Client',
    'SG721Instance',
    null,
    execMsg
  ));
});

it('Impl, execExtends, ExtendsClass', () => {
  ctx.options.client.noImplicitOverride = false;
  ctx.options.client.execExtendsQuery = true;
  expectCode(createExecuteClass(
    ctx,
    'SG721Client',
    'SG721Instance',
    'ExtendsClassName',
    execMsg
  ));
});

it('noImpl, execExtends, ExtendsClass', () => {
  ctx.options.client.noImplicitOverride = true;
  ctx.options.client.execExtendsQuery = true;
  expectCode(createExecuteClass(
    ctx,
    'SG721Client',
    'SG721Instance',
    'ExtendsClassName',
    execMsg
  ));
});

it('noImpl, noExecExtends, ExtendsClass', () => {
  ctx.options.client.noImplicitOverride = true;
  ctx.options.client.execExtendsQuery = false;
  expectCode(createExecuteClass(
    ctx,
    'SG721Client',
    'SG721Instance',
    'ExtendsClassName',
    execMsg
  ));
});

it('noImpl, noExecExtends, noExtendsClass', () => {
  ctx.options.client.noImplicitOverride = true;
  ctx.options.client.execExtendsQuery = false;
  expectCode(createExecuteClass(
    ctx,
    'SG721Client',
    'SG721Instance',
    null,
    execMsg
  ));
});
