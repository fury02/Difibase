import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
 
module {

    public type UserInstance = {
        consecutive_number :  Nat;
        user_principal : Principal;
        instance_id : Text;
        canister_id : Principal;
        value_hash : ?Text;
    };

    public type UserIdentity = {
        consecutive_number :  Nat;
        user_principal : Principal;
        instance_id : Text;
    };
 
	public func equal(ui : UserIdentity, ui2 : UserIdentity): Bool{
        return Principal.equal(ui.user_principal, ui2.user_principal) and Nat.equal(ui.consecutive_number, ui2.consecutive_number);
    };

	public func hash(ui : UserIdentity): Hash.Hash{ 
        return Text.hash(Text.concat(Principal.toText(ui.user_principal), Nat.toText(ui.consecutive_number)));
	};
};
