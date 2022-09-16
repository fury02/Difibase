export const idlFactory = ({ IDL }) => {
  const SubAccount = IDL.Vec(IDL.Nat8);
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const Hex = IDL.Text;
  const PrincipalAccounting = IDL.Record({
    'principal' : IDL.Principal,
    'principal_value' : IDL.Text,
    'subaccount' : SubAccount,
    'account_identifier' : AccountIdentifier,
    'address' : Hex,
  });
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const CanisterAccounting = IDL.Record({
    'principal' : IDL.Principal,
    'principal_value' : IDL.Text,
    'subaccount' : SubAccount,
    'cycles' : IDL.Opt(IDL.Nat),
    'tokens_balance' : Tokens,
    'account_identifier' : AccountIdentifier,
    'address' : Hex,
  });
  const Wasm = IDL.Vec(IDL.Nat8);
  const Cycles = IDL.Nat;
  const DBEASY = IDL.Service({
    'accounting' : IDL.Func([IDL.Text], [PrincipalAccounting], []),
    'canister_accounting' : IDL.Func([], [CanisterAccounting], []),
    'clean_canister' : IDL.Func([IDL.Principal, Wasm], [IDL.Bool], []),
    'clear_column' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'clear_table' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'cycles_available' : IDL.Func([], [IDL.Nat], []),
    'cycles_balance' : IDL.Func([], [IDL.Nat], []),
    'delete_canister' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'delete_column' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'delete_table' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'delete_table_cell_value' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [IDL.Bool],
        [],
      ),
    'delete_table_entity' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'find_table_cell' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [IDL.Text],
        [],
      ),
    'find_table_value' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
    'get_collection_table_entityes' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Text)],
        [],
      ),
    'get_collection_table_keys' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], []),
    'get_collection_tables' : IDL.Func([], [IDL.Vec(IDL.Text)], []),
    'get_rts_memory_size' : IDL.Func([], [IDL.Nat], []),
    'get_table_entityes' : IDL.Func([IDL.Text], [IDL.Text], []),
    'get_table_entityes_json' : IDL.Func([IDL.Text], [IDL.Text], []),
    'get_table_keys' : IDL.Func([IDL.Text], [IDL.Text], []),
    'get_table_keys_json' : IDL.Func([IDL.Text], [IDL.Text], []),
    'get_tables' : IDL.Func([], [IDL.Text], []),
    'get_tables_array' : IDL.Func([], [IDL.Vec(IDL.Text)], []),
    'get_tables_json' : IDL.Func([], [IDL.Text], []),
    'get_version' : IDL.Func([], [IDL.Text], ['query']),
    'install_wasm' : IDL.Func([IDL.Principal, Wasm], [IDL.Bool], []),
    'key_contains' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'minting_cycles' : IDL.Func([IDL.Nat], [Cycles], []),
    'reinstall_wasm' : IDL.Func([IDL.Principal, Wasm], [IDL.Bool], []),
    'replace_table_value' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [IDL.Opt(IDL.Text)],
        [],
      ),
    'replace_value' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [IDL.Opt(IDL.Text)],
        [],
      ),
    'start_canister' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'stop_canister' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'table_contains' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'uninstall_wasm' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'upgrade_wasm' : IDL.Func([IDL.Principal, Wasm], [IDL.Bool], []),
  });
  return DBEASY;
};
export const init = ({ IDL }) => { return []; };
