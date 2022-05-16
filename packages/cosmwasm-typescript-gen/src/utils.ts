import { sync as glob } from 'glob';
import { readFileSync } from 'fs';

export const readSchemas = ({
    schemaDir, argv
}) => {
    const files = glob(schemaDir + '/**/*.json');
    const schemas = files.map(file => JSON.parse(readFileSync(file, 'utf-8')));
    if (argv.packed) {
        if (schemas.length !== 1) {
            throw new Error('packed option only supports one file');
        }
        return Object.values(schemas[0]);
    }
    return schemas;
};