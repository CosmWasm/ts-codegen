import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

import query_msg from './__fixtures__/schema/query_msg.json';

import {
    createRecoilSelector,
    createRecoilSelectors,
    createRecoilQueryClient,
} from './recoil';

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

it('selector', () => {
    expectCode(createRecoilSelector(
        'SG721',
        'SG721QueryClient',
        'governanceModules'
    ))
});

it('selectors', () => {
    expectCode(t.program(createRecoilSelectors(
        'SG721',
        'SG721QueryClient',
        query_msg
    )))
});

it('client', () => {
    printCode(createRecoilQueryClient(
        'SG721',
        'SG721QueryClient'
    ))
});
