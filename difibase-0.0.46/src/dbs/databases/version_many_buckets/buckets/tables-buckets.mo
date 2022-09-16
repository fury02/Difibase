import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Nat "mo:base/Nat";
import Prim "mo:prim";
import Text "mo:base/Text";

// import UUID "mo:uuid/UUID";

import S "../db-structure/tables-storage";
import UUID "../../../lib/uuid/UUID";
 
// shared({caller = owner}) actor class TablesBucket(benefit : shared () -> async ()) = this{
shared({caller = owner}) actor class TablesBucket() = this{
    
    let TS = S.TablesStorage();
   
    private let cyclesCapacity: Nat = 3_100_000_000_000;
    var cyclesSavings: Nat = 0;

    //**Size bucket**//
    public func get_rts_memory_size(): async Nat {  
        return Prim.rts_memory_size();
    };
    //**COMMON**//  
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
    //**ADD OR UPDATE**//  
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
     //**FIND**//
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
    //json//
    public func get_table_entityes(
        table_key: Text): async Text{
        let v = TS.get_table_entityes(
            table_key: Text);
        return v;
    };
    //collection//
    public func get_collection_table_entityes(
        table_key: Text): async [Text]{
        let v = TS.get_collection_table_entityes(
            table_key: Text);
        return v;
    };
    //json//
    public func get_tables(): async Text{
        let v = TS.get_tables();
        return v;
    }; 
    //collection//
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
    //**DELETE**//
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
    //**CLEAR**//
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
    //**Manager cycles**//
    // public func deposit() : async() {
    //   let amount = ExperimentalCycles.available();
    //   let limit : Nat = cyclesCapacity - cyclesSavings;
    //   let acceptable =
    //       if (amount <= limit) amount
    //       else limit;     
    //   let accepted = ExperimentalCycles.accept(acceptable);
    //   assert (accepted == acceptable);
    //   cyclesSavings += acceptable;
    // };
    // public shared(msg) func withdraw(amount : Nat) : async () {
    //   assert (msg.caller == owner);
    //   assert (amount <= cyclesSavings);
    //   ExperimentalCycles.add(amount);
    //   await benefit();
    //   let refund = ExperimentalCycles.refunded();
    //   cyclesSavings -= amount - refund;
    // };
}