export const idlFactory = ({ IDL }) => {
  const ExchangeLevel = IDL.Record({
    'threshold' : IDL.Nat,
    'rate_per_t' : IDL.Float64,
  });
  const CreateCyclesProviderArgs = IDL.Record({
    'admin' : IDL.Principal,
    'minimum_cycles_balance' : IDL.Nat,
    'cycles_exchange_config' : IDL.Vec(ExchangeLevel),
    'token_accessor' : IDL.Principal,
  });
  const CyclesProviderCommand = IDL.Variant({
    'SetAdmin' : IDL.Record({ 'canister' : IDL.Principal }),
    'RemoveAllowList' : IDL.Record({ 'canister' : IDL.Principal }),
    'SetMinimumBalance' : IDL.Record({ 'minimum_balance' : IDL.Nat }),
    'SetCycleExchangeConfig' : IDL.Vec(ExchangeLevel),
    'AddAllowList' : IDL.Record({
      'balance_threshold' : IDL.Nat,
      'balance_target' : IDL.Nat,
      'pull_authorized' : IDL.Bool,
      'canister' : IDL.Principal,
    }),
  });
  const ConfigureError = IDL.Variant({
    'NotInAllowList' : IDL.Null,
    'NotAllowed' : IDL.Null,
    'InvalidBalanceArguments' : IDL.Null,
    'InvalidCycleConfig' : IDL.Null,
  });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Null, 'err' : ConfigureError });
  const CyclesTransferError = IDL.Variant({
    'CallerRefundedAll' : IDL.Null,
    'PullNotAuthorized' : IDL.Null,
    'InsufficientCycles' : IDL.Null,
    'CanisterNotAllowed' : IDL.Null,
  });
  const DistributeCyclesState = IDL.Variant({
    'Failed' : CyclesTransferError,
    'Refilled' : IDL.Null,
    'Trapped' : IDL.Null,
    'AlreadyAboveThreshold' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const DistributeCyclesInfo = IDL.Record({
    'time' : IDL.Int,
    'state' : DistributeCyclesState,
  });
  const PoweringParameters = IDL.Record({
    'balance_threshold' : IDL.Nat,
    'balance_target' : IDL.Nat,
    'pull_authorized' : IDL.Bool,
    'last_execution' : DistributeCyclesInfo,
  });
  const ConfigureCommandRecord = IDL.Record({
    'admin' : IDL.Principal,
    'date' : IDL.Int,
    'command' : CyclesProviderCommand,
  });
  const CyclesBalanceRecord = IDL.Record({
    'balance' : IDL.Nat,
    'date' : IDL.Int,
  });
  const CyclesProfile = IDL.Record({
    'principal' : IDL.Principal,
    'balance_cycles' : IDL.Nat,
    'powering_parameters' : PoweringParameters,
  });
  const CyclesReceivedRecord = IDL.Record({
    'date' : IDL.Int,
    'from' : IDL.Principal,
    'cycle_amount' : IDL.Nat,
    'mint_index' : IDL.Nat,
  });
  const CyclesDistributionMethod = IDL.Variant({
    'DistributeCycles' : IDL.Null,
    'RequestCycles' : IDL.Null,
  });
  const CyclesSentRecord = IDL.Record({
    'to' : IDL.Principal,
    'method' : CyclesDistributionMethod,
    'date' : IDL.Int,
    'amount' : IDL.Nat,
  });
  const CyclesTransferSuccess = IDL.Variant({
    'Refilled' : IDL.Null,
    'AlreadyAboveThreshold' : IDL.Null,
  });
  const Result_2 = IDL.Variant({
    'ok' : CyclesTransferSuccess,
    'err' : CyclesTransferError,
  });
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
  const Token = IDL.Record({ 'e8s' : IDL.Nat64 });
  const BlockIndex = IDL.Nat64;
  const TransferError__1 = IDL.Variant({
    'TxTooOld' : IDL.Record({ 'allowed_window_nanos' : IDL.Nat64 }),
    'BadFee' : IDL.Record({ 'expected_fee' : Token }),
    'TxDuplicate' : IDL.Record({ 'duplicate_of' : BlockIndex }),
    'TxCreatedInFuture' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Token }),
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
  const Result_1 = IDL.Variant({ 'ok' : IDL.Opt(IDL.Nat), 'err' : MintError });
  const TokenStandard = IDL.Variant({
    'EXT' : IDL.Null,
    'LEDGER' : IDL.Null,
    'DIP20' : IDL.Null,
    'DIP721' : IDL.Null,
    'NFT_ORIGYN' : IDL.Null,
  });
  const Token__1 = IDL.Record({
    'canister' : IDL.Principal,
    'identifier' : IDL.Opt(IDL.Variant({ 'nat' : IDL.Nat, 'text' : IDL.Text })),
    'standard' : TokenStandard,
  });
  const MintRecord = IDL.Record({
    'to' : IDL.Principal,
    'result' : Result_1,
    'token' : Token__1,
    'date' : IDL.Int,
    'index' : IDL.Nat,
    'amount' : IDL.Nat,
  });
  const WalletReceiveError = IDL.Variant({
    'NoCyclesAdded' : IDL.Null,
    'TokenAccessorError' : IDL.Variant({
      'TokenNotSet' : IDL.Null,
      'MintNotAuthorized' : IDL.Null,
    }),
    'MaxCyclesReached' : IDL.Null,
    'InvalidCycleConfig' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : MintRecord, 'err' : WalletReceiveError });
  const CyclesProvider = IDL.Service({
    'computeTokensInExchange' : IDL.Func([IDL.Nat], [IDL.Nat], ['query']),
    'configure' : IDL.Func([CyclesProviderCommand], [Result_3], []),
    'cyclesBalance' : IDL.Func([], [IDL.Nat], ['query']),
    'distributeCycles' : IDL.Func([], [], []),
    'getAdmin' : IDL.Func([], [IDL.Principal], ['query']),
    'getAllowList' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, PoweringParameters))],
        ['query'],
      ),
    'getConfigureCommandRegister' : IDL.Func(
        [],
        [IDL.Vec(ConfigureCommandRecord)],
        ['query'],
      ),
    'getCycleExchangeConfig' : IDL.Func(
        [],
        [IDL.Vec(ExchangeLevel)],
        ['query'],
      ),
    'getCyclesBalanceRegister' : IDL.Func(
        [],
        [IDL.Vec(CyclesBalanceRecord)],
        ['query'],
      ),
    'getCyclesProfile' : IDL.Func([], [IDL.Vec(CyclesProfile)], []),
    'getCyclesReceivedRegister' : IDL.Func(
        [],
        [IDL.Vec(CyclesReceivedRecord)],
        ['query'],
      ),
    'getCyclesSentRegister' : IDL.Func(
        [],
        [IDL.Vec(CyclesSentRecord)],
        ['query'],
      ),
    'getMinimumBalance' : IDL.Func([], [IDL.Nat], ['query']),
    'getTokenAccessor' : IDL.Func([], [IDL.Principal], ['query']),
    'requestCycles' : IDL.Func([], [Result_2], []),
    'walletReceive' : IDL.Func([], [Result], []),
  });
  return CyclesProvider;
};
export const init = ({ IDL }) => {
  const ExchangeLevel = IDL.Record({
    'threshold' : IDL.Nat,
    'rate_per_t' : IDL.Float64,
  });
  const CreateCyclesProviderArgs = IDL.Record({
    'admin' : IDL.Principal,
    'minimum_cycles_balance' : IDL.Nat,
    'cycles_exchange_config' : IDL.Vec(ExchangeLevel),
    'token_accessor' : IDL.Principal,
  });
  return [CreateCyclesProviderArgs];
};
