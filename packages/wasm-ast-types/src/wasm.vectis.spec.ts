import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

import cosmos_msg_for__empty from './../../../__fixtures__/vectis/govec/cosmos_msg_for__empty.json';
import execute_msg_for__empty from './../../../__fixtures__/vectis/govec/execute_msg_for__empty.json';

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

it('cosmos_msg_for__empty', () => {
    expectCode(createTypeInterface(
        cosmos_msg_for__empty
    ))
});

it('execute_msg_for__empty', () => {
    expectCode(createTypeInterface(
        execute_msg_for__empty
    ))
})


it('query classes', () => {
    expectCode(createQueryClass(
        'SG721QueryClient',
        'SG721ReadOnlyInstance',
        cosmos_msg_for__empty
    ))
});

it('query classes', () => {
    expectCode(createQueryClass(
        'SG721QueryClient',
        'SG721ReadOnlyInstance',
        execute_msg_for__empty
    ))
});

it('execute classes array types', () => {
    expectCode(createExecuteClass(
        'SG721Client',
        'SG721Instance',
        null,
        execute_msg_for__empty
    ))
});

it('execute interfaces no extends', () => {
    expectCode(createExecuteInterface(
        'SG721Instance',
        null,
        execute_msg_for__empty
    ))
});
