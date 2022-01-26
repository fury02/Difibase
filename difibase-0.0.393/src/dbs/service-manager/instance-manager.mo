import Array "mo:base/Array";
import List "mo:base/List";
import Blob  "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Nat  "mo:base/Nat";
import Nat8  "mo:base/Nat8";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Prim "mo:⛔";
import Error "mo:base/Error";
import Result "mo:base/Result";
import TrieMap "mo:base/TrieMap";
import TrieSet "mo:base/TrieSet";

import MainIC "../main-ic";
import UserCanister "user-canister";
import User "user-identity";

import CryptoUtilities "mo:crypto/Utilities";
import SHA256 "mo:crypto/SHA/SHA256";
import SHA224 "mo:crypto/SHA/SHA224";
import SHA2 "mo:crypto/SHA/SHA2";
import Hex "mo:encoding/Hex";
import Base32 "mo:encoding/Base32";

import WasmActor "example/wasm-actor";
import Interfaces "interfaces";

import Debug "mo:base/Debug";

actor IM{

    type IC = MainIC.IC;
     
    type Wasm = MainIC.wasm_module; //[Nat8]
    type UserIdentity = User.UserIdentity;
    type UserInstance = User.UserInstance;
    type Canister = UserCanister.Canister;
    type CanisterStatus = UserCanister.CanisterStatus;

    let actor_ic : IC = actor("aaaaa-aa");
    public type definite_canister_settings = MainIC.definite_canister_settings;
    
    //**Testing dev**//
    type WA = WasmActor.WasmActor;
    type IWA = Interfaces.WasmActorInterface;
    let dev_my_work_wallet_principal: Text = "mlx7d-nlzwm-jsiyr-txxc2-mlgsf-hafo6-73wnd-du4xx-f2tsd-mjtum-pae";
    //**Testing dev**//

    stable var service_canisters_entries : [(UserIdentity, Canister)] = [];
    var service_canisters : TrieMap.TrieMap<UserIdentity, Canister> = TrieMap.fromEntries(service_canisters_entries.vals(), User.equal, User.hash);

    let empty_principal: Principal = Principal.fromBlob(Blob.fromArrayMut(Array.init(32, 0 : Nat8)));

    private func getSizeUserServiceCanisters(user_principal: Principal): Nat{
        var i = 0;
        for(k : UserIdentity in service_canisters.keys()){         
            if(Principal.equal(user_principal, k.user_principal)){ i += 1;};
        };
        return i;
    };

    private func getConsecutiveNumber(user_principal: Principal): Nat{
        let size = getSizeUserServiceCanisters(user_principal);
        switch(size){
            case(0){return 0;};
            case(_){
                var numbers = Array.init<Nat>(size, 0);
                var i = 0;
                for((k : UserIdentity, v : Canister) in service_canisters.entries()){         
                    if(Principal.equal(user_principal, k.user_principal)){
                        numbers[i] := k.consecutive_number;
                        i += 1;
                    };
                };
                i := 0;
                for(v in numbers.vals()){ 
                    var val = Array.find<Nat>(Array.freeze<Nat>(numbers), func(d: Nat) {return Nat.equal(i, d);});
                    switch(val){
                        case(null){return i;};
                        case(?val){ i += 1;};
                    };
                };
                return i;
            };
        };
        return 0;
    };   


    private func getEmptyBlob(): Blob {
        return Blob.fromArrayMut(Array.init(32, 0 : Nat8));
    };

    private func getEmptyPrincipal(): Principal {
        let blob_empty = getEmptyBlob();
        return Principal.fromBlob(blob_empty);
    };

    private func destroyCanister(canister_id: Principal) : async Bool{ 
        try{
            let isStopped = await stopCanister(canister_id);
            switch(isStopped){
                case(false){ return false; };
                case(true) {
                    await actor_ic.delete_canister({canister_id = canister_id});
                    return true;
                };
            };
        }
        catch e { return false; }
    };

    private func deleteCanisterInColllection(consecutive_number: Nat, user_principal: Principal) : async Bool{ 
        let uin: UserInstance = {consecutive_number = consecutive_number;
            user_principal = user_principal; 
            instance_id = "";
            canister_id = empty_principal;
            value_hash = ?""; };
        let canister : ?Canister = service_canisters.remove(uin);
        switch(canister){
            case(null){ return false; };
            case(?canister) { return true; };
        };
    };

    private func deleteCanister(canister_id: Principal) : async Bool{ 
        try{
            await actor_ic.delete_canister({canister_id = canister_id});
            return true;
        }
        catch e { return false; }
    };

    //** Fast #Install wasm-code **//
    private func fastInstallWasm(
        canister_id : Principal, 
        wasm : Wasm) : async() {
            ignore actor_ic.install_code({arg = []; wasm_module = wasm; mode = #install; canister_id = canister_id;});
    };

    public func getVersion(): async Text {
        return "Instance Manager version 0.0.10";
    };

    public shared({caller}) func getSizeServiceCanisters(): async Nat{
        return service_canisters.size();
    };

    public shared({caller}) func getCanisterStatus(canister_id: Principal): async CanisterStatus{
        return await actor_ic.canister_status({canister_id = canister_id});
    };
 
    public shared({caller}) func deployCanister(
        wasm : Wasm, 
        user_principal: Principal, 
        instance_id: Text) : async (Principal, Text){ 
        try{

            //**The problem of long calculations with a large array, you need to write a separate module**//
            //**https://en.wikipedia.org/wiki/SHA-2**//
            //**https://forum.dfinity.org/t/icdevs-org-bounty-14-big-sha-keccak/11251**//
            // let wasm_sha: [Nat8] = SHA256.sum(wasm);
            // let value_hash = Hex.encode(wasm_sha);

            let canister_id: Principal = await createCanister(user_principal);
            ignore fastInstallWasm(canister_id, wasm);
            let ui: UserIdentity = { consecutive_number = getConsecutiveNumber(user_principal); user_principal = user_principal;  instance_id = instance_id };
            let uc: Canister = { name = ""; description = ""; canister_id = canister_id; wasm = null; wasm_hash = null; value_hash = null };
            putCanister(ui, uc);     
            return (canister_id, Principal.toText(canister_id));
        }
        catch e {
            Debug.print("deployCanister: error" # debug_show(Error.message(e)));
            return (empty_principal, "");
        }
    };

    public shared({caller}) func createCanister(user_principal: Principal) : async Principal{
        let canister_id = (await actor_ic.create_canister({ settings = ?{
            freezing_threshold = null;

            //**Testing dev**//
            controllers = ?[Principal.fromText(dev_my_work_wallet_principal), user_principal, Principal.fromActor(IM)];
            // controllers = ?[user_principal, Principal.fromActor(IM)];

            compute_allocation = null;
            memory_allocation = null;  
        }})).canister_id;

        return canister_id;
    };

    //** #Install #Reinstall #Upgrade #Uninstall wasm-code **//
    public shared({caller}) func installWasm(
        canister_id : Principal, 
        wasm : Wasm) : async Bool {
            try{
                await actor_ic.install_code({arg = []; wasm_module = wasm; mode = #install; canister_id = canister_id;});
                return true;
            }
            catch e {
                Debug.print("installWasm: error: " # debug_show(Error.message(e))); 
                return false; 
            }
    };
    public shared({caller}) func reinstallWasm(
        canister_id : Principal, 
        wasm : Wasm) : async Bool {
            try{
                await actor_ic.install_code({arg = []; wasm_module = wasm; mode = #reinstall; canister_id = canister_id;});
                return true;
            }
            catch e { 
                Debug.print("reinstallWasm: error: " # debug_show(Error.message(e)));
                return false; 
            }
    };
    public shared({caller}) func upgradeWasm(
        canister_id : Principal, 
        wasm : Wasm) : async Bool {
            try{
                await actor_ic.install_code({arg = []; wasm_module = wasm; mode = #upgrade; canister_id = canister_id;});
                return true;
            }
            catch e { 
                Debug.print("upgradeWasm: error: " # debug_show(Error.message(e)));
                return false; 
            }
    };
    public shared({caller}) func uninstallWasm(
        canister_id : Principal) : async Bool {
            try{
                await actor_ic.uninstall_code({canister_id = canister_id});
                return true;
            }
            catch e { 
                Debug.print("uninstallWasm: error: " # debug_show(Error.message(e)));
                return false; 
            }
    };

    //**Simple removal with possible failures. At the moment there is no definition of cycle accounting (return) and possibly other collisions**//
    public shared({caller}) func rejectCanister(
        consecutive_number: Nat, 
        user_principal: Principal, 
        service_canister_principal: Principal) : async Bool{
        let canister : ?Canister =  await getUserCanister(consecutive_number, user_principal);
        switch(canister){
            case(null){return false;};
            case(?canister){
                let can_status: CanisterStatus = await getCanisterStatus(canister.canister_id);
                if(can_status.memory_size > 0){
                    switch(can_status.status){
                        case(#running){ 
                            let isDestroy = await destroyCanister(canister.canister_id);
                            switch(isDestroy){
                                case(false){ return false; };
                                case(true) { 
                                    let isDelColl = await deleteCanisterInColllection(consecutive_number, user_principal);
                                    return isDelColl; };
                            };
                        };
                        case(#stopped){ 
                            let isDeleted = await deleteCanister(canister.canister_id);
                            switch(isDeleted){
                                case(false){ return false; };
                                case(true) { 
                                    let isDelColl = await deleteCanisterInColllection(consecutive_number, user_principal);
                                    return isDelColl; };
                            }; 
                        };
                        case(#stopping) {  return false; };
                    };
                }
                //There is no canister in the network, but there is in the collection
                else{ 
                    let isDelColl = await deleteCanisterInColllection(consecutive_number, user_principal);
                    return isDelColl; };
                };     
            };
            return false;
        };

    public shared({caller}) func stopCanister(canister_id: Principal) : async Bool{ 
        try{
            await actor_ic.stop_canister({canister_id = canister_id});
            return true;
        }
        catch e { return false; }
    };

    public shared({caller}) func getUserCanister(consecutive_number: Nat, user_principal: Principal): async ?Canister{
        let uin: UserInstance = {consecutive_number = consecutive_number;
            user_principal = user_principal; 
            instance_id = "";
            canister_id = empty_principal;
            value_hash = ?""; };
        let canister : ?Canister = service_canisters.get(uin);
        return canister;
    };

    //** service canisters **//
    public shared({caller}) func putCanister(
        ui: UserIdentity, 
        uc: Canister){ service_canisters.put(ui, uc);};
    public shared({caller}) func getCanisters(): async [UserInstance]{
        let size = service_canisters.size();
        var user_instances = Array.init<UserInstance>(size, {
            consecutive_number = 0;
            user_principal = empty_principal;
            instance_id = "";
            canister_id = empty_principal;
            value_hash = ?"";
        });
        var i = 0;
        for((k : UserIdentity, v : Canister) in service_canisters.entries()){
            let uin: UserInstance = {consecutive_number = k.consecutive_number;
            user_principal = k.user_principal; 
            instance_id = k.instance_id; 
            canister_id = v.canister_id; 
            value_hash = v.value_hash;}; 
            user_instances[i] := uin;
            i += 1;
        };
        return Array.freeze<UserInstance>(user_instances);
    };
    public shared({caller}) func getUserCanisters(user_principal: Principal): async [UserInstance]{
        let size = getSizeUserServiceCanisters(user_principal);
        var user_instances = Array.init<UserInstance>(size, {
            consecutive_number = 0;
            user_principal = empty_principal;
            instance_id = "";
            canister_id = empty_principal;
            value_hash = ?"";
        });
        var i = 0;
        for((k : UserIdentity, v : Canister) in service_canisters.entries()){         
            if(Principal.equal(user_principal, k.user_principal)){
                var uin: UserInstance = {consecutive_number = k.consecutive_number;
                user_principal = k.user_principal; 
                instance_id = k.instance_id; 
                canister_id = v.canister_id; 
                value_hash = v.value_hash;}; 
                user_instances[i] := uin;
                i += 1;
            };
        };
        return Array.freeze<UserInstance>(user_instances);    
    };

    system func preupgrade(){
        service_canisters_entries := Iter.toArray(service_canisters.entries());
    };

    system func postupgrade(){
        service_canisters_entries := [];
    };
}