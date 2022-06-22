import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

import execute_msg from './../../../__fixtures__/daodao/cw-named-groups/execute_msg.json';
import list_addresses_response from './../../../__fixtures__/daodao/cw-named-groups/list_addresses_response.json';
import dump_response from './../../../__fixtures__/daodao/cw-named-groups/dump_response.json';
import list_groups_response from './../../../__fixtures__/daodao/cw-named-groups/list_groups_response.json';
import instantiate_msg from './../../../__fixtures__/daodao/cw-named-groups/instantiate_msg.json';
import group from './../../../__fixtures__/daodao/cw-named-groups/group.json';
import query_msg from './../../../__fixtures__/daodao/cw-named-groups/query_msg.json';

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

it('execute_msg', () => {
    expectCode(createTypeInterface(
        execute_msg
    ))
})


it('query classes', () => {
    expectCode(createQueryClass(
        'SG721QueryClient',
        'SG721ReadOnlyInstance',
        execute_msg
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
