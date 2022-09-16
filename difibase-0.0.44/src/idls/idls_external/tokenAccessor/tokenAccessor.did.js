export const idlFactory = ({ IDL }) => {
  const NotAuthorizedError = IDL.Variant({ 'NotAuthorized' : IDL.Null });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : NotAuthorizedError });
  const AccountIdentifier = IDL.Text;
  const TokenIdentifier = IDL.Text;
  const TransferError = IDL.Variant({
    'CannotNotify' : AccountIdentifier,
    'InsufficientBalance' : IDL.Null,
    'InvalidToken' : TokenIdentifier,
    'Rejected' : IDL.Null,
    'Unauthorized' : AccountIdentifier,
    'Other' : IDL.Text,
  });
  const Token__1 = IDL.Record({ 'e8s' : IDL.Nat64 });
  const BlockIndex = IDL.Nat64;
  const TransferError__1 = IDL.Variant({
    'TxTooOld' : IDL.Record({ 'allowed_window_nanos' : IDL.Nat64 }),
    'BadFee' : IDL.Record({ 'expected_fee' : Token__1 }),
    'TxDuplicate' : IDL.Record({ 'duplicate_of' : BlockIndex }),
    'TxCreatedInFuture' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Token__1 }),
  });
  const TxError = IDL.Variant({
    'InsufficientAllowance' : IDL.Null,
    'InsufficientBalance' : IDL.Null,
    'ErrorOperationStyle' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'LedgerTrap' : IDL.Null,
    'ErrorTo' : IDL.Null,
    'Other' : IDL.Text,
    'BlockUsed' : IDL.Null,
    'AmountTooSmall' : IDL.Null,
  });
  const MintError = IDL.Variant({
    'NftNotSupported' : IDL.Null,
    'TokenIdMissing' : IDL.Null,
    'TokenIdInvalidType' : IDL.Null,
    'ComputeAccountIdFailed' : IDL.Null,
    'InterfaceError' : IDL.Variant({
      'EXT' : TransferError,
      'LEDGER' : TransferError__1,
      'DIP20' : TxError,
    }),
  });
  const MintResult = IDL.Variant({
    'ok' : IDL.Opt(IDL.Nat),
    'err' : MintError,
  });
  const ClaimMintRecord = IDL.Record({
    'result' : MintResult,
    'mint_record_id' : IDL.Nat,
    'amount' : IDL.Nat,
  });
  const ClaimMintTokens = IDL.Record({
    'results' : IDL.Vec(ClaimMintRecord),
    'total_mints_succeeded' : IDL.Nat,
    'total_mints_failed' : IDL.Nat,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Opt(IDL.Nat), 'err' : MintError });
  const TokenStandard = IDL.Variant({
    'EXT' : IDL.Null,
    'LEDGER' : IDL.Null,
    'DIP20' : IDL.Null,
    'DIP721' : IDL.Null,
    'NFT_ORIGYN' : IDL.Null,
  });
  const Token = IDL.Record({
    'canister' : IDL.Principal,
    'identifier' : IDL.Opt(IDL.Variant({ 'nat' : IDL.Nat, 'text' : IDL.Text })),
    'standard' : TokenStandard,
  });
  const MintRecord = IDL.Record({
    'to' : IDL.Principal,
    'result' : Result_2,
    'token' : Token,
    'date' : IDL.Int,
    'index' : IDL.Nat,
    'amount' : IDL.Nat,
  });
  const CommonError = IDL.Variant({
    'InvalidToken' : TokenIdentifier,
    'Other' : IDL.Text,
  });
  const IsFungibleError = IDL.Variant({
    'TokenIdMissing' : IDL.Null,
    'TokenIdInvalidType' : IDL.Null,
    'InterfaceError' : IDL.Variant({ 'EXT' : CommonError }),
  });
  const SetTokenError = IDL.Variant({
    'IsFungibleError' : IsFungibleError,
    'TokenNotOwned' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'TokenNotFungible' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : SetTokenError });
  const TokenAccessor = IDL.Service({
    'addMinter' : IDL.Func([IDL.Principal], [Result_1], []),
    'claimMintTokens' : IDL.Func([], [ClaimMintTokens], []),
    'getAdmin' : IDL.Func([], [IDL.Principal], ['query']),
    'getMintRecord' : IDL.Func([IDL.Nat], [IDL.Opt(MintRecord)], ['query']),
    'getMintRegister' : IDL.Func([], [IDL.Vec(MintRecord)], ['query']),
    'getMinters' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getToken' : IDL.Func([], [IDL.Opt(Token)], ['query']),
    'isAuthorizedMinter' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'mint' : IDL.Func([IDL.Principal, IDL.Nat], [MintRecord], []),
    'removeMinter' : IDL.Func([IDL.Principal], [Result_1], []),
    'setAdmin' : IDL.Func([IDL.Principal], [Result_1], []),
    'setToken' : IDL.Func([Token], [Result], []),
  });
  return TokenAccessor;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
