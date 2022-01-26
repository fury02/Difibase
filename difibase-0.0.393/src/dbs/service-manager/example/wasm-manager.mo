import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import TrieMap "mo:base/TrieMap";
import Blob  "mo:base/Blob";

import MainIC "../../main-ic";
import User "../user-identity";

import WasmActor "wasm-actor";
import Debug "mo:base/Debug";

actor WM{

    type IC = MainIC.IC;
     
    type Wasm = MainIC.wasm_module; //[Nat8]
    type UserIdentity = User.UserIdentity;
    
    type WA = WasmActor.WasmActor;

    let actor_ic : IC = actor("aaaaa-aa");

    stable var service_canisters_entries : [(UserIdentity, Principal)] = [];
    var service_canisters : TrieMap.TrieMap<UserIdentity, Principal> = TrieMap.fromEntries(service_canisters_entries.vals(), User.equal, User.hash);

    public shared({caller}) func deployCanister(wasm : Wasm) : async Principal{
        let canister_id = await createCanisterDefault();
        installWasmBinary(canister_id, wasm);
        putCanisterDefault(canister_id);
        Debug.print("deployCanister: canister_id =" # debug_show(canister_id));
        return canister_id;
    };

    public shared({caller}) func createCanisterDefault() : async Principal{
        let canister_id = (await actor_ic.create_canister({ settings = ?{
            freezing_threshold = null;
            controllers = ?[caller, Principal.fromActor(WM)];
            compute_allocation = null;
            memory_allocation = null;  
        }})).canister_id;

        return canister_id;
    };

    public shared({caller}) func putCanisterDefault(canister_id : Principal){
        let ui: UserIdentity = { consecutive_number = service_canisters.size(); user_principal = getEmptyPrincipal();  instance_id = "" };
        service_canisters.put(ui, canister_id);
    };

    public shared({caller}) func installWasmBinary(canister_id : Principal, wasm : Wasm) {
        ignore actor_ic.install_code({arg = []; wasm_module = wasm; mode = #install; canister_id = canister_id;});
    };

    private func getCanisterFirstOrDefault(): ?Principal{
        let size = service_canisters.size();
        Debug.print("getCanisterFirstOrDefault: size collections =" # debug_show(size));
        if(size > 0){
            let ui: UserIdentity = { consecutive_number = 0; user_principal = getEmptyPrincipal();  instance_id = "" };
            let canister_default = service_canisters.get(ui);
            return canister_default;
        }
        else{
            return null;
        };
    };

    private func getCanisterLastOrDefault(): ?Principal{
        let size = service_canisters.size();
        Debug.print("getCanisterLastOrDefault: size collections =" # debug_show(size));
        if(size > 0){
            let ui: UserIdentity = { consecutive_number = size-1; user_principal = getEmptyPrincipal();  instance_id = "" };
            let canister_default = service_canisters.get(ui);
            return canister_default;
        }
        else{
            return null;
        };
    };

    public func getCanisterVersionFirstOrDefault(): async Text{
        let canister_default = getCanisterFirstOrDefault();
        switch(canister_default){
            case(null){return "null"};
            case(?canister_default){
                let actor_wa: WA = actor(Principal.toText(canister_default));
                let status = await actor_ic.canister_status({ canister_id = canister_default });
                Debug.print("canister status" # debug_show(status));
                let version = await actor_wa.get_version();
                Debug.print("(.wasm) version" # debug_show(version));
                return version;
            };
        };
    };

     public func getCanisterVersionLastOrDefault(): async Text{
        let canister_default = getCanisterLastOrDefault();
        switch(canister_default){
            case(null){return "null"};
            case(?canister_default){
                let actor_wa: WA = actor(Principal.toText(canister_default));
                let version = await actor_wa.get_version();
                return version;
            };
        };
    };

    private func getEmptyBlob(): Blob {
        return Blob.fromArrayMut(Array.init(32, 0 : Nat8));
    };

    private func getEmptyPrincipal(): Principal {
        let blob_empty = getEmptyBlob();
        return Principal.fromBlob(blob_empty);
    };
 
    system func preupgrade(){
        service_canisters_entries := Iter.toArray(service_canisters.entries());
    };

    system func postupgrade(){
        service_canisters_entries := [];
    };

}