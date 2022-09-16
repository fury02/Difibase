import Blob "mo:base/Blob";
import Bool "mo:base/Bool";
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
import Error "mo:base/Error";
import Result "mo:base/Result";

import Types "../../../types";
import AsyncSource "../../../lib/uuid/async/SourceV4";
import CRC "../../../lib/checksum/crc/crc8";
import FUID "../../../lib/uuid/FUID";
import FilesStorage "files-storage";
import GUID "../../../lib/uuid/GUID";
import JSON "../../../lib/json/JSON";
import UUID "../../../lib/uuid/UUID";

module{
   public class FilesEssence(){

     type UUID = UUID.UUID;
     type GUID = GUID.GUID;
     type FUID = FUID.FUID;
     type FileInfo = Types.FileInfo;
     type FileBlob = Types.FileBlob;
     type FileUploadError = Types.FileUploadError;
     type FileDownloadError = Types.FileDownloadError;
     
     private let Parser = JSON.Parser();
     private let ASS = AsyncSource.Source();
     private let DBFS = FilesStorage.FilesStorage<FUID, FileBlob>(FUID.equal, FUID.hash);
     private let initialSizeBucket: Nat = 196_608; //192 Kb;
     private var realCanisterSize: Nat = 0 + initialSizeBucket;
      
     //**Size buckets, count chunks**//
     public func get_rts_memory_size(): async Nat {
        return Prim.rts_memory_size();
     };
     public func count_chunks(): async Nat{
          return DBFS.files.size();
     };
     //**(realCanisterSize; bytesSpase; bytesTotal; increment_canister_size; decrement_canister_size; fileBlob)**//
     //**This is an attempt to control the actual value of the occupied memory with **//
     //**some accuracy. It is possible to add recalculation functions for all FUIDs. Since Prim.rts_memory_size loses its**//
     //**meaning when deleting files and overwriting**//
     public func get_realtime_memory_size(): async Nat{
          return realCanisterSize;
     };
     func increment_canister_size(sizeBytes: Nat){
          realCanisterSize += sizeBytes;
     };
     func decrement_canister_size(sizeBytes: Nat){
          realCanisterSize -= sizeBytes;
     };
     //**For external calls, transmitting identifiers**//
     public func guid_to_uuid(guid: GUID): async (uuid: UUID){ return GUID.toUUID(guid); };
     public func uuid_to_guid(uuid: UUID): async (guid: GUID){ return UUID.toGUID(uuid); };
     //**Ping bucket**//
     public func ping() : async Text { return "conected."; };
     //**BLOCKCHAIN UPLOAD PACKETS**//
     //**This is the first download block with information about the total number of download blocks for the file. Should be called before web_upload**//
     //1B (Initial unloading)
     public func create_blob_json(
          chunksCount: Nat, 
          bindKey: Text,
          bindTable: Text,
          typeFile: Text, 
          nameFile: Text,
          bytesTotal: Nat): async Blob{
          let hm = HashMap.HashMap<Text, JSON.JSON>(5, Text.equal, Text.hash);
          hm.put("ChunksCount", #Digit(chunksCount));
          hm.put("BindKey", #String(bindKey));
          hm.put("BindTable", #String(bindTable));
          hm.put("TypeFile", #String(typeFile));
          hm.put("NameFile", #String(nameFile));
          hm.put("BytesTotal", #Digit(bytesTotal));
          let json = JSON.show(#Object(hm));
          let blob_json = Text.encodeUtf8(json);
          return blob_json;
     };
     //1.2B
     public func set_blob_file_info(blob_json: Blob): 
                    async (uuid: UUID, guid: GUID){
          let uuid = await ASS.new();
          let guid = UUID.toGUID(uuid);
          let fuid = {NumberID = 0; UUID = uuid;};

          let ba = Blob.toArray(blob_json);
          let lba = List.fromArray<Nat8>(ba);
          let size_blob_json = List.size(lba);
          increment_canister_size(size_blob_json);
          Debug.print(
                " DEBUG: set_blob_file_info : " # debug_show(
               //  " this canister : ", Principal.fromActor(this),
                " fuid : ", fuid,
                " blob_json : ", blob_json,
                " size_blob_json : ", size_blob_json));

          let fblob: FileBlob = {BytesBlob = blob_json; BytesSpase = size_blob_json};
          set(fuid, fblob);

          return (uuid, guid);
     };
     //1A (Initial unloading)
     public func set_file_info(
          chunksCount: Nat, 
          bindKey: Text,
          bindTable: Text,
          typeFile: Text, 
          nameFile: Text,
          bytesTotal: Nat): async (uuid: UUID, guid: GUID){       

          //**We create a json string from the incoming parameters, convert it to a blob and write it as a byte object**//
          let hm = HashMap.HashMap<Text, JSON.JSON>(5, Text.equal, Text.hash);
          hm.put("ChunksCount", #Digit(chunksCount));
          hm.put("BindKey", #String(bindKey));
          hm.put("BindTable", #String(bindTable));
          hm.put("TypeFile", #String(typeFile));
          hm.put("NameFile", #String(nameFile));
          hm.put("BytesTotal", #Digit(bytesTotal));
          let json = JSON.show(#Object(hm));
          let blob_json = Text.encodeUtf8(json);
          
          let uuid = await ASS.new();
          let guid = UUID.toGUID(uuid);
          let fuid = {NumberID = 0; UUID = uuid;};

          //**Real Canister Size**//
          let ba = Blob.toArray(blob_json);
          let lba = List.fromArray<Nat8>(ba);
          let size_blob_json = List.size(lba);
          increment_canister_size(size_blob_json);
          Debug.print(
                " DEBUG: set_file_info : " # debug_show(
                " fuid : ", fuid,
                " json : ", json,
                " blob_json : ", blob_json,
                " size_blob_json : ", size_blob_json));

          let fblob: FileBlob = {BytesBlob = blob_json; BytesSpase = size_blob_json};
          set(fuid, fblob);

          return (uuid, guid);
     };
      //1.2A or 1.3B Based unloading
     public func upload_chunks_crc_result(
          blob: Blob, 
          uuid: UUID,        
          numberId: Nat,
          sizeChunk: Nat, 
          crc_front: Nat): async Result.Result<(UUID, Bool), FileUploadError> {
          try{
               var crc_check: Bool = false;
               let fuid = {NumberID = numberId; UUID = uuid;};
               var crc_back = await CRC.crc8(Blob.toArray(blob));
               //**It will record only if there is a match**//
               if(Nat8.toNat(crc_back) == crc_front){  
                    //**Real Canister Size**//
                    increment_canister_size(sizeChunk);
                    crc_check := true;
                    let fblob: FileBlob = {BytesBlob = blob; BytesSpase = sizeChunk};

                    set(fuid, fblob);
                    Debug.print(
                         "DEBUG: files-essence.mo upload_chunks_crc_result(): " # debug_show(
                    "uuid : ", uuid));
                    return #ok(uuid, crc_check);
               }
               else{
                    return #err(#crc_invalid);
               };
          } 
          catch e{
               return #err(#abort_upload);
          }   
           
     };
     //1.2A or 1.3B Based unloading without crc check
     public func upload_chunks_result(
          blob: Blob, 
          uuid: UUID,        
          numberId: Nat,
          sizeChunk: Nat): async Result.Result<UUID, FileUploadError> {
          try{
               //real canister size
               increment_canister_size(sizeChunk);
               let fuid = {NumberID = numberId; UUID = uuid;};
               let fblob: FileBlob = {BytesBlob = blob; BytesSpase = sizeChunk};
               
               set(fuid, fblob);

               Debug.print(
                "DEBUG: files-essence.mo upload_chunks_result(): " # debug_show(
                "uuid : ", uuid));

               return #ok(uuid);
          } 
          catch e{
               return #err(#abort_upload);
          }    
     };
     //1.2A or 1.3B Based unloading
     public func upload_chunks_crc(
          blob: Blob, 
          uuid: UUID,        
          numberId: Nat,
          sizeChunk: Nat, 
          crc_front: Nat): async (uuid: UUID, crc_check: Bool) {
          var crc_check: Bool = false;
          let fuid = {NumberID = numberId; UUID = uuid;};
          var crc_back = await CRC.crc8(Blob.toArray(blob));
          //**It will record only if there is a match**//
          if(Nat8.toNat(crc_back) == crc_front){  
                //**Real Canister Size**//
                increment_canister_size(sizeChunk);
                crc_check := true;
                let fblob: FileBlob = {BytesBlob = blob; BytesSpase = sizeChunk};

                set(fuid, fblob);
               Debug.print(
               "DEBUG: files-essence.mo upload_chunks_crc(): " # debug_show(
               "uuid : ", uuid));
          };
          return (uuid, crc_check);
     };
     //1.2A or 1.3B Based unloading without crc check
     public func upload_chunks(
          blob: Blob, 
          uuid: UUID,        
          numberId: Nat,
          sizeChunk: Nat): async UUID {
               //real canister size
               increment_canister_size(sizeChunk);
               let fuid = {NumberID = numberId; UUID = uuid;};
               let fblob: FileBlob = {BytesBlob = blob; BytesSpase = sizeChunk};
               
               set(fuid, fblob);

               Debug.print(
                "DEBUG: files-essence.mo upload_chunks(): " # debug_show(
                "uuid : ", uuid));

                return uuid;
     };
     //**BLOCKCHAIN DOWNLOAD PACKETS**//
     //**This is the first block of loading from the blockchain with information about the total number. Should be called before web_download**//
     //**1**// Initial loading
     public func get_file_info(
          uuid: UUID): async (chunksCount: Nat, bindKey: Text, bindTable: Text, typeFile: Text, nameFile: Text, bytesTotal: Nat){
          var fi = { var ChunksCount = 0; var BindKey = ""; var BindTable = ""; var TypeFile = ""; var NameFile = ""; var BytesTotal = 0;};
          let fuid = {NumberID = 0; UUID = uuid;};
          //**Blob type (json)**//
          let fblob: ?FileBlob = await get(fuid); 
          switch(fblob){
               case(null) {return (fi.ChunksCount, fi.BindKey, fi.BindTable, fi.TypeFile, fi.NameFile, fi.BytesTotal);};
               case(?fblob) {
                     //**Text type (json)**//
                    let blob: Blob = fblob.BytesBlob;
                    let json = Text.decodeUtf8(blob);
                    switch(json){
                         case(null) { return (fi.ChunksCount, fi.BindKey, fi.BindTable, fi.TypeFile, fi.NameFile, fi.BytesTotal);};
                         case(?json) { 
                              //**Parse text type json**//
                          
                              var psj = Parser.parse(json);         

                              switch (psj) {
                                   case (null) {  };
                                   case (?v) {
                                        switch (v) {
                                             case (#Object(v)) {

                                                  switch(v.get("TypeFile")) {
                                                       case(?v) {
                                                            switch(v) {
                                                                 case (#String(v)) {
                                                                      fi.TypeFile := v;
                                                                      // Debug.print("TypeFile:" #debug_show(v));                                        
                                                                 };
                                                                 case (_) {  };
                                                            };
                                                       };
                                                       case (_) {  };
                                                  };

                                                  switch(v.get("BindKey")) {
                                                       case(?v) {
                                                            switch(v) {
                                                                 case (#String(v)) {
                                                                      fi.BindKey := v;
                                                                      // Debug.print("BindKey:" #debug_show(v));
                                                                 };
                                                                 case (_) {  };
                                                            };
                                                       };
                                                       case (_) {  };
                                                  };

                                                  switch(v.get("BindTable")) {
                                                       case(?v) {
                                                            switch(v) {
                                                                 case (#String(v)) {
                                                                      fi.BindTable := v;
                                                                      // Debug.print("BindTable:" #debug_show(v));
                                                                 };
                                                                 case (_) {  };
                                                            };
                                                       };
                                                       case (_) {  };
                                                  };

                                                  switch(v.get("ChunksCount")) {
                                                       case(?v) {
                                                            switch(v) {
                                                                 case (#Digit(v)) {
                                                                      fi.ChunksCount := v;
                                                                      // Debug.print("ChunksCount:" #debug_show(v));                                       
                                                                 };
                                                                 case (_) {  };
                                                            };
                                                       };
                                                       case (_) {  };
                                                  };

                                                  switch(v.get("NameFile")) {
                                                       case(?v) {
                                                            switch(v) {
                                                                 case (#String(v)) {
                                                                      fi.NameFile := v;
                                                                      // Debug.print("NameFile:" #debug_show(v));                                        
                                                                 };
                                                                 case (_) {  };
                                                            };
                                                       };
                                                       case (_) {  };
                                                  };

                                                  switch(v.get("BytesTotal")) {
                                                       case(?v) {
                                                            switch(v) {
                                                                 case (#Digit(v)) {
                                                                      fi.BytesTotal := v;
                                                                      // Debug.print("BytesTotal:" #debug_show(v));                                       
                                                                 };
                                                                 case (_) {  };
                                                            };
                                                       };
                                                       case (_) {  };
                                                  };
                                      
                                             };
                                             case (_) {   };
                                        };
                                   };
                              };
      
                              return (fi.ChunksCount, fi.BindKey, fi.BindTable, fi.TypeFile, fi.NameFile, fi.BytesTotal);
                         };
                    };
               };
          };
     };
     //**2-1**// Based loading
     public func download_chunks(
          uuid: UUID, 
          numberID: Nat): async (blob: ?Blob) {
          let fuid = {NumberID = numberID; UUID = uuid;};
          let fblob = await get(fuid); 
          switch(fblob){
               case(null) {return null;};
               case(?fblob) {return ?fblob.BytesBlob;};
          };
     };
     //**BLOCKCHAIN DELETE FILE**//
     public func delete_file(uuid: UUID): async Bool{
          let (fs, fbk, fbt, ft, fn, fts) = await get_file_info(uuid);
          var isDelete = false;
           
          if(fts > 0){ decrement_canister_size(fts); };

          var ni = 0;
          while(fs >= ni){
               let fuid = {NumberID = ni; UUID = uuid;};
               isDelete := true;
               await delete(fuid);
               // if(ni == fs){ isDelete := true; }; //TODO
               ni += 1;
          };
          return isDelete;
     };
     //**GRUD**//
     public func get(fuid: FUID): async ?FileBlob { return DBFS.files.get(fuid); };
     public func set(fuid: FUID, fblob: FileBlob){ DBFS.files.put(fuid, fblob); };
     public func delete(fuid: FUID): async(){ DBFS.files.delete(fuid);};
     //**Guid-Uuid-Fuid Present**//
     public func isGuidPresent(guid: GUID) : async Bool{
          var uuid: UUID = GUID.toUUID(guid);
          for(k in DBFS.files.keys()){
               if(UUID.equal(k.UUID, uuid)){
                    return true;
               };
          };
          return false;
     };
     public func isUuidPresent(uuid: UUID) : async Bool{
          for(k in DBFS.files.keys()){
               if(UUID.equal(k.UUID, uuid)){
                    return true;
               };
          };
          return false;
     };
     public func isFuidPresent(fuid: FUID): async Bool{
          for(k in DBFS.files.keys()){
               if(FUID.equal(k, fuid)){
                    return true;
               };
          };
          return false;
     };
     //print chunks
     public func print_keys_chunks(){
          for(k in DBFS.files.keys()){
               Debug.print("keys: " #debug_show(k.UUID, UUID.toGUID(k.UUID)));
               };
          };  
     }
}