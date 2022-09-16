import Array "mo:base/Array";
import List "mo:base/List";
import Blob  "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Nat  "mo:base/Nat";
import Nat8  "mo:base/Nat8";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Prim "mo:⛔";
import Error "mo:base/Error";
import Result "mo:base/Result";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";
import TrieSet "mo:base/TrieSet";

import Types "types";

import Identifiers "wasm/identifiers";
import IdentifiersChunk "wasm/identifiers-chunk";

module{
    // type Result = Result.Result;
    type ErrorCode = Error.ErrorCode;
    type DescriptionError = Types.DescriptionError;
    type ClusterInstanceError = Types.ClusterInstanceError;
    type Wasm = Types.Wasm; //[Nat8]
    type UUID = Types.UUID;
    type GUID = Types.GUID;
    type CanisterStatus = Types.CanisterStatus;
    type WasmObject = Types.WasmObjects;
    type WasmDelivered = Types.WasmDelivered;
    type FileHash = Types.FileHash;
    type TypeHash = Types.TypeHash;
    type CombinedWasmInfo = Types.CombinedWasmInfo;
    type UserIdentifier = Types.UserIdentifier;
    type Cluster = Types.Cluster;
    type ClusterIdentifier = Types.ClusterIdentifier;
    type Instance = Types.Instance;
    type Action = Types.Action;
    type InstanceInfo = Types.InstanceInfo;
    type KeyChunk = IdentifiersChunk.KeyChunk;
    type ValueChunk = IdentifiersChunk.ValueChunk;
    type WasmIdentifier = Identifiers.WasmIdentifier; // name; version - key;

    // https://icscan.io/canister/ryjl3-tyaaa-aaaaa-aaaba-cai
    type Token = Types.Token;
    type NotifyCanisterArgs  = Types.NotifyCanisterArgs;
    type AccountBalanceArgs = Types.AccountBalanceArgs;
    type Tokens = Types.Tokens;
    type Archive = Types.Archive;
    type Archives = Types.Archives;
    type GetBlocksArgs = Types.GetBlocksArgs;
    type QueryBlocksResponse = Types.QueryBlocksResponse;
    type TransferArgs = Types.TransferArgs;
    type TransferResult = Types.TransferResult;
    type TransferFeeArg = Types.TransferFeeArg;
    type TransferFee = Types.TransferFee;

    // https://icscan.io/canister/rkp4c-7iaaa-aaaaa-aaaca-cai
    type IcpXdrConversionRateCertifiedResponse = Types.IcpXdrConversionRateCertifiedResponse;
    type NotifyCreateCanisterResult = Types.NotifyCreateCanisterResult;
    type NotifyCreateCanisterArg = Types.NotifyCreateCanisterArg;
    type NotifyTopUpArg = Types.NotifyTopUpArg;
    type NotifyTopUpResult = Types.NotifyTopUpResult;
    type SetAuthorizedSubnetworkListArgs = Types.SetAuthorizedSubnetworkListArgs;
    type TransactionNotification = Types.TransactionNotification;

    type canister_id = Types.canister_id;
    type wasm_module = Types.wasm_module;
    type canister_settings = Types.canister_settings;
    type definite_canister_settings = Types.definite_canister_settings;

    public type IInternetComputer = actor {
        //delete create
        delete_canister : shared { canister_id : canister_id } -> async ();
        create_canister : shared { settings : ?canister_settings } -> async {
            canister_id : canister_id;
        };
        //cycles
        deposit_cycles : shared { canister_id : canister_id } -> async ();
        //start stop
        start_canister : shared { canister_id : canister_id } -> async ();
        stop_canister : shared { canister_id : canister_id } -> async ();
        //settings
        update_settings : ({
            canister_id : Principal;
            settings : canister_settings
        }) -> async ();
        //get status
        canister_status : ({canister_id : canister_id}) -> async ({
            status : { #running; #stopping; #stopped };
            settings: definite_canister_settings;
            module_hash: ?Blob;
            memory_size: Nat;
            cycles: Nat;
            freezing_threshold: Nat;
        });
        //install uninstal code  
        install_code : shared {
            arg : [Nat8];
            wasm_module : wasm_module;
            mode : { #reinstall; #upgrade; #install };
            canister_id : canister_id;
        } -> async ();
        uninstall_code : shared { canister_id : canister_id } -> async ();

        provisional_create_canister_with_cycles : shared {
            settings : ?canister_settings;
            amount : ?Nat;
        } -> async { canister_id : canister_id };
        provisional_top_up_canister : shared {
            canister_id : canister_id;
            amount : Nat;
        } -> async ();
        raw_rand : shared () -> async [Nat8];
    };
    //https://icscan.io/canister/n2hvz-4aaaa-aaaah-aaoqa-cai
    public type IWasmStorage = actor{
        add_wasm:(name: Text, description: Text, version: Nat, wasm : Wasm, hash_value: [Nat8], text_hash : Text, type_hash : TypeHash)->async ();
        getCanisterStatus:(principal: Principal)->async CanisterStatus;
        get_size:()-> async Nat;
        install_wasm:(count_number: Nat, id: Text, name: Text, description: Text, version: Nat, hash_value: [Nat8], text_hash : Text, type_hash : TypeHash)->async Wasm;
        last_wasm_result:(name: Text)-> async Result.Result<WasmDelivered, DescriptionError>;
        objects:()->async [CombinedWasmInfo];
        read_wasm_result:(name: Text, version: Nat)->async Result.Result<Wasm, DescriptionError>;
        remove_wasm:(name: Text, description: Text, version: Nat)->async ?WasmObject;
        update_wasm:(name: Text,  description: Text,  version: Nat,  uuid: UUID, guid: GUID, wasm : Wasm,  hash_value: [Nat8], text_hash : Text, type_hash : TypeHash)->async ?WasmObject;
        upload_progress:(number_id: Nat, id: Text, value: [Nat8])->async ();
    };
    public type ICluster = actor{
        get_version: () -> async Text;
        get_canister_status: (canister_id: Principal)-> async CanisterStatus;
        size_instances: ()-> async Nat;
        install_wasm: (canister_id : Principal, wasm : Wasm) -> async Bool;
        reinstall_wasm: (canister_id : Principal,  wasm : Wasm) -> async Bool;
        upgrade_wasm: (canister_id : Principal, wasm : Wasm) -> async Bool;
        uninstall_wasm: (canister_id : Principal) -> async Bool;
        start_canister: (canister_id: Principal) -> async Bool;
        stop_canister: (canister_id: Principal) -> async Bool;
        clean_canister: (canister_id: Principal, wasm: Wasm)-> async Bool;
        delete_canister: (canister_id: Principal) -> async Bool;
        create_instance: (user_principal: Principal) -> async Result.Result<Principal, DescriptionError>;
        get_wasm_default: () -> async Result.Result<WasmDelivered, DescriptionError>;
        get_wasm: (wasm_name: Text, wasm_version: Nat) -> async Result.Result<Wasm, DescriptionError>;
        deploy_instance_default: (user_principal: Principal, description: Text) -> async Result.Result<(Principal, Text), DescriptionError>;
        deploy_instance: (user_principal: Principal, description: Text,  wasm_name: Text, wasm_version: Nat) -> async Result.Result<(Principal, Text), DescriptionError>;
        check_instances: (action: Action) -> async Result.Result<Bool, ClusterInstanceError>;
        start_instance: (key: Nat)-> async Result.Result<Principal, ClusterInstanceError>;
        stop_instance: (key: Nat)-> async Result.Result<Principal, ClusterInstanceError>;
        clean_instance: (key: Nat)-> async Result.Result<Principal, ClusterInstanceError>;
        delete_instance: (key: Nat)-> async Result.Result<Principal, ClusterInstanceError>;
        read_instances: ()  ->  async [Instance];
        read_instances_info: ()  ->  async [InstanceInfo];
    };
    //Test
    public type IWasmActor = actor{
        query_get_version : () -> async Text;
        get_version: () -> async Text;
    };
    //Test
    public type  ICycles = actor{
        withdraw_cycles : () -> async ();
    };
    //https://icscan.io/canister/ryjl3-tyaaa-aaaaa-aaaba-cai
    public type IPublicLedger = actor { //Ledger
        account_balance : shared query AccountBalanceArgs -> async Tokens;
        archives : shared query () -> async Archives;
        decimals : shared query () -> async { decimals : Nat32 };
        name : shared query () -> async { name : Text };
        query_blocks : shared query GetBlocksArgs -> async QueryBlocksResponse;
        symbol : shared query () -> async { symbol : Text };
        transfer : shared TransferArgs -> async TransferResult;
        transfer_fee : shared query TransferFeeArg -> async TransferFee;
    }; 
    //https://icscan.io/canister/rkp4c-7iaaa-aaaaa-aaaca-cai
    public type ICyclesConversionNotify = actor {
        get_average_icp_xdr_conversion_rate : shared query () -> async IcpXdrConversionRateCertifiedResponse;
        get_icp_xdr_conversion_rate : shared query () -> async IcpXdrConversionRateCertifiedResponse;
        notify_create_canister : shared NotifyCreateCanisterArg -> async NotifyCreateCanisterResult;
        notify_top_up : shared NotifyTopUpArg -> async NotifyTopUpResult;
        set_authorized_subnetwork_list : shared SetAuthorizedSubnetworkListArgs -> async ();
        transaction_notification : shared TransactionNotification -> async Types.Result;
    };
    public type IDBEASY = actor{ };
    public type IDBFILES = actor{ };
}