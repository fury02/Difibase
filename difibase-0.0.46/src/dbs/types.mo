import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Bool "mo:base/Bool";

import Hex "mo:encoding/Hex";
import UUID "lib/uuid/UUID";
import GUID "lib/uuid/GUID";

module {
    public type UUID = UUID.UUID;
    public type GUID = GUID.GUID;
    public type canister_id = Principal;
    public type wasm_module = [Nat8];
    public type canister_settings = {
        freezing_threshold : ?Nat;
        controllers : ?[Principal];
        memory_allocation : ?Nat;
        compute_allocation : ?Nat;
    };
    public type definite_canister_settings = {
        controllers : [Principal];
        compute_allocation : Nat;
        memory_allocation : Nat;
        freezing_threshold : Nat;
    };
    public type Wasm = wasm_module;

    public type TypeHash = { #none; #unknown; #sha512; #sha384; #sha256; #sha224; #kessak;};
    public type Action = { #start; #stop; #delete; #clean};
    public type CurrentStatusInstance = { #unknown; #involved; #abandon; #stopped;};
    public type CurrentStatusCluster = { #unknown; #involved; #abandon; #stopped;};

    //Hubs; Cluster; Admin
    public type ClusterIdentifier = { 
        cluster_principal : Principal;
    };
    public type UserIdentifier = {
        description : Text;
        guid : GUID; //Text
        uuid : UUID; //[Nat8]
        user_principal : Principal;
    };
    public type Cluster = { //for  collection return result
        cluster_principal : Principal; //ClusterIdentifier (canister_id)
        user_principal : Principal;
        wasm_name: Text;
        wasm_version: Nat;
        description : Text;
        status: CurrentStatusCluster;
        wasm : Wasm;//Rezerv (Just in case)  
    };
    public type Instance = { //for  collection return result
        instance_principal : Principal; //(canister_id)
        wasm_name: Text;
        wasm_version: Nat;
        description : Text; 
        status : CurrentStatusInstance;
        wasm: Wasm;
    };
    public type ClusterInfo = { //for  collection return result
        cluster_principal : Principal; //ClusterIdentifier (canister_id)
        user_principal : Principal;
        wasm_name: Text;
        wasm_version: Nat;
        status: CurrentStatusCluster;
        description : Text;
    };
        public type InstanceInfo = { //for  collection return result
        number_key: Nat;
        instance_principal : Principal; //(canister_id)
        wasm_name: Text;
        wasm_version: Nat;
        status : CurrentStatusInstance;
        description : Text; 
    };
    //Error description  
    //Canister
    public type DescriptionError = {
        #abort_canister_create;
        #canister_create_error_not_enough_funds;
        #canister_install_wasm_error;
        #unreliable_operation;
        #abort_canister_deploy;
        #reject_install_wasm;
        #invalid_caller;
        #not_include_wasm;
        #minting_cycles_error;
        #unknown_error;
    };
    //Cluster Instance
    public type ClusterInstanceError = {
        #abort_stop;
        #abort_start;
        #abort_delete;
        #abort_clean;
        #abort_start_instance;
        #abort_stop_instance;
        #abort_delete_instance;
        #abort_clean_instance;
        #abort_start_cluster;
        #abort_stop_cluster;
        #abort_delete_cluster;
        #abort_clean_cluster;
        #abort_replace_value;   
        #invalid_caller;
        #unknown_error;
    };
    //Cluster Instance
    public type LedgerError = {
        #small_amount;
        #invalid_caller;
        #unknown_error;
    };
    public type FileUploadError = {
        #abort_upload;
        #crc_invalid;
        #unknown_error;
    };
    public type FileDownloadError = {
        #abort_download;
        #unknown_error;
    };
    public type CanisterStatus = {
        status : { #running; #stopping; #stopped };
        settings: definite_canister_settings;
        module_hash: ?Blob;
        memory_size: Nat;
        cycles: Nat;
        freezing_threshold: Nat;
    };
    public type FileStorage= {
        file : [Nat8];
        updated: Bool;  //first deploy or update  
        file_hash: FileHash;   
    };
    public type WasmObjects= {
        wasm :  Wasm;
        updated: Bool;  //first deploy or update  
        file_hash: FileHash;   
    };
    public type WasmDelivered = {
        wasm : Wasm;
        name: Text;
        version: Nat; 
    };
    public type FileHash = {
        value : [Nat8];  //[Nat8] - sha kessak or othe []
        text_hash : Text;   //Text - sha text  
        type_hash : TypeHash; //type: sha kessak
    };
    public type FileIdentifier = {
        name: Text; // any name (service.mo; cluster.mo)
        description : Text; //text version (alpha 0.0.1)
        version: Nat; //digit version (1)
        uuid: UUID;
        guid: GUID;
    };
    public type AdvancedPrincipal = {
        text: Text; 
        principal : Principal; 
    };
    //Combined
    public type CombinedWasmInfo = {
        name: Text; // any name (service.mo; cluster.mo) // *FileIdentifier
        description : Text; //text version (alpha 0.0.1) // *FileIdentifier
        version: Nat; //digit version (1) // *FileIdentifier
        uuid: UUID; //[Nat8]; // *FileIdentifier
        guid: GUID; //Text // *FileIdentifier
        updated: Bool; // *WasmObjects.updated
        value_hash : [Nat8];  //[Nat8] - sha kessak or othe [] // *FileHash.value
        text_hash : Text;   //Text - sha text // *FileHash.text_hash
        type_hash : TypeHash; //type: sha kessak // *FileHash.type_hash
    };
    public type TransferResultExpanded = {
        transfer_result: TransferResult;
        created_at_time : TimeStamp;
        amount : Tokens;
    };
    public type TransferNotifyTopUpResult = {
        notify_topup_result: NotifyTopUpResult;
        transfer_result: TransferResult;
    };
    public type CanisterAccounting = {
        account_identifier: AccountIdentifier;
        subaccount: SubAccount; //SubAccount = AccountIdentifier
        address: Hex.Hex;
        principal: Principal;
        principal_value: Text;
        tokens_balance: Tokens;
        cycles: ?Nat;
    };
    public type PrincipalAccounting = {
        account_identifier: AccountIdentifier;
        subaccount: SubAccount; //SubAccount = AccountIdentifier
        address: Hex.Hex;
        principal: Principal;
        principal_value: Text;
    };
    public type TransferOperation = {
        to : AccountIdentifier;
        fee : Tokens;
        from : AccountIdentifier;
        amount : Tokens;
    };
    public type BlockParticipants = {
        to : AccountIdentifier;
        from : AccountIdentifier;
        amount : Nat64;
        verify: Bool;
    };
    public type FileInfo = {
          ChunksCount: Nat;
          BindKey: Text;
          BindTable: Text;
          TypeFile: Text;
          NameFile: Text;
          BytesTotal: Nat; //File-Size
    };
    public type FileBlob = {
          BytesBlob : Blob;
          BytesSpase: Nat; //Packet-Size
    };
 
    // https://icscan.io/canister/ryjl3-tyaaa-aaaaa-aaaba-cai
    //Ledger 
    public type AccountBalanceArgs = { account : AccountIdentifier };
    public type AccountIdentifier = [Nat8];
    public type Archive = { canister_id : Principal };
    public type Archives = { archives : [Archive] };
    public type Block = {
        transaction : Transaction;
        timestamp : TimeStamp;
        parent_hash : ?[Nat8];
    };
    public type BlockIndex = Nat64;
    public type BlockRange = { blocks : [Block] };
    public type GetBlocksArgs = { start : BlockIndex; length : Nat64 };
    public type Memo = Nat64;
    public type Operation = {
        #Burn : { from : AccountIdentifier; amount : Tokens };
        #Mint : { to : AccountIdentifier; amount : Tokens };
        #Transfer : {
        to : AccountIdentifier;
        fee : Tokens;
        from : AccountIdentifier;
        amount : Tokens;
        };
    };
    public type QueryArchiveError = {
        #BadFirstBlockIndex : {
            requested_index : BlockIndex;
            first_valid_index : BlockIndex;
        };
        #Other : { error_message : Text; error_code : Nat64 };
    };
    public type QueryArchiveFn = shared query GetBlocksArgs -> async QueryArchiveResult;
    public type QueryArchiveResult = {
        #Ok : BlockRange;
        #Err : QueryArchiveError;
    };
    public type QueryBlocksResponse = {
        certificate : ?[Nat8];
        blocks : [Block];
        chain_length : Nat64;
        first_block_index : BlockIndex;
        archived_blocks : [
        { callback : QueryArchiveFn; start : BlockIndex; length : Nat64 }
        ];
    };
    public type SubAccount = [Nat8];
    public type SubAccountValues = {
        subaccount: SubAccount;
        text: Text;
    };
    public type TimeStamp = { timestamp_nanos : Nat64 };
    public type Tokens = { e8s : Nat64 };
    public type Token = { e8s : Nat64; };
    public type Transaction = {
        memo : Memo;
        operation : ?Operation;
        created_at_time : TimeStamp;
    };
    public type TransferArgs = {
        to : AccountIdentifier;
        fee : Tokens;
        memo : Memo;
        from_subaccount : ?SubAccount;
        created_at_time : ?TimeStamp;
        amount : Tokens;
    };
    public type TransferError = {
        #TxTooOld : { allowed_window_nanos : Nat64 };
        #BadFee : { expected_fee : Tokens };
        #TxDuplicate : { duplicate_of : BlockIndex };
        #TxCreatedInFuture;
        #InsufficientFunds : { balance : Tokens };
    };
    public type TransferFee = { transfer_fee : Tokens };
    public type TransferFeeArg = {};
    public type TransferResult = { #Ok : BlockIndex; #Err : TransferError };
    public type Address = Blob;
    public type NotifyCanisterArgs = {
        // The of the block to send a notification about.
        block_height: BlockIndex;
        // Max fee, should be 10000 e8s.
        max_fee: Token;
        // Subaccount the payment came from.
        from_subaccount: ?SubAccount;
        // Canister that received the payment.
        to_canister: Principal;
        // Subaccount that received the payment.
        to_subaccount:  ?SubAccount;
    };

    // https://icscan.io/canister/rkp4c-7iaaa-aaaaa-aaaca-cai
    // Notify Conversion Cycles
    public type Cycles = Nat;
    public type CyclesResponse = {
        #Refunded : (Text, ?Nat64);
        #CanisterCreated : Principal;
        #ToppedUp;
    };
    public type ICPTs = { e8s : Nat64 };
    public type IcpXdrConversionRate = {
        xdr_permyriad_per_icp : Nat64;
        timestamp_seconds : Nat64;
    };
    public type IcpXdrConversionRateCertifiedResponse = {
        certificate : [Nat8];
        data : IcpXdrConversionRate;
        hash_tree : [Nat8];
    };
    public type NotifyCreateCanisterArg = {
        controller : Principal;
        block_index : BlockIndex;
    };
    public type NotifyCreateCanisterResult = {
        #Ok : Principal;
        #Err : NotifyError;
    };
    public type NotifyError = {
        #Refunded : { block_index : ?BlockIndex; reason : Text };
        #InvalidTransaction : Text;
        #Other : { error_message : Text; error_code : Nat64 };
        #Processing;
        #TransactionTooOld : BlockIndex;
    };
     public type NotifyTopUpArg = {
        block_index : BlockIndex;
        canister_id : Principal;
    };
    public type NotifyTopUpResult = { #Ok : Cycles; #Err : NotifyError };
    public type Result = { #Ok : CyclesResponse; #Err : Text };
    public type SetAuthorizedSubnetworkListArgs = {
        who : ?Principal;
        subnets : [Principal];
    };
    public type TransactionNotification = {
        to : Principal;
        to_subaccount : ?[Nat8];
        from : Principal;
        memo : Nat64;
        from_subaccount : ?[Nat8];
        amount : ICPTs;
        block_height : Nat64;
    };
};