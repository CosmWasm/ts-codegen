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
const ctx = new RenderContext(message);

it('execute_msg_for__empty', () => {
    expectCode(createTypeInterface(
        ctx,
        message
    ))
})


it('query classes', () => {
    expectCode(createQueryClass(
        ctx,
        'SG721QueryClient',
        'SG721ReadOnlyInstance',
        message
    ))
});

it('execute classes array types', () => {
    expectCode(createExecuteClass(
        ctx,
        'SG721Client',
        'SG721Instance',
        null,
        message
    ))
});

it('execute interfaces no extends', () => {
    expectCode(createExecuteInterface(
        ctx,
        'SG721Instance',
        null,
        message
    ))
});
