/**
* This file was automatically generated by @cosmwasm/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee } from "@cosmjs/amino";
import { InstantiateMsg, ExecuteMsg, QueryMsg, MigrateMsg, SudoMsg, Uint128, Coin } from "./HackAtom.types";
export interface HackAtomReadOnlyInterface {
  contractAddress: string;
  verifier: () => Promise<VerifierResponse>;
  otherBalance: ({
    address
  }: {
    address: string;
  }) => Promise<OtherBalanceResponse>;
  recurse: ({
    depth,
    work
  }: {
    depth: number;
    work: number;
  }) => Promise<RecurseResponse>;
  getInt: () => Promise<GetIntResponse>;
}
export class HackAtomQueryClient implements HackAtomReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.verifier = this.verifier.bind(this);
    this.otherBalance = this.otherBalance.bind(this);
    this.recurse = this.recurse.bind(this);
    this.getInt = this.getInt.bind(this);
  }

  verifier = async (): Promise<VerifierResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      verifier: {}
    });
  };
  otherBalance = async ({
    address
  }: {
    address: string;
  }): Promise<OtherBalanceResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      other_balance: {
        address
      }
    });
  };
  recurse = async ({
    depth,
    work
  }: {
    depth: number;
    work: number;
  }): Promise<RecurseResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      recurse: {
        depth,
        work
      }
    });
  };
  getInt = async (): Promise<GetIntResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_int: {}
    });
  };
}
export interface HackAtomInterface extends HackAtomReadOnlyInterface {
  contractAddress: string;
  sender: string;
  release: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  cpuLoop: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  storageLoop: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  memoryLoop: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  messageLoop: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  allocateLargeMemory: ({
    pages
  }: {
    pages: number;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  panic: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  userErrorsInApiCalls: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
}
export class HackAtomClient extends HackAtomQueryClient implements HackAtomInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.release = this.release.bind(this);
    this.cpuLoop = this.cpuLoop.bind(this);
    this.storageLoop = this.storageLoop.bind(this);
    this.memoryLoop = this.memoryLoop.bind(this);
    this.messageLoop = this.messageLoop.bind(this);
    this.allocateLargeMemory = this.allocateLargeMemory.bind(this);
    this.panic = this.panic.bind(this);
    this.userErrorsInApiCalls = this.userErrorsInApiCalls.bind(this);
  }

  release = async (fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      release: {}
    }, fee, memo, funds);
  };
  cpuLoop = async (fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      cpu_loop: {}
    }, fee, memo, funds);
  };
  storageLoop = async (fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      storage_loop: {}
    }, fee, memo, funds);
  };
  memoryLoop = async (fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      memory_loop: {}
    }, fee, memo, funds);
  };
  messageLoop = async (fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      message_loop: {}
    }, fee, memo, funds);
  };
  allocateLargeMemory = async ({
    pages
  }: {
    pages: number;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      allocate_large_memory: {
        pages
      }
    }, fee, memo, funds);
  };
  panic = async (fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      panic: {}
    }, fee, memo, funds);
  };
  userErrorsInApiCalls = async (fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      user_errors_in_api_calls: {}
    }, fee, memo, funds);
  };
}