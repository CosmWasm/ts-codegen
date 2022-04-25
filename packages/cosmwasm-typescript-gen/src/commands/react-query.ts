import { prompt } from '../prompt';
import reactQuery from '../react-query';
import { sync as glob } from 'glob';
import { readFileSync } from 'fs';

export default async (argv) => {

    const questions = [
        {
            _: true,
            type: 'path',
            name: 'schema',
            message: 'which directory contains the the Rust contracts?',
            default: './schema'
        },
        {
            _: true,
            type: 'path',
            name: 'out',
            message: 'where is the output directory?',
            default: './ts'
        },
        {
            _: true,
            type: 'string',
            name: 'name',
            message: 'contract name?'
        }
    ];

    const { schema, out, name } = await prompt(questions, argv);

    const files = glob(schema + '/**/*.json');
    const schemas = files.map(file => JSON.parse(readFileSync(file, 'utf-8')));
    await reactQuery(name, schemas, out);
};