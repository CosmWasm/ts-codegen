/**
* This file was automatically generated by @cosmwasm/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import { Decimal, AssetEntry, BondingPeriodSelector, Duration, InstantiateMsg, ExecuteMsg, Uint128, AnsAsset, QueryMsg, MigrateMsg, Expiration, Timestamp, Uint64, ArrayOfTupleOfStringAndArrayOfClaim, Claim, ArrayOfClaim, Addr, PoolAddressBaseForAddr, AssetInfoBaseForAddr, PoolType, Config, PoolMetadata } from "./Autocompounder.types";
export interface AutocompounderReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<Config>;
  pendingClaims: ({
    address
  }: {
    address: string;
  }) => Promise<Uint128>;
  claims: ({
    address
  }: {
    address: string;
  }) => Promise<ArrayOfClaim>;
  allClaims: ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }) => Promise<ArrayOfTupleOfStringAndArrayOfClaim>;
  latestUnbonding: () => Promise<Expiration>;
  totalLpPosition: () => Promise<Uint128>;
  balance: ({
    address
  }: {
    address: string;
  }) => Promise<Uint128>;
}
export class AutocompounderQueryClient implements AutocompounderReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.config = this.config.bind(this);
    this.pendingClaims = this.pendingClaims.bind(this);
    this.claims = this.claims.bind(this);
    this.allClaims = this.allClaims.bind(this);
    this.latestUnbonding = this.latestUnbonding.bind(this);
    this.totalLpPosition = this.totalLpPosition.bind(this);
    this.balance = this.balance.bind(this);
  }

  config = async (): Promise<Config> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {}
    });
  };
  pendingClaims = async ({
    address
  }: {
    address: string;
  }): Promise<Uint128> => {
    return this.client.queryContractSmart(this.contractAddress, {
      pending_claims: {
        address
      }
    });
  };
  claims = async ({
    address
  }: {
    address: string;
  }): Promise<ArrayOfClaim> => {
    return this.client.queryContractSmart(this.contractAddress, {
      claims: {
        address
      }
    });
  };
  allClaims = async ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string;
  }): Promise<ArrayOfTupleOfStringAndArrayOfClaim> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_claims: {
        limit,
        start_after: startAfter
      }
    });
  };
  latestUnbonding = async (): Promise<Expiration> => {
    return this.client.queryContractSmart(this.contractAddress, {
      latest_unbonding: {}
    });
  };
  totalLpPosition = async (): Promise<Uint128> => {
    return this.client.queryContractSmart(this.contractAddress, {
      total_lp_position: {}
    });
  };
  balance = async ({
    address
  }: {
    address: string;
  }): Promise<Uint128> => {
    return this.client.queryContractSmart(this.contractAddress, {
      balance: {
        address
      }
    });
  };
}
export interface AutocompounderInterface extends AutocompounderReadOnlyInterface {
  contractAddress: string;
  sender: string;
  updateFeeConfig: ({
    deposit,
    performance,
    withdrawal
  }: {
    deposit?: Decimal;
    performance?: Decimal;
    withdrawal?: Decimal;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  deposit: ({
    funds
  }: {
    funds: AnsAsset[];
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  withdraw: (fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  compound: (fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  batchUnbond: (fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
}
export class AutocompounderClient extends AutocompounderQueryClient implements AutocompounderInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.updateFeeConfig = this.updateFeeConfig.bind(this);
    this.deposit = this.deposit.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.compound = this.compound.bind(this);
    this.batchUnbond = this.batchUnbond.bind(this);
  }

  updateFeeConfig = async ({
    deposit,
    performance,
    withdrawal
  }: {
    deposit?: Decimal;
    performance?: Decimal;
    withdrawal?: Decimal;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_fee_config: {
        deposit,
        performance,
        withdrawal
      }
    }, fee, memo, _funds);
  };
  deposit = async ({
    funds
  }: {
    funds: AnsAsset[];
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      deposit: {
        funds
      }
    }, fee, memo, _funds);
  };
  withdraw = async (fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      withdraw: {}
    }, fee, memo, _funds);
  };
  compound = async (fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      compound: {}
    }, fee, memo, _funds);
  };
  batchUnbond = async (fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      batch_unbond: {}
    }, fee, memo, _funds);
  };
}