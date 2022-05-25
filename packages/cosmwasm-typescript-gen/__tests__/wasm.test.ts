import { readSchemas } from '../src/utils';
import generate from '../src/generate';
import fromPartial from '../src/from-partial';

it('vectis', async () => {
    const out = __dirname + '/../__output__/vectis';
    const schemaDir = __dirname + '/../__fixtures__/vectis/';

    const schemas = readSchemas({ schemaDir, argv: {} });
    await generate('MyContract', schemas, out);
})

it('cosmwasm', async () => {
    const out = __dirname + '/../__output__/cosmwasm';
    const schemaDir = __dirname + '/../__fixtures__/cosmwasm/';

    const schemas = readSchemas({ schemaDir, argv: { packed: true } });
    await generate('CW4Group', schemas, out);
    await fromPartial('CW4Group', schemas, out);
})

it('minter', async () => {
    const out = __dirname + '/../__output__/minter';
    const schemaDir = __dirname + '/../__fixtures__/minter/';

    const schemas = readSchemas({ schemaDir, argv: {} });
    await generate('Minter', schemas, out);
    await fromPartial('Minter', schemas, out);
})

it('sg721', async () => {
    const out = __dirname + '/../__output__/sg721';
    const schemaDir = __dirname + '/../__fixtures__/sg721/';

    const schemas = readSchemas({ schemaDir, argv: {} });
    await generate('Sg721', schemas, out);
    await fromPartial('Sg721', schemas, out);
})