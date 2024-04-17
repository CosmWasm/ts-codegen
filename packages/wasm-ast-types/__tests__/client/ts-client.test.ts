import execute_msg_named_groups from '../../../../../__fixtures__/daodao/cw-named-groups/execute_msg.json';

import query_msg from '../../../../../__fixtures__/basic/query_msg.json';
import execute_msg from '../../../../../__fixtures__/basic/execute_msg_for__empty.json';
import approval_response from '../../../../../__fixtures__/basic/approval_response.json';
import all_nft_info_response from '../../../../../__fixtures__/basic/all_nft_info_response.json';
import approvals_response from '../../../../../__fixtures__/basic/approvals_response.json';
import collection_info_response from '../../../../../__fixtures__/basic/collection_info_response.json';
import contract_info_response from '../../../../../__fixtures__/basic/contract_info_response.json';
import instantiate_msg from '../../../../../__fixtures__/basic/instantiate_msg.json';
import nft_info_response from '../../../../../__fixtures__/basic/nft_info_response.json';
import num_tokens_response from '../../../../../__fixtures__/basic/num_tokens_response.json';
import operators_response from '../../../../../__fixtures__/basic/operators_response.json';
import owner_of_response from '../../../../../__fixtures__/basic/owner_of_response.json';
import tokens_response from '../../../../../__fixtures__/basic/tokens_response.json';

import {
  createQueryClass,
  createQueryInterface,
  createExecuteClass,
  createExecuteInterface,
  createTypeInterface
} from '../client';

import { expectCode, makeContext } from '../../../test-utils';

it('approval_response', () => {
  const ctx = makeContext(approval_response);
  expectCode(createTypeInterface(
    ctx,
    approval_response
  ))
});

it('all_nft_info_response', () => {
  const ctx = makeContext(all_nft_info_response);
  expectCode(createTypeInterface(
    ctx,
    all_nft_info_response
  ))
})
it('approvals_response', () => {
  const ctx = makeContext(approvals_response);
  expectCode(createTypeInterface(
    ctx,
    approvals_response
  ))
})
it('collection_info_response', () => {
  const ctx = makeContext(collection_info_response);
  expectCode(createTypeInterface(
    ctx,
    collection_info_response
  ))
})
it('contract_info_response', () => {
  const ctx = makeContext(contract_info_response);
  expectCode(createTypeInterface(
    ctx,
    contract_info_response
  ))
})
it('instantiate_msg', () => {
  const ctx = makeContext(instantiate_msg);
  expectCode(createTypeInterface(
    ctx,
    instantiate_msg
  ))
})
it('nft_info_response', () => {
  const ctx = makeContext(nft_info_response);
  expectCode(createTypeInterface(
    ctx,
    nft_info_response
  ))
})
it('num_tokens_response', () => {
  const ctx = makeContext(num_tokens_response);
  expectCode(createTypeInterface(
    ctx,
    num_tokens_response
  ))
})
it('operators_response', () => {
  const ctx = makeContext(operators_response);
  expectCode(createTypeInterface(
    ctx,
    operators_response
  ))
})
it('owner_of_response', () => {
  const ctx = makeContext(owner_of_response);
  expectCode(createTypeInterface(
    ctx,
    owner_of_response
  ))
})
it('tokens_response', () => {
  const ctx = makeContext(tokens_response);
  expectCode(createTypeInterface(
    ctx,
    tokens_response
  ))
})

it('query classes', () => {
  const ctx = makeContext(query_msg);
  expectCode(createQueryClass(
    ctx,
    'SG721QueryClient',
    'SG721ReadOnlyInstance',
    query_msg
  ))
});

it('execute classes', () => {
  const ctx = makeContext(execute_msg);
  expectCode(createExecuteClass(
    ctx,
    'SG721Client',
    'SG721Instance',
    'SG721QueryClient',
    execute_msg
  ))
});

it('execute classes no extends', () => {
  const ctx = makeContext(execute_msg);
  expectCode(createExecuteClass(
    ctx,
    'SG721Client',
    'SG721Instance',
    null,
    execute_msg
  ))
});

it('execute classes array types', () => {
  const ctx = makeContext(execute_msg_named_groups);
  expectCode(createExecuteClass(
    ctx,
    'SG721Client',
    'SG721Instance',
    null,
    execute_msg_named_groups
  ))
});

it('execute interfaces no extends', () => {
  const ctx = makeContext(execute_msg);
  expectCode(createExecuteInterface(
    ctx,
    'SG721Instance',
    null,
    execute_msg
  ))
});

it('query interfaces', () => {
  const ctx = makeContext(query_msg);
  expectCode(createQueryInterface(
    ctx,
    'SG721ReadOnlyInstance',
    query_msg
  ))
});
