/**
* This file was automatically generated by @abstract-money/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @abstract-money/ts-codegen generate command to regenerate this file.
*/

import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { AppExecuteMsg, AppExecuteMsgFactory } from "@abstract-money/abstract.js";
import { CanExecuteRelayResponse, CosmosMsgForEmpty, BankMsg, Uint128, StakingMsg, DistributionMsg, WasmMsg, Binary, Coin, Empty, ExecuteMsgForEmpty, Addr, RelayTransaction, Guardians, MultiSig, InfoResponse, ContractVersion, InstantiateMsg, CreateWalletMsg, QueryMsg, Uint64 } from "./Govec.types";
export interface GovecMessage {
  contractAddress: string;
  sender: string;
  execute: ({
    msgs
  }: {
    msgs: CosmosMsgForEmpty[];
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  revertFreezeStatus: (_funds?: Coin[]) => MsgExecuteContractEncodeObject;
  relay: ({
    transaction
  }: {
    transaction: RelayTransaction;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  rotateUserKey: ({
    newUserAddress
  }: {
    newUserAddress: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  addRelayer: ({
    newRelayerAddress
  }: {
    newRelayerAddress: Addr;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  removeRelayer: ({
    relayerAddress
  }: {
    relayerAddress: Addr;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  updateGuardians: ({
    guardians,
    newMultisigCodeId
  }: {
    guardians: Guardians;
    newMultisigCodeId?: number;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  updateLabel: ({
    newLabel
  }: {
    newLabel: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
}
export class GovecMessageComposer implements GovecMessage {
  sender: string;
  contractAddress: string;

  constructor(sender: string, contractAddress: string) {
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.execute = this.execute.bind(this);
    this.revertFreezeStatus = this.revertFreezeStatus.bind(this);
    this.relay = this.relay.bind(this);
    this.rotateUserKey = this.rotateUserKey.bind(this);
    this.addRelayer = this.addRelayer.bind(this);
    this.removeRelayer = this.removeRelayer.bind(this);
    this.updateGuardians = this.updateGuardians.bind(this);
    this.updateLabel = this.updateLabel.bind(this);
  }

  execute = ({
    msgs
  }: {
    msgs: CosmosMsgForEmpty[];
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      execute: {
        msgs
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
  revertFreezeStatus = (_funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      revert_freeze_status: {}
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
  relay = ({
    transaction
  }: {
    transaction: RelayTransaction;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      relay: {
        transaction
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
  rotateUserKey = ({
    newUserAddress
  }: {
    newUserAddress: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      rotate_user_key: {
        new_user_address: newUserAddress
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
  addRelayer = ({
    newRelayerAddress
  }: {
    newRelayerAddress: Addr;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      add_relayer: {
        new_relayer_address: newRelayerAddress
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
  removeRelayer = ({
    relayerAddress
  }: {
    relayerAddress: Addr;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      remove_relayer: {
        relayer_address: relayerAddress
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
  updateGuardians = ({
    guardians,
    newMultisigCodeId
  }: {
    guardians: Guardians;
    newMultisigCodeId?: number;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      update_guardians: {
        guardians,
        new_multisig_code_id: newMultisigCodeId
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
  updateLabel = ({
    newLabel
  }: {
    newLabel: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      update_label: {
        new_label: newLabel
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