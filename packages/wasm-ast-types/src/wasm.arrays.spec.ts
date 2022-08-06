import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

import message from './../../../__fixtures__/misc/schema/arrays.json';

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

it('execute_msg_for__empty', () => {
    expectCode(createTypeInterface(
        message
    ))
})


it('query classes', () => {
    expectCode(createQueryClass(
        'SG721QueryClient',
        'SG721ReadOnlyInstance',
        message
    ))
});

it('execute classes array types', () => {
    expectCode(createExecuteClass(
        'SG721Client',
        'SG721Instance',
        null,
        message
    ))
});

it('execute interfaces no extends', () => {
    expectCode(createExecuteInterface(
        'SG721Instance',
        null,
        message
    ))
});
