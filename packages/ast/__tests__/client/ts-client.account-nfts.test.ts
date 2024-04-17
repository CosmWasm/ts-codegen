import {
  createExecuteClass,
  createExecuteInterface,
  createQueryClass,
  createTypeInterface
} from '../../src';
import { expectCode, makeContext } from '../../test-utils';
import { JSONSchema } from '@cosmology/ts-codegen-types';

import nftIdlVersionData from '../../../../__fixtures__/idl-version/accounts-nft/account-nft.json';

// @ts-ignore
export const nftIdlVersion: JSONSchema = nftIdlVersionData;

// @ts-ignore
const message = nftIdlVersion.query;
const ctx = makeContext(message);

it('execute_msg_for__empty', () => {
  expectCode(createTypeInterface(ctx, message));
});

it('query classes', () => {
  expectCode(
    createQueryClass(ctx, 'SG721QueryClient', 'SG721ReadOnlyInstance', message)
  );
});

// it('query classes response', () => {
//     expectCode(createTypeInterface(
//         ctx,
//         contract.responses.all_debt_shares
//     ))
// });

it('execute classes array types', () => {
  expectCode(
    createExecuteClass(ctx, 'SG721Client', 'SG721Instance', null, message)
  );
});

it('execute interfaces no extends', () => {
  expectCode(createExecuteInterface(ctx, 'SG721Instance', null, message));
});
