import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AccountIdentifier = Uint8Array;
export interface CanisterAccounting {
  'principal' : Principal,
  'principal_value' : string,
  'subaccount' : SubAccount,
  'cycles' : [] | [bigint],
  'tokens_balance' : Tokens,
  'account_identifier' : AccountIdentifier,
  'address' : Hex,
}
export type Cycles = bigint;
export interface DBFILES {
  'accounting' : ActorMethod<[string], PrincipalAccounting>,
  'canister_accounting' : ActorMethod<[], CanisterAccounting>,
  'clean_canister' : ActorMethod<[Principal, Wasm], boolean>,
  'clear_column' : ActorMethod<[string, string], boolean>,
  'clear_table' : ActorMethod<[string], boolean>,
  'create_blob_json' : ActorMethod<
    [bigint, string, string, string, string, bigint],
    Uint8Array
  >,
  'cycles_available' : ActorMethod<[], bigint>,
  'cycles_balance' : ActorMethod<[], bigint>,
  'delete_canister' : ActorMethod<[Principal], boolean>,
  'delete_column' : ActorMethod<[string, string], boolean>,
  'delete_file' : ActorMethod<[UUID], boolean>,
  'delete_table' : ActorMethod<[string], boolean>,
  'delete_table_cell_value' : ActorMethod<[string, string, string], boolean>,
  'delete_table_entity' : ActorMethod<[string, string], boolean>,
  'download_chunks_by_guid' : ActorMethod<[GUID, bigint], [] | [Uint8Array]>,
  'download_chunks_by_uuid' : ActorMethod<[UUID, bigint], [] | [Uint8Array]>,
  'find_table_cell' : ActorMethod<[string, string, string], string>,
  'find_table_value' : ActorMethod<[string, string], string>,
  'get_collection_table_entityes' : ActorMethod<[string], Array<string>>,
  'get_collection_table_keys' : ActorMethod<[string], Array<string>>,
  'get_collection_tables' : ActorMethod<[], Array<string>>,
  'get_file_info_by_guid' : ActorMethod<
    [GUID],
    [bigint, string, string, string, string, bigint]
  >,
  'get_file_info_by_uuid' : ActorMethod<
    [UUID],
    [bigint, string, string, string, string, bigint]
  >,
  'get_rts_memory_size' : ActorMethod<[], bigint>,
  'get_table_entityes' : ActorMethod<[string], string>,
  'get_table_entityes_json' : ActorMethod<[string], string>,
  'get_table_keys' : ActorMethod<[string], string>,
  'get_table_keys_json' : ActorMethod<[string], string>,
  'get_tables' : ActorMethod<[], string>,
  'get_tables_array' : ActorMethod<[], Array<string>>,
  'get_tables_json' : ActorMethod<[], string>,
  'get_version' : ActorMethod<[], string>,
  'guid_to_uuid' : ActorMethod<[GUID], UUID>,
  'install_wasm' : ActorMethod<[Principal, Wasm], boolean>,
  'key_contains' : ActorMethod<[string, string], boolean>,
  'minting_cycles' : ActorMethod<[bigint], Cycles>,
  'reinstall_wasm' : ActorMethod<[Principal, Wasm], boolean>,
  'replace_table_value' : ActorMethod<
    [string, string, string, string],
    [] | [string]
  >,
  'replace_value' : ActorMethod<
    [string, string, string, string],
    [] | [string]
  >,
  'set_blob_file_info' : ActorMethod<
    [Uint8Array, string, string],
    [UUID, GUID]
  >,
  'set_file_info' : ActorMethod<
    [bigint, string, string, string, string, bigint],
    [UUID, GUID]
  >,
  'start_canister' : ActorMethod<[Principal], boolean>,
  'stop_canister' : ActorMethod<[Principal], boolean>,
  'table_contains' : ActorMethod<[string], boolean>,
  'uninstall_wasm' : ActorMethod<[Principal], boolean>,
  'upgrade_wasm' : ActorMethod<[Principal, Wasm], boolean>,
  'upload_chunks' : ActorMethod<[Uint8Array, UUID, bigint, bigint], UUID>,
  'upload_chunks_crc' : ActorMethod<
    [Uint8Array, UUID, bigint, bigint, bigint],
    [UUID, boolean]
  >,
  'upload_chunks_crc_result' : ActorMethod<
    [Uint8Array, UUID, bigint, bigint, bigint],
    Result_1
  >,
  'upload_chunks_result' : ActorMethod<
    [Uint8Array, UUID, bigint, bigint],
    Result
  >,
  'uuid_to_guid' : ActorMethod<[UUID], GUID>,
}
export type FileUploadError = { 'abort_upload' : null } |
  { 'crc_invalid' : null } |
  { 'unknown_error' : null };
export type GUID = string;
export type Hex = string;
export interface PrincipalAccounting {
  'principal' : Principal,
  'principal_value' : string,
  'subaccount' : SubAccount,
  'account_identifier' : AccountIdentifier,
  'address' : Hex,
}
export type Result = { 'ok' : UUID } |
  { 'err' : FileUploadError };
export type Result_1 = { 'ok' : [UUID, boolean] } |
  { 'err' : FileUploadError };
export type SubAccount = Uint8Array;
export interface Tokens { 'e8s' : bigint }
export type UUID = Uint8Array;
export type Wasm = Uint8Array;
export interface _SERVICE extends DBFILES {}
