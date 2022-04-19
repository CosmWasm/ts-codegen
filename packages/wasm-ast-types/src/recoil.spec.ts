import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

import query_msg from './__fixtures__/schema/query_msg.json';

import {
    createRecoilSelectors,
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

it('query interfaces', () => {
    expectCode(createRecoilSelectors(
        'SG721',
        query_msg
    ))
});
