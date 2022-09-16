import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AccountIdentifier = Uint8Array;
export type Action = { 'clean' : null } |
  { 'stop' : null } |
  { 'delete' : null } |
  { 'start' : null };
export interface Block {
  'transaction' : Transaction,
  'timestamp' : TimeStamp,
  'parent_hash' : [] | [Uint8Array],
}
export type BlockIndex = bigint;
export interface BlockParticipants {
  'to' : AccountIdentifier,
  'from' : AccountIdentifier,
  'verify' : boolean,
  'amount' : bigint,
}
export interface BlockRange { 'blocks' : Array<Block> }
export interface CanisterAccounting {
  'principal' : Principal,
  'principal_value' : string,
  'subaccount' : SubAccount,
  'cycles' : [] | [bigint],
  'tokens_balance' : Tokens,
  'account_identifier' : AccountIdentifier,
  'address' : Hex,
}
export interface CanisterStatus {
  'status' : { 'stopped' : null } |
    { 'stopping' : null } |
    { 'running' : null },
  'freezing_threshold' : bigint,
  'memory_size' : bigint,
  'cycles' : bigint,
  'settings' : definite_canister_settings,
  'module_hash' : [] | [Uint8Array],
}
export interface Cluster {
  'accounting' : ActorMethod<[string], PrincipalAccounting>,
  'block_participants' : ActorMethod<[bigint], BlockParticipants>,
  'caller' : ActorMethod<[], Principal>,
  'canister_accounting' : ActorMethod<[], CanisterAccounting>,
  'check_instances' : ActorMethod<[Action], Result_5>,
  'check_participants' : ActorMethod<
    [bigint, Principal, Principal],
    BlockParticipants
  >,
  'clean_canister' : ActorMethod<[Principal, Wasm], boolean>,
  'clean_instance' : ActorMethod<[bigint], Result>,
  'create_instance' : ActorMethod<[Principal], Result_4>,
  'credit' : ActorMethod<[], undefined>,
  'cycles_available' : ActorMethod<[], bigint>,
  'cycles_balance' : ActorMethod<[], bigint>,
  'delete_canister' : ActorMethod<[Principal], boolean>,
  'delete_instance' : ActorMethod<[bigint], Result>,
  'deploy_instance' : ActorMethod<
    [bigint, Principal, Principal, string, string, bigint],
    Result_3
  >,
  'deploy_instance_default' : ActorMethod<
    [bigint, Principal, Principal, string],
    Result_3
  >,
  'deploy_instance_default_internal' : ActorMethod<
    [Principal, string],
    [] | [Principal]
  >,
  'get_canister_status' : ActorMethod<[Principal], CanisterStatus>,
  'get_version' : ActorMethod<[], string>,
  'get_wasm' : ActorMethod<[string, bigint], Result_2>,
  'get_wasm_default' : ActorMethod<[], Result_1>,
  'install_wasm' : ActorMethod<[Principal, Wasm], boolean>,
  'minting_cycles' : ActorMethod<[bigint], Cycles>,
  'query_bloks' : ActorMethod<[bigint, bigint], QueryBlocksResponse>,
  'read_instances' : ActorMethod<[], Array<Instance>>,
  'read_instances_info' : ActorMethod<[], Array<InstanceInfo>>,
  'reinstall_wasm' : ActorMethod<[Principal, Wasm], boolean>,
  'size_instances' : ActorMethod<[], bigint>,
  'start_canister' : ActorMethod<[Principal], boolean>,
  'start_instance' : ActorMethod<[bigint], Result>,
  'stop_canister' : ActorMethod<[Principal], boolean>,
  'stop_instance' : ActorMethod<[bigint], Result>,
  'transfer_icp' : ActorMethod<[Hex, bigint], TransferResultExpanded>,
  'uninstall_wasm' : ActorMethod<[Principal], boolean>,
  'upgrade_wasm' : ActorMethod<[Principal, Wasm], boolean>,
}
export type ClusterInstanceError = { 'invalid_caller' : null } |
  { 'abort_delete_cluster' : null } |
  { 'abort_clean_instance' : null } |
  { 'abort_stop' : null } |
  { 'abort_replace_value' : null } |
  { 'abort_delete' : null } |
  { 'abort_clean_cluster' : null } |
  { 'abort_clean' : null } |
  { 'abort_start_cluster' : null } |
  { 'abort_stop_cluster' : null } |
  { 'abort_start_instance' : null } |
  { 'abort_start' : null } |
  { 'abort_delete_instance' : null } |
  { 'abort_stop_instance' : null } |
  { 'unknown_error' : null };
