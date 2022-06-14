import { readSchemas } from '../src/utils';
import generate from '../src/generate';
import fromPartial from '../src/from-partial';
import reactQuery from '../src/react-query';
import recoil from '../src/recoil';

const FIXTURE_DIR = __dirname + '/../../../__fixtures__';

it('vectis', async () => {
    const out = __dirname + '/../__output__/vectis';
    const schemaDir = FIXTURE_DIR + '/vectis/';

    const schemas = readSchemas({ schemaDir, argv: {} });
    await generate('MyContract', schemas, out);
    await fromPartial('MyContract', schemas, out);
    // await recoil('MyContract', schemas, out);
    // await reactQuery('MyContract', schemas, out);
})

it('cosmwasm', async () => {
    const out = __dirname + '/../__output__/cosmwasm';
    const schemaDir = FIXTURE_DIR + '/cosmwasm/';
    const schemas = readSchemas({ schemaDir, argv: { packed: true } });
    await generate('CW4Group', schemas, out);
    await fromPartial('CW4Group', schemas, out);
    await recoil('CW4Group', schemas, out);
    await reactQuery('CW4Group', schemas, out);
})

it('minter', async () => {
    const out = __dirname + '/../__output__/minter';
    const schemaDir = FIXTURE_DIR + '/minter/';
    const schemas = readSchemas({ schemaDir, argv: {} });
    await generate('Minter', schemas, out);
    await fromPartial('Minter', schemas, out);
    await recoil('Minter', schemas, out);
    await reactQuery('Minter', schemas, out);
})

it('sg721', async () => {
    const out = __dirname + '/../__output__/sg721';
    const schemaDir = FIXTURE_DIR + '/sg721/';

    const schemas = readSchemas({ schemaDir, argv: {} });
    await generate('Sg721', schemas, out);
    await fromPartial('Sg721', schemas, out);
    await recoil('Sg721', schemas, out);
    await reactQuery('Sg721', schemas, out);
})

it('cw-named-groups', async () => {
    const out = __dirname + '/../__output__/cw-named-groups';
    const schemaDir = FIXTURE_DIR + '/cw-named-groups/';

    const schemas = readSchemas({ schemaDir, argv: {} });
    await generate('CwNamedGroups', schemas, out);
    await fromPartial('CwNamedGroups', schemas, out);
    await recoil('CwNamedGroups', schemas, out);
    await reactQuery('CwNamedGroups', schemas, out);
})