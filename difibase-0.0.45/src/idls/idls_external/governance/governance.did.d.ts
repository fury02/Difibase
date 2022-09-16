import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AccountIdentifier = string;
export type AuthorizationError = { 'NotAllowed' : null };
export type BalanceError = { 'NftNotSupported' : null } |
  { 'TokenIdMissing' : null } |
  { 'TokenIdInvalidType' : null } |
  { 'ComputeAccountIdFailed' : null } |
  { 'InterfaceError' : { 'EXT' : CommonError } };
export type BlockIndex = bigint;
export type ChargeError = { 'NftNotSupported' : null } |
  { 'LockNotFound' : null } |
  { 'TokenIdMissing' : null } |
  { 'TokenIdInvalidType' : null } |
  { 'AlreadyRefunded' : null } |
  { 'AlreadyCharged' : null } |
  { 'ComputeAccountIdFailed' : null } |
  {
    'InterfaceError' : { 'EXT' : TransferError } |
      { 'LEDGER' : TransferError__1 } |
      { 'DIP20' : TxError }
  };
export type CommonError = { 'InvalidToken' : TokenIdentifier } |
  { 'Other' : string };
export interface CreateGovernanceArgs {
  'system_params' : SystemParams,
  'proposals' : Array<Proposal>,
}
export interface Dip20ApproveArgs { 'to' : Principal, 'amount' : bigint }
export type DistributeBalanceError = { 'NotAllowed' : null } |
  { 'TokenInterfaceError' : TransferError__2 };
export interface DistributeBalancePayload {
  'to' : Principal,
  'token' : Token,
  'amount' : bigint,
}
export type ExecuteProposalError = { 'ICRawCallError' : string };
export interface ExtTransferArgs {
  'to' : { 'principal' : Principal } |
    { 'address' : string },
  'token' : string,
  'notify' : boolean,
  'from' : { 'principal' : Principal } |
    { 'address' : string },
  'memo' : Array<number>,
  'subaccount' : [] | [Array<number>],
  'amount' : bigint,
}
export type GetLockTransactionArgsError = {
    'TokenLockerError' : GetLockTransactionArgsError__1
  } |
  { 'TokenNotSet' : null };
export type GetLockTransactionArgsError__1 = { 'NftNotSupported' : null } |
  { 'TokenIdMissing' : null } |
  { 'TokenIdInvalidType' : null } |
  { 'ComputeAccountIdFailed' : null };
export interface Governance {
  'claimChargeErrors' : ActorMethod<[], Result_5>,
  'claimRefundErrors' : ActorMethod<[], Array<TokenLock>>,
  'distributeBalance' : ActorMethod<[DistributeBalancePayload], Result_4>,
  'executeAcceptedProposals' : ActorMethod<[], undefined>,
  'getLockTransactionArgs' : ActorMethod<[], Result_3>,
  'getLockedTokens' : ActorMethod<[], LockedTokens>,
  'getProposal' : ActorMethod<[bigint], [] | [Proposal]>,
  'getProposals' : ActorMethod<[], Array<Proposal>>,
  'getSystemParams' : ActorMethod<[], SystemParams>,
  'mint' : ActorMethod<[MintPayload], Result_1>,
  'submitProposal' : ActorMethod<[ProposalPayload], Result_2>,
  'updateSystemParams' : ActorMethod<[UpdateSystemParamsPayload], Result_1>,
  'vote' : ActorMethod<[VoteArgs], Result>,
}
export interface LedgerTransferArgs {
  'to' : Array<number>,
  'fee' : { 'e8s' : bigint },
  'memo' : bigint,
  'from_subaccount' : [] | [Array<number>],
  'created_at_time' : [] | [{ 'timestamp_nanos' : bigint }],
  'amount' : { 'e8s' : bigint },
}
export type List = [] | [[Principal, List]];
export type LockError = { 'NftNotSupported' : null } |
  { 'InsufficientBalance' : null } |
  { 'TokenIdMissing' : null } |
  { 'TokenIdInvalidType' : null } |
  { 'ComputeAccountIdFailed' : null } |
  { 'InterfaceError' : { 'EXT' : CommonError } | { 'DIP20' : TxError } };
export interface LockTransactionArgs {
  'token' : Token,
  'args' : LockTransactionArgs__1,
}
export type LockTransactionArgs__1 = { 'EXT' : ExtTransferArgs } |
  { 'LEDGER' : LedgerTransferArgs } |
  { 'DIP20' : Dip20ApproveArgs };
export interface LockedTokens { 'locks' : Array<TokenLock>, 'amount' : bigint }
export interface MintPayload { 'to' : Principal, 'amount' : bigint }
export type NftError = { 'UnauthorizedOperator' : null } |
  { 'SelfTransfer' : null } |
  { 'TokenNotFound' : null } |
  { 'UnauthorizedOwner' : null } |
  { 'TxNotFound' : null } |
  { 'SelfApprove' : null } |
  { 'OperatorNotFound' : null } |
  { 'ExistedNFT' : null } |
  { 'OwnerNotFound' : null } |
  { 'Other' : string };
