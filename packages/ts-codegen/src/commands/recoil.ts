import { prompt } from '../utils/prompt';
import generateRecoil from '../generators/recoil';
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
    await generateRecoil(name, schemas, out);
};