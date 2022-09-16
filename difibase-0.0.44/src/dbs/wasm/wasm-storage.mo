import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import List "mo:base/List";
import Blob  "mo:base/Blob";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Prim "mo:⛔";
import Error "mo:base/Error";
import Result "mo:base/Result";
import Trie "mo:base/Trie";
import Hash "mo:base/Hash";
import Bool "mo:base/Bool";
import TrieMap "mo:base/TrieMap";
import TrieSet "mo:base/TrieSet";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Time "mo:base/Time";
import Nat  "mo:base/Nat";
import Nat8  "mo:base/Nat8";
import Nat64  "mo:base/Nat64";
import Int  "mo:base/Int";
import Debug "mo:base/Debug";


import Helpers "../lib/util/helpers";
import Types "../types";
import Identifiers "identifiers";
import IdentifiersChunk "identifiers-chunk";
import Interfaces "../interfaces";
import Const "../const";
import Tools "../lib/tools/tools";
import Financing "../financing";

import Hex "mo:encoding/Hex";

shared({caller = owner}) actor class WasmStorage() = thisWasmStorage{
    //**An actor for storing wasm files.**//
    type ErrorCode = Error.ErrorCode;
    type DescriptionError = Types.DescriptionError;
    type Wasm = Types.Wasm; //[Nat8]
    type UUID = Types.UUID;
    type GUID = Types.GUID;
    type CanisterStatus = Types.CanisterStatus;
    type WasmObject = Types.WasmObjects;
    type WasmDelivered = Types.WasmDelivered;
    type FileHash = Types.FileHash;
    type TypeHash = Types.TypeHash;
    type CombinedWasmInfo = Types.CombinedWasmInfo;
    type KeyChunk = IdentifiersChunk.KeyChunk;
    type ValueChunk = IdentifiersChunk.ValueChunk;
    type WasmIdentifier = Identifiers.WasmIdentifier; // name; version - key;
    type Set<Principal> = Trie.Trie<Principal, ()>;
    type Trie<K, V> = Trie.Trie<K, V>;

    type TransferResult = Types.TransferResult; 
    type TransferResultExpanded = Types.TransferResultExpanded;
    type BlockIndex = Types.BlockIndex;
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

    type IIC = Interfaces.IInternetComputer;
    type ILedger = Interfaces.IPublicLedger;
    type ICyclesConversionNotify = Interfaces.ICyclesConversionNotify;

    private let admin_principal = Const.admin_principal;
    private let admin: Principal = Principal.fromText(admin_principal);

    let actor_ic : IIC = actor(Const.canister_ic);
    let public_ledger: ILedger = actor(Const.canister_nns_ledger);
    let public_coinage: ICyclesConversionNotify = actor(Const.canister_nns_cycles_minting);
    let principal_public_ledger: Principal = Principal.fromText(Const.canister_nns_ledger);
    let principal_public_coinage: Principal = Principal.fromText(Const.canister_nns_cycles_minting);

    //caller
    public shared({caller}) func caller() : async Principal{
        return caller;
    };

    //size memory (WEB)
    public func get_rts_memory_size(): async Nat { return Prim.rts_memory_size(); };

    //**Financing module**//

    //cycles balance (WEB)
    public query func cycles_balance() : async Nat{
        return ExperimentalCycles.balance();
    };
    //cycles available (WEB)
    public query func cycles_available(): async Nat{
      return ExperimentalCycles.available();
    };


    //Variant: Internal via dispatch inside canisters
    // private let cyclesCapacity: Nat = 4_000_000_000_000;
    private let cyclesCapacity: Nat = 2_000_000_000_000;
    var cyclesSavings: Nat = 0;
    public func deposit() : async() {
        let amount = ExperimentalCycles.available();
        let limit : Nat = cyclesCapacity - cyclesSavings;
        let acceptable =
          if (amount <= limit) amount
          else limit;     
        let accepted = ExperimentalCycles.accept(acceptable);
        assert (accepted == acceptable);
        cyclesSavings += acceptable;
    };
    public shared(msg) func withdraw(amount : Nat) : async () {
        assert (msg.caller == owner);
         assert (amount <= cyclesSavings);
        ExperimentalCycles.add(amount);
        //await benefit();
        await deposit();
        let refund = ExperimentalCycles.refunded();
        cyclesSavings -= amount - refund;
    };
    //Variant: External version through cycles and coinage
    private var financing = Financing.Financing();
    public func canister_accounting(): async CanisterAccounting {
        // return await financing.canister_accounting(Principal.fromActor(WasmStorage));
        return await financing.canister_accounting(Principal.fromActor(thisWasmStorage));
    };
    //coinage here
    // public func minting_cycles(icp_amount: Nat): async TransferNotifyTopUpResult {
    //     return await financing.minting_cycles_here(Principal.fromActor(thisWasmStorage), icp_amount);
    // };
    public func minting_cycles(icp_amount: Nat): async Cycles { 
        return await financing.minting_cycles_return_value(Principal.fromActor(thisWasmStorage), icp_amount);
    };
    //transfer icp
    public func transfer_icp(address: Hex.Hex, icp_amount: Nat): async TransferResultExpanded {
        // return await financing.minting_cycles_canister(Principal.fromActor(WasmStorage), icp_amount);
        return await financing.transfer_icp_by_address_hex(address, icp_amount);
    };

    //**Main module**//

    let version = Const.wasm_storage_version;

    //version (WEB)
    public query func get_version(): async Text {version;};

    //stable var administrators : TrieSet.Set<Principal> = TrieSet.empty<Principal>();
    stable var white_list: Set<Principal> = TrieSet.fromArray<Principal>([admin], Principal.hash, Principal.equal);
    public func get_canister_status(canister_id: Principal): async CanisterStatus {await actor_ic.canister_status({canister_id = canister_id});};

    //**Wasm storage**//

    stable var wasm_files_entries : [(WasmIdentifier, WasmObject)] = [];
    var wasm_files : TrieMap.TrieMap<WasmIdentifier, WasmObject> = TrieMap.fromEntries(wasm_files_entries.vals(), Identifiers.equal, Identifiers.hash);
    private var temp: TrieMap.TrieMap<KeyChunk, ValueChunk> = TrieMap.TrieMap(IdentifiersChunk.equal, IdentifiersChunk.hash);
    
    //count files (WEB)
    public func get_count_files(): async Nat {wasm_files.size();};

    //**1**//
    public func upload_progress(
        number_id: Nat, 
        id: Text, 
        value: [Nat8]) : async(){
        Debug.print("upload_with_progress : " # debug_show(number_id));
        temp.put({number_id = number_id; id = id}, {value = value});
    };
    //**2**//
    public func install_wasm(
        count_number: Nat, 
        id: Text,
        name: Text, 
        description: Text, 
        version: Nat, 
        hash_value: [Nat8], 
        text_hash : Text, 
        type_hash : TypeHash) : async Wasm{
            var wasm : Wasm = join_chunks(count_number, id);
            Debug.print("install_wasm : " # debug_show(wasm));
            ignore add_wasm(name, 
                            description, 
                            version, 
                            wasm, 
                            hash_value, 
                            text_hash, 
                            type_hash);
            delete_chunks(count_number,id);
            return wasm;
    };
    func delete_chunks(
        count_number: Nat, 
        id: Text){
        var i: Nat = 0;
        while(i < count_number){
            temp.delete({number_id = i; id = id});
            i := i + 1;
        }
    };
    func join_chunks(
        count_number: Nat, 
        id: Text): [Nat8]{
        var i: Nat = 0;
        var united_chunks : List.List<Nat8>  = List.nil<Nat8>();
        var list_chunks : List.List<Nat8> =List.nil<Nat8>();
        while(i < count_number){
            var chunk = temp.get({number_id = i; id = id});
            switch(chunk){
                case(null) {};
                case(?chunk) {
                   list_chunks := List.fromArray<Nat8>(chunk.value);
                };
            };
            united_chunks := List.append<Nat8>(united_chunks, list_chunks);
            i := i + 1;
        };
        return List.toArray<Nat8>(united_chunks);
    };
    public func add_wasm(
        name: Text, 
        description: Text, 
        version: Nat, 
        wasm : Wasm, 
        hash_value: [Nat8], 
        text_hash : Text, 
        type_hash : TypeHash): async (){
        let (uuid, guid) = await Helpers.random_id16();
        let wi : WasmIdentifier = {
            name = name;
            description = description;  
            version = version;
            uuid = uuid;
            guid = guid;
        };
        let wf : WasmObject = {
            wasm = wasm;
            updated = false;
            file_hash : FileHash = {
                value = hash_value;
                text_hash = text_hash;
                type_hash = type_hash;
            };
        };
        wasm_files.put(
            wi,
            wf
        );
    };
    public func update_wasm(
        name: Text, 
        description: Text, 
        version: Nat, 
        uuid: UUID,
        guid: GUID,
        wasm : Wasm, 
        hash_value: [Nat8], 
        text_hash : Text, 
        type_hash : TypeHash): async ?WasmObject{
        let wi : WasmIdentifier = {
            name = name;
            description = description;  
            version = version;
            uuid = uuid;
            guid = guid;
        };
        let wf : WasmObject = {
            wasm = wasm;
            updated = true;
            file_hash : FileHash = {
                value = hash_value;
                text_hash = text_hash;
                type_hash = type_hash;
            };
        };
        let wfu : ?WasmObject = wasm_files.replace(
            wi,
            wf
        );
        return wfu;
    };
    public func remove_wasm( 
        name: Text, 
        description: Text, 
        version: Nat): async ?WasmObject{
        let key : WasmIdentifier = {
            name = name;
            description = "";  
            version = version;
            uuid = [];
            guid = "";
        };
        let wf : ?WasmObject = wasm_files.remove(
            key 
        );
        return wf
    };
    //**Get (wasm)actor**//
    public func read_wasm( 
        name: Text, 
        version: Nat): async Wasm{
        let key : WasmIdentifier = {
            name = name;
            description = "";  
            version = version;
            uuid = [];
            guid = "";
        };
        let wf : ?WasmObject = wasm_files.get(key);
        switch(wf){
            case(null){
                return [];};
            case(?wf){
                return wf.wasm;
            };
        };
    };
     //**Get (wasm)actor**//
    func internal_read_wasm( 
        name: Text, 
        version: Nat): Wasm{
        let key : WasmIdentifier = {
            name = name;
            description = "";  
            version = version;
            uuid = [];
            guid = "";
        };
        let wf : ?WasmObject = wasm_files.get(key);
        switch(wf){
            case(null){
                return [];};
            case(?wf){
                return wf.wasm;
            };
        };
    };
    //**Get (wasm)actor**//
    public func read_wasm_result( 
        name: Text, 
        version: Nat): async Result.Result<Wasm, DescriptionError>{
        let key : WasmIdentifier = {
            name = name; //key
            description = "";  
            version = version;  //key
            uuid = [];
            guid = "";
        };
        let wf : ?WasmObject = wasm_files.get(key);
        switch(wf){
            case(null){
                return #err(#not_include_wasm)};
            case(?wf){
                return #ok(wf.wasm);
            };
        };
    };
    //**Last number vesrion**//
    func last_version(
        name: Text) : ?Nat{
        var number_version: Nat = 0;
        var is_contains: Bool = false;
        for((k,v) in wasm_files.entries()){
            if(Text.equal(name, k.name)){
                is_contains := true;
                if(number_version < k.version){
                    number_version := k.version;
                };
            };
        };
        if(is_contains){
            return ?number_version
        }
        else{
            return null;
        };
    };
    //**Last vesrion (wasm)actor file**//
    public func last_wasm_result(
        name: Text) : async Result.Result<WasmDelivered, DescriptionError>{
        let version = last_version(name);
        Debug.print("last_wasm_result version : " # debug_show(version));

        switch(version){
            case(null){
                return #err(#not_include_wasm);
            };
            case(?version){
                let wasm = internal_read_wasm(name, version);

                if(wasm == []){
                    return #err(#not_include_wasm);
                }
                else{
                    let wd: WasmDelivered = {
                        wasm = wasm;
                        name = name;
                        version = version;
                    };
                    Debug.print("last_wasm_result wasm : " # debug_show(wasm));
                    return #ok(wd);
                };
            };
        };
    };
    public func objects(): async  [CombinedWasmInfo]{
        var values : [var CombinedWasmInfo] = Array.init<CombinedWasmInfo>(wasm_files.size(),
        {
            name = "";          // *FileIdentifier
            description = "";   // *FileIdentifier
            version = 0;       // *FileIdentifier
            uuid: UUID = [0];   // *FileIdentifier
            guid: GUID  = "";     // *FileIdentifier
            updated = false;    // *WasmObject.updated
            value_hash = [0];   // *FileHash.value
            text_hash = "";   //Text - sha text // *FileHash.text_hash
            type_hash = #none; //type: sha kessak // *FileHash.type_hash
        });
        var i = 0;
        for((k,v) in wasm_files.entries()){
            values[i] := 
            {
                name = k.name; 
                description = k.description;
                version = k.version;
                uuid: UUID = k.uuid;  
                guid: GUID  = k.guid;   
                updated = v.updated;   
                value_hash = v.file_hash.value;   
                text_hash = v.file_hash.text_hash;   
                type_hash = v.file_hash.type_hash; 
            };
            i := i + 1;
        };
        return Array.freeze<CombinedWasmInfo>(values);
    };
    //**WASM STORAGE**//

    system func preupgrade(){
        wasm_files_entries := Iter.toArray(wasm_files.entries());
    };

    system func postupgrade(){
        wasm_files_entries := [];
    };
}