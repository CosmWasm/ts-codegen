import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

import execute_msg from './../../../__fixtures__/basic/execute_msg_for__empty.json';

import {
    createInterface
} from './jsonschema-types'

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

it('createInterface', () => {
    printCode(createInterface(
        execute_msg
    ))
});
