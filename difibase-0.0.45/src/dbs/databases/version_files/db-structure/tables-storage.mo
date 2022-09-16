import Array "mo:base/Array";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

import H "../../../lib/util/helpers";
import T "tree";
import Types "types";
//**Superstructure over the basis (Tree.mo). In a simple sense, it is a collection of tables,**//
//**columns and keys for processing and storing and receiving data**//
module {
type Tree = T.Tree<Text, Text>;
public class TablesStorage(){
        private let _key: Text = "difibase";
        private let _val: Text = "treeroot";
        private let _parent: ?Tree = null;
        private let _childs = ?List.nil<Tree>();
        private let _level: Nat = 0;
        private let _hm_capacity: Nat = 0;
        private var root_tree: T.Tree<Text, Text> = T.Tree<Text, Text>(_key, _val, _parent, _childs, _level, _hm_capacity, #root, Text.equal, Text.hash);
        // **Creating a new table**//
        private func add_table(
            table_key_name: Text): (Tree , Tree){
            let (instance, table) = T.add_child(table_key_name, table_key_name, #table, root_tree);  
            let trm = add_table_name_root_hm(table_key_name);
            Debug.print("add_table: " # debug_show(table_key_name)); 
            return (instance, table); 
        };
        // **Adds a table to the list of tables of the root object**//
        private func add_table_name_root_hm(
            table_key_name: Text): ?Text{
            var table = T.replace_value(root_tree, table_key_name, table_key_name);        
            return table; 
        };
        // **Delete a table to the list of tables of the root object**//
        private func delete_table_name_root_hm(
            table_key_name: Text){
            var table = T.delete_value(root_tree, table_key_name);        
        };
        //**Get all the keys in the table. A table is an abstraction representing a Tree branch**//
        private func get_table_keys_(
            table: ?Tree) : ?HashMap.HashMap<Text,Text>{
            switch(table){
                case(null){ return null;};
                case(?table){
                    return ?T.get_hashmap(table);
                };
            };
        };
        // **Add a new key to the list(hashmap) of table keys**//
        private func add_table_key(
            column: Tree,
            entity_key: Text) : ?Text{          
            let table: ?Tree = T.get_parent(column);
            switch(table){
                case(null){ return null;};
                case(?table){
                    let tv = T.replace_value(table, entity_key, entity_key);
                    return tv;
                };
            };
        };
        //TODO testing
        // **Create a table, column, or both**//               
        private func create_table_and_column(
            table_key: Text, 
            column_key_name: Text): Tree{
            let table: ?Tree = T.find_tree(root_tree, table_key, #table);
            switch(table){
                case(null){
                    let (instance, table) = add_table(table_key);
                    let (table_, column) = T.add_child(column_key_name, column_key_name, #column, table);
                    return column; 
                };
                case(?table){
                    switch(table.typeTree){
                        case(#table){
                            let (table_, column) = T.add_child(column_key_name, column_key_name, #column, table);
                            return column; 
                        };
                        case(#column){
                            let (instance, tn) = add_table(table_key);
                            let (table_, column) = T.add_child(column_key_name, column_key_name, #column, tn);
                            return column; 
                        };
                    };                    
                };
            };
        };
        //**Get the number of existing values by key**//
        private func get_count_real_values(
            table: Tree,
            row_key: Text): Nat{
            var columns: List.List<Tree> = T.get_childs<Text, Text>(table);                
            var count: Nat = 0;
            List.iterate(columns, func(column: Tree) {
                let v: ?Text = T.search_value(column, row_key);                 
                switch(v){
                    case(null){ };
                    case(?v){
                        if(Text.equal(v, "null")){
                        }else{
                            count += 1;
                        };                                   
                    };
                };     
            });
            return count;
        };
        //**Get the root object of the data structure**//
        public func get_instance(): Tree {
            return root_tree;
        };  
        //**Is the key included in this table**//
        public func key_contains(
            table_key: Text,
            row_key: Text): Bool{
            let table: ?Tree = T.find_tree(root_tree, table_key, #table);
            switch(table){
                case(null){ return false; };
                case(?table){
                    let hm = T.get_hashmap(table);
                    let keys_values = hm.entries();
                    for((key, value) in keys_values){
                        if(Text.equal(row_key, key)){
                            return true;
                        };
                    };                  
                };
            };
            return false;
        };
        //**Is the table included in this structure**//
        public func table_contains(
            table_key: Text): Bool{
            var hm = T.get_hashmap(root_tree);  
            if(hm.size() > 0){
                let keys_values = hm.entries();
                for((key, value) in keys_values){
                    if(Text.equal(table_key, key)){
                            return true;
                    };
                };  
            };
            return false;            
        };
        //**Find a table in the structure**//
        public func get_table(
            table_key: Text): ?Tree{
            let table = T.find_tree(root_tree, table_key, #table);
            return table; 
        };
        //**Get a collection the keys in the table**//
        public func get_collection_table_keys(
            table_key: Text) : [Text]{           
            let table: ?Tree = T.find_tree(root_tree, table_key, #table);
            var i = 0;
            switch(table){
                case(null){};
                case(?table){
                    let hm = T.get_hashmap(table);
                    var a : [var Text] = Array.init(hm.size(), "");
                    for((k,v) in hm.entries()){
                        a[i] := k;
                        i := i + 1;
                    };
                    let fa: [Text] = Array.freeze<Text>(a);//let fa stable
                    return fa;   
                };
            };
            var a : [var Text] = Array.init(0, "");
            let fa: [Text] = Array.freeze<Text>(a);//let fa stable
            return fa;
        };
        //**Get all the keys in the table(usage for one buckets)**//
        public func get_table_keys(
            table_key: Text) : Text{
            var result = "";
            let sign = "\"";
            let strt = "Key";
            let table: ?Tree = T.find_tree(root_tree, table_key, #table);
            switch(table){
                case(null){ return "{}";};
                case(?table){
                    let hm = T.get_hashmap(table);
                    let keys_values = hm.entries();
                    Iter.iterate<(Text, Text)>(keys_values, func((key, value), _i) {
                        var ck = H.text_concat(sign, sign, key);
                        var concat = H.text_concat(strt, ck, " : ");
                        concat := H.text_concat("{", "}", concat);
                        result := H.text_concat(concat, result, ", ");  

                    });                      
                    result := Text.trimEnd(result, #char ' ');
                    result := Text.trimEnd(result, #char ',');  
                    result := Text.concat("[", result);
                    result := Text.concat(result, "]");
                };
            };
            return result;
        };
        // **Get a collection of tables**//
        public func get_collection_tables(): [Text]{ 
            let hm = T.get_hashmap(root_tree);//let hm non stable
            var a : [var Text] = Array.init(hm.size(), "");
            var i = 0;
            for((k,v) in hm.entries()){
                a[i] := k;
                i := i + 1;
            };
            let fa: [Text] = Array.freeze<Text>(a);//let fa stable
            return fa;                  
        };
        //**Get a list of tables (usage for one buckets)**//
        public func get_tables(): Text{   
            var tables = T.get_hashmap(root_tree); 
            var result = "";
            let sign = "\"";
            let strt = "Table";  
            if(Nat.equal(tables.size(),0)){
                return "{}";
            }else{
            for((k,v) in tables.entries()){
                var ck = H.text_concat(sign, sign, v);
                var concat = H.text_concat(strt, ck, " : ");
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
        //TODO testing
        // **Add a column and/or a table and/or a column and a table. Always creates.**//
        public func replace_table_value(
            table_key: Text, 
            column_key_name: Text, 
            entity_key: Text, 
            entity_value: Text): ?Text{
            let tr: ?Tree = T.find_tree(root_tree, table_key, #indefinite);

            switch(tr){
                case(null){
                    let column = create_table_and_column(table_key, column_key_name); 
                    let tv = add_table_key(column, entity_key);             
                    let v = T.replace_value(column, entity_key, entity_value);
                    return v;
                };
                case(?tr){
                    switch(tr.typeTree){
                        case(#table){
                            var column = T.get_child<Text, Text>(tr, column_key_name);
                            switch(column){
                                case(null){
                                    let (table_, column_) = T.add_child(column_key_name, column_key_name, #column, tr); //Create column
                                    let v = T.replace_value(column_, entity_key, entity_value);                     
                                    let tv = add_table_key(column_, entity_key);
                                    return v;
                                };
                                case(?column){
                                    let v = T.replace_value(column, entity_key, entity_value);
                                    let tv = add_table_key(column, entity_key);
                                    return v;
                                };
                            };
                        };
                        case(#column){
                            let (instance, table) = add_table(table_key);
                            let (table_, column) = T.add_child(column_key_name, column_key_name, #column, table);
                            let tv = add_table_key(column, entity_key);
                            let v = T.replace_value(column, entity_key, entity_value);
                            return v;
                        };
                    };
                };
            };
            return null; 
        }; 
        //**Get a specific value in the table cells**//
        public func find_table_cell(
            table_key: Text, 
            column_key_name: Text, 
            row_key: Text): Text{
            var result = "";         
            let table: ?Tree = T.find_tree(root_tree, table_key, #table);
            switch(table){
                case(null){ return result; };
                case(?table){
                    var column = T.get_child<Text, Text>(table, column_key_name);
                    switch(column){
                        case(null){
                            return result;
                        };
                        case(?column){
                            let v = T.search_value(column, row_key);
                            switch(v){
                                case(null){return result;};
                                case(?v){return v;};
                            };
                        };
                    };
                };
            };
            return result; 
        };
        //**Get the key values from the table**//
        public func find_table_entity(
            table_key: Text, 
            row_key: Text): Text{              
            let table: ?Tree = T.find_tree(root_tree, table_key, #table);
            let sign = "\"";
            var result = "";
            switch(table){
                case(null){
                    return result;
                    };
                case(?table){
                    var columns: List.List<Tree> = T.get_childs<Text, Text>(table);
                    if(List.isNil(columns)){
                        return result;
                    }else{
                        List.iterate(columns, func(column: Tree) {
                            let v: ?Text = T.search_value(column, row_key);

                            switch(v){
                                case(null){
                                    var concat = H.text_concat(sign, sign, column.value);
                                    concat := H.text_concat(concat, "\"null\"", " : ");                   
                                    result := H.text_concat(concat, result, ", ");
                                };
                                case(?v){
                                    var ck = H.text_concat(sign, sign, column.value);
                                    var cv = H.text_concat(sign, sign, v);
                                    var concat = H.text_concat(ck, cv, " : ");
                                    result := H.text_concat(concat, result, ", ");
                                };
                            };     
                        });
                        result := Text.trimEnd(result, #char ' ');
                        result := Text.trimEnd(result, #char ',');  
                        result := Text.concat("{", result);
                        result := Text.concat(result, "}");
                        return result;
                    };
                };
            };
            return result; 
        };
        //**Get collection entities the data from the table**//
        public func get_collection_table_entityes(
            table_key: Text): [Text]{             
            let table: ?Tree = T.find_tree(root_tree, table_key, #table);
            let sign = "\"";
            var result = "";
            var a : [var Text] = Array.init(0, "");
            let fa: [Text] = Array.freeze<Text>(a);//let fa stable
            switch(table){
                case(null){ return fa; };
                case(?table){
                    var columns: List.List<Tree> = T.get_childs<Text, Text>(table);
                    if(List.isNil(columns)){
                        return fa;
                    }else{
                        let hm = T.get_hashmap(table);
                        let kv = hm.entries();
                        a := Array.init(hm.size(), "");
                        var i = 0;
                        Iter.iterate<(Text, Text)>(kv, func((key, value), _i) {                         
                            var temp = "";         
                            var concat = H.text_concat(sign, sign, "Key");
                            temp := H.text_concat(sign, sign, key);
                            concat := H.text_concat(concat, temp, " : "); 
                            temp := Text.concat(concat, ", ");                                     
                            List.iterate(columns, func(column: Tree) {
                            let v: ?Text = T.search_value(column, key);
                                switch(v){
                                    case(null){                                      
                                        var concat = H.text_concat(sign, sign, column.value);
                                        concat := H.text_concat(concat, "\"null\"", " : "); 
                                        temp := H.text_concat(concat, temp, ", ");
                                    };
                                    case(?v){
                                        var ck = H.text_concat(sign, sign, column.value);
                                        var cv = H.text_concat(sign, sign, v);
                                        var concat = H.text_concat(ck, cv, " : ");
                                        temp := H.text_concat(concat, temp, ", ");
                                    };
                                };
                            });                      
                            temp := Text.trimEnd(temp, #char ' ');
                            temp := Text.trimEnd(temp, #char ',');
                            temp := Text.concat("{", temp);
                            temp := Text.concat(temp, "}");
                            a[i] := temp;
                            i := i + 1;
                            
                        });
                        let fa_: [Text] = Array.freeze<Text>(a);//let fa stable
                        return fa_;
                    };
                };
            };
            return fa; 
        };
        //**Get all the data from the table(usage for one buckets)**//
        public func get_table_entityes(
            table_key: Text): Text{             
            let table: ?Tree = T.find_tree(root_tree, table_key, #table);
            let sign = "\"";
            var result = "";
            switch(table){
                case(null){ return result; };
                case(?table){
                    var columns: List.List<Tree> = T.get_childs<Text, Text>(table);
                    if(List.isNil(columns)){
                        return result;
                    }else{
                        let hm = T.get_hashmap(table);
                        let kv = hm.entries();
                        Iter.iterate<(Text, Text)>(kv, func((key, value), _i) {                         
                            var temp = "";   
                            var concat = H.text_concat(sign, sign, "Key");
                            temp := H.text_concat(sign, sign, key);
                            concat := H.text_concat(concat, temp, " : "); 
                            temp := Text.concat(concat, ", ");     
                            List.iterate(columns, func(column: Tree) {
                            let v: ?Text = T.search_value(column, key);
                                switch(v){
                                    case(null){
                                        var concat = H.text_concat(sign, sign, column.value);
                                        concat := H.text_concat(concat, "\"null\"", " : "); 
                                        temp := H.text_concat(concat, temp, ", ");
                                    };
                                    case(?v){
                                        var ck = H.text_concat(sign, sign, column.value);
                                        var cv = H.text_concat(sign, sign, v);
                                        var concat = H.text_concat(ck, cv, " : ");
                                        temp := H.text_concat(concat, temp, ", ");
                                    };
                                };
                            });                      
                            temp := Text.trimEnd(temp, #char ' ');
                            temp := Text.trimEnd(temp, #char ',');
                            temp := Text.concat("{", temp);
                            temp := Text.concat(temp, "}, ");
                            result := Text.concat(result, temp);
                        });
                        result := Text.trimEnd(result, #char ' ');
                        result := Text.trimEnd(result, #char ','); 
                        result := Text.concat("[", result);
                        result := Text.concat(result, "]");
                        return result;
                    };
                };
            };
            return result; 
        };
        //**Delete a specific value in table cells**//
        public func delete_table_cell_value(
            table_key: Text, 
            column_key_name: Text, 
            row_key: Text): Bool{
            let table: ?Tree = T.find_tree(root_tree, table_key, #table);
            switch(table){
                case(null){ return false; };
                case(?table){
                    var column = T.get_child<Text, Text>(table, column_key_name);
                    switch(column){
                        case(null){ return false; };
                        case(?column){
                            var real_v: Nat = get_count_real_values(table, row_key);
                            if(real_v > 1){
                                let v = T.delete_value(column, row_key);
                                switch(v){
                                    case(null){ return false};
                                    case(?v){ return true};
                                };                             
                            }else{
                                let v = T.delete_value(column, row_key);
                                let vt = T.delete_value(table, row_key);
                                switch(v){
                                    case(null){ return false};
                                    case(?v){ return true};
                                };
                            };
                        };
                    };
                };
            };
            return false; 
        };
        //**Delete a key value from the table (Row)**//
        public func delete_table_entity(
            table_key: Text, 
            row_key: Text): Bool{      
            let table: ?Tree = T.find_tree(root_tree, table_key, #table);
            var bl: Bool = false;
            switch(table){
                case(null){
                    return bl;
                };
                case(?table){
                    var columns: List.List<Tree> = T.get_childs<Text, Text>(table);
                    if(List.isNil(columns)){
                        return bl;
                    }else{
                        List.iterate(columns, func(column: Tree) {
                            let v = T.delete_value(column, row_key);
                            switch(v){
                                case(null){};
                                case(?v){ bl := true;};
                            };
                        });
                        let vt = T.delete_value(table, row_key); //**Deleting keys from the table**////**Удаление из таблицы ключей**//              
                    };
                }; 
            };
            return bl;
        };
        //**Delete table clear all related data**//
        public func delete_table(
            table_key: Text): Bool{
            let (table, bl) = clear_table(table_key);
            switch(table, bl){
                case(null, false) {return false;};
                case(?table, false) {return false;};
                case(?table, true) {
                    let trp = T.get_parent(table);
                    switch(trp){
                        case(null) {return false;};
                        case(?trp) { //**root**//
                            T.delete_tree_child<Text, Text>(trp, table);
                            delete_table_name_root_hm(table.key);
                            return true;
                        };
                    };
                };
            };
            return false;
        };
        //**Delete column clear all related data**//
        public func delete_column(
            table_key: Text,
            column_key: Text): Bool{
            let (table, column, bl) = clear_column(table_key, column_key);
            switch(table, column, bl){
                case(null, null, false) {return false;};
                case(?table, null, false) {return false;};
                case(?table, ?column, false) {return false;};
                case(?table, ?column, true) {
                    T.delete_tree_child<Text, Text>(table, column);
                    return true;    
                };
            };
            return false;
        };
        //**Clear the table**//
        public func clear_table(
            table_key: Text): (?Tree, Bool){
            let table: ?Tree = T.find_tree(root_tree, table_key, #table);
            var bl: Bool = false;
            switch(table){
                case(null){ return (table, bl); };
                case(?table){
                    assert(table.key != _key and table.value != _val);
                    var columns: List.List<Tree> = T.get_childs<Text, Text>(table);
                    if(List.isNil(columns)){
                        return (?table, bl);
                    }else{
                        List.iterate(columns, func(column: Tree) {
                            let v = T.clear_hashmap(column);
                        }); 
                        T.clear_hashmap(table); 
                        bl := true;              
                    };
                }; 
            };
            return (table, bl);
        };
        //**Clear the column**//
        public func clear_column(
            table_key: Text,
            column_key: Text): (?Tree, ?Tree, Bool){
            var c: ?Tree = null;   
            let table: ?Tree = T.find_tree(root_tree, table_key, #table);
            var bl: Bool = false;
            switch(table){
                case(null){ return (table, c, bl); };
                case(?table){
                    assert(table.key != _key and table.value != _val);
                    var columns: List.List<Tree> = T.get_childs<Text, Text>(table);
                    if(List.isNil(columns)){
                        return (?table, c, bl);
                    }else{
                        List.iterate(columns, func(column: Tree) {
                            if(Text.equal(column.key, column_key)){
                                c := ?column;
                                let v = T.clear_hashmap(column);
                                bl := true;     
                            };           
                        });            
                    };
                }; 
            };
            return (table, c, bl);
        };
    };
};