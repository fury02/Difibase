import Principal "mo:base/Principal";

import CryptoUtilities "mo:crypto/Utilities";
import SHA256 "mo:crypto/SHA/SHA256";
import Hex "mo:encoding/Hex";

import MainIC "../main-ic";

import Debug "mo:base/Debug";

module{
    type canister_settings = MainIC.canister_settings;
    type definite_canister_settings = MainIC.definite_canister_settings;
 
    public type Canister = {
        name : Text;
        description : Text;
        canister_id : Principal;
        wasm : ?[Nat8];
        wasm_hash : ?[Nat8];    //sha []
        value_hash : ?Text;     //sha text  
    };

    public type CanisterStatus = {
        status : { #running; #stopping; #stopped };
        settings: definite_canister_settings;
        module_hash: ?Blob;
        memory_size: Nat;
        cycles: Nat;
        freezing_threshold: Nat;
    };
}