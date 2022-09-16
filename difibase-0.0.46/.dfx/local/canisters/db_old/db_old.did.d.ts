import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface DF_SERVICE {
  'add_service_second_controller' : ActorMethod<[string], undefined>,
  'clear_column' : ActorMethod<[string, string], boolean>,
  'clear_service_second_controller' : ActorMethod<[string], undefined>,
  'clear_table' : ActorMethod<[string], boolean>,
  'credit' : ActorMethod<[], undefined>,
  'cycles_available' : ActorMethod<[], bigint>,
  'cycles_balance' : ActorMethod<[], bigint>,
  'cycles_savings' : ActorMethod<[], bigint>,
  'delete_column' : ActorMethod<[string, string], boolean>,
  'delete_file' : ActorMethod<[UUID], boolean>,
  'delete_table' : ActorMethod<[string], boolean>,
  'delete_table_cell_value' : ActorMethod<[string, string, string], boolean>,
  'delete_table_entity' : ActorMethod<[string, string], boolean>,
  'deposit' : ActorMethod<[], undefined>,
  'download_chunks' : ActorMethod<[UUID, bigint], [] | [Uint8Array]>,
  'exist_table' : ActorMethod<[string], boolean>,
  'find_table_cell' : ActorMethod<[string, string, string], string>,
  'find_table_value' : ActorMethod<[string, string], string>,
  'getVersion' : ActorMethod<[], string>,
  'get_file_info' : ActorMethod<
    [UUID],
    [bigint, string, string, string, string, bigint]
  >,
  'get_real_canister_size' : ActorMethod<[], undefined>,
  'get_real_canisters_size' : ActorMethod<[], undefined>,
  'get_rts_memory_size' : ActorMethod<[], bigint>,
  'get_table_entityes' : ActorMethod<[string], Array<string>>,
  'get_table_entityes_json' : ActorMethod<[string], string>,
  'get_table_keys' : ActorMethod<[string], Array<string>>,
  'get_table_keys_json' : ActorMethod<[string], string>,
  'get_tables' : ActorMethod<[], Array<string>>,
  'get_tables_json' : ActorMethod<[], string>,
  'guid_to_uuid' : ActorMethod<[GUID], UUID>,
  'id' : ActorMethod<[], Principal>,
  'installer' : ActorMethod<[], Principal>,
  'ping' : ActorMethod<[], string>,
  'print_buckets_files' : ActorMethod<[], undefined>,
  'print_buckets_tables' : ActorMethod<[], undefined>,
  'replace_value' : ActorMethod<
    [string, string, string, string],
    [] | [string]
  >,
  'set_file_info' : ActorMethod<
    [bigint, string, string, string, string, bigint],
    [UUID, GUID]
  >,
  'ui_service_canister_id' : ActorMethod<[], string>,
  'ui_service_compute_allocation' : ActorMethod<[], string>,
  'ui_service_created_tables' : ActorMethod<[], string>,
  'ui_service_freezing_threshold' : ActorMethod<[], string>,
  'ui_service_generated_buckets' : ActorMethod<[], string>,
  'ui_service_max_buckets' : ActorMethod<[], string>,
  'ui_service_memory_allocation' : ActorMethod<[], string>,
  'ui_service_using_memory_size' : ActorMethod<[], string>,
  'upload_chunks' : ActorMethod<[Uint8Array, UUID, bigint, bigint], UUID>,
  'upload_chunks_crc' : ActorMethod<
    [Uint8Array, UUID, bigint, bigint, bigint],
    [UUID, boolean]
  >,
  'uuid_to_guid' : ActorMethod<[UUID], GUID>,
  'whoami' : ActorMethod<[], Principal>,
}
export type GUID = string;
export type UUID = Uint8Array;
export interface _SERVICE extends DF_SERVICE {}
