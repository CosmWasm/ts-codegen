// @ts-nocheck
import { JSONSchema } from '../src/types';

import canExecuteRelayResponseData from '../../../__fixtures__/vectis/govec/can_execute_relay_response.json';
import cosmosMsgForEmptyData from '../../../__fixtures__/vectis/govec/cosmos_msg_for__empty.json';
import executeMsgForEmptyData from '../../../__fixtures__/vectis/govec/execute_msg_for__empty.json';
import infoResponseData from '../../../__fixtures__/vectis/govec/info_response.json';
import relayTransactionData from '../../../__fixtures__/vectis/govec/relay_transaction.json';

import nftIdlVersionData from '../../../__fixtures__/idl-version/accounts-nft/account-nft.json';

export const nftIdlVersion: JSONSchema = nftIdlVersionData;
export const vectisCanExecuteRelayResponse: JSONSchema = canExecuteRelayResponseData;
export const vectisCosmosMsgForEmpty: JSONSchema = cosmosMsgForEmptyData;
export const vectisExecuteMsgForEmpty: JSONSchema = executeMsgForEmptyData;
export const vectisInfoResponse: JSONSchema = infoResponseData;
export const vectisRelayTransaction: JSONSchema = relayTransactionData;
