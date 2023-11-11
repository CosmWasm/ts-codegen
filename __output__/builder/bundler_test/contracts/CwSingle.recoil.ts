/**
* This file was automatically generated by @cosmwasm/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { selectorFamily } from "recoil";
import { cosmWasmClient } from "./chain";
import { Addr, Uint128, Duration, Threshold, PercentageThreshold, Decimal, ConfigResponse, CheckedDepositInfo, ExecuteMsg, CosmosMsgForEmpty, BankMsg, StakingMsg, DistributionMsg, Binary, IbcMsg, Timestamp, Uint64, WasmMsg, GovMsg, VoteOption, Vote, DepositToken, Coin, Empty, IbcTimeout, IbcTimeoutBlock, DepositInfo, GovernanceModulesResponse, InfoResponse, ContractVersion, InstantiateMsg, Expiration, Status, ListProposalsResponse, ProposalResponse, Proposal, Votes, ListVotesResponse, VoteInfo, MigrateMsg, ProposalCountResponse, ProposalHooksResponse, QueryMsg, ReverseProposalsResponse, VoteHooksResponse, VoteResponse } from "./CwSingle.types";
import { CwSingleQueryClient } from "./CwSingle.client";
type QueryClientParams = {
  contractAddress: string;
};
export const queryClient = selectorFamily<CwSingleQueryClient, QueryClientParams>({
  key: "cwSingleQueryClient",
  get: ({
    contractAddress
  }) => ({
    get
  }) => {
    const client = get(cosmWasmClient);
    return new CwSingleQueryClient(client, contractAddress);
  }
});
export const configSelector = selectorFamily<ConfigResponse, QueryClientParams & {
  params: Parameters<CwSingleQueryClient["config"]>;
}>({
  key: "cwSingleConfig",
  get: ({
    params,
    ...queryClientParams
  }) => async ({
    get
  }) => {
    const client = get(queryClient(queryClientParams));
    return await client.config(...params);
  }
});
export const proposalSelector = selectorFamily<ProposalResponse, QueryClientParams & {
  params: Parameters<CwSingleQueryClient["proposal"]>;
}>({
  key: "cwSingleProposal",
  get: ({
    params,
    ...queryClientParams
  }) => async ({
    get
  }) => {
    const client = get(queryClient(queryClientParams));
    return await client.proposal(...params);
  }
});
export const listProposalsSelector = selectorFamily<ListProposalsResponse, QueryClientParams & {
  params: Parameters<CwSingleQueryClient["listProposals"]>;
}>({
  key: "cwSingleListProposals",
  get: ({
    params,
    ...queryClientParams
  }) => async ({
    get
  }) => {
    const client = get(queryClient(queryClientParams));
    return await client.listProposals(...params);
  }
});
export const reverseProposalsSelector = selectorFamily<ReverseProposalsResponse, QueryClientParams & {
  params: Parameters<CwSingleQueryClient["reverseProposals"]>;
}>({
  key: "cwSingleReverseProposals",
  get: ({
    params,
    ...queryClientParams
  }) => async ({
    get
  }) => {
    const client = get(queryClient(queryClientParams));
    return await client.reverseProposals(...params);
  }
});
export const proposalCountSelector = selectorFamily<ProposalCountResponse, QueryClientParams & {
  params: Parameters<CwSingleQueryClient["proposalCount"]>;
}>({
  key: "cwSingleProposalCount",
  get: ({
    params,
    ...queryClientParams
  }) => async ({
    get
  }) => {
    const client = get(queryClient(queryClientParams));
    return await client.proposalCount(...params);
  }
});
export const voteSelector = selectorFamily<VoteResponse, QueryClientParams & {
  params: Parameters<CwSingleQueryClient["vote"]>;
}>({
  key: "cwSingleVote",
  get: ({
    params,
    ...queryClientParams
  }) => async ({
    get
  }) => {
    const client = get(queryClient(queryClientParams));
    return await client.vote(...params);
  }
});
export const listVotesSelector = selectorFamily<ListVotesResponse, QueryClientParams & {
  params: Parameters<CwSingleQueryClient["listVotes"]>;
}>({
  key: "cwSingleListVotes",
  get: ({
    params,
    ...queryClientParams
  }) => async ({
    get
  }) => {
    const client = get(queryClient(queryClientParams));
    return await client.listVotes(...params);
  }
});
export const proposalHooksSelector = selectorFamily<ProposalHooksResponse, QueryClientParams & {
  params: Parameters<CwSingleQueryClient["proposalHooks"]>;
}>({
  key: "cwSingleProposalHooks",
  get: ({
    params,
    ...queryClientParams
  }) => async ({
    get
  }) => {
    const client = get(queryClient(queryClientParams));
    return await client.proposalHooks(...params);
  }
});
export const voteHooksSelector = selectorFamily<VoteHooksResponse, QueryClientParams & {
  params: Parameters<CwSingleQueryClient["voteHooks"]>;
}>({
  key: "cwSingleVoteHooks",
  get: ({
    params,
    ...queryClientParams
  }) => async ({
    get
  }) => {
    const client = get(queryClient(queryClientParams));
    return await client.voteHooks(...params);
  }
});
export const infoSelector = selectorFamily<InfoResponse, QueryClientParams & {
  params: Parameters<CwSingleQueryClient["info"]>;
}>({
  key: "cwSingleInfo",
  get: ({
    params,
    ...queryClientParams
  }) => async ({
    get
  }) => {
    const client = get(queryClient(queryClientParams));
    return await client.info(...params);
  }
});