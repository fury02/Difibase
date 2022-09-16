import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AccountIdentifier = string;
export type BlockIndex = bigint;
export interface ConfigureCommandRecord {
  'admin' : Principal,
  'date' : bigint,
  'command' : CyclesProviderCommand,
}
export type ConfigureError = { 'NotInAllowList' : null } |
  { 'NotAllowed' : null } |
  { 'InvalidBalanceArguments' : null } |
  { 'InvalidCycleConfig' : null };
export interface CreateCyclesProviderArgs {
  'admin' : Principal,
  'minimum_cycles_balance' : bigint,
  'cycles_exchange_config' : Array<ExchangeLevel>,
  'token_accessor' : Principal,
}
export interface CyclesBalanceRecord { 'balance' : bigint, 'date' : bigint }
export type CyclesDistributionMethod = { 'DistributeCycles' : null } |
  { 'RequestCycles' : null };
export interface CyclesProfile {
  'principal' : Principal,
  'balance_cycles' : bigint,
  'powering_parameters' : PoweringParameters,
}
export interface CyclesProvider {
  'computeTokensInExchange' : ActorMethod<[bigint], bigint>,
  'configure' : ActorMethod<[CyclesProviderCommand], Result_3>,
  'cyclesBalance' : ActorMethod<[], bigint>,
  'distributeCycles' : ActorMethod<[], undefined>,
  'getAdmin' : ActorMethod<[], Principal>,
  'getAllowList' : ActorMethod<[], Array<[Principal, PoweringParameters]>>,
  'getConfigureCommandRegister' : ActorMethod<
    [],
    Array<ConfigureCommandRecord>,
  >,
  'getCycleExchangeConfig' : ActorMethod<[], Array<ExchangeLevel>>,
  'getCyclesBalanceRegister' : ActorMethod<[], Array<CyclesBalanceRecord>>,
  'getCyclesProfile' : ActorMethod<[], Array<CyclesProfile>>,
  'getCyclesReceivedRegister' : ActorMethod<[], Array<CyclesReceivedRecord>>,
  'getCyclesSentRegister' : ActorMethod<[], Array<CyclesSentRecord>>,
  'getMinimumBalance' : ActorMethod<[], bigint>,
  'getTokenAccessor' : ActorMethod<[], Principal>,
  'requestCycles' : ActorMethod<[], Result_2>,
  'walletReceive' : ActorMethod<[], Result>,
}
export type CyclesProviderCommand = {
    'SetAdmin' : { 'canister' : Principal }
  } |
  { 'RemoveAllowList' : { 'canister' : Principal } } |
  { 'SetMinimumBalance' : { 'minimum_balance' : bigint } } |
  { 'SetCycleExchangeConfig' : Array<ExchangeLevel> } |
  {
    'AddAllowList' : {
      'balance_threshold' : bigint,
      'balance_target' : bigint,
      'pull_authorized' : boolean,
      'canister' : Principal,
    }
  };
export interface CyclesReceivedRecord {
  'date' : bigint,
  'from' : Principal,
  'cycle_amount' : bigint,
  'mint_index' : bigint,
}
export interface CyclesSentRecord {
  'to' : Principal,
  'method' : CyclesDistributionMethod,
  'date' : bigint,
  'amount' : bigint,
}
export type CyclesTransferError = { 'CallerRefundedAll' : null } |
  { 'PullNotAuthorized' : null } |
  { 'InsufficientCycles' : null } |
  { 'CanisterNotAllowed' : null };
export type CyclesTransferSuccess = { 'Refilled' : null } |
  { 'AlreadyAboveThreshold' : null };
export interface DistributeCyclesInfo {
  'time' : bigint,
  'state' : DistributeCyclesState,
}
export type DistributeCyclesState = { 'Failed' : CyclesTransferError } |
  { 'Refilled' : null } |
  { 'Trapped' : null } |
  { 'AlreadyAboveThreshold' : null } |
  { 'Pending' : null };
export interface ExchangeLevel { 'threshold' : bigint, 'rate_per_t' : number }
export type MintError = { 'NftNotSupported' : null } |
  { 'TokenIdMissing' : null } |
  { 'TokenIdInvalidType' : null } |
  { 'ComputeAccountIdFailed' : null } |
  {
    'InterfaceError' : { 'EXT' : TransferError } |
      { 'LEDGER' : TransferError__1 } |
      { 'DIP20' : TxError }
  };
export interface MintRecord {
  'to' : Principal,
  'result' : Result_1,
  'token' : Token__1,
  'date' : bigint,
  'index' : bigint,
  'amount' : bigint,
}
export interface PoweringParameters {
  'balance_threshold' : bigint,
  'balance_target' : bigint,
  'pull_authorized' : boolean,
  'last_execution' : DistributeCyclesInfo,
}
export type Result = { 'ok' : MintRecord } |
  { 'err' : WalletReceiveError };
export type Result_1 = { 'ok' : [] | [bigint] } |
  { 'err' : MintError };
export type Result_2 = { 'ok' : CyclesTransferSuccess } |
  { 'err' : CyclesTransferError };
export type Result_3 = { 'ok' : null } |
  { 'err' : ConfigureError };
export interface Token { 'e8s' : bigint }
export type TokenIdentifier = string;
export type TokenStandard = { 'EXT' : null } |
  { 'LEDGER' : null } |
  { 'DIP20' : null } |
  { 'DIP721' : null } |
  { 'NFT_ORIGYN' : null };
export interface Token__1 {
  'canister' : Principal,
  'identifier' : [] | [{ 'nat' : bigint } | { 'text' : string }],
  'standard' : TokenStandard,
}
export type TransferError = { 'CannotNotify' : AccountIdentifier } |
  { 'InsufficientBalance' : null } |
  { 'InvalidToken' : TokenIdentifier } |
  { 'Rejected' : null } |
  { 'Unauthorized' : AccountIdentifier } |
  { 'Other' : string };
export type TransferError__1 = {
    'TxTooOld' : { 'allowed_window_nanos' : bigint }
  } |
  { 'BadFee' : { 'expected_fee' : Token } } |
  { 'TxDuplicate' : { 'duplicate_of' : BlockIndex } } |
  { 'TxCreatedInFuture' : null } |
  { 'InsufficientFunds' : { 'balance' : Token } };
export type TxError = { 'InsufficientAllowance' : null } |
  { 'InsufficientBalance' : null } |
  { 'ErrorOperationStyle' : null } |
  { 'Unauthorized' : null } |
  { 'LedgerTrap' : null } |
  { 'ErrorTo' : null } |
  { 'Other' : string } |
  { 'BlockUsed' : null } |
  { 'AmountTooSmall' : null };
export type WalletReceiveError = { 'NoCyclesAdded' : null } |
  {
    'TokenAccessorError' : { 'TokenNotSet' : null } |
      { 'MintNotAuthorized' : null }
  } |
  { 'MaxCyclesReached' : null } |
  { 'InvalidCycleConfig' : null };
export interface _SERVICE extends CyclesProvider {}
