import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

import Types "../types";

module {
    type UserIdentifier = Types.UserIdentifier;
	public func equal(ui : UserIdentifier, ui2 : UserIdentifier): Bool{
        return Principal.equal(ui.user_principal, ui2.user_principal) and Text.equal(ui.description, ui2.description);
    };
	public func hash(ui : UserIdentifier): Hash.Hash{ 
        return Text.hash(Text.concat(Principal.toText(ui.user_principal), ui.description));
	};
};
