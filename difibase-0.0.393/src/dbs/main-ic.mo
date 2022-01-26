import Time "mo:base/Time";
import Result "mo:base/Result";

module{
    //**MAIN IC MANAGER**//
    public type canister_id = Principal;
    public type wasm_module = [Nat8];
    public type canister_settings = {
        freezing_threshold : ?Nat;
        controllers : ?[Principal];
        memory_allocation : ?Nat;
        compute_allocation : ?Nat;
    };
    public type definite_canister_settings = {
        controllers : [Principal];
        compute_allocation : Nat;
        memory_allocation : Nat;
        freezing_threshold : Nat;
    };
    public type IC = actor {
        //delete create
        delete_canister : shared { canister_id : canister_id } -> async ();
        create_canister : shared { settings : ?canister_settings } -> async {
            canister_id : canister_id;
        };
        //cycles
        deposit_cycles : shared { canister_id : canister_id } -> async ();
        //start stop
        start_canister : shared { canister_id : canister_id } -> async ();
        stop_canister : shared { canister_id : canister_id } -> async ();
        //settings
        update_settings : ({
            canister_id : Principal;
            settings : canister_settings
        }) -> async ();
        //get status
        canister_status : ({canister_id : canister_id}) -> async ({
            status : { #running; #stopping; #stopped };
            settings: definite_canister_settings;
            module_hash: ?Blob;
            memory_size: Nat;
            cycles: Nat;
            freezing_threshold: Nat;
        });
        //install uninstal code  
        install_code : shared {
            arg : [Nat8];
            wasm_module : wasm_module;
            mode : { #reinstall; #upgrade; #install };
            canister_id : canister_id;
        } -> async ();
        uninstall_code : shared { canister_id : canister_id } -> async ();

        provisional_create_canister_with_cycles : shared {
            settings : ?canister_settings;
            amount : ?Nat;
        } -> async { canister_id : canister_id };
        provisional_top_up_canister : shared {
            canister_id : canister_id;
            amount : Nat;
        } -> async ();
        raw_rand : shared () -> async [Nat8];
    };
}