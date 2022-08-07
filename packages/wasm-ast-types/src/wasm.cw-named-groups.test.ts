import generate from '@babel/generator';
import execute_msg from './../../../__fixtures__/daodao/cw-named-groups/execute_msg.json';

import {
    createQueryClass,
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
