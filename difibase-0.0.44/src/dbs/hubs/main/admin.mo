import Array "mo:base/Array";
import List "mo:base/List";
import Blob  "mo:base/Blob";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Nat  "mo:base/Nat";
import Nat8  "mo:base/Nat8";
import Nat64 "mo:base/Nat64";
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

import Helpers "../../lib/util/helpers";
import UserIdentifiers "../identifiers";
import Types "../../types";
import Interfaces "../../interfaces";
import Creating "../creating";
import Const "../../const";
import Financing "../../financing";
import Tools "../../lib/tools/tools";

// import Identifiers "identifiers";
// import IdentifiersChunk "identifiers-chunk";

import CryptoUtilities "mo:crypto/Utilities";
import SHA256 "mo:crypto/SHA/SHA256";
import SHA224 "mo:crypto/SHA/SHA224";
import SHA2 "mo:crypto/SHA/SHA2";
import Hex "mo:encoding/Hex";
import Base32 "mo:encoding/Base32";

shared({caller = owner}) actor class Admin() = thisAdmin{
    type canister_settings = Types.canister_settings;
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

    let version = Const.admin_version;
    let cluster = Const.cluster; 

    private let admin_principal = Const.admin_principal;
    private let admin: Principal = Principal.fromText(admin_principal);

    let empty_text: Text = "";
    var nil: Nat8 = 0;
    var empty_array: [var Nat8] = Array.init(32, nil);
    var empty_freeze_array: [Nat8] = Array.freeze<Nat8>(empty_array);

    // stable var administrators : TrieSet.Set<Principal> = TrieSet.empty<Principal>();
    stable var white_list: Set<Principal> = TrieSet.fromArray<Principal>([admin], Principal.hash, Principal.equal);
    stable var users_clusters_entries : [(UserIdentifier, Cluster)] = [];
    var users_clusters : TrieMap.TrieMap<UserIdentifier, Cluster> = TrieMap.fromEntries(users_clusters_entries.vals(), UserIdentifiers.equal, UserIdentifiers.hash);
    //count clusters (WEB)
    public func count_clusters(): async Nat {users_clusters.size();};

    //version (WEB)
    public query func get_version(): async Text {version;};
    public func get_canister_status(canister_id: Principal): async CanisterStatus{await actor_ic.canister_status({canister_id = canister_id});};
    //size memory (WEB)
    public func get_rts_memory_size(): async Nat { return Prim.rts_memory_size(); };
    
    //caller
    public shared({caller}) func caller() : async Principal{
        return caller;
    };

    //upgrade canister
    system func preupgrade(){
        users_clusters_entries := Iter.toArray(users_clusters.entries());
    };
    system func postupgrade(){
        users_clusters_entries := [];
    };

    //**Financing module**//

    //cycles balance (WEB)
    public query func cycles_balance() : async Nat{
        return ExperimentalCycles.balance();
    };
    //cycles available (WEB)
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
        let c: Creating.Creating = await Creating.Creating(thisAdmin.credit);
        await c.deposit(); //deposit 
        let p: Principal = Principal.fromActor(c);
        await set_settings_creating(p, user_principal);
        return ?c;
    };
     private func creating(user_principal: Principal, cycles: Nat): async ?Creating.Creating{
        ExperimentalCycles.add(cycles);
        let c: Creating.Creating = await Creating.Creating(thisAdmin.credit);
        await c.deposit(); //deposit 
        let p: Principal = Principal.fromActor(c);
        await set_settings_creating(p, user_principal);
        return ?c;
    };
    private func set_settings_creating(canister_id: Principal, user_principal: Principal) : async(){
        let settings: canister_settings = { 
                controllers = ?[user_principal, Principal.fromActor(thisAdmin)];
                compute_allocation = null;
                memory_allocation = null;  
                freezing_threshold = null };
        await actor_ic.update_settings({canister_id : Principal; settings : canister_settings;});
    };
    //2//
    //Variant: External version through cycles and coinage
    private var financing = Financing.Financing();
    //utils
    public func canister_accounting(): async CanisterAccounting {
        return await financing.canister_accounting(Principal.fromActor(thisAdmin));
    };
    public func accounting(id: Text): async PrincipalAccounting {
        return await financing.accounting_by_id(id);
    };
    //coinage here
    // public func minting_cycles(icp_amount: Nat): async TransferNotifyTopUpResult {
    //     return await financing.minting_cycles_here(Principal.fromActor(thisAdmin), icp_amount);
    // };
    public func minting_cycles(icp_amount: Nat): async Cycles { 
        return await financing.minting_cycles_return_value(Principal.fromActor(thisAdmin), icp_amount);
    };
    //transfer icp
    public func transfer_icp(address: Hex.Hex, icp_amount: Nat): async TransferResultExpanded {
        return await financing.transfer_icp_by_address_hex(address, icp_amount);
    };
    // //create canister 
    // public shared({caller}) func create_canister_with_icp(user: Principal, amount: Nat): async Principal {
    //     return await financing.create_canister(user, caller, amount);
    // };
    //test
    public func principal_to_account(canister_id: Principal): async [Nat8] {
        return await financing.principal_to_account(canister_id);
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

    //**USERS**//
    public shared({caller}) func add_white_list(user : Principal): async Set<Principal>{
        // assert(Principal.equal(admin, caller));
        white_list :=  Trie.put(white_list, { key = user; hash = Principal.hash user}, Principal.equal, ()).0;
        return white_list;
    };
    public shared({caller}) func delete_white_list(user : Principal): async Set<Principal>{
        // assert(Principal.equal(admin, caller));
        white_list := Trie.remove<Principal, ()>(white_list,  { key = user; hash = Principal.hash user}, Principal.equal).0;
        return white_list;
    };
    public shared({caller}) func contains_white_list(user : Principal): async Bool{
        let contains : Bool = TrieSet.mem<Principal>(white_list, user, Principal.hash(user), Principal.equal);
        return contains;
    };

    //** #Install #Reinstall #Upgrade #Uninstall wasm-code **//
    //** Fast #Install wasm-code **//
    public shared({caller}) func install_wasm(
        canister_id : Principal, 
        wasm : Wasm) : async Bool {
            try{
                await actor_ic.install_code({arg = []; wasm_module = wasm; mode = #install; canister_id = canister_id;});
                return true;
            } catch e { return false;  }
    };
    public shared({caller}) func reinstall_wasm(
        canister_id : Principal, 
        wasm : Wasm) : async Bool {
            try{
                await actor_ic.install_code({arg = []; wasm_module = wasm; mode = #reinstall; canister_id = canister_id;});
                return true;
            } catch e {  return false;   }
    };
    public shared({caller}) func upgrade_wasm(
        canister_id : Principal, 
        wasm : Wasm) : async Bool {
            try{
                await actor_ic.install_code({arg = []; wasm_module = wasm; mode = #upgrade; canister_id = canister_id;});
                return true;
            } catch e {  return false;  }
    };
    public shared({caller}) func uninstall_wasm(
        canister_id : Principal) : async Bool {
            try{
                await actor_ic.uninstall_code({canister_id = canister_id});
                return true;
            } catch e {  return false;  }
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
    public shared({caller}) func delete_canister(canister_id: Principal) : async Bool{ 
        // assert(Principal.equal(admin, caller));// "caller" principal type (create only admin)
        // assert(TrieSet.mem<Principal>(white_list, caller, Principal.hash(caller), Principal.equal));//caller in white_list 
        try{
            await actor_ic.delete_canister({canister_id = canister_id});
            return true;
        }
        catch e { return false; }
    };
    public shared({caller}) func create_canister(user_principal: Principal) : async Result.Result<Principal, DescriptionError> {
        try{
            //if(TrieSet.mem<Principal>(white_list, caller, Principal.hash(caller), Principal.equal)){ return #err(#invalid_caller); };
            let canister_id = (await actor_ic.create_canister({ settings = ?{
                freezing_threshold = null;
                controllers = ?[user_principal, Principal.fromActor(thisAdmin)];
                // controllers = ?[admin, user_principal, Principal.fromActor(thisAdmin)];
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
            let rwd: Result.Result<WasmDelivered, DescriptionError> = await actor_wasm_storage.last_wasm_result(cluster);//cluster.wasm file or other default
            return rwd;       
    };
    public shared({caller}) func deploy_cluster_default(   
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
                                let (uuid, guid) = await Helpers.random_id32();
                                let ui: UserIdentifier = { 
                                    description = description;  
                                    guid = guid; 
                                    uuid = uuid; 
                                    user_principal = user_principal;
                                };
                                let c: Cluster = { 
                                    cluster_principal = canister_id;  
                                    user_principal = user_principal;
                                    description = description;
                                    wasm_name = wd.name;
                                    wasm_version = wd.version;
                                    status = #involved; //{#unknown; #involved; #abandon; #stopped;}
                                    wasm = wd.wasm;
                                };
                                put_canister(ui, c);
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
    public shared({caller}) func deploy_cluster_default_internal(   
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
                            var isrt = await reinstall_wasm(canister_id, wd.wasm);
                            let (uuid, guid) = await Helpers.random_id32();
                            let ui: UserIdentifier = { 
                                description = description;  
                                guid = guid; 
                                uuid = uuid; 
                                user_principal = user_principal;
                            };
                            let c: Cluster = { 
                                cluster_principal = canister_id;  
                                user_principal = user_principal;
                                description = description;
                                wasm_name = wd.name;
                                wasm_version = wd.version;
                                status = #involved; //{#unknown; #involved; #abandon; #stopped;}
                                wasm = wd.wasm;
                            };
                            put_canister(ui, c);
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
    public shared({caller}) func deploy_cluster(   
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
                        let rwd : Result.Result<Wasm, DescriptionError> = await get_wasm(wasm_name, wasm_version);
                        let canister_id = Principal.fromActor(act);
                        switch(rwd){
                            case(#ok(wasm)){
                                //creating.mo redefined the canister with the right wasm logic
                                var isrt = await reinstall_wasm(canister_id, wasm); 
                                //created stored data about the canister
                                let (uuid, guid) = await Helpers.random_id32();
                                let ui: UserIdentifier = { 
                                    description = description;  
                                    guid = guid; 
                                    uuid = uuid; 
                                    user_principal = user_principal;
                                };
                                let c: Cluster = { 
                                    cluster_principal = canister_id;  
                                    user_principal = user_principal;
                                    description = description;
                                    wasm_name = wasm_name;
                                    wasm_version = wasm_version;
                                    status = #involved; //{#unknown; #involved; #abandon; #stopped;}
                                    wasm = wasm;
                                };
                                put_canister(ui, c);
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
    //No financing
    //Singleton instance
    public shared({caller}) func deploy_singleton_instance(
        wasm : Wasm, 
        user_principal: Principal): async Result.Result<(Principal, Text), DescriptionError>{ 
        try{
            // let create_id: Result.Result<Principal, DescriptionError> = await create_canister(user_principal);  
            // switch(create_id){
            //     case(#ok(canister_id)){
            //         let result_install = await install_wasm(canister_id, wasm);
            //         if(result_install){
            //             return #ok((canister_id, Principal.toText(canister_id))); 
            //         }
            //         else{
            //             return #err(#reject_install_wasm);
            //         };   
            //     };
            //     case(#err(e)){
            //         return #err(e);
            //     };
            // };
            return #err(#abort_canister_deploy);
        }
        catch e {
            return #err(#abort_canister_deploy);
        }
    };
    public func get_wasm(
        wasm_name: Text,
        wasm_version: Nat): async Result.Result<Wasm, DescriptionError>{        
            let wasm: Result.Result<Wasm, DescriptionError> = await actor_wasm_storage.read_wasm_result(wasm_name, wasm_version);
            Debug.print("cluster.mo get_wasm name: " # debug_show(wasm_name));
            Debug.print("cluster.mo get_wasm: " # debug_show(wasm));
            return wasm;
    };
    public shared({caller}) func clusters(): async [ClusterInfo]{
        let size = users_clusters.size();
        var clusters = Array.init<ClusterInfo>(size, {
            cluster_principal : Principal = empty_principal;
            description : Text = empty_text;
            user_principal : Principal = empty_principal;
            wasm_name = empty_text;
            status = #unknown;
            wasm_version = 0;
            wasm: Wasm = [];
        });
        var i = 0;
        for((k : UserIdentifier, v : Cluster) in users_clusters.entries()){
            let c: ClusterInfo = {
                cluster_principal = v.cluster_principal;
                user_principal = k.user_principal;
                description = k.description; 
                status = v.status;
                wasm_name = v.wasm_name;
                wasm_version = v.wasm_version;
            }; 
            clusters[i] := c;
            i += 1;
        };
        return Array.freeze<ClusterInfo>(clusters);
    };
    public shared({caller}) func user_clusters(user_principal: Principal): async [ClusterInfo]{
        let size = count_user_clusters(user_principal);
        var clusters = Array.init<ClusterInfo>(size, {
            cluster_principal : Principal = empty_principal;
            description : Text = empty_text;
            user_principal : Principal = empty_principal;
            wasm_name = empty_text;
            status = #unknown;
            wasm_version = 0;
        });
        var i = 0;
        for((k : UserIdentifier, v : Cluster) in users_clusters.entries()){
            if(Principal.equal(user_principal, k.user_principal)){
                var c: ClusterInfo = {
                    cluster_principal = v.cluster_principal;
                    user_principal = k.user_principal; 
                    description = k.description;
                    status = v.status;
                    wasm_name = v.wasm_name;
                    wasm_version = v.wasm_version;
                }; 
                clusters[i] := c;
                i += 1;
            };
        };
        return Array.freeze<ClusterInfo>(clusters);
    };
    public shared({caller}) func get_cluster(user_principal: Text, description : Text): async Cluster{
        let ui = {
            description = description;
            user_principal = Principal.fromText(user_principal);
            guid = "";
            uuid = [];
        };
        var c: ?Cluster = users_clusters.get(ui);
        switch(c){
            case(null){
                let c_: Cluster = {  
                    cluster_principal = empty_principal;  
                    user_principal = empty_principal;
                    description = empty_text; 
                    wasm_name = empty_text;
                    wasm_version = 0;
                    status = #unknown; //{#unknown; #involved; #abandon; #stopped;}
                    wasm = [];
                };
                return c_;
            };
            case(?c){
                return c;
            };
        };
    };
    private func put_canister(
        ui: UserIdentifier, 
        c: Cluster){ 
            users_clusters.put(ui, c);
    };
    private func count_user_clusters(user_principal: Principal): Nat{
        var i = 0;
        for(k : UserIdentifier in users_clusters.keys()){         
            if(Principal.equal(user_principal, k.user_principal)){ i += 1;};
        };
        return i;
    };
    //**Cluster Internal**//
    //Start cluster
    public shared({caller}) func cluster_start(        
        user_principal: Principal, 
        description: Text)
                        : async Result.Result<Principal, ClusterInstanceError>{
        try{
            let key : UserIdentifier = { description = description;//key
                    guid = ""; 
                    uuid = empty_freeze_array;
                    user_principal = user_principal; //key
            };
            let cluster: ?Cluster = users_clusters.get(key);
            switch(cluster){
                case(null){
                    return #err(#unknown_error);
                };
                case(?cluster){
                    var c ={
                        cluster_principal = cluster.cluster_principal;
                        user_principal = cluster.user_principal;
                        wasm_name = cluster.wasm_name;
                        wasm_version = cluster.wasm_version;
                        description  = cluster.description;
                        status = #involved; // { #unknown; #involved; #abandon; #stopped;};
                        wasm = cluster.wasm;
                    };

                    // let ac : ICluster = actor(Principal.toText(cluster.cluster_principal));!!!
                    // let isCheck = ac.check_instances(#start);!!!

                    var isStart: Bool = await start_canister(cluster.cluster_principal);
                    if(isStart){
                        var result : ?Cluster = users_clusters.replace(key, c);
                        switch(result){
                            case(null){
                                return #err(#abort_replace_value);
                            };
                            case(?result){                       
                                return #ok(result.cluster_principal);
                            };
                        };
                    }  
                    else {
                        return #err(#abort_start_cluster);
                    };
                    return #err(#unknown_error);
                };
            };
        }
        catch e{
            return #err(#unknown_error);
        }
    };
    //Stop cluster
    public shared({caller}) func cluster_stop(
        user_principal: Principal, 
        description: Text)
                        : async Result.Result<Principal, ClusterInstanceError>{
        try{
            let key : UserIdentifier = { description = description;//key
                    guid = ""; 
                    uuid = empty_freeze_array;
                    user_principal = user_principal; //key
            };
            let cluster: ?Cluster = users_clusters.get(key);
            switch(cluster){
                case(null){
                    return #err(#unknown_error);
                };
                case(?cluster){
                    var c ={
                        cluster_principal = cluster.cluster_principal;
                        user_principal = cluster.user_principal;
                        wasm_name = cluster.wasm_name;
                        wasm_version = cluster.wasm_version;
                        description  = cluster.description;
                        status = #stopped; // { #unknown; #involved; #abandon; #stopped;};
                        wasm = cluster.wasm;
                    };

                    let ac : ICluster = actor(Principal.toText(cluster.cluster_principal));
                    let isCheck = await ac.check_instances(#stop);

                    switch(isCheck){
                        case(#ok(v)){
                            var isStop: Bool = await stop_canister(cluster.cluster_principal);
                            if(isStop){
                                var result : ?Cluster = users_clusters.replace(key, c);
                                switch(result){
                                    case(null){
                                        return #err(#abort_replace_value);
                                    };
                                    case(?result){                       
                                        return #ok(result.cluster_principal);
                                    };
                                };
                            }  
                            else {
                                return #err(#abort_stop_cluster);
                            };         
                        };
                        case(#err(e)){
                            return #err(e);
                        };
                    };
                    return #err(#unknown_error);
                };
            };
        }
        catch e{
            return #err(#unknown_error);
        }
    };
    //**ICluster External**//
    //Start instance
    public shared({caller}) func cluster_start_instance(
        key: Nat, 
        cluster_id: Text)
                        : async Result.Result<Principal, ClusterInstanceError>{
        let ac : ICluster = actor(cluster_id);
        return await ac.start_instance(key);
    };
    //Stop instance
    public shared({caller}) func cluster_stop_instance(
        key: Nat, 
        cluster_id: Text)
                        : async Result.Result<Principal, ClusterInstanceError>{
        let ac : ICluster = actor(cluster_id);
        return await ac.stop_instance(key);
    };
    //Clean instance
    public shared({caller}) func cluster_clean_instance(
        key: Nat, 
        cluster_id: Text)
                        : async Result.Result<Principal, ClusterInstanceError>{
        let ac : ICluster = actor(cluster_id);
        return await ac.clean_instance(key);
    };
    //Delete instance
    public shared({caller}) func cluster_delete_instance(
        key: Nat, 
        cluster_id: Text)
                        : async Result.Result<Principal, ClusterInstanceError>{
        let ac : ICluster = actor(cluster_id);
        return await ac.delete_instance(key);
    };
    //Deploy
    public shared({caller}) func cluster_deploy_instance_default( // default wasm_actor or dbs
        user_principal: Principal,
        cluster_id: Text, 
        description : Text): async Result.Result<(Principal, Text), DescriptionError>{
            let ac : ICluster = actor(cluster_id);
            return await ac.deploy_instance_default(user_principal, description);
    };
    public shared({caller}) func cluster_deploy_instance(   
        user_principal: Principal, 
        cluster_id: Text, 
        description: Text,
        wasm_name: Text,
        wasm_version: Nat): async Result.Result<(Principal, Text), DescriptionError>{
            let ac : ICluster = actor(cluster_id);
            return await ac.deploy_instance(user_principal, description, wasm_name, wasm_version);
    };
    //Read
    public shared({caller}) func cluster_reade_instances(
        cluster_id: Text): async [Instance]{
            let ac : ICluster = actor(cluster_id);
            return await ac.read_instances();
    };
    public shared({caller}) func cluster_reade_instances_info(
        cluster_id: Text): async [InstanceInfo]{
            let ac : ICluster = actor(cluster_id);
            return await ac.read_instances_info();  
    };
}