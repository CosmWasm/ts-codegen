import { readSchemas } from '../src/utils';
import cosmscript from '../src/generate';

it('vectis', async () => {
    const out = __dirname + '/../__output__/vectis';
    const schemaDir = __dirname + '/../__fixtures__/vectis/';

    const schemas = readSchemas({ schemaDir, argv: {} });
    await cosmscript('MyContract', schemas, out);
})

it('cosmwasm', async () => {
    const out = __dirname + '/../__output__/cosmwasm';
    const schemaDir = __dirname + '/../__fixtures__/cosmwasm/';

    const schemas = readSchemas({ schemaDir, argv: { packed: true } });
    await cosmscript('CW4Group', schemas, out);
})