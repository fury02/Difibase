import Hash "mo:base/Hash";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

import Types "../types";

module {
    public type KeyChunk ={
        number_id: Nat;
        id: Text;
    };
    public type ValueChunk = {
        value: [Nat8];
    };
    public func equal(kc : KeyChunk, kc2 : KeyChunk): Bool{
        return Text.equal(kc.id, kc2.id) and Nat.equal(kc.number_id, kc2.number_id);
    };
	public func hash(kc : KeyChunk): Hash.Hash{ 
        // Nat32.fromNat(kc.value) : Hash.Hash
        return Text.hash(kc.id) + Text.hash(Nat.toText(kc.number_id));
	};
     
};
