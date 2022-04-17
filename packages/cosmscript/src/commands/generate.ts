import { prompt } from '../prompt';
import cosmscript from '../index';
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
            default: './code'
        },
        {
            _: true,
            type: 'string',
            name: 'name',
            message: 'contract name?'
        }
    ];

    const { jsonSchemaPath, outPath, name } = await prompt(questions, argv);

    const files = glob(jsonSchemaPath + '/**/*.json');
    const schemas = files.map(file => JSON.parse(readFileSync(file, 'utf-8')));
    cosmscript(name, schemas, outPath);
};