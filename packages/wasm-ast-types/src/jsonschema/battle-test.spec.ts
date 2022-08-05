import generate from '@babel/generator';
import { sync as glob } from 'glob';
import { readFileSync } from 'fs';
import {
    RenderContext,
    processTypes,
} from './jsonschema-types'
import cases from 'jest-in-case';

const minter = glob(__dirname + '/../../../../__fixtures__/minter/*.json').map(file => {
    return { name: file.split('__fixtures__')[1], content: JSON.parse(readFileSync(file, 'utf-8')) }
});

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

const context: RenderContext = {
    options: {
        optionalArrays: true
    }
}

cases('minter', opts => {
    processTypes(
        context,
        opts.content
    ).map(ast => {
        expectCode(ast);
    })
}, minter);

it('processTypes', () => {

});