import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AccountIdentifier = Uint8Array;
export type BlockIndex = bigint;
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
export interface CombinedWasmInfo {
  'value_hash' : Uint8Array,
  'type_hash' : TypeHash__1,
  'guid' : GUID__1,
  'name' : string,
  'uuid' : UUID__1,
  'description' : string,
  'version' : bigint,
  'updated' : boolean,
  'text_hash' : string,
}
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
export interface FileHash {
  'type_hash' : TypeHash__1,
  'value' : Uint8Array,
  'text_hash' : string,
}
export type GUID = string;
export type GUID__1 = string;
export type Hex = string;
export type Result = { 'ok' : Wasm } |
  { 'err' : DescriptionError };
export type Result_1 = { 'ok' : WasmDelivered } |
  { 'err' : DescriptionError };
export type SubAccount = Uint8Array;
export interface TimeStamp { 'timestamp_nanos' : bigint }
export interface Tokens { 'e8s' : bigint }
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
export type TypeHash = { 'sha224' : null } |
  { 'sha256' : null } |
  { 'sha384' : null } |
  { 'sha512' : null } |
  { 'kessak' : null } |
  { 'none' : null } |
  { 'unknown' : null };
export type TypeHash__1 = { 'sha224' : null } |
  { 'sha256' : null } |
  { 'sha384' : null } |
  { 'sha512' : null } |
  { 'kessak' : null } |
  { 'none' : null } |
  { 'unknown' : null };
export type UUID = Uint8Array;
export type UUID__1 = Uint8Array;
export type Wasm = Uint8Array;
export interface WasmDelivered {
  'name' : string,
  'wasm' : Wasm__1,
  'version' : bigint,
}
export interface WasmObject {
  'wasm' : Wasm__1,
  'file_hash' : FileHash,
  'updated' : boolean,
}
export interface WasmStorage {
  'add_wasm' : ActorMethod<
    [string, string, bigint, Wasm, Uint8Array, string, TypeHash],
    undefined
  >,
  'caller' : ActorMethod<[], Principal>,
  'canister_accounting' : ActorMethod<[], CanisterAccounting>,
  'cycles_available' : ActorMethod<[], bigint>,
  'cycles_balance' : ActorMethod<[], bigint>,
  'deposit' : ActorMethod<[], undefined>,
  'get_canister_status' : ActorMethod<[Principal], CanisterStatus>,
  'get_count_files' : ActorMethod<[], bigint>,
  'get_rts_memory_size' : ActorMethod<[], bigint>,
  'get_version' : ActorMethod<[], string>,
  'install_wasm' : ActorMethod<
    [bigint, string, string, string, bigint, Uint8Array, string, TypeHash],
    Wasm
  >,
  'last_wasm_result' : ActorMethod<[string], Result_1>,
  'minting_cycles' : ActorMethod<[bigint], Cycles>,
  'objects' : ActorMethod<[], Array<CombinedWasmInfo>>,
  'read_wasm' : ActorMethod<[string, bigint], Wasm>,
  'read_wasm_result' : ActorMethod<[string, bigint], Result>,
  'remove_wasm' : ActorMethod<[string, string, bigint], [] | [WasmObject]>,
  'transfer_icp' : ActorMethod<[Hex, bigint], TransferResultExpanded>,
  'update_wasm' : ActorMethod<
    [string, string, bigint, UUID, GUID, Wasm, Uint8Array, string, TypeHash],
    [] | [WasmObject]
  >,
  'upload_progress' : ActorMethod<[bigint, string, Uint8Array], undefined>,
  'withdraw' : ActorMethod<[bigint], undefined>,
}
export type Wasm__1 = Uint8Array;
export interface definite_canister_settings {
  'freezing_threshold' : bigint,
  'controllers' : Array<Principal>,
  'memory_allocation' : bigint,
  'compute_allocation' : bigint,
}
export interface _SERVICE extends WasmStorage {}
