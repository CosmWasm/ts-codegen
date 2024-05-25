import { ExecuteMsg } from '@cosmwasm/ts-codegen-types';

import { createExecuteClass, createExecuteInterface } from '../../src';
import { expectCode, globLegacyContracts, makeContext } from '../../test-utils';

const contract = globLegacyContracts('basic').find(c => c.name === '/ownership.json')!;
const ownership = contract.content;

it('execute interfaces no extends', () => {
  const ctx = makeContext(ownership);
  expectCode(createExecuteInterface(
    ctx,
    'OwnershipInstance',
    null,
    ownership as ExecuteMsg
  ));
});

it('ownership client with tuple', () => {
  const ctx = makeContext(ownership);
  expectCode(createExecuteClass(
    ctx,
    'OwnershipClient',
    'OwnershipInstance',
    null,
    ownership as ExecuteMsg
  ));
});


