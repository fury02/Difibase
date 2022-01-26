import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type WasmBinary = Array<number>;
export interface _SERVICE {
  'createCanisterDefault' : ActorMethod<[], Principal>,
  'deployCanister' : ActorMethod<[WasmBinary], Principal>,
  'getCanisterVersionFirstOrDefault' : ActorMethod<[], string>,
  'getCanisterVersionLastOrDefault' : ActorMethod<[], string>,
  'installWasmBinary' : ActorMethod<[Principal, WasmBinary], undefined>,
  'putCanisterDefault' : ActorMethod<[Principal], undefined>,
}
