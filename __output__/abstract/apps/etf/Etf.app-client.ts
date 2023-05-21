/**
* This file was automatically generated by @cosmwasm/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CamelCasedProperties } from "type-fest";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { AbstractQueryClient, AbstractAccountQueryClient, AbstractAccountClient } from "@abstract-money/abstract.js";
import { Decimal, InstantiateMsg, ExecuteMsg, Uint128, AssetInfoBaseForString, AssetBaseForString, QueryMsg, MigrateMsg, StateResponse } from "./Etf.types";
import { EtfQueryClient, EtfClient } from "./Etf.client";
import { EtfQueryMsgBuilder, EtfExecuteMsgBuilder } from "./Etf.msg-builder";
export interface IEtfAppQueryClient {
  moduleId: string;
  queryClient: AbstractAccountQueryClient;
  _moduleAddress: string;
  state: () => Promise<StateResponse>;
  connect: (signingClient: SigningCosmWasmClient, address: string) => EtfAppClient;
  address: () => Promise<string>;
}
export class EtfAppQueryClient implements IEtfAppQueryClient {
  queryClient: AbstractAccountQueryClient;
  moduleId: string;
  _moduleAddress: string;

  constructor({
    abstract,
    accountId,
    managerAddress,
    proxyAddress,
    moduleId
  }) {
    this.queryClient = new AbstractAccountQueryClient({
      abstract,
      accountId,
      managerAddress,
      proxyAddress
    });
    this.moduleId = moduleId;
    this.state = this.state.bind(this);
  }

  state = async (): Promise<StateResponse> => {
    return this._query(EtfQueryMsgBuilder.state());
  };
  _query = (queryMsg: QueryMsg): Promise<any> => {
    return this.queryClient.queryModule({
      moduleId: this.moduleId,
      moduleType: "app",
      queryMsg
    });
  };
  address = async (): Promise<string> => {
    if (!this._moduleAddress) {
      this._moduleAddress = await this.queryClient.getModuleAddress(this.moduleId);
    }

    return this._moduleAddress;
  };
  connect = (signingClient: SigningCosmWasmClient, address: string): EtfAppClient => {
    return new EtfAppClient({
      accountId: this.queryClient.accountId,
      managerAddress: this.queryClient.managerAddress,
      proxyAddress: this.queryClient.proxyAddress,
      abstract: this.queryClient.abstract.upgrade(signingClient, address)
    });
  };
}
export interface IEtfAppClient extends IEtfAppQueryClient {
  accountClient: AbstractAccountClient;
  provideLiquidity: (params: CamelCasedProperties<Extract<QueryMsg, {
    provide_liquidity: unknown;
  }>["provide_liquidity"]>, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ProvideLiquidityResponse>;
  setFee: (params: CamelCasedProperties<Extract<QueryMsg, {
    set_fee: unknown;
  }>["set_fee"]>, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<SetFeeResponse>;
}
export class EtfAppClient implements IEtfAppClient {
  accountClient: AbstractAccountClient;

  constructor({
    abstract,
    accountId,
    managerAddress,
    proxyAddress,
    moduleId
  }) {
    super(base);
    this.accountClient = AbstractAccountClient.fromQueryClient(this.accountQueryClient, base.abstract);
    this.provideLiquidity = this.provideLiquidity.bind(this);
    this.setFee = this.setFee.bind(this);
  }

  provideLiquidity = async (params: CamelCasedProperties<Extract<QueryMsg, {
    provide_liquidity: unknown;
  }>["provide_liquidity"]>, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]): Promise<ProvideLiquidityResponse> => {
    return this._composeMsg(EtfExecuteMsgBuilder.provideLiquidity(params));
  };
  setFee = async (params: CamelCasedProperties<Extract<QueryMsg, {
    set_fee: unknown;
  }>["set_fee"]>, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]): Promise<SetFeeResponse> => {
    return this._composeMsg(EtfExecuteMsgBuilder.setFee(params));
  };
  _composeMsg = (msg: AutocompounderExecuteMsg, _funds?: Coin[]): Promise<MsgExecuteContractEncodeObject> => {
    const moduleMsg: AppExecuteMsg<AutocompounderExecuteMsg> = AppModuleExecuteMsgBuilder.executeApp(msg);
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.accountClient.sender,
        contract: await this.address(),
        msg: toUtf8(JSON.stringify(moduleMsg)),
        funds
      })
    };
  };
}