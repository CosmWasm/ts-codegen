import { BuilderContext } from '@cosmwasm/ts-codegen-ast';
import { TSBuilder } from '../src';
import { readSchemas } from '../src/utils';
import { generateReactQuery, generateClient, generateMessageComposer, generateMessageBuilder, generateRecoil, generateTypes, generateContractHooks } from '../test-utils';

const FIXTURE_DIR = __dirname + '/../../../__fixtures__';
const OUTPUT_DIR = __dirname + '/../../../__output__';

it('optionalClient', async () => {
    const outopt = OUTPUT_DIR + '/vectis/factory-optional-client';
    const schemaDir = FIXTURE_DIR + '/vectis/factory/';
    const contractInfo = await readSchemas({
        schemaDir
    });
    await generateReactQuery('Factory', contractInfo, outopt, { optionalClient: true });
})

it('v4Query', async () => {
    const outopt = OUTPUT_DIR + '/vectis/factory-v4-query';
    const schemaDir = FIXTURE_DIR + '/vectis/factory/';
    const contractInfo = await readSchemas({
        schemaDir
    });
    await generateReactQuery('Factory', contractInfo, outopt, { version: 'v4' });
})

it('queryKeys', async () => {
    const outopt = OUTPUT_DIR + '/vectis/factory-query-keys';
    const schemaDir = FIXTURE_DIR + '/vectis/factory/';
    const contractInfo = await readSchemas({
        schemaDir
    });
    await generateReactQuery('Factory', contractInfo, outopt, { queryKeys: true });
})

it('queryFactory', async () => {
    const outopt = OUTPUT_DIR + '/vectis/factory-query-keys';
    const schemaDir = FIXTURE_DIR + '/vectis/factory/';
    const contractInfo = await readSchemas({
        schemaDir
    });
    await generateReactQuery('Factory', contractInfo, outopt, { queryKeys: true, queryFactory: true });
})



it('queryKeysOptionalClient', async () => {
    const outopt = OUTPUT_DIR + '/vectis/factory-query-keys-optional-client';
    const schemaDir = FIXTURE_DIR + '/vectis/factory/';
    const contractInfo = await readSchemas({
        schemaDir
    });
    await generateReactQuery('Factory', contractInfo, outopt, { queryKeys: true, optionalClient: true });
})

it('useMutations', async () => {
    const outopt = OUTPUT_DIR + '/vectis/factory-w-mutations';
    const schemaDir = FIXTURE_DIR + '/vectis/factory/';
    const contractInfo = await readSchemas({
        schemaDir
    });
    await generateReactQuery('Factory', contractInfo, outopt, { version: 'v4', mutations: true });
})

it('vectis/factory', async () => {
    const out = OUTPUT_DIR + '/vectis/factory';
    const schemaDir = FIXTURE_DIR + '/vectis/factory/';

    const contractInfo = await readSchemas({
        schemaDir
    });
    await generateTypes('Factory', contractInfo, out);
    await generateClient('Factory', contractInfo, out);
    await generateMessageComposer('Factory', contractInfo, out);
    await generateRecoil('Factory', contractInfo, out);
    await generateReactQuery('Factory', contractInfo, out);
})

it('vectis/govec', async () => {
    const out = OUTPUT_DIR + '/vectis/govec';
    const schemaDir = FIXTURE_DIR + '/vectis/govec/';

    const contractInfo = await readSchemas({
        schemaDir
    });
    await generateTypes('Govec', contractInfo, out);
    await generateClient('Govec', contractInfo, out);
    await generateMessageComposer('Govec', contractInfo, out);
    await generateRecoil('Govec', contractInfo, out);
    await generateReactQuery('Govec', contractInfo, out);
})

it('vectis/proxy', async () => {
    const out = OUTPUT_DIR + '/vectis/proxy';
    const schemaDir = FIXTURE_DIR + '/vectis/proxy/';

    const contractInfo = await readSchemas({
        schemaDir
    });
    await generateTypes('Proxy', contractInfo, out);
    await generateClient('Proxy', contractInfo, out);
    await generateMessageComposer('Proxy', contractInfo, out);
    await generateRecoil('Proxy', contractInfo, out);
    await generateReactQuery('Proxy', contractInfo, out);
})

it('minter', async () => {
    const out = OUTPUT_DIR + '/minter';
    const schemaDir = FIXTURE_DIR + '/minter/';
    const contractInfo = await readSchemas({
        schemaDir
    });
    await generateTypes('Minter', contractInfo, out);
    await generateClient('Minter', contractInfo, out);
    await generateMessageComposer('Minter', contractInfo, out);
    await generateRecoil('Minter', contractInfo, out);
    await generateReactQuery('Minter', contractInfo, out);
})

it('sg721', async () => {
    const out = OUTPUT_DIR + '/sg721';
    const schemaDir = FIXTURE_DIR + '/sg721/';

    const contractInfo = await readSchemas({
        schemaDir
    });

    const builderContext = new BuilderContext();

    await generateTypes('Sg721', contractInfo, out);
    await generateClient('Sg721', contractInfo, out, builderContext);
    await generateMessageComposer('Sg721', contractInfo, out, builderContext);
    await generateMessageBuilder('Sg721', contractInfo, out);
    await generateRecoil('Sg721', contractInfo, out);
    await generateReactQuery('Sg721', contractInfo, out);
    await generateContractHooks('Sg721', contractInfo, out, builderContext);
})

