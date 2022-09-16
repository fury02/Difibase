export const idlFactory = ({ IDL }) => {
  const Wasm = IDL.Vec(IDL.Nat8);
  const TypeHash = IDL.Variant({
    'sha224' : IDL.Null,
    'sha256' : IDL.Null,
    'sha384' : IDL.Null,
    'sha512' : IDL.Null,
    'kessak' : IDL.Null,
    'none' : IDL.Null,
    'unknown' : IDL.Null,
  });
  const SubAccount = IDL.Vec(IDL.Nat8);
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const Hex = IDL.Text;
  const CanisterAccounting = IDL.Record({
    'principal' : IDL.Principal,
    'principal_value' : IDL.Text,
    'subaccount' : SubAccount,
    'cycles' : IDL.Opt(IDL.Nat),
    'tokens_balance' : Tokens,
    'account_identifier' : AccountIdentifier,
    'address' : Hex,
  });
  const definite_canister_settings = IDL.Record({
    'freezing_threshold' : IDL.Nat,
    'controllers' : IDL.Vec(IDL.Principal),
    'memory_allocation' : IDL.Nat,
    'compute_allocation' : IDL.Nat,
  });
  const CanisterStatus = IDL.Record({
    'status' : IDL.Variant({
      'stopped' : IDL.Null,
      'stopping' : IDL.Null,
      'running' : IDL.Null,
    }),
    'freezing_threshold' : IDL.Nat,
    'memory_size' : IDL.Nat,
    'cycles' : IDL.Nat,
    'settings' : definite_canister_settings,
    'module_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Wasm__1 = IDL.Vec(IDL.Nat8);
  const WasmDelivered = IDL.Record({
    'name' : IDL.Text,
    'wasm' : Wasm__1,
    'version' : IDL.Nat,
  });
  const DescriptionError = IDL.Variant({
    'canister_install_wasm_error' : IDL.Null,
    'invalid_caller' : IDL.Null,
    'canister_create_error_not_enough_funds' : IDL.Null,
    'minting_cycles_error' : IDL.Null,
    'abort_canister_deploy' : IDL.Null,
    'abort_canister_create' : IDL.Null,
    'reject_install_wasm' : IDL.Null,
    'not_include_wasm' : IDL.Null,
    'unknown_error' : IDL.Null,
    'unreliable_operation' : IDL.Null,
  });
  const Result_1 = IDL.Variant({
    'ok' : WasmDelivered,
    'err' : DescriptionError,
  });
  const Cycles = IDL.Nat;
  const TypeHash__1 = IDL.Variant({
    'sha224' : IDL.Null,
    'sha256' : IDL.Null,
    'sha384' : IDL.Null,
    'sha512' : IDL.Null,
    'kessak' : IDL.Null,
    'none' : IDL.Null,
    'unknown' : IDL.Null,
  });
  const GUID__1 = IDL.Text;
  const UUID__1 = IDL.Vec(IDL.Nat8);
  const CombinedWasmInfo = IDL.Record({
    'value_hash' : IDL.Vec(IDL.Nat8),
    'type_hash' : TypeHash__1,
    'guid' : GUID__1,
    'name' : IDL.Text,
    'uuid' : UUID__1,
    'description' : IDL.Text,
    'version' : IDL.Nat,
    'updated' : IDL.Bool,
    'text_hash' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : Wasm, 'err' : DescriptionError });
  const FileHash = IDL.Record({
    'type_hash' : TypeHash__1,
    'value' : IDL.Vec(IDL.Nat8),
    'text_hash' : IDL.Text,
  });
  const WasmObject = IDL.Record({
    'wasm' : Wasm__1,
    'file_hash' : FileHash,
    'updated' : IDL.Bool,
  });
  const BlockIndex = IDL.Nat64;
  const TransferError = IDL.Variant({
    'TxTooOld' : IDL.Record({ 'allowed_window_nanos' : IDL.Nat64 }),
    'BadFee' : IDL.Record({ 'expected_fee' : Tokens }),
    'TxDuplicate' : IDL.Record({ 'duplicate_of' : BlockIndex }),
    'TxCreatedInFuture' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Tokens }),
  });
  const TransferResult = IDL.Variant({
    'Ok' : BlockIndex,
    'Err' : TransferError,
  });
  const TimeStamp = IDL.Record({ 'timestamp_nanos' : IDL.Nat64 });
  const TransferResultExpanded = IDL.Record({
    'transfer_result' : TransferResult,
    'created_at_time' : TimeStamp,
    'amount' : Tokens,
  });
  const UUID = IDL.Vec(IDL.Nat8);
  const GUID = IDL.Text;
  const WasmStorage = IDL.Service({
    'add_wasm' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Nat,
          Wasm,
          IDL.Vec(IDL.Nat8),
          IDL.Text,
          TypeHash,
        ],
        [],
        [],
      ),
    'caller' : IDL.Func([], [IDL.Principal], []),
    'canister_accounting' : IDL.Func([], [CanisterAccounting], []),
    'cycles_available' : IDL.Func([], [IDL.Nat], ['query']),
    'cycles_balance' : IDL.Func([], [IDL.Nat], ['query']),
    'deposit' : IDL.Func([], [], []),
    'get_canister_status' : IDL.Func([IDL.Principal], [CanisterStatus], []),
    'get_count_files' : IDL.Func([], [IDL.Nat], []),
    'get_rts_memory_size' : IDL.Func([], [IDL.Nat], []),
    'get_version' : IDL.Func([], [IDL.Text], ['query']),
    'install_wasm' : IDL.Func(
        [
          IDL.Nat,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Nat,
          IDL.Vec(IDL.Nat8),
          IDL.Text,
          TypeHash,
        ],
        [Wasm],
        [],
      ),
    'last_wasm_result' : IDL.Func([IDL.Text], [Result_1], []),
    'minting_cycles' : IDL.Func([IDL.Nat], [Cycles], []),
    'objects' : IDL.Func([], [IDL.Vec(CombinedWasmInfo)], []),
    'read_wasm' : IDL.Func([IDL.Text, IDL.Nat], [Wasm], []),
    'read_wasm_result' : IDL.Func([IDL.Text, IDL.Nat], [Result], []),
    'remove_wasm' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat],
        [IDL.Opt(WasmObject)],
        [],
      ),
    'transfer_icp' : IDL.Func([Hex, IDL.Nat], [TransferResultExpanded], []),
    'update_wasm' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Nat,
          UUID,
          GUID,
          Wasm,
          IDL.Vec(IDL.Nat8),
          IDL.Text,
          TypeHash,
        ],
        [IDL.Opt(WasmObject)],
        [],
      ),
    'upload_progress' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Vec(IDL.Nat8)],
        [],
        [],
      ),
    'withdraw' : IDL.Func([IDL.Nat], [], []),
  });
  return WasmStorage;
};
export const init = ({ IDL }) => { return []; };
