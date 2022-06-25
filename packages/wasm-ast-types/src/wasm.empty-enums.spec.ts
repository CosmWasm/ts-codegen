import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

import query_msg from './../../../__fixtures__/daodao/cw-admin-factory/query_msg.json';

import {
    createQueryClass,
    createQueryInterface
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


it('query classes', () => {
    expectCode(createQueryClass(
        'SG721QueryClient',
        'SG721ReadOnlyInstance',
        query_msg
    ))
});

it('query interface', () => {
    expectCode(
        createQueryInterface('ReadOnlyInstance', query_msg)
    )
});
