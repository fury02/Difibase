export const idlFactory = ({ IDL }) => {
  const WasmBinary = IDL.Vec(IDL.Nat8);
  return IDL.Service({
    'createCanisterDefault' : IDL.Func([], [IDL.Principal], []),
    'deployCanister' : IDL.Func([WasmBinary], [IDL.Principal], []),
    'getCanisterVersionFirstOrDefault' : IDL.Func([], [IDL.Text], []),
    'getCanisterVersionLastOrDefault' : IDL.Func([], [IDL.Text], []),
    'installWasmBinary' : IDL.Func([IDL.Principal, WasmBinary], [], ['oneway']),
    'putCanisterDefault' : IDL.Func([IDL.Principal], [], ['oneway']),
  });
};
export const init = ({ IDL }) => { return []; };
