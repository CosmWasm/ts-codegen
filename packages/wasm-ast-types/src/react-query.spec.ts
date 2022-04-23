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
  createReactQueryHook,
} from './react-query'

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

it('create hook', () => {
  printCode(createReactQueryHook())
});

