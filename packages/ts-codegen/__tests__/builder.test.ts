import { readSchemas } from '../src/utils';
import { TSBuilder } from '../src/builder';

const FIXTURE_DIR = __dirname + '/../../../__fixtures__';
const OUTPUT_DIR = __dirname + '/../../../__output__/builder';

it('options undefined', async () => {
    const outPath = OUTPUT_DIR + '/vectis/factory-opt';
    const schemaDir = FIXTURE_DIR + '/vectis/factory/';
    const builder = new TSBuilder({
        contractDirs: [
            schemaDir
        ],
        outPath,
        options: undefined
    });
    expect(builder).toMatchSnapshot();
});

it('options tsClient.enabled', async () => {
    const outPath = OUTPUT_DIR + '/vectis/factory-opt';
    const schemaDir = FIXTURE_DIR + '/vectis/factory/';
    const builder = new TSBuilder({
        contractDirs: [
            schemaDir
        ],
        outPath,
        options: {
            tsClient: {
                enabled: true
            },
            reactQuery: {
                enabled: true
            }
        }
    });
    expect(builder).toMatchSnapshot();
});

it('builder invoke', async () => {
    const outPath = OUTPUT_DIR + '/vectis/factory-opt';
    const schemaDir = FIXTURE_DIR + '/vectis/factory/';
    const builder = new TSBuilder({
        contractDirs: [
            schemaDir
        ],
        outPath,
        options: {
            tsClient: {
                enabled: true
            },
            reactQuery: {
                enabled: true
            }
        }
    });
    builder.build();
});
