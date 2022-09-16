import Array "mo:base/Array";
import List "mo:base/List";
import Blob  "mo:base/Blob";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Nat  "mo:base/Nat";
import Nat8  "mo:base/Nat8";
import Nat32  "mo:base/Nat32";
import Nat64  "mo:base/Nat64";
import Bool  "mo:base/Bool";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Prim "mo:⛔";
import Error "mo:base/Error";
import Result "mo:base/Result";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";
import TrieSet "mo:base/TrieSet";
import Debug "mo:base/Debug";

import Helpers "../lib/util/helpers";
import UserIdentifiers "identifiers";
import Types "../types";
import Interfaces "../interfaces";
import Creating "creating";
import Const "../const";
import Financing "../financing";
import Tools "../lib/tools/tools";

import CryptoUtilities "mo:crypto/Utilities";
import SHA256 "mo:crypto/SHA/SHA256";
import SHA224 "mo:crypto/SHA/SHA224";
import SHA2 "mo:crypto/SHA/SHA2";
import Hex "mo:encoding/Hex";
import Base32 "mo:encoding/Base32";

// shared({caller = owner}) actor class Cluster(benefit : shared () -> async ()) = thisCluster{
shared({caller = owner}) actor class Cluster() = thisCluster{
    type canister_settings = Types.canister_settings;
    type ErrorCode = Error.ErrorCode;
    type DescriptionError = Types.DescriptionError;
    type ClusterInstanceError = Types.ClusterInstanceError;
 
    type Wasm = Types.Wasm; //[Nat8]
    type UUID = Types.UUID;
    type GUID = Types.GUID;
    type Action = Types.Action;
    type CanisterStatus = Types.CanisterStatus;
    type WasmObject = Types.WasmObjects;
    type WasmDelivered = Types.WasmDelivered;
    type FileHash = Types.FileHash;
    type TypeHash = Types.TypeHash;
    type AdvancedPrincipal = Types.AdvancedPrincipal;
    type CombinedWasmInfo = Types.CombinedWasmInfo;

    type UserIdentifier = Types.UserIdentifier;
    type Cluster = Types.Cluster;
    type ClusterInfo = Types.ClusterInfo;
    type ClusterIdentifier = Types.ClusterIdentifier;
    type CurrentStatusCluster = Types.CurrentStatusCluster;
    type Instance = Types.Instance;
    type InstanceInfo = Types.InstanceInfo;

    type TransferResult = Types.TransferResult; 
    type TransferResultExpanded = Types.TransferResultExpanded;
    type LedgerError = Types.LedgerError;
    type NotifyTopUpResult = Types.NotifyTopUpResult;
    type Cycles = Types.Cycles;
    type NotifyError = Types.NotifyError;
    type Tokens = Types.Tokens;
    type AccountBalanceArgs = Types.AccountBalanceArgs;
    type AccountIdentifier = Types.AccountIdentifier; //[Nat8];
    type SubAccount = Types.SubAccount; //[Nat8];
    type SubAccountValues = Types.SubAccountValues;
    type CanisterAccounting = Types.CanisterAccounting;
    type TransferNotifyTopUpResult = Types.TransferNotifyTopUpResult;

    type PrincipalAccounting = Types.PrincipalAccounting;
    type QueryBlocksResponse = Types.QueryBlocksResponse;
    type GetBlocksArgs = Types.GetBlocksArgs;
    type BlockIndex = Types.BlockIndex;
    type Block = Types.BlockIndex;
    type Transaction = Types.Transaction;
    type Operation = Types.Operation;
    type TransferOperation = Types.TransferOperation;
    type BlockParticipants = Types.BlockParticipants;

    //Interfaces
    type IWasmStorage = Interfaces.IWasmStorage;
    type ICluster = Interfaces.ICluster;
    // type IWasmActor = Interfaces.IWasmActor;
    type IIC = Interfaces.IInternetComputer;
    type ILedger  = Interfaces.IPublicLedger ;
    type ICyclesConversionNotify = Interfaces.ICyclesConversionNotify;

    type Set<Principal> = Trie.Trie<Principal, ()>;
    type Trie<K, V> = Trie.Trie<K, V>;
 
    let actor_ic : IIC = actor(Const.canister_ic);
    let actor_wasm_storage : IWasmStorage = actor(Const.canister_wasm_storage);
    let public_ledger: ILedger = actor(Const.canister_nns_ledger);
    let public_coinage: ICyclesConversionNotify = actor(Const.canister_nns_cycles_minting);

    let principal_public_ledger: Principal = Principal.fromText(Const.canister_nns_ledger);
    let principal_public_coinage: Principal = Principal.fromText(Const.canister_nns_cycles_minting);

    let empty_principal: Principal = Principal.fromBlob(Blob.fromArrayMut(Array.init(32, 0 : Nat8)));
    let empty_blob: Blob = Blob.fromArrayMut(Array.init(32, 0 : Nat8));
    
    func get_empty_principal(): Principal {empty_principal};
    func get_empty_blob(): Blob {empty_blob};

    let version = Const.cluster_version;

    // let db = Const.db_old; 
    let db = Const.db_easy;

    private let admin_principal = Const.admin_principal;
    private let admin: Principal = Principal.fromText(admin_principal);
 
    let empty_text: Text = "";
    var nil: Nat8 = 0;
    var empty_array: [var Nat8] = Array.init(32, nil);
    var empty_freeze_array: [Nat8] = Array.freeze<Nat8>(empty_array);

     // stable var administrators : TrieSet.Set<Principal> = TrieSet.empty<Principal>();
    stable var white_list: Set<Principal> = TrieSet.fromArray<Principal>([admin], Principal.hash, Principal.equal);
    stable var instances_entries : [(Nat, Instance)] = [];
    var instances : TrieMap.TrieMap<Nat, Instance> = TrieMap.fromEntries(instances_entries.vals(), Nat.equal, Nat32.fromNat);
    
    public func size_instances(): async Nat {instances.size();};
    public func get_version(): async Text {version;};
    public func get_canister_status(canister_id: Principal): async CanisterStatus{await actor_ic.canister_status({canister_id = canister_id});};
    public func get_rts_memory_size(): async Nat { return Prim.rts_memory_size(); };

    system func preupgrade(){
        // wasm_files_entries := Iter.toArray(wasm_files.entries());
        instances_entries := Iter.toArray(instances.entries());
    };

    system func postupgrade(){
        // wasm_files_entries := [];
        instances_entries := [];
    };

    //caller
    public shared({caller}) func caller() : async Principal{
        return caller;
    };

    //**Financing module**//

    public query func cycles_balance() : async Nat{
        return ExperimentalCycles.balance();
    };
    public query func cycles_available(): async Nat{
      return ExperimentalCycles.available();
    };
    //1//
    //Variant: Internal via dispatch inside canisters
    //Manager cycles//
    public func credit() : async () {
        let available = ExperimentalCycles.available();
        let accepted = ExperimentalCycles.accept(available);
        assert (accepted == available);
    };
    private func creating_internal(user_principal: Principal): async ?Creating.Creating{
        ExperimentalCycles.add(1_000_000_000_000);
        let c: Creating.Creating = await Creating.Creating(thisCluster.credit);
        await c.deposit(); //deposit 
        let p: Principal = Principal.fromActor(c);
        await set_settings_creating(p, user_principal);
        return ?c;
    };
     private func creating(user_principal: Principal, cycles: Nat): async ?Creating.Creating{
        ExperimentalCycles.add(cycles);
        let c: Creating.Creating = await Creating.Creating(thisCluster.credit);
        await c.deposit(); //deposit 
        let p: Principal = Principal.fromActor(c);
        await set_settings_creating(p, user_principal);
        return ?c;
    };
    private func set_settings_creating(canister_id: Principal, user_principal: Principal) : async(){
        let settings: canister_settings = { 
                controllers = ?[user_principal, Principal.fromActor(thisCluster)];
                compute_allocation = null;
                memory_allocation = null;  
                freezing_threshold = null };
        await actor_ic.update_settings({canister_id : Principal; settings : canister_settings;});
    };
    //2//
    //Variant: External version through cycles and coinage
    private var financing = Financing.Financing();
    public func canister_accounting(): async CanisterAccounting {
        return await financing.canister_accounting(Principal.fromActor(thisCluster));
    };
    public func accounting(id: Text): async PrincipalAccounting {
        return await financing.accounting_by_id(id);
    };
    public func minting_cycles(icp_amount: Nat): async Cycles { 
        return await financing.minting_cycles_return_value(Principal.fromActor(thisCluster), icp_amount);
    };
    //transfer icp
    public func transfer_icp(address: Hex.Hex, icp_amount: Nat): async TransferResultExpanded {
        return await financing.transfer_icp_by_address_hex(address, icp_amount);
    };
    public func query_bloks(sbi : Nat, n : Nat): async QueryBlocksResponse {// BlockIndex = Nat64; GetBlocksArgs = { start : BlockIndex; length : Nat64 };
        return await financing.query_bloks(sbi, n);
    };
    public func block_participants(sbi : Nat): async BlockParticipants {// BlockIndex = Nat64; GetBlocksArgs = { start : BlockIndex; length : Nat64 };
       return await financing.block_participants(sbi);
    };
    public func check_participants(
            sbi : Nat, 
            user_principal: Principal, 
            canister: Principal): async BlockParticipants { 
       return await financing.check_participants(sbi, user_principal, canister);
    };
 
    //**Main module**//

    //** #Install #Reinstall #Upgrade #Uninstall wasm-code **//
    //** Fast #Install wasm-code **//
    private func fast_install_wasm(
        canister_id : Principal, 
        wasm : Wasm) : async() {
            ignore actor_ic.install_code({arg = []; wasm_module = wasm; mode = #install; canister_id = canister_id;});
    };
    public shared({caller}) func install_wasm(
        canister_id : Principal, 
        wasm : Wasm) : async Bool {
            try{
                await actor_ic.install_code({arg = []; wasm_module = wasm; mode = #install; canister_id = canister_id;});
                return true;
            }
            catch e { return false;  }
    };
    public shared({caller}) func reinstall_wasm(
        canister_id : Principal, 
        wasm : Wasm) : async Bool {
            try{
                await actor_ic.install_code({arg = []; wasm_module = wasm; mode = #reinstall; canister_id = canister_id;});
                return true;
            }
            catch e {  return false; }
    };
    public shared({caller}) func upgrade_wasm(
        canister_id : Principal, 
        wasm : Wasm) : async Bool {
            try{
                await actor_ic.install_code({arg = []; wasm_module = wasm; mode = #upgrade; canister_id = canister_id;});
                return true;
            }
            catch e {  return false;  }
    };
    public shared({caller}) func uninstall_wasm(
        canister_id : Principal) : async Bool {
            try{
                await actor_ic.uninstall_code({canister_id = canister_id});
                return true;
            }
            catch e {  return false;  }
    };
    public shared({caller}) func start_canister(canister_id: Principal) : async Bool{ 
        // assert(Principal.equal(admin, caller));// "caller" principal type (create only admin)
        // assert(TrieSet.mem<Principal>(white_list, caller, Principal.hash(caller), Principal.equal));//caller in white_list 
        try{
            await actor_ic.start_canister({canister_id = canister_id});
            return true;
        }
        catch e { return false; }
    };
    public shared({caller}) func stop_canister(canister_id: Principal) : async Bool{ 
        // assert(Principal.equal(admin, caller));// "caller" principal type (create only admin)
        // assert(TrieSet.mem<Principal>(white_list, caller, Principal.hash(caller), Principal.equal));//caller in white_list 
        try{
            await actor_ic.stop_canister({canister_id = canister_id});
            return true;
        }
        catch e { return false; }
    };
    public shared({caller}) func clean_canister(canister_id: Principal, wasm: Wasm) : async Bool{ 
        // assert(Principal.equal(admin, caller));// "caller" principal type (create only admin)
        // assert(TrieSet.mem<Principal>(white_list, caller, Principal.hash(caller), Principal.equal));//caller in white_list 
        try{
            let isUninstall = await uninstall_wasm(canister_id);
            if(isUninstall){
                let isInstall = await install_wasm(canister_id, wasm);
                if(isInstall){
                    return true;
                }
                else{
                    return false;
                };
            }
            else{
                return false;
            };
            return false;
        }
        catch e { return false; }
    };
    public shared({caller}) func delete_canister(canister_id: Principal) : async Bool{ 
        // assert(Principal.equal(admin, caller));// "caller" principal type (create only admin)
        // assert(TrieSet.mem<Principal>(white_list, caller, Principal.hash(caller), Principal.equal));//caller in white_list 
        try{
            await actor_ic.delete_canister({canister_id = canister_id});
            return true;
        }
        catch e { return false; }
    };
    public shared({caller}) func create_instance(user_principal: Principal) : async Result.Result<Principal, DescriptionError> {
        try{
            // if(TrieSet.mem<Principal>(white_list, caller, Principal.hash(caller), Principal.equal)){ return #err(#invalid_caller); };
            let canister_id = (await actor_ic.create_canister({ settings = ?{
                freezing_threshold = null;
                controllers = ?[user_principal, Principal.fromActor(thisCluster)];
                //  controllers = ?[admin, user_principal, Principal.fromActor(thisCluster)];
                compute_allocation = null;
                memory_allocation = null;  
            }})).canister_id;
            return #ok(canister_id);
        }
        catch e {
            return #err(#abort_canister_create);
        }
    };
    public func get_wasm_default(): async Result.Result<WasmDelivered, DescriptionError>{     
        let rwd: Result.Result<WasmDelivered, DescriptionError> = await actor_wasm_storage.last_wasm_result(db);//dbs.wasm file or other default
        return rwd;       
    };


    public shared({caller}) func deploy_instance_default(   
            sbi : Nat,
            user_principal: Principal, 
            canister: Principal,
            description: Text) : async Result.Result<(Principal, Text), DescriptionError>{
        try{
            // var bp: BlockParticipants = await check_participants(sbi, user_principal, canister); //icp transfer in blockchain 
            var bp: BlockParticipants = await check_participants(sbi, canister, user_principal);//icp transfer in blockchain 
            if(bp.verify == true){//transfer verify
                let cycles: Cycles = await minting_cycles(Nat64.toNat(bp.amount));// bp.amount - real icp transfer
                // an attempt to create a canister for a user with real funds
                let act : ?Creating.Creating = await creating(user_principal: Principal, cycles);//new actor creating.mo
                switch(act){
                    case(null){
                        return #err(#canister_create_error_not_enough_funds);
                    };
                    case(?act){
                        let rwd : Result.Result<WasmDelivered, DescriptionError> = await get_wasm_default(); //default
                        let canister_id = Principal.fromActor(act);
                        switch(rwd){
                            case(#ok(wd)){
                                //creating.mo redefined the canister with the right wasm logic
                                var isrt = await reinstall_wasm(canister_id, wd.wasm); 
                                //created stored data about the canister 
                                let i: Instance = {  
                                    instance_principal = canister_id;
                                    wasm_name = db;
                                    wasm_version = wd.version;
                                    description = description; 
                                    status = #involved; // { #unknown; #involved; #abandon; #stopped;};
                                    wasm = wd.wasm;
                                    };
                                var size = instances.size();
                                put_canister(size, i);
                                return #ok((canister_id, Principal.toText(canister_id)));  
                            };
                            case(#err(e)){
                                return #err(e);
                            };
                        };
                        return  #err(#canister_install_wasm_error);
                    };
                };
            };
            return  #err(#unreliable_operation)
        }
        catch e {
            return #err(#abort_canister_deploy);
        }     
    };
    public shared({caller}) func deploy_instance_default_internal(   
        user_principal: Principal, 
        description: Text) : async ?Principal {
        try{
            let act : ?Creating.Creating = await creating_internal(user_principal: Principal);
            switch(act){
                case(null){
                    return null;
                };
                case(?act){
                    let rwd : Result.Result<WasmDelivered, DescriptionError> = await get_wasm_default(); //default
                    let canister_id = Principal.fromActor(act);
                    switch(rwd){
                        case(#ok(wd)){
                            //creating.mo redefined the canister with the right wasm logic
                            var isrt = await reinstall_wasm(canister_id, wd.wasm); 
                                //created stored data about the canister
                            let i: Instance = {  
                                    instance_principal = canister_id;
                                    wasm_name = db;
                                    wasm_version = wd.version;
                                    description = description; 
                                    status = #involved; // { #unknown; #involved; #abandon; #stopped;};
                                    wasm = wd.wasm;
                            };
                            var size = instances.size();
                            put_canister(size, i);
                            return ?canister_id;       
                        };
                        case(#err(e)){
                            return null;
                        };
                    };
                    return ?canister_id;
                };
            };
        }
        catch e {
            return null;
        }     
    };
    public shared({caller}) func deploy_instance(   
            sbi : Nat,
            user_principal: Principal, 
            canister: Principal,
            description: Text,
            wasm_name: Text,
            wasm_version: Nat) : async Result.Result<(Principal, Text), DescriptionError>{
            // assert(Principal.equal(admin, caller));// "caller" principal type (create only admin)
            // assert(TrieSet.mem<Principal>(white_list, caller, Principal.hash(caller), Principal.equal));//caller in white_list 
            try{
            // var bp: BlockParticipants = await check_participants(sbi, user_principal, canister); //icp transfer in blockchain 
            var bp: BlockParticipants = await check_participants(sbi, canister, user_principal);
            if(bp.verify == true){//transfer verify
                let cycles: Cycles = await minting_cycles(Nat64.toNat(bp.amount));// bp.amount - real icp transfer
                // an attempt to create a canister for a user with real funds
                let act : ?Creating.Creating = await creating(user_principal: Principal, cycles);//new actor creating.mo
                switch(act){
                    case(null){
                        return #err(#canister_create_error_not_enough_funds);
                    };
                    case(?act){
                        let wasm_result: Result.Result<Wasm, DescriptionError> = await get_wasm(wasm_name, wasm_version);
                        let canister_id = Principal.fromActor(act);
                        switch(wasm_result){
                            case(#ok(wasm)){
                                //creating.mo redefined the canister with the right wasm logic
                                var isrt = await reinstall_wasm(canister_id, wasm); 
                                //created stored data about the canister
                                let i: Instance = {  
                                    instance_principal = canister_id;
                                    wasm_name = wasm_name;
                                    wasm_version = wasm_version;
                                    description = description; 
                                    status = #involved; // { #unknown; #involved; #abandon; #stopped;};
                                    wasm = wasm;
                                };
                                var size = instances.size();
                                put_canister(size, i);
                                return #ok((canister_id, Principal.toText(canister_id)));    
                            };
                            case(#err(e)){
                                return #err(e);
                            };
                        };
                        return  #err(#canister_install_wasm_error);
                    };
                };
            };
            return  #err(#unreliable_operation)
        }
        catch e {
            return #err(#abort_canister_deploy);
        }     
    };

    //Check instance
    public shared({caller}) func check_instances(action: Action): async Result.Result<Bool, ClusterInstanceError>{  
        try{
            // #start; #stop; #delete; #clean - Action
            // #unknown; #involved; #abandon; #stopped; check Instance
            switch(action){
                case(#start){ return #ok(true);}; //we start with any statuses
                case(#stop){
                    for((key:Nat, inst: Instance) in instances.entries()){
                        var status = inst.status;
                        switch(status){
                            case(#stopped){};
                            case(#abandon){};
                            case(#involved){return #err(#abort_stop);};  
                        };
                    }; 
                    return #ok(true);
                };
                case(#delete){
                    for((key:Nat, inst: Instance) in instances.entries()){
                        var status = inst.status;
                        switch(status){
                            case(#stopped){return #err(#abort_delete);};
                            case(#abandon){};
                            case(#involved){return #err(#abort_delete);};  
                        };
                    }; 
                    return #ok(true);
                };
                // case(#clean){ };
            };
            return #err(#unknown_error);
        }
        catch e {
            return #err(#unknown_error);
        }  
    };
    public func get_wasm(
        wasm_name: Text,
        wasm_version: Nat): async Result.Result<Wasm, DescriptionError>{              
            let wasm: Result.Result<Wasm, DescriptionError> = await actor_wasm_storage.read_wasm_result(wasm_name, wasm_version);
            return wasm;
    };
    func put_canister(
        n: Nat, 
        i: Instance){ 
            instances.put(n, i);
    };
    //Start instance
    public shared({caller}) func start_instance(key: Nat): async Result.Result<Principal, ClusterInstanceError>{  
        try{
            var inst: ?Instance = instances.get(key);
            switch(inst){
                case(null){
                    return #err(#unknown_error);
                };
                case(?inst){
                    var isStart: Bool = await start_canister(inst.instance_principal);
 
                    if(isStart){
                        var i: Instance = {  
                            instance_principal = inst.instance_principal;
                            wasm_name = inst.wasm_name;
                            wasm_version =inst. wasm_version;
                            description = inst.description; 
                            status = #involved; // { #unknown; #involved; #abandon; #stopped;};
                            wasm = inst.wasm;
                        };
                        var result : ?Instance = instances.replace(key, i);
                        switch(result){
                            case(null){
                                return #err(#abort_replace_value);
                            };
                            case(?result){                       
                                return #ok(result.instance_principal);
                            };
                        };
                    }  
                    else {
                        return #err(#abort_start_instance);
                    };
                    return #err(#unknown_error);
                };
            };
            return #err(#unknown_error);
        }
        catch e {
            return #err(#unknown_error);
        }  
    };
    //Stop instance
    public shared({caller}) func stop_instance(key: Nat): async Result.Result<Principal, ClusterInstanceError>{
         try{
            var inst: ?Instance = instances.get(key);
            switch(inst){
                case(null){
                    return #err(#unknown_error);
                };
                case(?inst){
                    var isStop: Bool = await stop_canister(inst.instance_principal);
                    if(isStop){
                        var i: Instance = {  
                            instance_principal = inst.instance_principal;
                            wasm_name = inst.wasm_name;
                            wasm_version =inst. wasm_version;
                            description = inst.description; 
                            status = #stopped; // { #unknown; #involved; #abandon; #stopped;};
                            wasm = inst.wasm;
                        };
                        var result : ?Instance = instances.replace(key, i);
                        switch(result){
                            case(null){
                                return #err(#abort_replace_value);
                            };
                            case(?result){                       
                                return #ok(result.instance_principal);
                            };
                        };
                    }  
                    else {
                        return #err(#abort_stop_instance);
                    };
                    return #err(#unknown_error);
                };
            };
            return #err(#unknown_error);
        }
        catch e {
            return #err(#unknown_error);
        }  
    };  
    //Clean instance
    //(https://forum.dfinity.org/t/cleaning-the-canister/15924)
    public shared({caller}) func clean_instance(key: Nat): async Result.Result<Principal, ClusterInstanceError>{
        try{
            var inst: ?Instance = instances.get(key);
            switch(inst){
                case(null){
                    return #err(#unknown_error);
                };
                case(?inst){
                    var isClean: Bool = await clean_canister(inst.instance_principal, inst.wasm);
                    if(isClean){
                        var i: Instance = {  
                            instance_principal = inst.instance_principal;
                            wasm_name = inst.wasm_name;
                            wasm_version =inst.wasm_version;
                            description = inst.description; 
                            status = #involved; // { #unknown; #involved; #abandon; #stopped;};
                            wasm = inst.wasm;
                        };
                        var result : ?Instance = instances.replace(key, i);
                        switch(result){
                            case(null){
                                return #err(#abort_replace_value);
                            };
                            case(?result){                       
                                return #ok(result.instance_principal);
                            };
                        };
                    }  
                    else {
                        return #err(#abort_clean_instance);
                    };
                    return #err(#unknown_error);
                };
            };
            return #err(#unknown_error);
        }
        catch e {
            return #err(#unknown_error);
        }  
    };
    //Delete instance
    //Удаляет канистру но оставляет ее в списках "instances" как канистру
    //Removes the canister but leaves it in the "instances" lists as a canister
    public shared({caller}) func delete_instance(key: Nat): async Result.Result<Principal, ClusterInstanceError>{
        try{
            var inst: ?Instance = instances.get(key);
            switch(inst){
                case(null){
                    return #err(#unknown_error);
                };
                case(?inst){
                    var isDelete: Bool = await delete_canister(inst.instance_principal);
                    if(isDelete){
                        var i: Instance = {  
                            instance_principal = inst.instance_principal;
                            wasm_name = inst.wasm_name;
                            wasm_version =inst. wasm_version;
                            description = inst.description; 
                            status = #abandon; // { #unknown; #involved; #abandon; #stopped; #stopped_cleared};
                            wasm = inst.wasm;
                        };
                        var result : ?Instance = instances.replace(key, i);
                        switch(result){
                            case(null){
                                return #err(#abort_replace_value);
                            };
                            case(?result){                       
                                return #ok(result.instance_principal);
                            };
                        };
                    }  
                    else {
                        return #err(#abort_delete_instance);
                    };
                    return #err(#unknown_error);
                };
            };
            return #err(#unknown_error);
        }
        catch e {
            return #err(#unknown_error);
        }  
    };  

    // Get collection
    public shared({caller}) func read_instances(): async [Instance]{
        let size = instances.size();
        var ia = Array.init<Instance>(size, {
            instance_principal: Principal = empty_principal;
            wasm_name: Text = empty_text;
            wasm_version: Nat = 0;
            description: Text = empty_text;
            status = #unknown; // { #unknown; #involved; #abandon; #stopped; #stopped_cleared};
            wasm: Wasm = [];
        });

        var i = 0;    
        for((k : Nat, v : Instance) in instances.entries()){
            let inst: Instance = {
                instance_principal = v.instance_principal; //(canister_id)
                wasm_name = v.wasm_name;
                wasm_version = v.wasm_version;
                description = v.description;
                status = v.status;  
                wasm = v.wasm;
            }; 
            ia[i] := inst;
            i += 1;
        };
        return Array.freeze<Instance>(ia);
    };  

     public shared({caller}) func read_instances_info(): async [InstanceInfo]{
        let size = instances.size();
        var kia = Array.init<InstanceInfo>(size, {
            number_key: Nat = 0;
            instance_principal: Principal = empty_principal;
            wasm_name: Text = empty_text;
            wasm_version: Nat = 0;
            status = #unknown;
            description: Text = empty_text;
        });
   
        for((k : Nat, v : Instance) in instances.entries()){
            let inst: InstanceInfo = {
                number_key = k;
                instance_principal = v.instance_principal; //(canister_id)
                wasm_name = v.wasm_name;
                wasm_version = v.wasm_version;
                status = v.status;
                description = v.description;  
            }; 
            kia[k] := inst;
        };
        return Array.freeze<InstanceInfo>(kia);
    }; 
}