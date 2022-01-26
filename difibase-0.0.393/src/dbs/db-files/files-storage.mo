import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import TrieMap "mo:base/TrieMap";

module {
    public class FilesStorage<K, V>(
        _equal : (K, K) -> Bool,       
        _hash : (K) -> Hash.Hash
    ){
        public var files = TrieMap.TrieMap<K, V>(_equal, _hash);     
    };
 };