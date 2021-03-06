import Nat8  "mo:base/Nat8";
import Text "mo:base/Text";

module{

    // public type  CycleInterface = actor{
    //     withdraw_cycles : () -> async ();
    // };

    public type WasmActorInterface = actor{
        query_get_version : () -> async ({version: Text});
        get_version: () -> async ({version: Text});
    };
 
    public type DbsInstanceInterface = actor{
//   add_service_second_controller: (text) -> ();
//   clear_column: (text, text) -> (bool);
//   clear_service_second_controller: (text) -> ();
//   clear_table: (text) -> (bool);
//   credit: () -> ();
//   cycles_available: () -> (nat);
//   cycles_balance: () -> (nat);
//   cycles_savings: () -> (nat);
//   delete_column: (text, text) -> (bool);
//   delete_file: (UUID) -> (bool);
//   delete_table: (text) -> (bool);
//   delete_table_cell_value: (text, text, text) -> (bool);
//   delete_table_entity: (text, text) -> (bool);
//   deposit: () -> ();
//   download_chunks: (UUID, nat) -> (opt blob);
//   exist_table: (text) -> (bool);
//   find_table_cell: (text, text, text) -> (text);
//   find_table_value: (text, text) -> (text);
//   get_file_info: (UUID) -> (nat, text, text, text, text, nat);
//   get_real_canister_size: () -> () oneway;
//   get_real_canisters_size: () -> () oneway;
//   get_rts_memory_size: () -> (nat);
//   get_table_entityes: (text) -> (vec text);
//   get_table_entityes_json: (text) -> (text);
//   get_table_keys: (text) -> (vec text);
//   get_table_keys_json: (text) -> (text);
//   get_tables: () -> (vec text);
//   get_tables_json: () -> (text);
//   guid_to_uuid: (GUID) -> (UUID);
//   id: () -> (principal);
//   installer: () -> (principal) query;
//   ping: () -> (text);
//   print_buckets_files: () -> ();
//   print_buckets_tables: () -> ();
//   replace_value: (text, text, text, text) -> (opt text);
//   set_file_info: (nat, text, text, text, text, nat) -> (UUID, GUID);
//   ui_service_canister_id: () -> (text);
//   ui_service_compute_allocation: () -> (text);
//   ui_service_created_tables: () -> (text);
//   ui_service_freezing_threshold: () -> (text);
//   ui_service_generated_buckets: () -> (text);
//   ui_service_max_buckets: () -> (text);
//   ui_service_memory_allocation: () -> (text);
//   ui_service_using_memory_size: () -> (text);
//   upload_chunks: (blob, UUID, nat, nat) -> (UUID);
//   upload_chunks_crc: (blob, UUID, nat, nat, nat) -> (UUID, bool);
//   uuid_to_guid: (UUID) -> (GUID);
//   whoami: () -> (principal);
    };
}