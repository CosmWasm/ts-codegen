import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

import query_msg from './__fixtures__/schema/query_msg.json';
import execute_msg from './__fixtures__/schema/execute_msg_for__empty.json';
import approval_response from './__fixtures__/schema/approval_response.json';
import all_nft_info_response from './__fixtures__/schema/all_nft_info_response.json';
import approvals_response from './__fixtures__/schema/approvals_response.json';
import collection_info_response from './__fixtures__/schema/collection_info_response.json';
import contract_info_response from './__fixtures__/schema/contract_info_response.json';
import instantiate_msg from './__fixtures__/schema/instantiate_msg.json';
import nft_info_response from './__fixtures__/schema/nft_info_response.json';
import num_tokens_response from './__fixtures__/schema/num_tokens_response.json';
import operators_response from './__fixtures__/schema/operators_response.json';
import owner_of_response from './__fixtures__/schema/owner_of_response.json';
import tokens_response from './__fixtures__/schema/tokens_response.json';

import {
  createQueryClass,
  createQueryInterface,
  createExecuteClass,
  createExecuteInterface,
  createTypeInterface
} from './wasm'

const expectCode = (ast) => {
  expect(
    generate(ast).code
  ).toMatchSnapshot();
}

const printCode = (ast) => {
  console.log(
    generate(ast).code
  );
}

it('approval_response', () => {
  expectCode(createTypeInterface(
    approval_response
  ))
});

it('all_nft_info_response', () => {
  expectCode(createTypeInterface(
    all_nft_info_response
  ))
})
it('approvals_response', () => {
  expectCode(createTypeInterface(
    approvals_response
  ))
})
it('collection_info_response', () => {
  expectCode(createTypeInterface(
    collection_info_response
  ))
})
it('contract_info_response', () => {
  expectCode(createTypeInterface(
    contract_info_response
  ))
})
it('instantiate_msg', () => {
  expectCode(createTypeInterface(
    instantiate_msg
  ))
})
it('nft_info_response', () => {
  expectCode(createTypeInterface(
    nft_info_response
  ))
})
it('num_tokens_response', () => {
  expectCode(createTypeInterface(
    num_tokens_response
  ))
})
it('operators_response', () => {
  expectCode(createTypeInterface(
    operators_response
  ))
})
it('owner_of_response', () => {
  expectCode(createTypeInterface(
    owner_of_response
  ))
})
it('tokens_response', () => {
  expectCode(createTypeInterface(
    tokens_response
  ))
})

it('query classes', () => {
  expectCode(createQueryClass(
    'SG721QueryClient',
    'SG721ReadOnlyInstance',
    query_msg
  ))
});

it('execute classes', () => {
  expectCode(createExecuteClass(
    'SG721Client',
    'SG721Instance',
    'SG721QueryClient',
    execute_msg
  ))
});

it('execute interfaces', () => {
  expectCode(createExecuteInterface(
    'SG721Instance',
    'SG721ReadOnlyInstance',
    execute_msg
  ))
});

it('query interfaces', () => {
  expectCode(createQueryInterface(
    'SG721ReadOnlyInstance',
    query_msg
  ))
});
