export const idlFactory = ({ IDL }) => {
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
  const UserInstance = IDL.Record({
    'value_hash' : IDL.Opt(IDL.Text),
    'user_principal' : IDL.Principal,
    'instance_id' : IDL.Text,
    'canister_id' : IDL.Principal,
    'consecutive_number' : IDL.Nat,
  });
  const Canister = IDL.Record({
    'value_hash' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
    'canister_id' : IDL.Principal,
    'wasm' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'description' : IDL.Text,
    'wasm_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const UserIdentity = IDL.Record({
    'user_principal' : IDL.Principal,
    'instance_id' : IDL.Text,
    'consecutive_number' : IDL.Nat,
  });
  return IDL.Service({
    'createCanister' : IDL.Func([IDL.Principal], [IDL.Principal], []),
    'deployCanister' : IDL.Func(
        [Wasm, IDL.Principal, IDL.Text],
        [IDL.Principal, IDL.Text],
        [],
      ),
    'getCanisterStatus' : IDL.Func([IDL.Principal], [CanisterStatus], []),
    'getCanisters' : IDL.Func([], [IDL.Vec(UserInstance)], []),
    'getSizeServiceCanisters' : IDL.Func([], [IDL.Nat], []),
    'getUserCanister' : IDL.Func(
        [IDL.Nat, IDL.Principal],
        [IDL.Opt(Canister)],
        [],
      ),
    'getUserCanisters' : IDL.Func([IDL.Principal], [IDL.Vec(UserInstance)], []),
    'getVersion' : IDL.Func([], [IDL.Text], []),
    'installWasm' : IDL.Func([IDL.Principal, Wasm], [IDL.Bool], []),
    'putCanister' : IDL.Func([UserIdentity, Canister], [], ['oneway']),
    'reinstallWasm' : IDL.Func([IDL.Principal, Wasm], [IDL.Bool], []),
    'rejectCanister' : IDL.Func(
        [IDL.Nat, IDL.Principal, IDL.Principal],
        [IDL.Bool],
        [],
      ),
    'stopCanister' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'uninstallWasm' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'upgradeWasm' : IDL.Func([IDL.Principal, Wasm], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
