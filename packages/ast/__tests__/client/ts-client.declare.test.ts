import {
  createExecuteClass
} from '../../src';
import { expectCode, getMsgExecuteLegacyFixture, makeContext } from '../../test-utils';

const execMsg = getMsgExecuteLegacyFixture('sg721', '/execute_msg_for__empty.json');
const ctx = makeContext(execMsg);

it('noDeclare, execExtends, noExtendsClass', () => {
  ctx.options.client.useDeclareKeyword = false;
  ctx.options.client.execExtendsQuery = true;
  expectCode(createExecuteClass(
    ctx,
    'SG721Client',
    'SG721Instance',
    null,
    execMsg
  ));
});

it('noDeclare, execExtends, ExtendsClass', () => {
  ctx.options.client.useDeclareKeyword = false;
  ctx.options.client.execExtendsQuery = true;
  expectCode(createExecuteClass(
    ctx,
    'SG721Client',
    'SG721Instance',
    'ExtendsClassName',
    execMsg
  ));
});

it('useDeclare, execExtends, ExtendsClass', () => {
  ctx.options.client.useDeclareKeyword = true;
  ctx.options.client.execExtendsQuery = true;
  expectCode(createExecuteClass(
    ctx,
    'SG721Client',
    'SG721Instance',
    'ExtendsClassName',
    execMsg
  ));
});

it('useDeclare, noExecExtends, ExtendsClass', () => {
  ctx.options.client.useDeclareKeyword = true;
  ctx.options.client.execExtendsQuery = false;
  expectCode(createExecuteClass(
    ctx,
    'SG721Client',
    'SG721Instance',
    'ExtendsClassName',
    execMsg
  ));
});

it('useDeclare, noExecExtends, noExtendsClass', () => {
  ctx.options.client.useDeclareKeyword = true;
  ctx.options.client.execExtendsQuery = false;
  expectCode(createExecuteClass(
    ctx,
    'SG721Client',
    'SG721Instance',
    null,
    execMsg
  ));
});