export interface Proposal {
  'id' : bigint,
  'token' : Token,
  'lock_id' : bigint,
  'votes_no' : bigint,
  'voters' : List,
  'state' : ProposalState,
  'timestamp' : bigint,
  'proposer' : Principal,
  'votes_yes' : bigint,
  'payload' : ProposalPayload,
}
export type ProposalAcceptedState = { 'Failed' : ExecuteProposalError } |
  { 'Succeeded' : null } |
  { 'Pending' : null };
export interface ProposalPayload {
  'method' : string,
  'canister_id' : Principal,
  'message' : Array<number>,
}
export type ProposalState = { 'Open' : null } |
  { 'Rejected' : null } |
  { 'Accepted' : { 'state' : ProposalAcceptedState } };
export type RefundError = { 'NftNotSupported' : null } |
  { 'LockNotFound' : null } |
  { 'TokenIdMissing' : null } |
  { 'TokenIdInvalidType' : null } |
  { 'AlreadyRefunded' : null } |
  { 'AlreadyCharged' : null } |
  { 'ComputeAccountIdFailed' : null } |
  {
    'InterfaceError' : { 'EXT' : TransferError } |
      { 'LEDGER' : TransferError__1 } |
      { 'DIP20' : TxError }
  };
export type Result = { 'ok' : ProposalState } |
  { 'err' : VoteError };
export type Result_1 = { 'ok' : null } |
  { 'err' : AuthorizationError };
export type Result_2 = { 'ok' : bigint } |
  { 'err' : SubmitProposalError };
export type Result_3 = { 'ok' : LockTransactionArgs } |
  { 'err' : GetLockTransactionArgsError };
export type Result_4 = { 'ok' : null } |
  { 'err' : DistributeBalanceError };
export type Result_5 = { 'ok' : Array<TokenLock> } |
  { 'err' : AuthorizationError };
export type SubmitProposalError = { 'TokenLockerError' : LockError } |
  { 'TokenNotSet' : null };
export interface SystemParams {
  'proposal_vote_threshold' : bigint,
  'proposal_submission_deposit' : bigint,
  'token_accessor' : Principal,
  'proposal_vote_reward' : bigint,
}
export interface Token {
  'canister' : Principal,
  'identifier' : [] | [{ 'nat' : bigint } | { 'text' : string }],
  'standard' : TokenStandard,
}
export type TokenIdentifier = string;
export interface TokenLock {
  'transaction_id' : [] | [bigint],
  'token' : Token,
  'user' : Principal,
  'state' : TokenLockState,
  'index' : bigint,
  'amount' : bigint,
}
export type TokenLockState = {
    'Refunded' : { 'transaction_id' : [] | [bigint] }
  } |
  {
    'Locked' : { 'Still' : null } |
      { 'RefundError' : RefundError } |
      { 'ChargeError' : ChargeError }
  } |
  { 'Charged' : { 'transaction_id' : [] | [bigint] } };
export type TokenStandard = { 'EXT' : null } |
  { 'LEDGER' : null } |
  { 'DIP20' : null } |
  { 'DIP721' : null } |
  { 'NFT_ORIGYN' : null };
export interface Token__1 { 'e8s' : bigint }
export type TransferError = { 'CannotNotify' : AccountIdentifier } |
  { 'InsufficientBalance' : null } |
  { 'InvalidToken' : TokenIdentifier } |
  { 'Rejected' : null } |
  { 'Unauthorized' : AccountIdentifier } |
  { 'Other' : string };
export type TransferError__1 = {
    'TxTooOld' : { 'allowed_window_nanos' : bigint }
  } |
  { 'BadFee' : { 'expected_fee' : Token__1 } } |
  { 'TxDuplicate' : { 'duplicate_of' : BlockIndex } } |
  { 'TxCreatedInFuture' : null } |
  { 'InsufficientFunds' : { 'balance' : Token__1 } };
export type TransferError__2 = { 'TokenIdMissing' : null } |
  { 'TokenIdInvalidType' : null } |
  { 'ComputeAccountIdFailed' : null } |
  {
    'InterfaceError' : { 'EXT' : TransferError } |
      { 'LEDGER' : TransferError__1 } |
      { 'DIP20' : TxError } |
      { 'DIP721' : NftError }
  };
export type TxError = { 'InsufficientAllowance' : null } |
  { 'InsufficientBalance' : null } |
  { 'ErrorOperationStyle' : null } |
  { 'Unauthorized' : null } |
  { 'LedgerTrap' : null } |
  { 'ErrorTo' : null } |
  { 'Other' : string } |
  { 'BlockUsed' : null } |
  { 'AmountTooSmall' : null };
export interface UpdateSystemParamsPayload {
  'proposal_vote_threshold' : [] | [bigint],
  'proposal_submission_deposit' : [] | [bigint],
  'token_accessor' : [] | [Principal],
  'proposal_vote_reward' : [] | [bigint],
}
export type Vote = { 'No' : null } |
  { 'Yes' : null };
export interface VoteArgs { 'vote' : Vote, 'proposal_id' : bigint }
export type VoteError = { 'AlreadyVoted' : null } |
  { 'ProposalNotFound' : null } |
  { 'EmptyBalance' : null } |
  { 'ProposalNotOpen' : null } |
  { 'TokenInterfaceError' : BalanceError };
export interface _SERVICE extends Governance {}
