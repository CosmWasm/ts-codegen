/**
* This file was automatically generated by @cosmwasm/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { Coin } from "@cosmjs/amino";
import { MsgExecuteContractEncodeObject } from "cosmwasm";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { InstantiateMsg, ExecuteMsg, QueryMsg } from "./CyberPunk.types";
export interface CyberPunkMessage {
  contractAddress: string;
  sender: string;
  argon2: ({
    memCost,
    timeCost
  }: {
    memCost: number;
    timeCost: number;
  }, funds?: Coin[]) => MsgExecuteContractEncodeObject;
  mirrorEnv: (funds?: Coin[]) => MsgExecuteContractEncodeObject;
}
export class CyberPunkMessageComposer implements CyberPunkMessage {
  sender: string;
  contractAddress: string;

  constructor(sender: string, contractAddress: string) {
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.argon2 = this.argon2.bind(this);
    this.mirrorEnv = this.mirrorEnv.bind(this);
  }

  argon2 = ({
    memCost,
    timeCost
  }: {
    memCost: number;
    timeCost: number;
  }, funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          argon2: {
            mem_cost: memCost,
            time_cost: timeCost
          }
        })),
        funds
      })
    };
  };
  mirrorEnv = (funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          mirror_env: {}
        })),
        funds
      })
    };
  };
}