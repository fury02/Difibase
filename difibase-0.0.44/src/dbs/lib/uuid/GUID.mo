import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Result "mo:base/Result";
import Text "mo:base/Text";

import Hex "mo:encoding/Hex";

import UUID "UUID";
//**GUID: Text representation version UUID**//
module {
    type UUID = UUID.UUID;
    public type GUID = Text;
    
    // Converts the GUID
	public func toUUID(guid : GUID) : UUID {
        var tr = Text.replace(guid, #text("-"), "");
        switch(Hex.decode(tr)){
            case(#err(e)) {return []};
            case(#ok(an8)) { return an8 };
        };
	};

	public func equal(guid : GUID, guid2 : GUID): Bool = Text.equal(guid, guid2);

	public func hash(guid : GUID): Hash.Hash = Text.hash(guid);

};
