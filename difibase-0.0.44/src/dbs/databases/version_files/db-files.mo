import Array "mo:base/Array";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import Error "mo:base/Error";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Prim "mo:prim";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Result "mo:base/Result";
 
import H "../../lib/util/helpers";
import CRC "../../lib/checksum/crc/crc8";
import JSON "../../lib/json/JSON";
import GUID "../../lib/uuid/GUID";
import FUID "../../lib/uuid/FUID";
import UUID "../../lib/uuid/UUID";

import F "db-files/files-essence";
import S "db-structure/tables-storage";

import Financing "../../financing";

import Types "../../types";
import Interfaces "../../interfaces";
import Const "../../const";

import Debug "mo:base/Debug";

shared ({caller = owner}) actor class DBFILES() = thisDBFILES {
    type canister_settings = Types.canister_settings;
    type ErrorCode = Error.ErrorCode;
    type DescriptionError = Types.DescriptionError;
    type Wasm = Types.Wasm; //[Nat8]
    type UUID = Types.UUID;
    type GUID = Types.GUID;
    type Cycles = Types.Cycles;
    type PrincipalAccounting = Types.PrincipalAccounting;
    type CanisterAccounting = Types.CanisterAccounting; 
    type NotifyTopUpResult = Types.NotifyTopUpResult;
    type TransferNotifyTopUpResult = Types.TransferNotifyTopUpResult;
    type FileInfo = Types.FileInfo;
    type FileBlob = Types.FileBlob;
    type FileUploadError = Types.FileUploadError;
    type FileDownloadError = Types.FileDownloadError;

    type IIC = Interfaces.IInternetComputer;
    let actor_ic : IIC = actor(Const.canister_ic);
 
    let version = Const.db_files_version;
    public query func get_version(): async Text {version;};

    //**size**//
    public func get_rts_memory_size(): async Nat { return Prim.rts_memory_size(); };


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
        try{
            await actor_ic.start_canister({canister_id = canister_id});
            return true;
        }
        catch e { return false; }
    };
    public shared({caller}) func stop_canister(canister_id: Principal) : async Bool{ 
        try{
            await actor_ic.stop_canister({canister_id = canister_id});
            return true;
        }
        catch e { return false; }
    };
    public shared({caller}) func clean_canister(canister_id: Principal, wasm: Wasm) : async Bool{ 
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
        try{
            await actor_ic.delete_canister({canister_id = canister_id});
            return true;
        }
        catch e { return false; }
    };

    //**Financing module**//
    
    //**cycles**//
    public func cycles_available(): async Nat{
      return ExperimentalCycles.available();
    };
    public func cycles_balance(): async Nat{
      return ExperimentalCycles.balance();
    };

    //Variant: External version through cycles and coinage
    private let financing = Financing.Financing();
    //utils
    public func canister_accounting(): async CanisterAccounting {
        return await financing.canister_accounting(Principal.fromActor(thisDBFILES));
    };
    public func accounting(id: Text): async PrincipalAccounting {
        return await financing.accounting_by_id(id);
    };
    public func minting_cycles(icp_amount: Nat): async Cycles { 
        var cycles: Cycles = 0;
        let tn : TransferNotifyTopUpResult = await financing.minting_cycles_here(Principal.fromActor(thisDBFILES), icp_amount);
        let tnn : NotifyTopUpResult = tn.notify_topup_result;
        switch(tnn){
            case(#Err(e)){return cycles;};
            case(#Ok(c)){
                cycles := c;
                return cycles;
            };
        };
        return cycles;
    };

    //**For external calls, transmitting identifiers**//
    public func guid_to_uuid(guid: GUID): async (uuid: UUID){ return GUID.toUUID(guid); };
    public func uuid_to_guid(uuid: UUID): async (guid: GUID){ return UUID.toGUID(uuid); };

    //**Main module**//

    //Files
    private let aliasFileTableBindGuid = "Guid";
    private let FS = F.FilesEssence();

    //upload with ic
    // 1B
    public func create_blob_json(
      chunksSize: Nat, 
      bindKey: Text,
      bindTable: Text,
      typeFile: Text, 
      nameFile: Text,
      bytesTotal: Nat): async Blob {
        return await FS.create_blob_json(chunksSize, bindKey, bindTable, typeFile, nameFile, bytesTotal);
    };
    //1.2B
    public func set_blob_file_info(
        blob_json: Blob,
        bindKey: Text,
        bindTable: Text): async (uuid: UUID, guid: GUID){
        let (uuid, guid) = await FS.set_blob_file_info(blob_json);
        Debug.print(" Debug: set_file_info() "# debug_show(
              "uuid: ", uuid, 
              "guid: ", guid));
        let bind_table = await replace_value(bindTable, aliasFileTableBindGuid, bindKey, guid);
        switch(bind_table ){
          case(null){ return ([],"");};
          case(?bind_table){  return (uuid, guid);  };      
        };
    };
    //1A
    public func set_file_info(
      chunksSize: Nat, 
      bindKey: Text,
      bindTable: Text,
      typeFile: Text, 
      nameFile: Text,
      bytesTotal: Nat): async (uuid: UUID, guid: GUID){        
        let (uuid, guid) = await FS.set_file_info(chunksSize, bindKey, bindTable, typeFile, nameFile, bytesTotal);
         Debug.print(" Debug: set_file_info() "# debug_show(
              "uuid: ", uuid, 
              "guid: ", guid));
        //we add data to the table about the downloaded file and link it
        let bind_table = await replace_value(bindTable, aliasFileTableBindGuid, bindKey, guid);
        switch(bind_table ){
          case(null){ return ([],"");};
          case(?bind_table){  return (uuid, guid);  };      
        };
     };
      //1.2A or 1.3B
    //based unloading
    public func upload_chunks_crc_result(
      blob: Blob, 
      uuid: UUID, 
      numberId: Nat,
      writableSpace: Nat,
      crc_front: Nat): async Result.Result<(UUID, Bool), FileUploadError> {
        return await FS.upload_chunks_crc_result(blob, uuid, numberId, writableSpace, crc_front);
    };
    //1.3
    public func upload_chunks_result(
      blob: Blob, 
      uuid: UUID, 
      numberId: Nat,
      writableSpace: Nat): async Result.Result<UUID, FileUploadError> {
        return await FS.upload_chunks_result(blob, uuid, numberId, writableSpace);
    };
    //1.2A or 1.3B
    //based unloading
    public func upload_chunks_crc(
      blob: Blob, 
      uuid: UUID, 
      numberId: Nat,
      writableSpace: Nat,
      crc_front: Nat): async (uuid: UUID, crc_check: Bool) {
        let (ch_uuid, crc_check) = await FS.upload_chunks_crc(blob, uuid, numberId, writableSpace, crc_front);
        if(crc_check){
           Debug.print(" Debug: upload_chunks_crc() "# debug_show(
              "uuid: ", uuid, 
              "writable_space: ", writableSpace, 
              "numberId: ", numberId));
          return (ch_uuid, crc_check);
        }
        else{
          return ([],false);
        };
    };
    //1.3
    public func upload_chunks(
      blob: Blob, 
      uuid: UUID, 
      numberId: Nat,
      writableSpace: Nat): async UUID {
        let result: UUID = await FS.upload_chunks(blob, uuid, numberId, writableSpace);
        Debug.print(" Debug: upload_chunks() "# debug_show(
              "uuid: ", result));
        return result;
    };
    //download
    //1  
    public func get_file_info_by_uuid(uuid: UUID)
                              : async (
                                chunksSize: Nat, 
                                bindKey: Text, 
                                bindTable: Text, 
                                typeFile: Text, 
                                nameFile: Text, 
                                totalBytes: Nat){
      let (fs, fbk, fbt, ft, fn, fts) = await FS.get_file_info(uuid);
      if(fs > 0 and fts > 0){
          return (fs, fbk, fbt, ft, fn, fts);
      };
      return (0, "", "", "", "", 0);
    };
    //1.2
    public func download_chunks_by_uuid(
      uuid: UUID, 
      numberId: Nat): async (blob: ?Blob) {
        let blob: ?Blob = await FS.download_chunks(uuid, numberId);
        if(blob != null){
            Debug.print(" Debug: download_chunks_by_uuid() "# debug_show(
              "uuid : ", uuid, 
              "numberId : ", numberId)); 
            return blob;
        };
      return null  
    };
    //1
    public func get_file_info_by_guid(guid: GUID)
                              : async (
                                chunksSize: Nat, 
                                bindKey: Text, 
                                bindTable: Text, 
                                typeFile: Text, 
                                nameFile: Text, 
                                totalBytes: Nat){
      let uuid: UUID = GUID.toUUID(guid);
      let (fs, fbk, fbt, ft, fn, fts) = await FS.get_file_info(uuid);
      if(fs > 0 and fts > 0){
          return (fs, fbk, fbt, ft, fn, fts);
      };
      return (0, "", "", "", "", 0);
    };
    //1.2
    public func download_chunks_by_guid(
      guid: GUID, 
      numberId: Nat): async (blob: ?Blob) {
        let uuid: UUID = GUID.toUUID(guid);
        let blob: ?Blob = await FS.download_chunks(uuid, numberId);
        if(blob != null){
            Debug.print(" Debug: download_chunks_by_guid() "# debug_show(
              "uuid : ", uuid, 
              "numberId : ", numberId)); 
            return blob;
        };
      return null  
    };
    //delete in ic
    public func delete_file(uuid: UUID): async Bool{
        return await FS.delete_file(uuid);
    };
 
    //Tables//
    private let aliasKey = "Key";
    private let aliasTable = "Table";
    private let TS = S.TablesStorage();

      public func key_contains(
            table_key: Text,
            row_key: Text): async Bool{               
        let v = TS.key_contains(
            table_key,
            row_key);     
        return v;
    };
    public func table_contains(
            table_key: Text): async Bool{               
        let v = TS.table_contains(
            table_key);     
        return v;
    };
    //add or update   
    public func replace_value(
        table_key: Text, 
        column_key_name: Text, 
        entity_key: Text, 
        entity_value: Text): async ?Text{               
        let v = TS.replace_table_value(
            table_key, 
            column_key_name, 
            entity_key, entity_value);     
        return v;
    };
    public func replace_table_value(
        table_key: Text, 
        column_key_name: Text, 
        entity_key: Text, 
        entity_value: Text): async ?Text{               
        let v = await replace_value(
            table_key, 
            column_key_name, 
            entity_key, 
            entity_value);     
        return v;
    };
    //find 
    public func find_table_cell(
      table_key: Text, 
      column_key_name: Text, 
      entity_key: Text): async Text{
        let v = TS.find_table_cell(
            table_key, 
            column_key_name, 
            entity_key);
        return v; 
    };
    public func find_table_value(
      table_key: Text,  
      entity_key: Text): async Text{          
        let v = TS.find_table_entity(
            table_key, 
            entity_key);
        return v;
    };
    //json 
    public func get_table_entityes(
        table_key: Text): async Text{
        let v = TS.get_table_entityes(
            table_key: Text);
        return v;
    };
    //collection 
    public func get_collection_table_entityes(
        table_key: Text): async [Text]{
        let v = TS.get_collection_table_entityes(
            table_key: Text);
        return v;
    };
    //json 
    public func get_tables(): async Text{
        let v = TS.get_tables();
        return v;
    }; 
    //collection 
    public func get_collection_tables(): async [Text]{
        let v = TS.get_collection_tables();
        return v;
    }; 
    //json//
    public func get_table_keys(
        table_key: Text): async Text{
        let v = TS.get_table_keys(
            table_key: Text);
        return v;
    };
    //collection//
    public func get_collection_table_keys(table_key: Text): async [Text]{
        let v = TS.get_collection_table_keys(table_key);
        return v;
    }; 
    //delete 
    public func delete_table_cell_value(
      table_key: Text, 
      column_key_name: Text, 
      entity_key: Text): async Bool{ 
        let v = TS.delete_table_cell_value(
            table_key, 
            column_key_name, 
            entity_key);
        return v;
    };
    public func delete_table_entity(
            table_key: Text, 
            row_key: Text): async Bool{
        let v = TS.delete_table_entity(
            table_key, 
            row_key);
        return v;
    };
    public func delete_table(
        table_key: Text): async Bool{
        let v = TS.delete_table(table_key); 
        return v;      
    };
    public func delete_column(
        table_key: Text,
        colunm_key: Text): async Bool{
        let v = TS.delete_column(table_key, colunm_key); 
        return v;      
    };
    //clear  
    public func clear_table(
        table_key: Text): async Bool{
        let (_, v) = TS.clear_table(table_key); 
        return v;      
    };
    public func clear_column(
        table_key: Text,
        colunm_key: Text): async Bool{
        let (_, _, v) = TS.clear_column(table_key, colunm_key); 
        return v;      
    };
    public func get_tables_array(): async [Text]{
        var hm = HashMap.HashMap<Text,Text>(0, Text.equal, Text.hash);
        var a : [var Text] = Array.init(0, "");
        let fa: [Text] = Array.freeze<Text>(a); 
        let c = await get_collection_tables();
        for(k in c.vals()){
          let i = hm.replace(k, k);
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
    //json//
    public func get_table_entityes_json(
      table_key: Text): async Text{
      var result = "";
      var i = 0;
      let c = await get_collection_table_entityes(table_key);
      for(v in c.vals()){
        result := H.text_concat(v, result, ", ");  
        i := i + 1;
      };
      if(i == 0){return "[{}]";};
      result := Text.trimEnd(result, #char ' ');
      result := Text.trimEnd(result, #char ','); 
      result := Text.concat("[", result);
      result := Text.concat(result, "]");  
      return result;
    };
  
    //json 
    public func get_table_keys_json(
      table_key: Text): async Text{
        var result = "";
        let sign = "\"";
        var i = 0;
        let c = await get_collection_table_keys(table_key);
        for(v in c.vals()){
          var ck = H.text_concat(sign, sign, v);
          var concat = H.text_concat(aliasKey, ck, " : ");
          concat := H.text_concat("{", "}", concat);
          result := H.text_concat(concat, result, ", "); 
          i := i + 1; 
        };
        if(i == 0){return "[{}]";};
        result := Text.trimEnd(result, #char ' ');
        result := Text.trimEnd(result, #char ',');  
        result := Text.concat("[", result);
        result := Text.concat(result, "]");  
        return result;
    };
    //json 
    public func get_tables_json(): async Text{
        var hm = HashMap.HashMap<Text,Text>(0, Text.equal, Text.hash);
        var result = "";
        let sign = "\"";
        let a = await get_collection_tables();
        Debug.print("get tables json  dbeasy.mo:  " # debug_show(a));
        for(k in a.vals()){
            let i = hm.replace(k, k);
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
}
 