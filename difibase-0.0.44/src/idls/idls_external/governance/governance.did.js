export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const SystemParams = IDL.Record({
    'proposal_vote_threshold' : IDL.Nat,
    'proposal_submission_deposit' : IDL.Nat,
    'token_accessor' : IDL.Principal,
    'proposal_vote_reward' : IDL.Nat,
  });
  const TokenStandard = IDL.Variant({
    'EXT' : IDL.Null,
    'LEDGER' : IDL.Null,
    'DIP20' : IDL.Null,
    'DIP721' : IDL.Null,
    'NFT_ORIGYN' : IDL.Null,
  });
  const Token = IDL.Record({
    'canister' : IDL.Principal,
    'identifier' : IDL.Opt(IDL.Variant({ 'nat' : IDL.Nat, 'text' : IDL.Text })),
    'standard' : TokenStandard,
  });
  List.fill(IDL.Opt(IDL.Tuple(IDL.Principal, List)));
  const ExecuteProposalError = IDL.Variant({ 'ICRawCallError' : IDL.Text });
  const ProposalAcceptedState = IDL.Variant({
    'Failed' : ExecuteProposalError,
    'Succeeded' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const ProposalState = IDL.Variant({
    'Open' : IDL.Null,
    'Rejected' : IDL.Null,
    'Accepted' : IDL.Record({ 'state' : ProposalAcceptedState }),
  });
  const ProposalPayload = IDL.Record({
    'method' : IDL.Text,
    'canister_id' : IDL.Principal,
    'message' : IDL.Vec(IDL.Nat8),
  });
  const Proposal = IDL.Record({
    'id' : IDL.Nat,
    'token' : Token,
    'lock_id' : IDL.Nat,
    'votes_no' : IDL.Nat,
    'voters' : List,
    'state' : ProposalState,
    'timestamp' : IDL.Int,
    'proposer' : IDL.Principal,
    'votes_yes' : IDL.Nat,
    'payload' : ProposalPayload,
  });
  const CreateGovernanceArgs = IDL.Record({
    'system_params' : SystemParams,
    'proposals' : IDL.Vec(Proposal),
  });
  const AccountIdentifier = IDL.Text;
  const TokenIdentifier = IDL.Text;
  const TransferError = IDL.Variant({
    'CannotNotify' : AccountIdentifier,
    'InsufficientBalance' : IDL.Null,
    'InvalidToken' : TokenIdentifier,
    'Rejected' : IDL.Null,
    'Unauthorized' : AccountIdentifier,
    'Other' : IDL.Text,
  });
  const Token__1 = IDL.Record({ 'e8s' : IDL.Nat64 });
  const BlockIndex = IDL.Nat64;
  const TransferError__1 = IDL.Variant({
    'TxTooOld' : IDL.Record({ 'allowed_window_nanos' : IDL.Nat64 }),
    'BadFee' : IDL.Record({ 'expected_fee' : Token__1 }),
    'TxDuplicate' : IDL.Record({ 'duplicate_of' : BlockIndex }),
    'TxCreatedInFuture' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Token__1 }),
  });
  const TxError = IDL.Variant({
    'InsufficientAllowance' : IDL.Null,
    'InsufficientBalance' : IDL.Null,
    'ErrorOperationStyle' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'LedgerTrap' : IDL.Null,
    'ErrorTo' : IDL.Null,
    'Other' : IDL.Text,
    'BlockUsed' : IDL.Null,
    'AmountTooSmall' : IDL.Null,
  });
  const RefundError = IDL.Variant({
    'NftNotSupported' : IDL.Null,
    'LockNotFound' : IDL.Null,
    'TokenIdMissing' : IDL.Null,
    'TokenIdInvalidType' : IDL.Null,
    'AlreadyRefunded' : IDL.Null,
    'AlreadyCharged' : IDL.Null,
    'ComputeAccountIdFailed' : IDL.Null,
    'InterfaceError' : IDL.Variant({
      'EXT' : TransferError,
      'LEDGER' : TransferError__1,
      'DIP20' : TxError,
    }),
  });
  const ChargeError = IDL.Variant({
    'NftNotSupported' : IDL.Null,
    'LockNotFound' : IDL.Null,
    'TokenIdMissing' : IDL.Null,
    'TokenIdInvalidType' : IDL.Null,
    'AlreadyRefunded' : IDL.Null,
    'AlreadyCharged' : IDL.Null,
    'ComputeAccountIdFailed' : IDL.Null,
    'InterfaceError' : IDL.Variant({
      'EXT' : TransferError,
      'LEDGER' : TransferError__1,
      'DIP20' : TxError,
    }),
  });
  const TokenLockState = IDL.Variant({
    'Refunded' : IDL.Record({ 'transaction_id' : IDL.Opt(IDL.Nat) }),
    'Locked' : IDL.Variant({
      'Still' : IDL.Null,
      'RefundError' : RefundError,
      'ChargeError' : ChargeError,
    }),
    'Charged' : IDL.Record({ 'transaction_id' : IDL.Opt(IDL.Nat) }),
  });
  const TokenLock = IDL.Record({
    'transaction_id' : IDL.Opt(IDL.Nat),
    'token' : Token,
    'user' : IDL.Principal,
    'state' : TokenLockState,
    'index' : IDL.Nat,
    'amount' : IDL.Nat,
  });
  const AuthorizationError = IDL.Variant({ 'NotAllowed' : IDL.Null });
  const Result_5 = IDL.Variant({
    'ok' : IDL.Vec(TokenLock),
    'err' : AuthorizationError,
  });
  const DistributeBalancePayload = IDL.Record({
    'to' : IDL.Principal,
    'token' : Token,
    'amount' : IDL.Nat,
  });
  const NftError = IDL.Variant({
    'UnauthorizedOperator' : IDL.Null,
    'SelfTransfer' : IDL.Null,
    'TokenNotFound' : IDL.Null,
    'UnauthorizedOwner' : IDL.Null,
    'TxNotFound' : IDL.Null,
    'SelfApprove' : IDL.Null,
    'OperatorNotFound' : IDL.Null,
    'ExistedNFT' : IDL.Null,
    'OwnerNotFound' : IDL.Null,
    'Other' : IDL.Text,
  });
  const TransferError__2 = IDL.Variant({
    'TokenIdMissing' : IDL.Null,
    'TokenIdInvalidType' : IDL.Null,
    'ComputeAccountIdFailed' : IDL.Null,
    'InterfaceError' : IDL.Variant({
      'EXT' : TransferError,
      'LEDGER' : TransferError__1,
      'DIP20' : TxError,
      'DIP721' : NftError,
    }),
  });
  const DistributeBalanceError = IDL.Variant({
    'NotAllowed' : IDL.Null,
    'TokenInterfaceError' : TransferError__2,
  });
  const Result_4 = IDL.Variant({
    'ok' : IDL.Null,
    'err' : DistributeBalanceError,
  });
  const ExtTransferArgs = IDL.Record({
    'to' : IDL.Variant({ 'principal' : IDL.Principal, 'address' : IDL.Text }),
    'token' : IDL.Text,
    'notify' : IDL.Bool,
    'from' : IDL.Variant({ 'principal' : IDL.Principal, 'address' : IDL.Text }),
    'memo' : IDL.Vec(IDL.Nat8),
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'amount' : IDL.Nat,
  });
  const LedgerTransferArgs = IDL.Record({
    'to' : IDL.Vec(IDL.Nat8),
    'fee' : IDL.Record({ 'e8s' : IDL.Nat64 }),
    'memo' : IDL.Nat64,
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Record({ 'timestamp_nanos' : IDL.Nat64 })),
    'amount' : IDL.Record({ 'e8s' : IDL.Nat64 }),
  });
  const Dip20ApproveArgs = IDL.Record({
    'to' : IDL.Principal,
    'amount' : IDL.Nat,
  });
  const LockTransactionArgs__1 = IDL.Variant({
    'EXT' : ExtTransferArgs,
    'LEDGER' : LedgerTransferArgs,
    'DIP20' : Dip20ApproveArgs,
  });
  const LockTransactionArgs = IDL.Record({
    'token' : Token,
    'args' : LockTransactionArgs__1,
  });
  const GetLockTransactionArgsError__1 = IDL.Variant({
    'NftNotSupported' : IDL.Null,
    'TokenIdMissing' : IDL.Null,
    'TokenIdInvalidType' : IDL.Null,
    'ComputeAccountIdFailed' : IDL.Null,
  });
  const GetLockTransactionArgsError = IDL.Variant({
    'TokenLockerError' : GetLockTransactionArgsError__1,
    'TokenNotSet' : IDL.Null,
  });
  const Result_3 = IDL.Variant({
    'ok' : LockTransactionArgs,
    'err' : GetLockTransactionArgsError,
  });
  const LockedTokens = IDL.Record({
    'locks' : IDL.Vec(TokenLock),
    'amount' : IDL.Nat,
  });
  const MintPayload = IDL.Record({ 'to' : IDL.Principal, 'amount' : IDL.Nat });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : AuthorizationError });
  const CommonError = IDL.Variant({
    'InvalidToken' : TokenIdentifier,
    'Other' : IDL.Text,
  });
  const LockError = IDL.Variant({
    'NftNotSupported' : IDL.Null,
    'InsufficientBalance' : IDL.Null,
    'TokenIdMissing' : IDL.Null,
    'TokenIdInvalidType' : IDL.Null,
    'ComputeAccountIdFailed' : IDL.Null,
    'InterfaceError' : IDL.Variant({ 'EXT' : CommonError, 'DIP20' : TxError }),
  });
  const SubmitProposalError = IDL.Variant({
    'TokenLockerError' : LockError,
    'TokenNotSet' : IDL.Null,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : SubmitProposalError });
  const UpdateSystemParamsPayload = IDL.Record({
    'proposal_vote_threshold' : IDL.Opt(IDL.Nat),
    'proposal_submission_deposit' : IDL.Opt(IDL.Nat),
    'token_accessor' : IDL.Opt(IDL.Principal),
    'proposal_vote_reward' : IDL.Opt(IDL.Nat),
  });
  const Vote = IDL.Variant({ 'No' : IDL.Null, 'Yes' : IDL.Null });
  const VoteArgs = IDL.Record({ 'vote' : Vote, 'proposal_id' : IDL.Nat });
  const BalanceError = IDL.Variant({
    'NftNotSupported' : IDL.Null,
    'TokenIdMissing' : IDL.Null,
    'TokenIdInvalidType' : IDL.Null,
    'ComputeAccountIdFailed' : IDL.Null,
    'InterfaceError' : IDL.Variant({ 'EXT' : CommonError }),
  });
  const VoteError = IDL.Variant({
    'AlreadyVoted' : IDL.Null,
    'ProposalNotFound' : IDL.Null,
    'EmptyBalance' : IDL.Null,
    'ProposalNotOpen' : IDL.Null,
    'TokenInterfaceError' : BalanceError,
  });
  const Result = IDL.Variant({ 'ok' : ProposalState, 'err' : VoteError });
  const Governance = IDL.Service({
    'claimChargeErrors' : IDL.Func([], [Result_5], []),
    'claimRefundErrors' : IDL.Func([], [IDL.Vec(TokenLock)], []),
    'distributeBalance' : IDL.Func([DistributeBalancePayload], [Result_4], []),
    'executeAcceptedProposals' : IDL.Func([], [], []),
    'getLockTransactionArgs' : IDL.Func([], [Result_3], []),
    'getLockedTokens' : IDL.Func([], [LockedTokens], []),
    'getProposal' : IDL.Func([IDL.Nat], [IDL.Opt(Proposal)], ['query']),
    'getProposals' : IDL.Func([], [IDL.Vec(Proposal)], ['query']),
    'getSystemParams' : IDL.Func([], [SystemParams], ['query']),
    'mint' : IDL.Func([MintPayload], [Result_1], []),
    'submitProposal' : IDL.Func([ProposalPayload], [Result_2], []),
    'updateSystemParams' : IDL.Func(
        [UpdateSystemParamsPayload],
        [Result_1],
        [],
      ),
    'vote' : IDL.Func([VoteArgs], [Result], []),
  });
  return Governance;
};
export const init = ({ IDL }) => {
  const List = IDL.Rec();
  const SystemParams = IDL.Record({
    'proposal_vote_threshold' : IDL.Nat,
    'proposal_submission_deposit' : IDL.Nat,
    'token_accessor' : IDL.Principal,
    'proposal_vote_reward' : IDL.Nat,
  });
  const TokenStandard = IDL.Variant({
    'EXT' : IDL.Null,
    'LEDGER' : IDL.Null,
    'DIP20' : IDL.Null,
    'DIP721' : IDL.Null,
    'NFT_ORIGYN' : IDL.Null,
  });
  const Token = IDL.Record({
    'canister' : IDL.Principal,
    'identifier' : IDL.Opt(IDL.Variant({ 'nat' : IDL.Nat, 'text' : IDL.Text })),
    'standard' : TokenStandard,
  });
  List.fill(IDL.Opt(IDL.Tuple(IDL.Principal, List)));
  const ExecuteProposalError = IDL.Variant({ 'ICRawCallError' : IDL.Text });
  const ProposalAcceptedState = IDL.Variant({
    'Failed' : ExecuteProposalError,
    'Succeeded' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const ProposalState = IDL.Variant({
    'Open' : IDL.Null,
    'Rejected' : IDL.Null,
    'Accepted' : IDL.Record({ 'state' : ProposalAcceptedState }),
  });
  const ProposalPayload = IDL.Record({
    'method' : IDL.Text,
    'canister_id' : IDL.Principal,
    'message' : IDL.Vec(IDL.Nat8),
  });
  const Proposal = IDL.Record({
    'id' : IDL.Nat,
    'token' : Token,
    'lock_id' : IDL.Nat,
    'votes_no' : IDL.Nat,
    'voters' : List,
    'state' : ProposalState,
    'timestamp' : IDL.Int,
    'proposer' : IDL.Principal,
    'votes_yes' : IDL.Nat,
    'payload' : ProposalPayload,
  });
  const CreateGovernanceArgs = IDL.Record({
    'system_params' : SystemParams,
    'proposals' : IDL.Vec(Proposal),
  });
  return [CreateGovernanceArgs];
};
