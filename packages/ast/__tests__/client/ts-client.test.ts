import {
  createExecuteClass,
  createExecuteInterface,
  createQueryClass,
  createQueryInterface,
  createTypeInterface
} from '../../src';
import { expectCode, getLegacyFixture, getMsgExecuteLegacyFixture, getMsgQueryLegacyFixture, makeContext } from '../../test-utils';

const daodaoCwNamedGroupsExecuteMsg = getMsgExecuteLegacyFixture('daodao/cw-named-groups', '/execute_msg.json');

const queryMsgData = getMsgQueryLegacyFixture('basic', '/query_msg.json');
const executeMsgData = getMsgExecuteLegacyFixture('basic', '/execute_msg_for__empty.json');
const approvalResponseData = getLegacyFixture('basic', '/approval_response.json');
const allNftInfoResponseData = getLegacyFixture('basic', '/all_nft_info_response.json');
const approvalsResponseData = getLegacyFixture('basic', '/approvals_response.json');
const collectionInfoResponseData = getLegacyFixture('basic', '/collection_info_response.json');
const contractInfoResponseData = getLegacyFixture('basic', '/contract_info_response.json');
const instantiateMsgData = getLegacyFixture('basic', '/instantiate_msg.json');
const nftInfoResponseData = getLegacyFixture('basic', '/nft_info_response.json');
const numTokensResponseData = getLegacyFixture('basic', '/num_tokens_response.json');
const operatorsResponseData = getLegacyFixture('basic', '/operators_response.json');
const ownerOfResponseData = getLegacyFixture('basic', '/owner_of_response.json');
const tokensResponseData = getLegacyFixture('basic', '/tokens_response.json');


it('approval_response', () => {
  const ctx = makeContext(approvalResponseData);
  expectCode(createTypeInterface(
    ctx,
    approvalResponseData
  ))
});

it('all_nft_info_response', () => {
  const ctx = makeContext(allNftInfoResponseData);
  expectCode(createTypeInterface(
    ctx,
    allNftInfoResponseData
  ))
})
it('approvals_response', () => {
  const ctx = makeContext(approvalsResponseData);
  expectCode(createTypeInterface(
    ctx,
    approvalsResponseData
  ))
})
it('collection_info_response', () => {
  const ctx = makeContext(collectionInfoResponseData);
  expectCode(createTypeInterface(
    ctx,
    collectionInfoResponseData
  ))
})
it('contract_info_response', () => {
  const ctx = makeContext(contractInfoResponseData);
  expectCode(createTypeInterface(
    ctx,
    contractInfoResponseData
  ))
})
it('instantiate_msg', () => {
  const ctx = makeContext(instantiateMsgData);
  expectCode(createTypeInterface(
    ctx,
    instantiateMsgData
  ))
})
it('nft_info_response', () => {
  const ctx = makeContext(nftInfoResponseData);
  expectCode(createTypeInterface(
    ctx,
    nftInfoResponseData
  ))
})
it('num_tokens_response', () => {
  const ctx = makeContext(numTokensResponseData);
  expectCode(createTypeInterface(
    ctx,
    numTokensResponseData
  ))
})
it('operators_response', () => {
  const ctx = makeContext(operatorsResponseData);
  expectCode(createTypeInterface(
    ctx,
    operatorsResponseData
  ))
})
it('owner_of_response', () => {
  const ctx = makeContext(ownerOfResponseData);
  expectCode(createTypeInterface(
    ctx,
    ownerOfResponseData
  ))
})
it('tokens_response', () => {
  const ctx = makeContext(tokensResponseData);
  expectCode(createTypeInterface(
    ctx,
    tokensResponseData
  ))
})

it('query classes', () => {
  const ctx = makeContext(queryMsgData);
  expectCode(createQueryClass(
    ctx,
    'SG721QueryClient',
    'SG721ReadOnlyInstance',
    queryMsgData
  ))
});

it('execute classes', () => {
  const ctx = makeContext(executeMsgData);
  expectCode(createExecuteClass(
    ctx,
    'SG721Client',
    'SG721Instance',
    'SG721QueryClient',
    executeMsgData
  ))
});

it('execute classes no extends', () => {
  const ctx = makeContext(executeMsgData);
  expectCode(createExecuteClass(
    ctx,
    'SG721Client',
    'SG721Instance',
    null,
    executeMsgData
  ))
});

it('execute classes array types', () => {
  const ctx = makeContext(daodaoCwNamedGroupsExecuteMsg);
  expectCode(createExecuteClass(
    ctx,
    'SG721Client',
    'SG721Instance',
    null,
    daodaoCwNamedGroupsExecuteMsg
  ))
});

it('execute interfaces no extends', () => {
  const ctx = makeContext(executeMsgData);
  expectCode(createExecuteInterface(
    ctx,
    'SG721Instance',
    null,
    executeMsgData
  ))
});

it('query interfaces', () => {
  const ctx = makeContext(queryMsgData);
  expectCode(createQueryInterface(
    ctx,
    'SG721ReadOnlyInstance',
    queryMsgData
  ))
});
