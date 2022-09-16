import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AccountIdentifier = string;
export type BlockIndex = bigint;
export interface ClaimMintRecord {
  'result' : MintResult,
  'mint_record_id' : bigint,
  'amount' : bigint,
}
export interface ClaimMintTokens {
  'results' : Array<ClaimMintRecord>,
  'total_mints_succeeded' : bigint,
  'total_mints_failed' : bigint,
}
export type CommonError = { 'InvalidToken' : TokenIdentifier } |
  { 'Other' : string };
export type IsFungibleError = { 'TokenIdMissing' : null } |
  { 'TokenIdInvalidType' : null } |
  { 'InterfaceError' : { 'EXT' : CommonError } };
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
  'result' : Result_2,
  'token' : Token,
  'date' : bigint,
  'index' : bigint,
  'amount' : bigint,
}
export type MintResult = { 'ok' : [] | [bigint] } |
  { 'err' : MintError };
export type NotAuthorizedError = { 'NotAuthorized' : null };
export type Result = { 'ok' : null } |
  { 'err' : SetTokenError };
export type Result_1 = { 'ok' : null } |
  { 'err' : NotAuthorizedError };
export type Result_2 = { 'ok' : [] | [bigint] } |
  { 'err' : MintError };
export type SetTokenError = { 'IsFungibleError' : IsFungibleError } |
  { 'TokenNotOwned' : null } |
  { 'NotAuthorized' : null } |
  { 'TokenNotFungible' : null };
export interface Token {
  'canister' : Principal,
  'identifier' : [] | [{ 'nat' : bigint } | { 'text' : string }],
  'standard' : TokenStandard,
}
export interface TokenAccessor {
  'addMinter' : ActorMethod<[Principal], Result_1>,
  'claimMintTokens' : ActorMethod<[], ClaimMintTokens>,
  'getAdmin' : ActorMethod<[], Principal>,
  'getMintRecord' : ActorMethod<[bigint], [] | [MintRecord]>,
  'getMintRegister' : ActorMethod<[], Array<MintRecord>>,
  'getMinters' : ActorMethod<[], Array<Principal>>,
  'getToken' : ActorMethod<[], [] | [Token]>,
  'isAuthorizedMinter' : ActorMethod<[Principal], boolean>,
  'mint' : ActorMethod<[Principal, bigint], MintRecord>,
  'removeMinter' : ActorMethod<[Principal], Result_1>,
  'setAdmin' : ActorMethod<[Principal], Result_1>,
  'setToken' : ActorMethod<[Token], Result>,
}
export type TokenIdentifier = string;
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
export type TxError = { 'InsufficientAllowance' : null } |
  { 'InsufficientBalance' : null } |
  { 'ErrorOperationStyle' : null } |
  { 'Unauthorized' : null } |
  { 'LedgerTrap' : null } |
  { 'ErrorTo' : null } |
  { 'Other' : string } |
  { 'BlockUsed' : null } |
  { 'AmountTooSmall' : null };
export interface _SERVICE extends TokenAccessor {}
