/**
* This file was automatically generated by @cosmwasm/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { Addr, Uint128, Duration, Threshold, PercentageThreshold, Decimal, ConfigResponse, CheckedDepositInfo, ExecuteMsg, CosmosMsgForEmpty, BankMsg, StakingMsg, DistributionMsg, Binary, IbcMsg, Timestamp, Uint64, WasmMsg, GovMsg, VoteOption, Vote, DepositToken, Coin, Empty, IbcTimeout, IbcTimeoutBlock, DepositInfo, GovernanceModulesResponse, InfoResponse, ContractVersion, InstantiateMsg, Expiration, Status, ListProposalsResponse, ProposalResponse, Proposal, Votes, ListVotesResponse, VoteInfo, MigrateMsg, ProposalCountResponse, ProposalHooksResponse, QueryMsg, ReverseProposalsResponse, VoteHooksResponse, VoteResponse } from "./CwSingle.types";
export abstract class CwSingleExecuteMsgBuilder {
  static propose = ({
    description,
    msgs,
    title
  }: {
    description: string;
    msgs: CosmosMsgForEmpty[];
    title: string;
  }): ExecuteMsg => {
    return {
      propose: ({
        description,
        msgs,
        title
      } as const)
    };
  };
  static vote = ({
    proposalId,
    vote
  }: {
    proposalId: number;
    vote: Vote;
  }): ExecuteMsg => {
    return {
      vote: ({
        proposal_id: proposalId,
        vote
      } as const)
    };
  };
  static execute = ({
    proposalId
  }: {
    proposalId: number;
  }): ExecuteMsg => {
    return {
      execute: ({
        proposal_id: proposalId
      } as const)
    };
  };
  static close = ({
    proposalId
  }: {
    proposalId: number;
  }): ExecuteMsg => {
    return {
      close: ({
        proposal_id: proposalId
      } as const)
    };
  };
  static updateConfig = ({
    allowRevoting,
    dao,
    depositInfo,
    maxVotingPeriod,
    minVotingPeriod,
    onlyMembersExecute,
    threshold
  }: {
    allowRevoting: boolean;
    dao: string;
    depositInfo?: DepositInfo;
    maxVotingPeriod: Duration;
    minVotingPeriod?: Duration;
    onlyMembersExecute: boolean;
    threshold: Threshold;
  }): ExecuteMsg => {
    return {
      update_config: ({
        allow_revoting: allowRevoting,
        dao,
        deposit_info: depositInfo,
        max_voting_period: maxVotingPeriod,
        min_voting_period: minVotingPeriod,
        only_members_execute: onlyMembersExecute,
        threshold
      } as const)
    };
  };
  static addProposalHook = ({
    address
  }: {
    address: string;
  }): ExecuteMsg => {
    return {
      add_proposal_hook: ({
        address
      } as const)
    };
  };
  static removeProposalHook = ({
    address
  }: {
    address: string;
  }): ExecuteMsg => {
    return {
      remove_proposal_hook: ({
        address
      } as const)
    };
  };
  static addVoteHook = ({
    address
  }: {
    address: string;
  }): ExecuteMsg => {
    return {
      add_vote_hook: ({
        address
      } as const)
    };
  };
  static removeVoteHook = ({
    address
  }: {
    address: string;
  }): ExecuteMsg => {
    return {
      remove_vote_hook: ({
        address
      } as const)
    };
  };
}
export abstract class CwSingleQueryMsgBuilder {
  static config = (): QueryMsg => {
    return {
      config: ({} as const)
    };
  };
  static proposal = ({
    proposalId
  }: {
    proposalId: number;
  }): QueryMsg => {
    return {
      proposal: ({
        proposal_id: proposalId
      } as const)
    };
  };
  static listProposals = ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: number;
  }): QueryMsg => {
    return {
      list_proposals: ({
        limit,
        start_after: startAfter
      } as const)
    };
  };
  static reverseProposals = ({
    limit,
    startBefore
  }: {
    limit?: number;
    startBefore?: number;
  }): QueryMsg => {
    return {
      reverse_proposals: ({
        limit,
        start_before: startBefore
      } as const)
    };
  };
  static proposalCount = (): QueryMsg => {
    return {
      proposal_count: ({} as const)
    };
  };
  static vote = ({
    proposalId,
    voter
  }: {
    proposalId: number;
    voter: string;
  }): QueryMsg => {
    return {
      vote: ({
        proposal_id: proposalId,
        voter
      } as const)
    };
  };
  static listVotes = ({
    limit,
    proposalId,
    startAfter
  }: {
    limit?: number;
    proposalId: number;
    startAfter?: string;
  }): QueryMsg => {
    return {
      list_votes: ({
        limit,
        proposal_id: proposalId,
        start_after: startAfter
      } as const)
    };
  };
  static proposalHooks = (): QueryMsg => {
    return {
      proposal_hooks: ({} as const)
    };
  };
  static voteHooks = (): QueryMsg => {
    return {
      vote_hooks: ({} as const)
    };
  };
  static info = (): QueryMsg => {
    return {
      info: ({} as const)
    };
  };
}