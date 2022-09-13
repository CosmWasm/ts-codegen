import generate from '@babel/generator';
import { sync as glob } from 'glob';
import { readFileSync } from 'fs';
import { join } from 'path';
import { JSONSchema } from '../src/types';
import { RenderContext, RenderOptions } from '../src/context';

export const expectCode = (ast) => {
    expect(
        generate(ast).code
    ).toMatchSnapshot();
}

export const printCode = (ast) => {
    console.log(
        generate(ast).code
    );
}

export const makeContext = (
    schema: JSONSchema,
    options?: RenderOptions,
    responses?: Record<string, JSONSchema>
) => {
    return new RenderContext({
        schemas: [schema],
        responses
    }, options)
};

interface GlobContract {
    name: `/${string}.json`;
    content: JSONSchema;
}

export const globContracts = (p: string): GlobContract[] => {
    return glob(join(__dirname, '/../../../__fixtures__/', p, '/*.json')).map(file => {
        return { name: file.split('__fixtures__')[1], content: JSON.parse(readFileSync(file, 'utf-8')) }
    });
};
