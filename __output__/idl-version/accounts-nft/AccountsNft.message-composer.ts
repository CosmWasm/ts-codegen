/**
* This file was automatically generated by @abstract-money/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @abstract-money/ts-codegen generate command to regenerate this file.
*/

import { Coin } from "@cosmjs/amino";
import { MsgExecuteContractEncodeObject } from "cosmwasm";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { AppExecuteMsg, AppExecuteMsgFactory } from "@abstract-money/abstract.js";
import { InstantiateMsg, ExecuteMsg, Binary, Expiration, Timestamp, Uint64, QueryMsg, VaultBaseForString, Uint128, ArrayOfSharesResponseItem, SharesResponseItem, AllNftInfoResponseForEmpty, OwnerOfResponse, Approval, NftInfoResponseForEmpty, Empty, OperatorsResponse, String, TokensResponse, ArrayOfVaultBaseForString, ApprovalResponse, ApprovalsResponse, ContractInfoResponse, MinterResponse, NumTokensResponse } from "./AccountsNft.types";
export interface AccountsNftMessage {
  contractAddress: string;
  sender: string;
  proposeNewOwner: ({
    newOwner
  }: {
    newOwner: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  acceptOwnership: (_funds?: Coin[]) => MsgExecuteContractEncodeObject;
  mint: ({
    user
  }: {
    user: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  transferNft: ({
    recipient,
    tokenId
  }: {
    recipient: string;
    tokenId: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  sendNft: ({
    contract,
    msg,
    tokenId
  }: {
    contract: string;
    msg: Binary;
    tokenId: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  approve: ({
    expires,
    spender,
    tokenId
  }: {
    expires?: Expiration;
    spender: string;
    tokenId: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  revoke: ({
    spender,
    tokenId
  }: {
    spender: string;
    tokenId: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  approveAll: ({
    expires,
    operator
  }: {
    expires?: Expiration;
    operator: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  revokeAll: ({
    operator
  }: {
    operator: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  burn: ({
    tokenId
  }: {
    tokenId: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
}
export class AccountsNftMessageComposer implements AccountsNftMessage {
  sender: string;
  contractAddress: string;

  constructor(sender: string, contractAddress: string) {
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.proposeNewOwner = this.proposeNewOwner.bind(this);
    this.acceptOwnership = this.acceptOwnership.bind(this);
    this.mint = this.mint.bind(this);
    this.transferNft = this.transferNft.bind(this);
    this.sendNft = this.sendNft.bind(this);
    this.approve = this.approve.bind(this);
    this.revoke = this.revoke.bind(this);
    this.approveAll = this.approveAll.bind(this);
    this.revokeAll = this.revokeAll.bind(this);
    this.burn = this.burn.bind(this);
  }

  proposeNewOwner = ({
    newOwner
  }: {
    newOwner: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      propose_new_owner: {
        new_owner: newOwner
      }
    };
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: _funds
      })
    };
  };
  acceptOwnership = (_funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      accept_ownership: {}
    };
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: _funds
      })
    };
  };
  mint = ({
    user
  }: {
    user: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      mint: {
        user
      }
    };
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: _funds
      })
    };
  };
  transferNft = ({
    recipient,
    tokenId
  }: {
    recipient: string;
    tokenId: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      transfer_nft: {
        recipient,
        token_id: tokenId
      }
    };
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: _funds
      })
    };
  };
  sendNft = ({
    contract,
    msg,
    tokenId
  }: {
    contract: string;
    msg: Binary;
    tokenId: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      send_nft: {
        contract,
        msg,
        token_id: tokenId
      }
    };
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: _funds
      })
    };
  };
  approve = ({
    expires,
    spender,
    tokenId
  }: {
    expires?: Expiration;
    spender: string;
    tokenId: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      approve: {
        expires,
        spender,
        token_id: tokenId
      }
    };
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: _funds
      })
    };
  };
  revoke = ({
    spender,
    tokenId
  }: {
    spender: string;
    tokenId: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      revoke: {
        spender,
        token_id: tokenId
      }
    };
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: _funds
      })
    };
  };
  approveAll = ({
    expires,
    operator
  }: {
    expires?: Expiration;
    operator: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      approve_all: {
        expires,
        operator
      }
    };
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: _funds
      })
    };
  };
  revokeAll = ({
    operator
  }: {
    operator: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      revoke_all: {
        operator
      }
    };
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: _funds
      })
    };
  };
  burn = ({
    tokenId
  }: {
    tokenId: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      burn: {
        token_id: tokenId
      }
    };
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: _funds
      })
    };
  };
}