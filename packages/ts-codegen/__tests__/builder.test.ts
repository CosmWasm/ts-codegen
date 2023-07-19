import codegen from '../src/index';
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
    delete builder.contracts;
    delete builder.outPath;
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
            types: {
                enabled: true
            },
            client: {
                enabled: true
            },
            reactQuery: {
                enabled: true
            }
        }
    });
    delete builder.contracts;
    delete builder.outPath;
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
            types: {
                enabled: true
            },
            client: {
                enabled: true
            },
            reactQuery: {
                enabled: true
            }
        }
    });
    await builder.build();
});

it('builder default', async () => {
    const outPath = OUTPUT_DIR + '/default/';
    const s = (str) => FIXTURE_DIR + str;
    await codegen({
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
            bundle: {
                bundleFile: 'index.ts',
                scope: 'smart.contracts'
            },
            types: {
                enabled: true
            },
            client: {
                enabled: true,
                execExtendsQuery: true
            },
            reactQuery: {
                enabled: true
            },
            recoil: {
                enabled: true
            },
            messageComposer: {
                enabled: true
            },
            msgBuilder: {
                enabled: true
            },
            useContractsHooks: {
              enabled: true,
            }
        }
    });
});

it('builder no extends', async () => {
    const outPath = OUTPUT_DIR + '/no-extends/';
    const s = (str) => FIXTURE_DIR + str;
    await codegen({
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
            bundle: {
                bundleFile: 'index.ts',
                scope: 'smart.contracts'
            },
            types: {
                enabled: true
            },
            client: {
                enabled: true,
                execExtendsQuery: false
            },
            reactQuery: {
                enabled: true
            },
            recoil: {
                enabled: true
            },
            messageComposer: {
                enabled: true
            },
            msgBuilder: {
                enabled: true
            }
        }
    });
});

it('builder set bundler path', async () => {
    const outPath = OUTPUT_DIR + '/bundler_test/contracts';
    const bundlerPath = OUTPUT_DIR + '/bundler_test/';
    const s = (str) => FIXTURE_DIR + str;
    await codegen({
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
            bundle: {
                bundlePath: bundlerPath,
                bundleFile: 'index.ts',
                scope: 'smart.contracts'
            },
            types: {
                enabled: true
            },
            client: {
                enabled: true,
                execExtendsQuery: false
            },
            reactQuery: {
                enabled: true
            },
            recoil: {
                enabled: true
            },
            messageComposer: {
                enabled: true
            },
            useContractsHooks: {
                enabled: true,
            }
        }
    });
});

