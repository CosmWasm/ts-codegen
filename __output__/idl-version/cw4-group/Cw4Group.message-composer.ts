/**
* This file was automatically generated by @cosmwasm/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { Coin } from "@cosmjs/amino";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { InstantiateMsg, Member, ExecuteMsg, QueryMsg, AdminResponse, HooksResponse, MemberListResponse, MemberResponse, TotalWeightResponse } from "./Cw4Group.types";
export interface Cw4GroupMsg {
  contractAddress: string;
  sender: string;
  updateAdmin: ({
    admin
  }: {
    admin?: string;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  updateMembers: ({
    add,
    remove
  }: {
    add: Member[];
    remove: string[];
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  addHook: ({
    addr
  }: {
    addr: string;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  removeHook: ({
    addr
  }: {
    addr: string;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
}
export class Cw4GroupMsgComposer implements Cw4GroupMsg {
  sender: string;
  contractAddress: string;
  constructor(sender: string, contractAddress: string) {
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.updateAdmin = this.updateAdmin.bind(this);
    this.updateMembers = this.updateMembers.bind(this);
    this.addHook = this.addHook.bind(this);
    this.removeHook = this.removeHook.bind(this);
  }
  updateAdmin = ({
    admin
  }: {
    admin?: string;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          update_admin: {
            admin
          }
        })),
        funds: funds_
      })
    };
  };
  updateMembers = ({
    add,
    remove
  }: {
    add: Member[];
    remove: string[];
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          update_members: {
            add,
            remove
          }
        })),
        funds: funds_
      })
    };
  };
  addHook = ({
    addr
  }: {
    addr: string;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          add_hook: {
            addr
          }
        })),
        funds: funds_
      })
    };
  };
  removeHook = ({
    addr
  }: {
    addr: string;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          remove_hook: {
            addr
          }
        })),
        funds: funds_
      })
    };
  };
}