export type CurrentStatusInstance = { 'abandon' : null } |
  { 'stopped' : null } |
  { 'involved' : null } |
  { 'unknown' : null };
export type Cycles = bigint;
export type DescriptionError = { 'canister_install_wasm_error' : null } |
  { 'invalid_caller' : null } |
  { 'canister_create_error_not_enough_funds' : null } |
  { 'minting_cycles_error' : null } |
  { 'abort_canister_deploy' : null } |
  { 'abort_canister_create' : null } |
  { 'reject_install_wasm' : null } |
  { 'not_include_wasm' : null } |
  { 'unknown_error' : null } |
  { 'unreliable_operation' : null };
export interface GetBlocksArgs { 'start' : BlockIndex, 'length' : bigint }
export type Hex = string;
export interface Instance {
  'status' : CurrentStatusInstance,
  'instance_principal' : Principal,
  'wasm_version' : bigint,
  'wasm' : Wasm__1,
  'description' : string,
  'wasm_name' : string,
}
export interface InstanceInfo {
  'status' : CurrentStatusInstance,
  'instance_principal' : Principal,
  'wasm_version' : bigint,
  'description' : string,
  'number_key' : bigint,
  'wasm_name' : string,
}
export type Memo = bigint;
export type Operation = {
    'Burn' : { 'from' : AccountIdentifier, 'amount' : Tokens }
  } |
  { 'Mint' : { 'to' : AccountIdentifier, 'amount' : Tokens } } |
  {
    'Transfer' : {
      'to' : AccountIdentifier,
      'fee' : Tokens,
      'from' : AccountIdentifier,
      'amount' : Tokens,
    }
  };
export interface PrincipalAccounting {
  'principal' : Principal,
  'principal_value' : string,
  'subaccount' : SubAccount,
  'account_identifier' : AccountIdentifier,
  'address' : Hex,
}
export type QueryArchiveError = {
    'BadFirstBlockIndex' : {
      'requested_index' : BlockIndex,
      'first_valid_index' : BlockIndex,
    }
  } |
  { 'Other' : { 'error_message' : string, 'error_code' : bigint } };
export type QueryArchiveFn = ActorMethod<[GetBlocksArgs], QueryArchiveResult>;
export type QueryArchiveResult = { 'Ok' : BlockRange } |
  { 'Err' : QueryArchiveError };
export interface QueryBlocksResponse {
  'certificate' : [] | [Uint8Array],
  'blocks' : Array<Block>,
  'chain_length' : bigint,
  'first_block_index' : BlockIndex,
  'archived_blocks' : Array<
    { 'callback' : QueryArchiveFn, 'start' : BlockIndex, 'length' : bigint }
  >,
}
export type Result = { 'ok' : Principal } |
  { 'err' : ClusterInstanceError };
export type Result_1 = { 'ok' : WasmDelivered } |
  { 'err' : DescriptionError };
export type Result_2 = { 'ok' : Wasm } |
  { 'err' : DescriptionError };
export type Result_3 = { 'ok' : [Principal, string] } |
  { 'err' : DescriptionError };
export type Result_4 = { 'ok' : Principal } |
  { 'err' : DescriptionError };
export type Result_5 = { 'ok' : boolean } |
  { 'err' : ClusterInstanceError };
export type SubAccount = Uint8Array;
export interface TimeStamp { 'timestamp_nanos' : bigint }
export interface Tokens { 'e8s' : bigint }
export interface Transaction {
  'memo' : Memo,
  'operation' : [] | [Operation],
  'created_at_time' : TimeStamp,
}
export type TransferError = {
    'TxTooOld' : { 'allowed_window_nanos' : bigint }
  } |
  { 'BadFee' : { 'expected_fee' : Tokens } } |
  { 'TxDuplicate' : { 'duplicate_of' : BlockIndex } } |
  { 'TxCreatedInFuture' : null } |
  { 'InsufficientFunds' : { 'balance' : Tokens } };
export type TransferResult = { 'Ok' : BlockIndex } |
  { 'Err' : TransferError };
export interface TransferResultExpanded {
  'transfer_result' : TransferResult,
  'created_at_time' : TimeStamp,
  'amount' : Tokens,
}
export type Wasm = Uint8Array;
export interface WasmDelivered {
  'name' : string,
  'wasm' : Wasm__1,
  'version' : bigint,
}
export type Wasm__1 = Uint8Array;
export interface definite_canister_settings {
  'freezing_threshold' : bigint,
  'controllers' : Array<Principal>,
  'memory_allocation' : bigint,
  'compute_allocation' : bigint,
}
export interface _SERVICE extends Cluster {}
