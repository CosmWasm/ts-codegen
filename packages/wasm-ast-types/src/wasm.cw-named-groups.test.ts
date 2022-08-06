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
import { RenderContext } from './utils/types';

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

const ctx = new RenderContext(execute_msg);

it('execute_msg', () => {
    expectCode(createTypeInterface(
        ctx,
        execute_msg
    ))
})


it('query classes', () => {
    expectCode(createQueryClass(
        ctx,
        'SG721QueryClient',
        'SG721ReadOnlyInstance',
        execute_msg
    ))
});

it('execute classes array types', () => {
    expectCode(createExecuteClass(
        ctx,
        'SG721Client',
        'SG721Instance',
        null,
        execute_msg
    ))
});

it('execute interfaces no extends', () => {
    expectCode(createExecuteInterface(
        ctx,
        'SG721Instance',
        null,
        execute_msg
    ))
});
