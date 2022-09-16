import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Metadata {
  'fee' : bigint,
  'decimals' : number,
  'owner' : Principal,
  'logo' : string,
  'name' : string,
  'totalSupply' : bigint,
  'symbol' : string,
}
export type Time = bigint;
export interface Token {
  'add_service_second_controller' : ActorMethod<[string], undefined>,
  'allowance' : ActorMethod<[Principal, Principal], bigint>,
  'approve' : ActorMethod<[Principal, bigint], TxReceipt>,
  'balanceOf' : ActorMethod<[Principal], bigint>,
  'burn' : ActorMethod<[bigint], TxReceipt>,
  'clear_service_second_controller' : ActorMethod<[string], undefined>,
  'decimals' : ActorMethod<[], number>,
  'getAllowanceSize' : ActorMethod<[], bigint>,
  'getBalanceOf' : ActorMethod<[string], bigint>,
  'getHolders' : ActorMethod<[bigint, bigint], Array<[Principal, bigint]>>,
  'getMetadata' : ActorMethod<[], Metadata>,
  'getTokenFee' : ActorMethod<[], bigint>,
  'getTokenInfo' : ActorMethod<[], TokenInfo>,
  'getUserApprovals' : ActorMethod<[Principal], Array<[Principal, bigint]>>,
  'get_canister_status_info' : ActorMethod<[], canister_status_type>,
  'historySize' : ActorMethod<[], bigint>,
  'logo' : ActorMethod<[], string>,
  'mint' : ActorMethod<[Principal, bigint], TxReceipt>,
  'name' : ActorMethod<[], string>,
  'setFee' : ActorMethod<[bigint], undefined>,
  'setFeeTo' : ActorMethod<[Principal], undefined>,
  'setLogo' : ActorMethod<[string], undefined>,
  'setName' : ActorMethod<[string], undefined>,
  'setOwner' : ActorMethod<[Principal], undefined>,
  'symbol' : ActorMethod<[], string>,
  'totalSupply' : ActorMethod<[], bigint>,
  'transfer' : ActorMethod<[Principal, bigint], TxReceipt>,
  'transferFrom' : ActorMethod<[Principal, Principal, bigint], TxReceipt>,
}
export interface TokenInfo {
  'holderNumber' : bigint,
  'deployTime' : Time,
  'metadata' : Metadata,
  'historySize' : bigint,
  'cycles' : bigint,
  'feeTo' : Principal,
}
export type TxReceipt = { 'Ok' : bigint } |
  {
    'Err' : { 'InsufficientAllowance' : null } |
      { 'InsufficientBalance' : null } |
      { 'ErrorOperationStyle' : null } |
      { 'Unauthorized' : null } |
      { 'LedgerTrap' : null } |
      { 'ErrorTo' : null } |
      { 'Other' : string } |
      { 'BlockUsed' : null } |
      { 'AmountTooSmall' : null }
  };
export interface canister_status_type {
  'status' : { 'stopped' : null } |
    { 'stopping' : null } |
    { 'running' : null },
  'memory_size' : bigint,
  'cycles' : bigint,
  'settings' : definite_canister_settings,
  'module_hash' : [] | [Uint8Array],
}
export interface definite_canister_settings {
  'freezing_threshold' : bigint,
  'controllers' : Array<Principal>,
  'memory_allocation' : bigint,
  'compute_allocation' : bigint,
}
export interface _SERVICE extends Token {}