it('cw-named-groups', async () => {
    const out = OUTPUT_DIR + '/daodao/cw-named-groups';
    const schemaDir = FIXTURE_DIR + '/daodao/cw-named-groups/';

    const contractInfo = await readSchemas({
        schemaDir
    });
    await generateTypes('CwNamedGroups', contractInfo, out);
    await generateClient('CwNamedGroups', contractInfo, out);
    await generateMessageComposer('CwNamedGroups', contractInfo, out);
    await generateRecoil('CwNamedGroups', contractInfo, out);
    await generateReactQuery('CwNamedGroups', contractInfo, out);
})

it('cw-proposal-single', async () => {
    const out = OUTPUT_DIR + '/daodao/cw-proposal-single';
    const schemaDir = FIXTURE_DIR + '/daodao/cw-proposal-single/';

    const contractInfo = await readSchemas({
        schemaDir
    });
    await generateTypes('CwProposalSingle', contractInfo, out);
    await generateClient('CwProposalSingle', contractInfo, out);
    await generateMessageComposer('CwProposalSingle', contractInfo, out);
    await generateRecoil('CwProposalSingle', contractInfo, out);
    await generateReactQuery('CwProposalSingle', contractInfo, out);
})

it('cw-admin-factory', async () => {
    const out = OUTPUT_DIR + '/daodao/cw-admin-factory';
    const schemaDir = FIXTURE_DIR + '/daodao/cw-admin-factory/';

    const contractInfo = await readSchemas({
        schemaDir
    });
    await generateTypes('CwAdminFactory', contractInfo, out);
    await generateClient('CwAdminFactory', contractInfo, out);
    await generateMessageComposer('CwAdminFactory', contractInfo, out);
    await generateRecoil('CwAdminFactory', contractInfo, out);
    await generateReactQuery('CwAdminFactory', contractInfo, out);
})

it('cw-code-id-registry', async () => {
    const out = OUTPUT_DIR + '/daodao/cw-code-id-registry';
    const schemaDir = FIXTURE_DIR + '/daodao/cw-code-id-registry/';

    const contractInfo = await readSchemas({
        schemaDir
    });
    await generateTypes('CwCodeIdRegistry', contractInfo, out);
    await generateClient('CwCodeIdRegistry', contractInfo, out);
    await generateMessageComposer('CwCodeIdRegistry', contractInfo, out);
    await generateRecoil('CwCodeIdRegistry', contractInfo, out);
    await generateReactQuery('CwCodeIdRegistry', contractInfo, out);
})

it('idl-version/hackatom', async () => {
    const out = OUTPUT_DIR + '/idl-version/hackatom';
    const schemaDir = FIXTURE_DIR + '/idl-version/hackatom/';

    const contractInfo = await readSchemas({
        schemaDir
    });
    await generateTypes('HackAtom', contractInfo, out);
    await generateClient('HackAtom', contractInfo, out);
    await generateMessageComposer('HackAtom', contractInfo, out);
    await generateRecoil('HackAtom', contractInfo, out);
    await generateReactQuery('HackAtom', contractInfo, out);
})

it('idl-version/cyberpunk', async () => {
    const out = OUTPUT_DIR + '/idl-version/cyberpunk';
    const schemaDir = FIXTURE_DIR + '/idl-version/cyberpunk/';

    const contractInfo = await readSchemas({
        schemaDir
    });

    await generateTypes('CyberPunk', contractInfo, out);
    await generateClient('CyberPunk', contractInfo, out);
    await generateMessageComposer('CyberPunk', contractInfo, out);
    await generateRecoil('CyberPunk', contractInfo, out);
    await generateReactQuery('CyberPunk', contractInfo, out);
})

it('idl-version/cw4-group', async () => {
    const out = OUTPUT_DIR + '/idl-version/cw4-group';
    const schemaDir = FIXTURE_DIR + '/idl-version/cw4-group/';

    const contractInfo = await readSchemas({
        schemaDir
    });

    await generateTypes('Cw4Group', contractInfo, out);
    await generateClient('Cw4Group', contractInfo, out);
    await generateMessageComposer('Cw4Group', contractInfo, out);
    await generateRecoil('Cw4Group', contractInfo, out);
    await generateReactQuery('Cw4Group', contractInfo, out);
})

it('idl-version/cw3-fixed-multisig', async () => {
    const out = OUTPUT_DIR + '/idl-version/cw3-fixed-multisig';
    const schemaDir = FIXTURE_DIR + '/idl-version/cw3-fixed-multisig/';

    const contractInfo = await readSchemas({
        schemaDir
    });

    await generateTypes('Cw3FixedMultiSig', contractInfo, out);
    await generateClient('Cw3FixedMultiSig', contractInfo, out);
    await generateMessageComposer('Cw3FixedMultiSig', contractInfo, out);
    await generateRecoil('Cw3FixedMultiSig', contractInfo, out);
    await generateReactQuery('Cw3FixedMultiSig', contractInfo, out);
})

it('idl-version/accounts-nft', async () => {
    const out = OUTPUT_DIR + '/idl-version/accounts-nft';
    const schemaDir = FIXTURE_DIR + '/idl-version/accounts-nft/';

    const contractInfo = await readSchemas({
        schemaDir
    });

    await generateTypes('AccountsNft', contractInfo, out);
    await generateClient('AccountsNft', contractInfo, out);
    await generateMessageComposer('AccountsNft', contractInfo, out);
    await generateRecoil('AccountsNft', contractInfo, out);
    await generateReactQuery('AccountsNft', contractInfo, out);
})
