/**
* This file was automatically generated by @abstract-money/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @abstract-money/ts-codegen generate command to regenerate this file.
*/

import { UseQueryOptions, useQuery } from "react-query";
import { Addr, Uint128, Duration, Threshold, PercentageThreshold, Decimal, ConfigResponse, CheckedDepositInfo, ExecuteMsg, CosmosMsgForEmpty, BankMsg, StakingMsg, DistributionMsg, Binary, IbcMsg, Timestamp, Uint64, WasmMsg, GovMsg, VoteOption, Vote, DepositToken, Coin, Empty, IbcTimeout, IbcTimeoutBlock, DepositInfo, GovernanceModulesResponse, InfoResponse, ContractVersion, InstantiateMsg, Expiration, Status, ListProposalsResponse, ProposalResponse, Proposal, Votes, ListVotesResponse, VoteInfo, MigrateMsg, ProposalCountResponse, ProposalHooksResponse, QueryMsg, ReverseProposalsResponse, VoteHooksResponse, VoteResponse } from "./CwProposalSingle.types";
import { CwProposalSingleQueryClient } from "./CwProposalSingleclient";
export interface CwProposalSingleReactQuery<TResponse, TData = TResponse> {
  client: CwProposalSingleQueryClient;
  options?: UseQueryOptions<TResponse, Error, TData>;
}
export interface CwProposalSingleInfoQuery<TData> extends CwProposalSingleReactQuery<InfoResponse, TData> {}
export function useCwProposalSingleInfoQuery<TData = InfoResponse>({
  client,
  options
}: CwProposalSingleInfoQuery<TData>) {
  return useQuery<InfoResponse, Error, TData>(["cwProposalSingleInfo", client.contractAddress], () => client.info(), options);
}
export interface CwProposalSingleVoteHooksQuery<TData> extends CwProposalSingleReactQuery<VoteHooksResponse, TData> {}
export function useCwProposalSingleVoteHooksQuery<TData = VoteHooksResponse>({
  client,
  options
}: CwProposalSingleVoteHooksQuery<TData>) {
  return useQuery<VoteHooksResponse, Error, TData>(["cwProposalSingleVoteHooks", client.contractAddress], () => client.voteHooks(), options);
}
export interface CwProposalSingleProposalHooksQuery<TData> extends CwProposalSingleReactQuery<ProposalHooksResponse, TData> {}
export function useCwProposalSingleProposalHooksQuery<TData = ProposalHooksResponse>({
  client,
  options
}: CwProposalSingleProposalHooksQuery<TData>) {
  return useQuery<ProposalHooksResponse, Error, TData>(["cwProposalSingleProposalHooks", client.contractAddress], () => client.proposalHooks(), options);
}
export interface CwProposalSingleListVotesQuery<TData> extends CwProposalSingleReactQuery<ListVotesResponse, TData> {
  args: {
    limit?: number;
    proposalId: number;
    startAfter?: string;
  };
}
export function useCwProposalSingleListVotesQuery<TData = ListVotesResponse>({
  client,
  args,
  options
}: CwProposalSingleListVotesQuery<TData>) {
  return useQuery<ListVotesResponse, Error, TData>(["cwProposalSingleListVotes", client.contractAddress, JSON.stringify(args)], () => client.listVotes({
    limit: args.limit,
    proposalId: args.proposalId,
    startAfter: args.startAfter
  }), options);
}
export interface CwProposalSingleVoteQuery<TData> extends CwProposalSingleReactQuery<VoteResponse, TData> {
  args: {
    proposalId: number;
    voter: string;
  };
}
export function useCwProposalSingleVoteQuery<TData = VoteResponse>({
  client,
  args,
  options
}: CwProposalSingleVoteQuery<TData>) {
  return useQuery<VoteResponse, Error, TData>(["cwProposalSingleVote", client.contractAddress, JSON.stringify(args)], () => client.vote({
    proposalId: args.proposalId,
    voter: args.voter
  }), options);
}
export interface CwProposalSingleProposalCountQuery<TData> extends CwProposalSingleReactQuery<ProposalCountResponse, TData> {}
export function useCwProposalSingleProposalCountQuery<TData = ProposalCountResponse>({
  client,
  options
}: CwProposalSingleProposalCountQuery<TData>) {
  return useQuery<ProposalCountResponse, Error, TData>(["cwProposalSingleProposalCount", client.contractAddress], () => client.proposalCount(), options);
}
export interface CwProposalSingleReverseProposalsQuery<TData> extends CwProposalSingleReactQuery<ReverseProposalsResponse, TData> {
  args: {
    limit?: number;
    startBefore?: number;
  };
}
export function useCwProposalSingleReverseProposalsQuery<TData = ReverseProposalsResponse>({
  client,
  args,
  options
}: CwProposalSingleReverseProposalsQuery<TData>) {
  return useQuery<ReverseProposalsResponse, Error, TData>(["cwProposalSingleReverseProposals", client.contractAddress, JSON.stringify(args)], () => client.reverseProposals({
    limit: args.limit,
    startBefore: args.startBefore
  }), options);
}
export interface CwProposalSingleListProposalsQuery<TData> extends CwProposalSingleReactQuery<ListProposalsResponse, TData> {
  args: {
    limit?: number;
    startAfter?: number;
  };
}
export function useCwProposalSingleListProposalsQuery<TData = ListProposalsResponse>({
  client,
  args,
  options
}: CwProposalSingleListProposalsQuery<TData>) {
  return useQuery<ListProposalsResponse, Error, TData>(["cwProposalSingleListProposals", client.contractAddress, JSON.stringify(args)], () => client.listProposals({
    limit: args.limit,
    startAfter: args.startAfter
  }), options);
}
export interface CwProposalSingleProposalQuery<TData> extends CwProposalSingleReactQuery<ProposalResponse, TData> {
  args: {
    proposalId: number;
  };
}
export function useCwProposalSingleProposalQuery<TData = ProposalResponse>({
  client,
  args,
  options
}: CwProposalSingleProposalQuery<TData>) {
  return useQuery<ProposalResponse, Error, TData>(["cwProposalSingleProposal", client.contractAddress, JSON.stringify(args)], () => client.proposal({
    proposalId: args.proposalId
  }), options);
}
export interface CwProposalSingleConfigQuery<TData> extends CwProposalSingleReactQuery<ConfigResponse, TData> {}
export function useCwProposalSingleConfigQuery<TData = ConfigResponse>({
  client,
  options
}: CwProposalSingleConfigQuery<TData>) {
  return useQuery<ConfigResponse, Error, TData>(["cwProposalSingleConfig", client.contractAddress], () => client.config(), options);
}