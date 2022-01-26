import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Canister {
  'value_hash' : [] | [string],
  'name' : string,
  'canister_id' : Principal,
  'wasm' : [] | [Array<number>],
  'description' : string,
  'wasm_hash' : [] | [Array<number>],
}
export interface CanisterStatus {
  'status' : { 'stopped' : null } |
    { 'stopping' : null } |
    { 'running' : null },
  'freezing_threshold' : bigint,
  'memory_size' : bigint,
  'cycles' : bigint,
  'settings' : definite_canister_settings,
  'module_hash' : [] | [Array<number>],
}
export interface UserIdentity {
  'user_principal' : Principal,
  'instance_id' : string,
  'consecutive_number' : bigint,
}
export interface UserInstance {
  'value_hash' : [] | [string],
  'user_principal' : Principal,
  'instance_id' : string,
  'canister_id' : Principal,
  'consecutive_number' : bigint,
}
export type Wasm = Array<number>;
export interface definite_canister_settings {
  'freezing_threshold' : bigint,
  'controllers' : Array<Principal>,
  'memory_allocation' : bigint,
  'compute_allocation' : bigint,
}
export interface _SERVICE {
  'createCanister' : ActorMethod<[Principal], Principal>,
  'deployCanister' : ActorMethod<
    [Wasm, Principal, string],
    [Principal, string],
  >,
  'getCanisterStatus' : ActorMethod<[Principal], CanisterStatus>,
  'getCanisters' : ActorMethod<[], Array<UserInstance>>,
  'getSizeServiceCanisters' : ActorMethod<[], bigint>,
  'getUserCanister' : ActorMethod<[bigint, Principal], [] | [Canister]>,
  'getUserCanisters' : ActorMethod<[Principal], Array<UserInstance>>,
  'getVersion' : ActorMethod<[], string>,
  'installWasm' : ActorMethod<[Principal, Wasm], boolean>,
  'putCanister' : ActorMethod<[UserIdentity, Canister], undefined>,
  'reinstallWasm' : ActorMethod<[Principal, Wasm], boolean>,
  'rejectCanister' : ActorMethod<[bigint, Principal, Principal], boolean>,
  'stopCanister' : ActorMethod<[Principal], boolean>,
  'uninstallWasm' : ActorMethod<[Principal], boolean>,
  'upgradeWasm' : ActorMethod<[Principal, Wasm], boolean>,
}
