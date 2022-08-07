import generate from '@babel/generator';
import * as t from '@babel/types';

import query_msg from './../../../__fixtures__/basic/query_msg.json';

import {
    createRecoilSelector,
    createRecoilSelectors,
    createRecoilQueryClient,
} from './recoil';
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

it('selector', () => {
    expectCode(createRecoilSelector(
        ctx,
        'SG721',
        'SG721QueryClient',
        'governanceModules'
    ))
});

it('selectors', () => {
    expectCode(t.program(createRecoilSelectors(
        ctx,
        'SG721',
        'SG721QueryClient',
        query_msg
    )))
});

it('client', () => {
    expectCode(createRecoilQueryClient(
        ctx,
        'SG721',
        'SG721QueryClient'
    ))
});
