import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

import query_msg from './../../../__fixtures__/daodao/cw-admin-factory/query_msg.json';

import {
    createQueryClass,
    createQueryInterface
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

const ctx = new RenderContext(query_msg);

it('query classes', () => {
    expectCode(createQueryClass(
        ctx,
        'SG721QueryClient',
        'SG721ReadOnlyInstance',
        query_msg
    ))
});

it('query interface', () => {
    expectCode(
        createQueryInterface(
            ctx,
            'ReadOnlyInstance',
            query_msg
        )
    )
});
