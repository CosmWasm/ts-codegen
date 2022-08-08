// DEPRECATED
import { prompt } from '../utils/prompt';
import deprecatedGeneration from '../generators/client';
import { readSchemas } from '../utils';

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
    const schemas = await readSchemas({ schemaDir: schema, schemaOptions: argv });
    await deprecatedGeneration(name, schemas, out);
    console.log('WARNING: use ts-client instead. "generate" cmd soon to be deprecated.');
};