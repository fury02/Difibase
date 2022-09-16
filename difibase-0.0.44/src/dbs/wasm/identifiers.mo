import Hash "mo:base/Hash";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

import Types "../types";

module {
    public type WasmIdentifier = Types.FileIdentifier;
    public func equal(wi : WasmIdentifier, wi2 : WasmIdentifier): Bool{
        return Text.equal(wi.name, wi2.name) and Nat.equal(wi.version, wi2.version);
    };
	public func hash(wi : WasmIdentifier): Hash.Hash{ 
        // Nat32.fromNat(wi.version) : Hash.Hash
        return Text.hash(wi.name) + Text.hash(Nat.toText(wi.version));
	};
};
