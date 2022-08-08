import { TSBuilder } from '../src/builder';

const FIXTURE_DIR = __dirname + '/../../../__fixtures__';
const OUTPUT_DIR = __dirname + '/../../../__output__/builder';

it('options undefined', async () => {
    const outPath = OUTPUT_DIR + '/vectis/factory-opt';
    const schemaDir = FIXTURE_DIR + '/vectis/factory/';
    const builder = new TSBuilder({
        contracts: [
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
        contracts: [
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
    const outPath = OUTPUT_DIR + '/invoke/';
    const s = (str) => FIXTURE_DIR + str;
    const builder = new TSBuilder({
        contracts: [
            s('/vectis/factory'),
            s('/minter'),
            s('/daodao/cw-admin-factory'),
            s('/daodao/cw-code-id-registry'),
            {
                name: 'CwSingle',
                dir: s('/daodao/cw-proposal-single')
            }
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
    await builder.build();
    await builder.bundle();
});
