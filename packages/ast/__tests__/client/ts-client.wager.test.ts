import {
  createExecuteClass,
  createQueryClass,
  createTypeInterface
} from '../../src'
import { expectCode, globIdlBasedContracts, makeContext } from '../../test-utils';

const globbed = globIdlBasedContracts('wager').find(c => c.name === '/cw-wager.json')!;
const wagerJson = globbed.content;

const queryCtx = makeContext(wagerJson.query);
const executeCtx = makeContext(wagerJson.execute);

it('query', () => {
  expectCode(createTypeInterface(
    queryCtx,
    wagerJson.query
  ))
})

it('execute', () => {
  expectCode(createTypeInterface(
    executeCtx,
    wagerJson.execute
  ))
})

it('query classes', () => {
  expectCode(createQueryClass(
    queryCtx,
    'WagerQueryClient',
    'WagerReadOnlyInstance',
    wagerJson.query
  ))
});

it('execute classes', () => {
  expectCode(createExecuteClass(
    executeCtx,
    'WagerClient',
    'WagerInstance',
    null,
    wagerJson.execute
  ))
});
