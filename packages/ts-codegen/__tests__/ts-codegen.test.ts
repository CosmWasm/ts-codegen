import { readSchemas } from '../src/utils';
import generateTypes from '../src/generators/types';
import generateClient from '../src/generators/client';
import generateMessageComposer from '../src/generators/message-composer';
import generateReactQuery from '../src/generators/react-query';
import generateRecoil from '../src/generators/recoil';

const FIXTURE_DIR = __dirname + '/../../../__fixtures__';
const OUTPUT_DIR = __dirname + '/../../../__output__';

it('optionalClient', async () => {
    const outopt = OUTPUT_DIR + '/vectis/factory-opt';
    const schemaDir = FIXTURE_DIR + '/vectis/factory/';
    const schemas = await readSchemas({ schemaDir, schemaOptions: {} });
    await generateReactQuery('Factory', schemas, outopt, { optionalClient: true });
})

it('v4Query', async () => {
    const outopt = OUTPUT_DIR + '/vectis/factory-opt';
    const schemaDir = FIXTURE_DIR + '/vectis/factory/';
    const schemas = await readSchemas({ schemaDir, schemaOptions: {} });
    await generateReactQuery('Factory', schemas, outopt, { v4: true });
})

it('useMutations', async () => {
    const outopt = OUTPUT_DIR + '/vectis/factory-opt';
    const schemaDir = FIXTURE_DIR + '/vectis/factory/';
    const schemas = await readSchemas({ schemaDir, schemaOptions: {} });
    await generateReactQuery('Factory', schemas, outopt, { v4: true, mutations: true });
})

it('vectis/factory', async () => {
    const out = OUTPUT_DIR + '/vectis/factory';
    const outopt = OUTPUT_DIR + '/vectis/factory-opt';
    const schemaDir = FIXTURE_DIR + '/vectis/factory/';

    const schemas = await readSchemas({ schemaDir, schemaOptions: {} });
    await generateTypes('Factory', schemas, out);
    await generateClient('Factory', schemas, out);
    await generateMessageComposer('Factory', schemas, out);
    await generateRecoil('Factory', schemas, out);
    await generateReactQuery('Factory', schemas, out);
    await generateReactQuery('Factory', schemas, outopt, { optionalClient: true });
})

it('vectis/govec', async () => {
    const out = OUTPUT_DIR + '/vectis/govec';
    const schemaDir = FIXTURE_DIR + '/vectis/govec/';

    const schemas = await readSchemas({ schemaDir, schemaOptions: {} });
    await generateTypes('Govec', schemas, out);
    await generateClient('Govec', schemas, out);
    await generateMessageComposer('Govec', schemas, out);
    await generateRecoil('Govec', schemas, out);
    await generateReactQuery('Govec', schemas, out);
})

it('vectis/proxy', async () => {
    const out = OUTPUT_DIR + '/vectis/proxy';
    const schemaDir = FIXTURE_DIR + '/vectis/proxy/';

    const schemas = await readSchemas({ schemaDir, schemaOptions: {} });
    await generateTypes('Proxy', schemas, out);
    await generateClient('Proxy', schemas, out);
    await generateMessageComposer('Proxy', schemas, out);
    await generateRecoil('Proxy', schemas, out);
    await generateReactQuery('Proxy', schemas, out);
})

it('cosmwasm', async () => {
    const out = OUTPUT_DIR + '/cosmwasm';
    const schemaDir = FIXTURE_DIR + '/cosmwasm/';
    const schemas = await readSchemas({ schemaDir, schemaOptions: { packed: true } });
    await generateTypes('CW4Group', schemas, out);
    await generateClient('CW4Group', schemas, out);
    await generateMessageComposer('CW4Group', schemas, out);
    await generateRecoil('CW4Group', schemas, out);
    await generateReactQuery('CW4Group', schemas, out);
})

it('minter', async () => {
    const out = OUTPUT_DIR + '/minter';
    const schemaDir = FIXTURE_DIR + '/minter/';
    const schemas = await readSchemas({ schemaDir, schemaOptions: {} });
    await generateTypes('Minter', schemas, out);
    await generateClient('Minter', schemas, out);
    await generateMessageComposer('Minter', schemas, out);
    await generateRecoil('Minter', schemas, out);
    await generateReactQuery('Minter', schemas, out);
})

it('sg721', async () => {
    const out = OUTPUT_DIR + '/sg721';
    const schemaDir = FIXTURE_DIR + '/sg721/';

    const schemas = await readSchemas({ schemaDir, schemaOptions: {} });
    await generateTypes('Sg721', schemas, out);
    await generateClient('Sg721', schemas, out);
    await generateMessageComposer('Sg721', schemas, out);
    await generateRecoil('Sg721', schemas, out);
    await generateReactQuery('Sg721', schemas, out);
})

it('cw-named-groups', async () => {
    const out = OUTPUT_DIR + '/daodao/cw-named-groups';
    const schemaDir = FIXTURE_DIR + '/daodao/cw-named-groups/';

    const schemas = await readSchemas({ schemaDir, schemaOptions: {} });
    await generateTypes('CwNamedGroups', schemas, out);
    await generateClient('CwNamedGroups', schemas, out);
    await generateMessageComposer('CwNamedGroups', schemas, out);
    await generateRecoil('CwNamedGroups', schemas, out);
    await generateReactQuery('CwNamedGroups', schemas, out);
})

it('cw-proposal-single', async () => {
    const out = OUTPUT_DIR + '/daodao/cw-proposal-single';
    const schemaDir = FIXTURE_DIR + '/daodao/cw-proposal-single/';

    const schemas = await readSchemas({ schemaDir, schemaOptions: {} });
    await generateTypes('CwProposalSingle', schemas, out);
    await generateClient('CwProposalSingle', schemas, out);
    await generateMessageComposer('CwProposalSingle', schemas, out);
    await generateRecoil('CwProposalSingle', schemas, out);
    await generateReactQuery('CwProposalSingle', schemas, out);
})

it('cw-admin-factory', async () => {
    const out = OUTPUT_DIR + '/daodao/cw-admin-factory';
    const schemaDir = FIXTURE_DIR + '/daodao/cw-admin-factory/';

    const schemas = await readSchemas({ schemaDir, schemaOptions: {} });
    await generateTypes('CwAdminFactory', schemas, out);
    await generateClient('CwAdminFactory', schemas, out);
    await generateMessageComposer('CwAdminFactory', schemas, out);
    await generateRecoil('CwAdminFactory', schemas, out);
    await generateReactQuery('CwAdminFactory', schemas, out);
})

it('cw-code-id-registry', async () => {
    const out = OUTPUT_DIR + '/daodao/cw-code-id-registry';
    const schemaDir = FIXTURE_DIR + '/daodao/cw-code-id-registry/';

    const schemas = await readSchemas({ schemaDir, schemaOptions: {} });
    await generateTypes('CwCodeIdRegistry', schemas, out);
    await generateClient('CwCodeIdRegistry', schemas, out);
    await generateMessageComposer('CwCodeIdRegistry', schemas, out);
    await generateRecoil('CwCodeIdRegistry', schemas, out);
    await generateReactQuery('CwCodeIdRegistry', schemas, out);
})
