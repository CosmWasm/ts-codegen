import {
  createExecuteClass,
  createExecuteInterface,
  createQueryClass,
  createTypeInterface
} from '../../src'
import { expectCode, getMsgExecuteLegacyFixture, getMsgQueryLegacyFixture, makeContext } from '../../test-utils';

const execMsg = getMsgExecuteLegacyFixture('sg721', '/execute_msg_for__empty.json');
const queryMsg = getMsgQueryLegacyFixture('sg721', '/execute_msg_for__empty.json');
const ctx = makeContext(execMsg);

it('execute_msg_for__empty', () => {
  expectCode(createTypeInterface(
    ctx,
    execMsg
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
