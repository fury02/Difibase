import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import Deque "mo:base/Deque";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Nat "mo:base/Nat";

import Types "types";
//**The basis, the structure of the graph contains the basic operations on it**//
module {
    public class Tree<K, V>( 
        _key : K,
        _value : V, 
        _parent : ?Tree<K, V>,
        _childs : ?List.List<Tree<K, V>>,
        _level : Nat,
        _capacity : Nat,
        _typeTree: Types.TypeTree,
        _equal : (K, K) -> Bool,       
        _hash : (K) -> Hash.Hash){      
            public let equal = _equal;
            public let hash = _hash;  
            public var level: Nat = _level;
            public var key: K = _key;
            public var value: V = _value;
            public var typeTree: Types.TypeTree = _typeTree;
            public var parent: ?Tree<K,V> = _parent;
            public var hm = HashMap.HashMap<K,V>(_capacity, _equal, _hash);
            public var childs = List.nil<Tree<K,V>>();
    };
    public func raise_tree<K, V>(
        key : K, 
        value : V,
        typeTree: Types.TypeTree,
        parent : Tree<K, V>,
        level : Nat): Tree<K, V>{ 
        var tree: Tree<K, V> = 
                Tree<K, V>(key, value, ?parent, null, level, 0, typeTree, parent.equal, parent.hash);    
        return tree;
    };
    public func replace_value<K, V>(
        tree: Tree<K, V>, 
        key: K,
        value: V) : ?V{
            return tree.hm.replace(key, value); 
    };
    public func delete_value<K, V>(
        tree: Tree<K, V>, 
        key: K) : ?V{
            return tree.hm.remove(key);
    };
    public func get_child<K, V>(
        tree: Tree<K, V>, 
        key: K) : ?Tree<K, V>{
            var child = List.find<Tree<K, V>>(tree.childs, func(t: Tree<K, V>) {       
                        return t.equal(t.key, key);         
                    });
            return child; 
    };
    public func get_childs<K, V>(tree: Tree<K, V>): List.List<Tree<K, V>>{ 
        return tree.childs;
    };
    public func get_parent<K, V>(
        tree: Tree<K, V>) : ?Tree<K, V>{
            return tree.parent; 
    };
    public func search_value<K, V>(
        tree: Tree<K, V>, 
        key: K) : ?V{
            return tree.hm.get(key);
    };  
    public func clear_hashmap<K, V>(
        tree: Tree<K, V>){
            tree.hm := HashMap.HashMap<K,V>(0, tree.equal, tree.hash);
    };
    public func get_hashmap<K, V>(
        tree: Tree<K, V>): HashMap.HashMap<K,V>{
           return tree.hm;
    };
    public func delete_tree_child<K, V>(
        tree: Tree<K, V>, 
        child: Tree<K, V>){
        var nch = List.nil<Tree<K,V>>();
        List.iterate(tree.childs, func(t: Tree<K, V>){
            if(t.equal(t.key, child.key)){                   
            }else{
                nch := List.push<Tree<K, V>>(t, nch);
            };
        }); 
        tree.childs := nch;
    };
    public func add_child<K, V>(        
        key: K, 
        value: V,
        typeTree: Types.TypeTree,
        parent : Tree<K, V>): (Tree<K, V>, Tree<K, V>) {
        var child : Tree<K, V> = raise_tree<K, V>(key, value, typeTree, parent, parent.level + 1);
        var childs = parent.childs;
        let b: Bool = List.isNil<Tree<K, V>>(childs);           
        switch(b){
            case(true){
                parent.childs := List.push<Tree<K, V>>(child, List.nil<Tree<K, V>>());   
                return (parent, child);                  
            };
            case(false){
                parent.childs := List.push<Tree<K, V>>(child, childs); 
                return (parent, child); 
            };
        };         
    };
    //**Search for a value in villages return the tree and the value(if any)**//
    public func find_value<K, V>(
        tree: Tree<K, V>, 
        key: K): (?Tree<K, V>, ?V) {
        var i = tree.level;     
        var value: ?V = null;
        loop{
            //**The level search is not optimal (further consider a full crawl)**//
            //**At the moment, a tree with levels 0 and 1 and 2 is assumed**//
            let l = get_trees_level(tree, i);
            if(List.size<Tree<K, V>>(l) == 0){
                return (null, null);
            };
            var _tree: ?Tree<K, V> = List.find<Tree<K, V>>(l, 
                    func(t: Tree<K, V>) {       
                        let v = t.hm.get(key);
                        let b = t.equal(t.key, key);
                        switch(b, v){
                            case(false, null){ return false;};
                            case(false, ?v)  { value := ?v; return true;};
                            case(true, null) { return true;};
                        };          
                    });      
            switch(_tree){
                case(null){};
                case(?_tree){
                    switch(value){
                        //**If null is the value in the tree (the output is all hm), otherwise the value in hm **//   
                        case(null)   { return (?_tree,  null);}; // full hm
                        case(?value) { return (?_tree, ?value);};// value в hm
                    };
                };
            };        
            i := i + 1;
        }
    };
    //**Search for a tree of a given tree by key**//
    public func find_tree<K, V>(
        tree: Tree<K, V>, 
        key_tree: K,
        typeTree: Types.TypeTree): ?Tree<K, V> {
        var i = tree.level;      
        loop{
            let l = get_trees_level(tree, i);
            if(List.size<Tree<K, V>>(l) == 0){
                return null;
            };
            var t: ?Tree<K, V> = null;
            if(typeTree == #indefinite){
                t := List.find<Tree<K, V>>(l, 
                    func(t: Tree<K, V>) {       
                        return t.equal(t.key, key_tree)    
                    });
            }
            else{
                t := List.find<Tree<K, V>>(l, 
                    func(t: Tree<K, V>) {       
                        return t.equal(t.key, key_tree) and (t.typeTree == typeTree);      
                    });
            };
            switch(t){
                case(null){};
                case(?t){
                    return ?t;
                };
            };
            i := i + 1;
        }
    };

    //**Output level trees**//
    public func get_trees_level<K, V>(
        tree: Tree<K, V>,
        level: Nat) : List.List<Tree<K, V>> {
            var deque = Deque.empty<Tree<K, V>>();
            var trees_level = List.nil<Tree<K, V>>();
            deque := Deque.pushFront(deque, tree); 
            loop{   
                if(Deque.isEmpty<Tree<K, V>>(deque)){
                    // Debug.print("break from loop"); 
                    return trees_level;
                } else {
                    // Debug.print("visit");
                    let ?(_deque, t) = Deque.popBack(deque);
                    deque := _deque;
                    if(t.level == level){
                       trees_level := List.push<Tree<K, V>>(t, trees_level);
                    };
                    if(t.level > level){
                        return trees_level;
                    };
                    List.iterate<Tree<K, V>>(t.childs, 
                         func(t: Tree<K, V>) { 
                             deque := Deque.pushFront(deque, t); 
                    });
                };
            };
        return trees_level;
    };
    //**Width traversal**//
    //**( In the future, consider and make it more optimal)**//
    public func tree_traversal_width<K, V>(
        tree: Tree<K, V>){
        var deque = Deque.empty<Tree<K, V>>();
        deque := Deque.pushFront(deque, tree); 
        loop{   
            if(Deque.isEmpty<Tree<K, V>>(deque)){
                // Debug.print("break from loop"); 
                return
            } else {
                let ?(_deque, t) = Deque.popBack(deque);
                deque := _deque;
                // Debug.print("visit");
                List.iterate<Tree<K, V>>(t.childs, 
                    func(t: Tree<K, V>) { 
                        deque := Deque.pushFront(deque, t); 
                });
            };
        };
    };
};