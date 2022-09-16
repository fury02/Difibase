export const idlFactory = ({ IDL }) => {
  const Branch = IDL.Rec();
  const List = IDL.Rec();
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
  const Hash = IDL.Nat32;
  const Key = IDL.Record({ 'key' : IDL.Principal, 'hash' : Hash });
  List.fill(IDL.Opt(IDL.Tuple(IDL.Tuple(Key, IDL.Null), List)));
  const AssocList = IDL.Opt(IDL.Tuple(IDL.Tuple(Key, IDL.Null), List));
  const Leaf = IDL.Record({ 'size' : IDL.Nat, 'keyvals' : AssocList });
  const Trie = IDL.Variant({
    'branch' : Branch,
    'leaf' : Leaf,
    'empty' : IDL.Null,
  });
  Branch.fill(IDL.Record({ 'left' : Trie, 'size' : IDL.Nat, 'right' : Trie }));
  const Set = IDL.Variant({
    'branch' : Branch,
    'leaf' : Leaf,
    'empty' : IDL.Null,
  });
  const BlockParticipants = IDL.Record({
    'to' : AccountIdentifier,
    'from' : AccountIdentifier,
    'verify' : IDL.Bool,
    'amount' : IDL.Nat64,
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
  const ClusterInstanceError = IDL.Variant({
    'invalid_caller' : IDL.Null,
    'abort_delete_cluster' : IDL.Null,
    'abort_clean_instance' : IDL.Null,
    'abort_stop' : IDL.Null,
    'abort_replace_value' : IDL.Null,
    'abort_delete' : IDL.Null,
    'abort_clean_cluster' : IDL.Null,
    'abort_clean' : IDL.Null,
    'abort_start_cluster' : IDL.Null,
    'abort_stop_cluster' : IDL.Null,
    'abort_start_instance' : IDL.Null,
    'abort_start' : IDL.Null,
    'abort_delete_instance' : IDL.Null,
    'abort_stop_instance' : IDL.Null,
    'unknown_error' : IDL.Null,
  });
  const Result_4 = IDL.Variant({
    'ok' : IDL.Principal,
    'err' : ClusterInstanceError,
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
  const Result_2 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Principal, IDL.Text),
    'err' : DescriptionError,
  });
  const CurrentStatusInstance = IDL.Variant({
    'abandon' : IDL.Null,
    'stopped' : IDL.Null,
    'involved' : IDL.Null,
    'unknown' : IDL.Null,
  });
  const Wasm__1 = IDL.Vec(IDL.Nat8);
  const Instance = IDL.Record({
    'status' : CurrentStatusInstance,
    'instance_principal' : IDL.Principal,
    'wasm_version' : IDL.Nat,
    'wasm' : Wasm__1,
    'description' : IDL.Text,
    'wasm_name' : IDL.Text,
  });
  const InstanceInfo = IDL.Record({
    'status' : CurrentStatusInstance,
    'instance_principal' : IDL.Principal,
    'wasm_version' : IDL.Nat,
    'description' : IDL.Text,
    'number_key' : IDL.Nat,
    'wasm_name' : IDL.Text,
  });
  const CurrentStatusCluster = IDL.Variant({
    'abandon' : IDL.Null,
    'stopped' : IDL.Null,
    'involved' : IDL.Null,
    'unknown' : IDL.Null,
  });
  const ClusterInfo = IDL.Record({
    'status' : CurrentStatusCluster,
    'user_principal' : IDL.Principal,
    'wasm_version' : IDL.Nat,
    'description' : IDL.Text,
    'cluster_principal' : IDL.Principal,
    'wasm_name' : IDL.Text,
  });
  const Result_3 = IDL.Variant({
    'ok' : IDL.Principal,
    'err' : DescriptionError,
  });
  const Wasm = IDL.Vec(IDL.Nat8);
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
  const Cluster = IDL.Record({
    'status' : CurrentStatusCluster,
    'user_principal' : IDL.Principal,
    'wasm_version' : IDL.Nat,
    'wasm' : Wasm__1,
    'description' : IDL.Text,
    'cluster_principal' : IDL.Principal,
    'wasm_name' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : Wasm, 'err' : DescriptionError });
  const WasmDelivered = IDL.Record({
    'name' : IDL.Text,
    'wasm' : Wasm__1,
    'version' : IDL.Nat,
  });
  const Result = IDL.Variant({
    'ok' : WasmDelivered,
    'err' : DescriptionError,
  });
  const Cycles = IDL.Nat;
  const Memo = IDL.Nat64;
  const Operation = IDL.Variant({
    'Burn' : IDL.Record({ 'from' : AccountIdentifier, 'amount' : Tokens }),
    'Mint' : IDL.Record({ 'to' : AccountIdentifier, 'amount' : Tokens }),
    'Transfer' : IDL.Record({
      'to' : AccountIdentifier,
      'fee' : Tokens,
      'from' : AccountIdentifier,
      'amount' : Tokens,
    }),
  });
  const TimeStamp = IDL.Record({ 'timestamp_nanos' : IDL.Nat64 });
  const Transaction = IDL.Record({
    'memo' : Memo,
    'operation' : IDL.Opt(Operation),
    'created_at_time' : TimeStamp,
  });
  const Block = IDL.Record({
    'transaction' : Transaction,
    'timestamp' : TimeStamp,
    'parent_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const BlockIndex = IDL.Nat64;
  const GetBlocksArgs = IDL.Record({
    'start' : BlockIndex,
    'length' : IDL.Nat64,
  });
  const BlockRange = IDL.Record({ 'blocks' : IDL.Vec(Block) });
  const QueryArchiveError = IDL.Variant({
    'BadFirstBlockIndex' : IDL.Record({
      'requested_index' : BlockIndex,
      'first_valid_index' : BlockIndex,
    }),
    'Other' : IDL.Record({
      'error_message' : IDL.Text,
      'error_code' : IDL.Nat64,
    }),
  });
  const QueryArchiveResult = IDL.Variant({
    'Ok' : BlockRange,
    'Err' : QueryArchiveError,
  });
  const QueryArchiveFn = IDL.Func(
      [GetBlocksArgs],
      [QueryArchiveResult],
      ['query'],
    );
  const QueryBlocksResponse = IDL.Record({
    'certificate' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'blocks' : IDL.Vec(Block),
    'chain_length' : IDL.Nat64,
    'first_block_index' : BlockIndex,
    'archived_blocks' : IDL.Vec(
      IDL.Record({
        'callback' : QueryArchiveFn,
        'start' : BlockIndex,
        'length' : IDL.Nat64,
      })
    ),
  });
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
  const TransferResultExpanded = IDL.Record({
    'transfer_result' : TransferResult,
    'created_at_time' : TimeStamp,
    'amount' : Tokens,
  });
  const Admin = IDL.Service({
    'accounting' : IDL.Func([IDL.Text], [PrincipalAccounting], []),
    'add_white_list' : IDL.Func([IDL.Principal], [Set], []),
    'block_participants' : IDL.Func([IDL.Nat], [BlockParticipants], []),
    'caller' : IDL.Func([], [IDL.Principal], []),
    'canister_accounting' : IDL.Func([], [CanisterAccounting], []),
    'check_participants' : IDL.Func(
        [IDL.Nat, IDL.Principal, IDL.Principal],
        [BlockParticipants],
        [],
      ),
    'cluster_clean_instance' : IDL.Func([IDL.Nat, IDL.Text], [Result_4], []),
    'cluster_delete_instance' : IDL.Func([IDL.Nat, IDL.Text], [Result_4], []),
    'cluster_deploy_instance' : IDL.Func(
        [IDL.Principal, IDL.Text, IDL.Text, IDL.Text, IDL.Nat],
        [Result_2],
        [],
      ),
    'cluster_deploy_instance_default' : IDL.Func(
        [IDL.Principal, IDL.Text, IDL.Text],
        [Result_2],
        [],
      ),
    'cluster_reade_instances' : IDL.Func([IDL.Text], [IDL.Vec(Instance)], []),
    'cluster_reade_instances_info' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(InstanceInfo)],
        [],
      ),
    'cluster_start' : IDL.Func([IDL.Principal, IDL.Text], [Result_4], []),
    'cluster_start_instance' : IDL.Func([IDL.Nat, IDL.Text], [Result_4], []),
    'cluster_stop' : IDL.Func([IDL.Principal, IDL.Text], [Result_4], []),
    'cluster_stop_instance' : IDL.Func([IDL.Nat, IDL.Text], [Result_4], []),
    'clusters' : IDL.Func([], [IDL.Vec(ClusterInfo)], []),
    'contains_white_list' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'count_clusters' : IDL.Func([], [IDL.Nat], []),
    'create_canister' : IDL.Func([IDL.Principal], [Result_3], []),
    'credit' : IDL.Func([], [], []),
    'cycles_available' : IDL.Func([], [IDL.Nat], ['query']),
    'cycles_balance' : IDL.Func([], [IDL.Nat], ['query']),
    'delete_canister' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'delete_white_list' : IDL.Func([IDL.Principal], [Set], []),
    'deploy_cluster' : IDL.Func(
        [IDL.Nat, IDL.Principal, IDL.Principal, IDL.Text, IDL.Text, IDL.Nat],
        [Result_2],
        [],
      ),
    'deploy_cluster_default' : IDL.Func(
        [IDL.Nat, IDL.Principal, IDL.Principal, IDL.Text],
        [Result_2],
        [],
      ),
    'deploy_cluster_default_internal' : IDL.Func(
        [IDL.Principal, IDL.Text],
        [IDL.Opt(IDL.Principal)],
        [],
      ),
    'deploy_singleton_instance' : IDL.Func(
        [Wasm, IDL.Principal],
        [Result_2],
        [],
      ),
    'get_canister_status' : IDL.Func([IDL.Principal], [CanisterStatus], []),
    'get_cluster' : IDL.Func([IDL.Text, IDL.Text], [Cluster], []),
    'get_rts_memory_size' : IDL.Func([], [IDL.Nat], []),
    'get_version' : IDL.Func([], [IDL.Text], ['query']),
    'get_wasm' : IDL.Func([IDL.Text, IDL.Nat], [Result_1], []),
    'get_wasm_default' : IDL.Func([], [Result], []),
    'install_wasm' : IDL.Func([IDL.Principal, Wasm], [IDL.Bool], []),
    'minting_cycles' : IDL.Func([IDL.Nat], [Cycles], []),
    'principal_to_account' : IDL.Func([IDL.Principal], [IDL.Vec(IDL.Nat8)], []),
    'query_bloks' : IDL.Func([IDL.Nat, IDL.Nat], [QueryBlocksResponse], []),
    'reinstall_wasm' : IDL.Func([IDL.Principal, Wasm], [IDL.Bool], []),
    'start_canister' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'stop_canister' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'transfer_icp' : IDL.Func([Hex, IDL.Nat], [TransferResultExpanded], []),
    'uninstall_wasm' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'upgrade_wasm' : IDL.Func([IDL.Principal, Wasm], [IDL.Bool], []),
    'user_clusters' : IDL.Func([IDL.Principal], [IDL.Vec(ClusterInfo)], []),
  });
  return Admin;
};
export const init = ({ IDL }) => { return []; };
