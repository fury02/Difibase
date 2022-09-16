import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Result "mo:base/Result";
import Text "mo:base/Text";

import Hex "mo:encoding/Hex";

import UUID "UUID";
//**Extended file identifier for storing defragmented binary files**//
module {
    type UUID = UUID.UUID;
    
    public type FUID = {
        NumberID : Nat;
        UUID : UUID;
    };

	public func equal(fuid : FUID, fuid2 : FUID): Bool{
        return UUID.equal(fuid.UUID, fuid2.UUID) and Nat.equal(fuid.NumberID, fuid2.NumberID);
    };

	public func hash(fuid : FUID): Hash.Hash{
        return Nat32.add(UUID.hash(fuid.UUID), Nat32.fromNat(fuid.NumberID));
    };
};
