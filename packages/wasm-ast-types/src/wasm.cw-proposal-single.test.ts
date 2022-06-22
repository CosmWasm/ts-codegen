import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

import execute_msg from './../../../__fixtures__/daodao/cw-proposal-single/execute_msg.json';
import governance_modules_response from './../../../__fixtures__/daodao/cw-proposal-single/governance_modules_response.json';
import config_response from './../../../__fixtures__/daodao/cw-proposal-single/config_response.json';
import proposal_count_response from './../../../__fixtures__/daodao/cw-proposal-single/proposal_count_response.json';
import vote_hooks_response from './../../../__fixtures__/daodao/cw-proposal-single/vote_hooks_response.json';
import list_votes_response from './../../../__fixtures__/daodao/cw-proposal-single/list_votes_response.json';
import migrate_msg from './../../../__fixtures__/daodao/cw-proposal-single/migrate_msg.json';
import vote_response from './../../../__fixtures__/daodao/cw-proposal-single/vote_response.json';
import reverse_proposals_response from './../../../__fixtures__/daodao/cw-proposal-single/reverse_proposals_response.json';
import info_response from './../../../__fixtures__/daodao/cw-proposal-single/info_response.json';
import instantiate_msg from './../../../__fixtures__/daodao/cw-proposal-single/instantiate_msg.json';
import list_proposals_response from './../../../__fixtures__/daodao/cw-proposal-single/list_proposals_response.json';
import proposal_hooks_response from './../../../__fixtures__/daodao/cw-proposal-single/proposal_hooks_response.json';
import query_msg from './../../../__fixtures__/daodao/cw-proposal-single/query_msg.json';
import proposal_response from './../../../__fixtures__/daodao/cw-proposal-single/proposal_response.json';

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

it('execute_msg_for', () => {
    expectCode(createTypeInterface(
        execute_msg
    ))
})


it('query classes', () => {
    expectCode(createQueryClass(
        'SG721QueryClient',
        'SG721ReadOnlyInstance',
        query_msg
    ))
});

it('execute classes array types', () => {
    expectCode(createExecuteClass(
        'SG721Client',
        'SG721Instance',
        null,
        execute_msg
    ))
});

it('execute interfaces no extends', () => {
    expectCode(createExecuteInterface(
        'SG721Instance',
        null,
        execute_msg
    ))
});
