import Array "mo:base/Array";
import Debug "mo:base/Debug";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Prim "mo:prim";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Blob "mo:base/Blob";

import CRC "../../lib/checksum/crc/crc8";
import JSON "../../lib/json/JSON";
import TB "buckets/tables-buckets";
import GUID "../../lib/uuid/GUID";
import FUID "../../lib/uuid/FUID";
import UUID "../../lib/uuid/UUID";
import FB "buckets/files-buckets";
import FilesStorage "db-files/files-storage";
import H "../../lib/util/helpers";

import Types "../../types";
import Interfaces "../../interfaces";
import Const "../../const";

// shared ({caller = owner}) actor class DF_SERVICE() = this {
shared ({caller = owner}) actor class DF_SERVICE() = this {
    type canister_settings = Types.canister_settings;

    type IIC = Interfaces.IInternetComputer;
    // type ILedger  = Interfaces.ILedger ;

    let actor_ic : IIC = actor(Const.canister_ic);
    // let ledger : ILedger = actor(Const.canister_nns_ledger);

    //**FILES**//
    //**TYPES**//
    public type UUID = UUID.UUID;
    public type GUID = GUID.GUID;
    public type FUID = FUID.FUID;
    public type FileInfo = {
          ChunksSize : Nat;
          TypeFile: Text;
          NameFile: Text;
    };
    //**COMMON**//
    //**PARAMETRS**//
    private let initialSizeBucket: Nat = 196_608; //192 Kb;
    private var cyclesSavings: Nat = 0;//cycles  
    private let cyclesCapacity: Nat = 5_000_000_000_000;//cycles  
    //**Chunk-Size for web request 64Kb**//
    //**Do big chunks create consensus problems???**//TODO
    // private let maxFilesBuckets: Nat = 100;//Error!!! no more than 15 buckets on service
    private let maxFilesBuckets: Nat = 15;//no more than 15 buckets on service
    private let freezingThresholdFiles = 504000; // 7 day
    private let sumCreatingFiles = 200_000_000_000; //cycles
    private let sumFirstFiles = 3_000_000_000_000; //cycles  
    // private let computeAllocationFiles = 25; //25%
    private let computeAllocationFiles = 5; //5%
    private let freeSpaceBucketMemory = 10_485_760; // 10 Mb;
    private let minWritableSpace = 10_240; //10 Kb;
    //**Work*//
    // private let bytesMemoryAllocation = 536_870_912; //512 Mb;
    // private let bytesMemoryAllocation = 1_048_576; //1 Mb
    // private let bytesMemoryAllocation = 4_294_967_296; //4 Gb
    // private let bytesMemoryAllocation = 6_442_450_944; //6 Gb
    // private let memoryAllocation = bytesMemoryAllocation + initialSizeBucket + freeSpaceBucketMemory; //(xxx) Mb + 192 Kb + 10 Mb; 
    //**Test*//
    private let bytesMemoryAllocation = 10485760; //10 Mb
    private let memoryAllocation = bytesMemoryAllocation + initialSizeBucket + freeSpaceBucketMemory; // (xxx) Mb + 192 Kb + 10 Mb;    
    private flexible var files_buckets : [var ?FB.FilesBucket] = Array.init(maxFilesBuckets, null);
    //**TABLES**//
    //**PARAMETRS**//
    private let maxTablesBuckets: Nat = 15;
    private let freezingThresholdTables = 504000; // 7 day
    private var cyclesSavingsTables: Nat = 0;//cycles  
    private let sumCreatingTables = 200_000_000_000; //cycles
    private let sumFirstTables = 3_000_000_000_000; //cycles  
    // private let computeAllocationTables = 25; //25%
    private let computeAllocationTables = 5; //5%
    private let memoryAllocationTables = 536870912; //512 Mb 
    private let freeSpaceBucketMemoryTables = 10_485_760; // 10 Mb
    private let aliasKey = "Key";
    private let aliasTable = "Table";
    private let aliasFileTableBindGuid = "Guid-uuid";
    private flexible var tables_buckets : [var ?TB.TablesBucket] = Array.init(maxTablesBuckets, null);

    //**https://github.com/InternetIdentityLabs/react-ic-ii-auth**//
    let admin = owner;
    // Return the principal identifier of the wallet canister that installed this
    // canister.
    public query func installer() : async Principal { return owner; };
    // Return the principal identifier of the caller of this method.
    public shared (message) func whoami() : async Principal { return message.caller; };
    // Return the principal identifier of this canister.
    public func id() : async Principal { return await whoami(); };

    //**FILES**//
    //**Sizes*//
    public func get_real_canister_size() {  }; //TODO
    public func get_real_canisters_size(){  }; //TODO
    //**For external calls, transmitting identifiers**//
    public func guid_to_uuid(guid: GUID): async (uuid: UUID){ return GUID.toUUID(guid); };
    public func uuid_to_guid(uuid: UUID): async (guid: GUID){ return UUID.toGUID(uuid); };
    public func getVersion(): async Text {
        return "Database Instance version 0.0.31 (DBS)";
    };
    //**UPLOAD IN IC**//
    //**1**//
    public func set_file_info(
      chunksSize: Nat, 
      bindKey: Text,
      bindTable: Text,
      typeFile: Text, 
      nameFile: Text,
      bytesTotal: Nat): async (uuid: UUID, guid: GUID){        
        let fb: ?FB.FilesBucket = await get_bucket_files(minWritableSpace);
        switch(fb){
          case(?fb){ 
              Debug.print(" Debug: set_file_info() "# debug_show(
              " SET info new file : ", 
              " chunksSize : ", chunksSize, 
              " bindKey : ", bindKey,
              " bindTable : ", bindTable,
              " typeFile : ", typeFile, 
              " nameFile : ", nameFile,
              " bytesTotal : ", bytesTotal,
              " canister : ", Principal.fromActor(fb))); 
            let (uuid, guid) = await fb.set_file_info(chunksSize, bindKey, bindTable, typeFile, nameFile, bytesTotal);
            //we add data to the table about the downloaded file and link it
            let bind_table = await this.replace_value(bindTable, aliasFileTableBindGuid, bindKey, guid);
            return (uuid, guid);
            };
          case(null){ return ([],"");};
        };
     };
    //**2-1**//Based unloading
    public func upload_chunks_crc(
      blob: Blob, 
      uuid: UUID, 
      numberId: Nat,
      writableSpace: Nat,
      crc_front: Nat): async (uuid: UUID, crc_check: Bool) {
        let fb: ?FB.FilesBucket = await get_bucket_files(writableSpace);
        switch(fb){
          case(?fb){ 
            Debug.print(" Debug: upload_crc() "# debug_show(
              " UUID : ", uuid, 
              " writableSpace : ", writableSpace, 
              " numberId : ", numberId,
              " canister : ", Principal.fromActor(fb))); 
            return await fb.upload_chunks_crc(blob, uuid, numberId, writableSpace, crc_front);
          };
          case(null){ return ([],false);};
        };
    };
    //**2-2**//
    public func upload_chunks(
      blob: Blob, 
      uuid: UUID, 
      numberId: Nat,
      writableSpace: Nat): async UUID {
        let fb: ?FB.FilesBucket = await get_bucket_files(writableSpace);
        switch(fb){
          case(?fb){ 
            Debug.print(" Debug: external_upload() "# debug_show(
              " UUID : ", uuid, 
              " writableSpace : ", writableSpace, 
              " numberId : ", numberId,
              " canister : ", Principal.fromActor(fb))); 
            return await fb.upload_chunks(blob, uuid, numberId, writableSpace);
            };
          case(null){ return [];};
        };
    };
    //**FILES**//
    //**DOWNLOAD WITH IC**//
    //**1**//
    public func get_file_info(uuid: UUID): async (chunksSize: Nat, bindKey: Text, bindTable: Text, typeFile: Text, nameFile: Text, totalBytes: Nat){
        for(fb: ?FB.FilesBucket in files_buckets.vals()){
          switch(fb){
            case(null) { };
            case(?fb){ 

              let (fs, fbk, fbt, ft, fn, fts) = await fb.get_file_info(uuid);
              if(fs > 0 and fts > 0){
                Debug.print(" Debug: get_file_info() "# debug_show(
                  " chunksSize : ", fs, 
                  " bindKey : ", fbk,
                  " bindTable : ", fbt,
                  " typeFile : ", ft, 
                  " nameFile : ", fn,
                  " totalBytes : ", fts,
                  " canister : ", Principal.fromActor(fb))); 
                return (fs, fbk, fbt, ft, fn, fts);
              };
            };
          };       
        };
        return (0, "", "", "", "", 0);
    };
    //**2-1**//
    public func download_chunks(
      uuid: UUID, 
      numberId: Nat): async (blob: ?Blob) {
        for(fb: ?FB.FilesBucket in files_buckets.vals()){
          switch(fb){
            case(null) { };
            case(?fb){ 
              let blob: ?Blob = await fb.download_chunks(uuid, numberId);
              if(blob != null){
                Debug.print(" Debug: external_download() "# debug_show(
                  " UUID : ", uuid, 
                  " numberId : ", numberId,
                  " canister : ", Principal.fromActor(fb))); 
                return blob;
              };

            };
          };       
        };
        return null;
    };
    //**FILES**//
    //**DELETE IN IC**//
    public func delete_file(uuid: UUID): async Bool{
        var isDelete = false;
        for(fb: ?FB.FilesBucket in files_buckets.vals()){
          switch(fb){
            case(null) { };
            case(?fb){ 
              Debug.print(" Debug: external_delete_file() "# debug_show(
                  " UUID : ", uuid, 
                  " canister : ", Principal.fromActor(fb)));
              isDelete := await fb.delete_file(uuid);
            };
          };       
        };
        return isDelete;
    };
    //**FILES**//
    //**Bucket operation**// 
    //**Create and set settings for bucket**// 
    private func create_bucket_files(): async ?FB.FilesBucket{
      let fb: FB.FilesBucket = await FB.FilesBucket();
      let p: Principal = Principal.fromActor(fb);
      await set_settings_files(p);
      return ?fb;

    };
    //**Cycles support - bucket operation**//
    // private func create_bucket_files(): async ?FB.FilesBucket{
    //   ExperimentalCycles.add(sumFirstFiles+sumCreatingFiles);
    //   let fb: FB.FilesBucket = await FB.FilesBucket(this.credit);
    //   await fb.deposit(); //deposit 
    //   let p: Principal = Principal.fromActor(fb);
    //   await set_settings_files(p);
    //   return ?fb;
    // };
    //**FILES**//
    //**Get bucket and/or create bucket**// 
    private func get_bucket_files(space: Nat): async ?FB.FilesBucket {
      for(fb: ?FB.FilesBucket in files_buckets.vals()){
          switch(fb){
            case(null) {
              let bc: ?FB.FilesBucket = await create_bucket_files();
              let r = add_bucket_files(bc);
              Debug.print("service: get_bucket_files() add_bucket:" # debug_show("ADD new bucket"));
              switch(r){
                case(false){return null};
                case(true){return bc};
              };
            };
            case(?fb){
              let size_b = await fb.get_rts_memory_size();
              let realtime_size_b = await fb.get_realtime_memory_size();
              Debug.print(
                "service: get_bucket_files() info:" # debug_show(
                "principal:", Principal.fromActor(fb),
                "size bucket:", size_b,
                "realtime_size", realtime_size_b,
                "writable_space_for_chunks", space,
                "size_b + freeSpaceBucketMemory + space", size_b + freeSpaceBucketMemory + space,
                "memoryAllocation", memoryAllocation));

              // if(size_b + freeSpaceBucketMemory <  memoryAllocation) { return ?fb;};//Free balance = freeSpaceBucketMemory

              if(size_b + freeSpaceBucketMemory + space <  memoryAllocation) { 
                Debug.print("RETURN OPPORTUNE BUCKET :" # debug_show(Principal.fromActor(fb)));
                return ?fb;};//Free balance = freeSpaceBucketMemory
          };
        };       
      };
      return null;
    };
    //**FILES**//
    //**Add new bucket in collections files_buckets**//
    private func add_bucket_files(bn: ?FB.FilesBucket): Bool{
      var i = 0;
      for(fb in files_buckets.vals()){   
        switch(fb){
            case(null) {
              files_buckets[i] := bn;
              return true;
            };
            case(?fb){
              i += 1;
          };
        };
      };
      return false;
    };
    //**FILES**//
    //**Print**//
    public func print_buckets_files(): async(){
        for(fb in files_buckets.vals()){
            switch(fb){
                case(null){ 
                  // Debug.print("bucket:" # debug_show("null"));
                };
                case(?fb){  
                    Debug.print("bucket used:" # debug_show(Principal.fromActor(fb), "size: ", await fb.get_rts_memory_size()));
                };
            };
        };
    };
    //**Set settings for actor**//
    private func set_settings_files(canister_id: Principal) : async(){
      let settings: canister_settings = { 
                controllers = ?[owner, Principal.fromActor(this)];
                compute_allocation = ?computeAllocationFiles;
                memory_allocation = ?memoryAllocation;  
                freezing_threshold = ?freezingThresholdFiles };
      // Debug.print("service:, set_settings() settings:" # debug_show(settings));
      await actor_ic.update_settings({canister_id : Principal; settings : canister_settings;});
    };
 

    //**TABLES**//
    //**ADD OR UPDATE**//
    public func replace_value(
      table_key: Text, 
      column_key_name: Text, 
      entity_key: Text, 
      entity_value: Text): async ?Text{  

          Debug.print("replace_value:" # debug_show(
            "table_key : ", table_key, 
            "column_key_name : ", column_key_name, 
            "entity_key : ", entity_key, 
            "entity_value : ", entity_value));

          let (bc, _) = await get_bucket_key_contains(table_key, entity_key);
          switch(bc){
            case(null){
              let tb: ?TB.TablesBucket = await get_bucket_tables();
              switch(tb){
                case(?tb){ return await tb.replace_value(table_key, column_key_name, entity_key, entity_value);};
                case(null){ return null;};
              };
            };
            case(?bc){ return await bc.replace_value(table_key, column_key_name, entity_key, entity_value);};
          }; 
    };
    //**TABLES**//
    //**FIND**//
    public func find_table_cell(
      table_key: Text, 
      column_key_name: Text, 
      entity_key: Text): async Text{
        var result = "null";
        let (bc, _) = await get_bucket_key_contains(table_key, entity_key);
        switch(bc){
          case(null){
            return result;
          };
          case(?bc){
            let v = await bc.find_table_cell(table_key, column_key_name, entity_key);
            return v;
          };
        }; 
    };
    public func find_table_value(
      table_key: Text, 
      entity_key: Text): async Text{
        let (bc, _) = await get_bucket_key_contains(table_key, entity_key);
        switch(bc){
          case(null){
            return "{}";
          };
          case(?bc){
            let v = await bc.find_table_value(table_key, entity_key);
            return v;
          };
        }; 
    };
    //**TABLES**//
    //collection//
    public func get_table_entityes(
      table_key: Text): async [Text]{
      let l: List.List<TB.TablesBucket> = await get_buckets_table_contains(table_key);
      var hm = HashMap.HashMap<Text,Text>(0, Text.equal, Text.hash);
      var a : [var Text] = Array.init(0, "");
      let fa: [Text] = Array.freeze<Text>(a); 
      if(List.isNil(l)){
        return fa;
      }
      else{
        let vl: [TB.TablesBucket] = List.toArray<TB.TablesBucket>(l);
        for(b in vl.vals()){
          let c = await b.get_collection_table_entityes(table_key);
            for(v in c.vals()){
              var inc = hm.size() + 1; 
              let r = hm.replace(Nat.toText(inc), v);
          };
        };
        if(Nat.equal(hm.size(),0)){
          return fa;
        }else{
          var i = 0;
          a := Array.init(hm.size(), "");
          for((k,v) in hm.entries()){
            a[i] := v;
            i := i + 1;
          };
          let fa_: [Text] = Array.freeze<Text>(a); 
          return fa_;
        };
      };  
      return fa;
    };
    //**TABLES**//
    //json//
    public func get_table_entityes_json(
      table_key: Text): async Text{
      let l: List.List<TB.TablesBucket> = await get_buckets_table_contains(table_key);
      var result = "";
      if(List.isNil(l)){
        return "[{}]";
      }
      else{
        let a: [TB.TablesBucket] = List.toArray<TB.TablesBucket>(l);
        for(b in a.vals()){
          let c = await b.get_collection_table_entityes(table_key);
            for(v in c.vals()){
              result := H.text_concat(v, result, ", ");  
            };
        };
        result := Text.trimEnd(result, #char ' ');
        result := Text.trimEnd(result, #char ','); 
        result := Text.concat("[", result);
        result := Text.concat(result, "]");
      };  
      return result;
    };
    //**TABLES**//
    //collection//
    public func get_table_keys(
      table_key: Text): async [Text]{
        let l: List.List<TB.TablesBucket> = await get_buckets_table_contains(table_key);
        var hm = HashMap.HashMap<Text,Text>(0, Text.equal, Text.hash);
        var a : [var Text] = Array.init(0, "");
        let fa: [Text] = Array.freeze<Text>(a); 
        if(List.isNil(l)){
            return fa;
        }
        else{
            let vl: [TB.TablesBucket] = List.toArray<TB.TablesBucket>(l);
            for(b in vl.vals()){
                let c = await b.get_collection_table_keys(table_key);
                for(k in c.vals()){
                    let i = hm.replace(k, k);
                };
            };
            if(Nat.equal(hm.size(),0)){
              return fa;
            }else{
              var i = 0;
              a := Array.init(hm.size(), "");
              for((k,v) in hm.entries()){
                a[i] := k;
                i := i + 1;
              };
              let fa_: [Text] = Array.freeze<Text>(a); 
              return fa_;
            };
        };  
    };
    //**TABLES**//
    //json//
    public func get_table_keys_json(
      table_key: Text): async Text{
        var result = "";
        let sign = "\"";
        let l: List.List<TB.TablesBucket> = await get_buckets_table_contains(table_key);
        if(List.isNil(l)){
            return "[{}]";
        }
        else{
            let a: [TB.TablesBucket] = List.toArray<TB.TablesBucket>(l);
            for(b in a.vals()){
                let c = await b.get_collection_table_keys(table_key);
                for(v in c.vals()){
                    var ck = H.text_concat(sign, sign, v);
                    var concat = H.text_concat(aliasKey, ck, " : ");
                    concat := H.text_concat("{", "}", concat);
                    result := H.text_concat(concat, result, ", ");  
                };
            };
          result := Text.trimEnd(result, #char ' ');
          result := Text.trimEnd(result, #char ',');  
          result := Text.concat("[", result);
          result := Text.concat(result, "]");  
        };  
        return result;
    };
    //**TABLES**//
    //collection//
    public func get_tables(): async [Text]{
        var hm = HashMap.HashMap<Text,Text>(0, Text.equal, Text.hash);
        var a : [var Text] = Array.init(0, "");
        let fa: [Text] = Array.freeze<Text>(a); 
        for(b in tables_buckets.vals()){
            switch(b){
                case(null){};
                case(?b){
                    let c = await b.get_collection_tables();
                    for(k in c.vals()){
                        let i = hm.replace(k, k);
                    };
                };
            };
        };
        if(Nat.equal(hm.size(),0)){
            return fa;
        }else{
            var i = 0;
            a := Array.init(hm.size(), "");
            for((k,v) in hm.entries()){
                a[i] := k;
                i := i + 1;
            };
            let fa_: [Text] = Array.freeze<Text>(a); 
            return fa_;
        }; 
    };
    //**TABLES**//
    //json//
    public func get_tables_json(): async Text{
        var hm = HashMap.HashMap<Text,Text>(0, Text.equal, Text.hash);
        var result = "";
        let sign = "\"";
        for(b in tables_buckets.vals()){
            switch(b){
                case(null){};
                case(?b){
                    let a = await b.get_collection_tables();
                    for(k in a.vals()){
                        let i = hm.replace(k, k);
                    };
                };
            };
        };
        if(Nat.equal(hm.size(),0)){
                return "[{}]";
        }else{
            for((k,v) in hm.entries()){
                var ck = H.text_concat(sign, sign, v);
                var concat = H.text_concat(aliasTable, ck, " : ");
                concat := H.text_concat("{", "}", concat);
                result := H.text_concat(concat, result, ", "); 
            };
            result := Text.trimEnd(result, #char ' ');
            result := Text.trimEnd(result, #char ',');  
            result := Text.concat("[", result);
            result := Text.concat(result, "]");
            return result;
        }; 
    };
    //**TABLES**//
    //**DELETE**//
    public func delete_table_cell_value(
      table_key: Text, 
      column_key_name: Text, 
      entity_key: Text): async Bool{
        let (b, _) = await get_bucket_key_contains(table_key, entity_key);
        switch(b){
            case(null){
                return false;
            };
            case(?b){
                let v = await b.delete_table_cell_value(table_key, column_key_name, entity_key);
                return v;
            };
        };
    };
    public func delete_table_entity(
      table_key: Text, 
      entity_key: Text): async Bool{
        let (b, _) = await get_bucket_key_contains(table_key, entity_key);
        switch(b){
            case(null){
                return false;
            };
            case(?b){
                let v = await b.delete_table_entity(table_key, entity_key);
                return v;
            };
        };
    };
    public func delete_table(
      table_key: Text): async Bool{
        let l: List.List<TB.TablesBucket> = await get_buckets_table_contains(table_key);
        var bl = false;
        if(List.isNil(l)){
            return false;
        }
        else{
            let a: [TB.TablesBucket] = List.toArray<TB.TablesBucket>(l);
            for(b in a.vals()){
                bl := true;
                var r = await b.delete_table(table_key);
            };
        };  
        return bl; 
    };
    public func delete_column(
      table_key: Text,
      column_key_name: Text): async Bool{
        let l: List.List<TB.TablesBucket> = await get_buckets_table_contains(table_key);
        var bl = false;
        if(List.isNil(l)){
            return false;
        }
        else{
            let a: [TB.TablesBucket] = List.toArray<TB.TablesBucket>(l);
            for(b in a.vals()){
                bl := await b.delete_column(table_key, column_key_name);
            };
        };  
        return bl; 
    };
    //**TABLES**//
    //**CLEAR**//
    public func clear_table(
      table_key: Text): async Bool{
        let l: List.List<TB.TablesBucket> = await get_buckets_table_contains(table_key);
        var bl = false;
        if(List.isNil(l)){
            return false;
        }
        else{
            let a: [TB.TablesBucket] = List.toArray<TB.TablesBucket>(l);
            for(b in a.vals()){
              bl := await b.clear_table(table_key);
            };
        };  
        return bl; 
    };
    public func clear_column(
      table_key: Text,
      column_key_name: Text): async Bool{
        let l: List.List<TB.TablesBucket> = await get_buckets_table_contains(table_key);
        var bl = false;
        if(List.isNil(l)){
            return false;
        }
        else{
            let a: [TB.TablesBucket] = List.toArray<TB.TablesBucket>(l);
            for(b in a.vals()){
              bl := await b.clear_column(table_key, column_key_name);
            };
        };  
        return bl; 
    };
    //**TABLES**//
    //**OTHER**//
    public func exist_table(
        table_key: Text): async Bool{
        let l: List.List<TB.TablesBucket> = await get_buckets_table_contains(table_key);
        if(List.isNil(l)){
          return false;
        }
        else{
          return true;
        };  
    };
    //**TABLES**//
    //**Bucket operation**// 
    //**Create and set settings for bucket**// 
    private func create_bucket_tables(): async ?TB.TablesBucket{
      let b: TB.TablesBucket = await TB.TablesBucket();
      let p: Principal = Principal.fromActor(b);
      await set_settings_tables(p);
      return ?b;
    };
    //**Cycles support - bucket operation**//
    // private func create_bucket_tables(): async ?TB.TablesBucket{
    //   ExperimentalCycles.add(sumFirstTables+sumCreatingTables);
    //   let b: TB.TablesBucket = await TB.TablesBucket(this.credit);
    //   await b.deposit(); //deposit 
    //   let p: Principal = Principal.fromActor(b);
    //   await set_settings_tables(p);
    //   return ?b;
    // };
    //**Get bucket and/or create bucket**// 
    private func get_bucket_tables(): async ?TB.TablesBucket {
      for(b: ?TB.TablesBucket in tables_buckets.vals()){
          switch(b){
            case(null) {
              let bc: ?TB.TablesBucket = await create_bucket_tables();
              let r = add_bucket_tables(bc);
              switch(r){
                case(false){return null};
                case(true){return bc};
              };
            };
            case(?b){
              let size_b = await b.get_rts_memory_size();
              Debug.print("service: get_bucket_tables() info:" # debug_show(
                  "principal:", Principal.fromActor(b), 
                  "size bucket:", size_b));
              if(size_b + freeSpaceBucketMemoryTables <  memoryAllocationTables)//Free balance = freeSpaceBucketMemoryTables
              { return ?b;};
          };
        };       
      };
      return null;
    };
    //**We get a bucket if there is a key there**// 
    private func get_bucket_key_contains(
      table_key: Text,
      entity_key: Text): async (?TB.TablesBucket, Bool) {
      for(b: ?TB.TablesBucket in tables_buckets.vals()){
          switch(b){
            case(null){ };
            case(?b){       
              let kc: Bool = await b.key_contains(table_key, entity_key);
              if(kc){
                return (?b, true);
              };
            };
          };       
        };
      return (null, false);
    };
    //**We get a tables_buckets if there is a given table there**// 
    private func get_buckets_table_contains(
      table_key: Text): async List.List<TB.TablesBucket>{
        var l : List.List<TB.TablesBucket> = List.nil<TB.TablesBucket>();
        for(b: ?TB.TablesBucket in tables_buckets.vals()){
          switch(b){
            case(null){ };
            case(?b){       
              let kc: Bool = await b.table_contains(table_key);
              if(kc){
                 l := List.push<TB.TablesBucket>(b, l); 
              };
            };
          };       
        };
        return l;
    };
    //**Add new bucket in collections tables_buckets**//
    private func add_bucket_tables(bn: ?TB.TablesBucket): Bool{
      var i = 0;
      for(b in tables_buckets.vals()){   
        switch(b){
            case(null) {
              tables_buckets[i] := bn;
              return true;
            };
            case(?b){
              i += 1;
          };
        };
      };
      return false;
    };
    //**Print buckets tables**//
    public func print_buckets_tables(): async(){
        for(b in tables_buckets.vals()){
            switch(b){
                case(null){ Debug.print("bucket:" # debug_show("null")); };
                case(?b){  
                    Debug.print("bucket:" # debug_show(Principal.fromActor(b), "size: ", await b.get_rts_memory_size()));
                };
            };
        };
    };
    //**TABLES**//
    //**Set settings for actor**//
    private func set_settings_tables(canister_id: Principal) : async(){
      let settings: canister_settings = { 
                controllers = ?[owner, Principal.fromActor(this)];
                compute_allocation = ?computeAllocationTables;
                memory_allocation = ?memoryAllocationTables;  
                freezing_threshold = ?freezingThresholdTables };
      // Debug.print("service:, set_settings_tables() settings:" # debug_show(settings));
      await actor_ic.update_settings({canister_id : Principal; settings : canister_settings;});
    };
    //**TABLES**//
    //**WEB UI**//
    public func ui_service_canister_id(): async Text{
      let p = Principal.fromActor(this);
      let t = Principal.toText(p);
      return t;
    };
    public func ui_service_max_buckets(): async Text{
      let r = Nat.toText(maxTablesBuckets);
      return r;
    };
    public func ui_service_freezing_threshold(): async Text{
      let r = Nat.toText(freezingThresholdTables);
      return r;
    };
    public func ui_service_compute_allocation(): async Text{
      let r = Nat.toText(computeAllocationTables);
      return r;
    };
    public func ui_service_memory_allocation(): async Text{
      let r = Nat.toText(memoryAllocationTables);
      return r;
    };
    public func ui_service_generated_buckets(): async Text{
      var i = 0;
      for(b in tables_buckets.vals()){
            switch(b){
                case(null){};
                case(?b){ i := i + 1; };
            };
      };
      let r = Nat.toText(i);
      return r;
    };
    public func ui_service_using_memory_size(): async Text{
      var i: Nat = 0;
      for(b in tables_buckets.vals()){
            switch(b){
                case(null){};
                case(?b){ 
                  var sm: Nat = await b.get_rts_memory_size();
                  i := i + sm;
                };
            };
      };
      let r = Nat.toText(i);
      return r;
    };
    public func ui_service_created_tables(): async Text{
      var i = 0;
      var tables = await get_tables();
      for(t in tables.vals()){
            i := i + 1;          
      };
      let r = Nat.toText(i);
      return r;
    };


    //**COMMON**//
    //**Size service**//
    public func get_rts_memory_size(): async Nat { return Prim.rts_memory_size(); };
    //**Ping service**//
    public func ping() : async Text {  return "conected."; };
    //**Manager cycles**//
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
    public func credit() : async () {
      let available = ExperimentalCycles.available();
      let accepted = ExperimentalCycles.accept(available);
      assert (accepted == available);
    };
    //**COMMON**//
    //**Cycles**//
    public func cycles_savings(): async Nat{
      return cyclesSavings;
    };
    public func cycles_available(): async Nat{
      return ExperimentalCycles.available();
    };
    public func cycles_balance(): async Nat{
      return ExperimentalCycles.balance();
    };
    //**COMMON**//
    
    //**SETTINGS**//
    //**Update settings for actor**//
    // public shared(msg) func update_settings(id: Text) : async(){
    //   assert (msg.caller == owner);
    //   let settings: canister_settings = { 
    //             controllers = ?[owner, Principal.fromActor(this)];
    //             compute_allocation = ?computeAllocationTables;
    //             memory_allocation = ?memoryAllocationTables;  
    //             freezing_threshold = ?freezingThresholdTables };
    //   Debug.print("service:, update_settings() settings:" # debug_show(settings));
    //   let canister_id = Principal.fromText(id);
    //   await IC.update_settings({canister_id: Principal; settings : canister_settings;});
    // };
    //**Добавление второго принципала(критичная операция)**//
    public shared(msg) func add_service_second_controller(id_principal: Text) : async(){
      assert (msg.caller == owner);
      let settings: canister_settings = { 
                controllers = ?[owner, Principal.fromActor(this), Principal.fromText(id_principal)];
                // compute_allocation = ?computeAllocationTables;
                // memory_allocation = ?memoryAllocationTables;  
                // freezing_threshold = ?freezingThresholdTables };
                compute_allocation = null;
                memory_allocation = null;  
                freezing_threshold = null };
      Debug.print("service:, add_service_second_controller() settings:" # debug_show(settings));
      let canister_id = Principal.fromActor(this);
      await actor_ic.update_settings({canister_id: Principal; settings : canister_settings;});
    };
    //**Удаление второго принципала(критичная операция)**//
    public shared(msg) func clear_service_second_controller(id_principal: Text) : async(){
      assert (msg.caller == owner);
      let settings: canister_settings = { 
                controllers = ?[Principal.fromText(id_principal), Principal.fromActor(this)];
                // compute_allocation = ?computeAllocationTables;
                // memory_allocation = ?memoryAllocationTables;  
                // freezing_threshold = ?freezingThresholdTables };
                compute_allocation = null;
                memory_allocation = null;  
                freezing_threshold = null };
      Debug.print("service:, clear_service_second_controller() settings:" # debug_show(settings));
      let canister_id = Principal.fromActor(this);
      await actor_ic.update_settings({canister_id: Principal; settings : canister_settings;});
    };




    //Удалить ->

    //**Status**//
    // public func canister_status(id: Text): async canister_status_type{
    //     let canister_id: canister_id = Principal.fromText(id);
    //     return await actor_ic.canister_status({canister_id: canister_id});
    // };
    // //**Types for actor "aaaaa-aa"**//
    // public type canister_id = Principal;
    // public type canister_settings = {
    //     freezing_threshold : ?Nat;
    //     controllers : ?[Principal];
    //     memory_allocation : ?Nat;
    //     compute_allocation : ?Nat;
    // };
    // public type definite_canister_settings = {
    //     freezing_threshold : Nat;
    //     controllers : [Principal];
    //     memory_allocation : Nat;
    //     compute_allocation : Nat;
    // };
    // public type wasm_module = [Nat8];
    // public type canister_status_type = {
    //   status : { #stopped; #stopping; #running };
    //   memory_size : Nat;
    //   cycles : Nat;
    //   settings : definite_canister_settings;
    //   module_hash : ?[Nat8];
    // };
  

    // //**Actor "aaaaa-aa"**//
    // let IC = actor "aaaaa-aa" : actor {
    // canister_status : shared { canister_id : canister_id } -> async {
    //   status : { #stopped; #stopping; #running };
    //   memory_size : Nat;
    //   cycles : Nat;
    //   settings : definite_canister_settings;
    //   module_hash : ?[Nat8];
    // };
    // create_canister : shared {} -> async {
    //   canister_id : canister_id;
    // };
    // delete_canister : shared { canister_id : canister_id } -> async ();
    // deposit_cycles : shared { canister_id : canister_id } -> async ();
    // install_code : shared {
    //     arg : [Nat8];
    //     wasm_module : wasm_module;
    //     mode : { #reinstall; #upgrade; #install };
    //     canister_id : canister_id;
    //   } -> async ();
    // provisional_create_canister_with_cycles : shared {
    //     settings : ?canister_settings;
    //     amount : ?Nat;
    //   } -> async { canister_id : canister_id };
    // provisional_top_up_canister : shared {
    //     canister_id : canister_id;
    //     amount : Nat;
    //   } -> async ();
    // raw_rand : shared () -> async [Nat8];
    // start_canister : shared { canister_id : canister_id } -> async ();
    // stop_canister : shared { canister_id : canister_id } -> async ();
    // uninstall_code : shared { canister_id : canister_id } -> async ();
    // update_settings : shared {
    //     canister_id : Principal;
    //     settings : canister_settings;
    //   } -> async ();
    // };
}