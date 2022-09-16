import {Actor_Service_Local} from "../../../../actors/local/Actor_local";
import {Principal} from "@dfinity/principal";

var ac = new Actor_Service_Local();

enum UpdateMode { Upgrade, Reinstall, Install, Unknown}

export default class WasmStorageIC {

    private canister_number: string;
    private canister_principal: string;
    private name: string;
    private type: string;
    private hash: number;

    readonly file: File;

    constructor(file: File, private number ? : string | undefined, private principal ? : string | undefined,) {

        this.file = file;
        this.name = file.name;
        this.type = file.type;
        this.hash = 0;

        if (number != null) { this.canister_number = number; }
        else {this.canister_number = '';}
        if (principal != null) { this.canister_principal = principal; }
        else {this.canister_principal = '';}
    }

    public async DeployCanisterSimple() {
        let file_type = this.file.type;
        if(file_type == "application/wasm"){
            let ab = await this.file.arrayBuffer();
            let wasm_binary = Array.from(new Uint8Array(ab));
            // ac.actor_service_wasm_manager.deployCanister(wasm_binary);
        }

        const formData = new FormData();
    }

    public async DeployCanister(service_canister_principal: Principal): Promise<Boolean> {
        let file_type = this.file.type;
        var result: Boolean = false;
        if(file_type == "application/wasm"){
            let ab = await this.file.arrayBuffer();
            let wasm_binary = Array.from(new Uint8Array(ab));
            // result = await ac.actor_service_instance_manager.reinstallWasm(service_canister_principal, wasm_binary)
        }
        const formData = new FormData();
        return result;
    }

    public async DeployCanisterMode(service_canister_principal: Principal, mode: UpdateMode ): Promise<Boolean> {
        let file_type = this.file.type;
        var result: Boolean = false;
        if(file_type == "application/wasm"){
            let ab = await this.file.arrayBuffer();
            let wasm_binary = Array.from(new Uint8Array(ab));
            if(UpdateMode.Upgrade == mode){
                // result = await ac.actor_service_instance_manager.upgradeWasm(service_canister_principal, wasm_binary)
            }
            else if(UpdateMode.Reinstall == mode){
                // result = await ac.actor_service_instance_manager.reinstallWasm(service_canister_principal, wasm_binary)
            }
            else if(UpdateMode.Install == mode){
                // result = await ac.actor_service_instance_manager.installWasm(service_canister_principal, wasm_binary)
            }
            else if(UpdateMode.Unknown == mode){
                // Not update, result false
            }
            else {}
        }
        const formData = new FormData();
        return result;
    }

    // public async extendedDeployCanister(service_canister_principal: Principal) {
    //     let file_type = this.file.type;
    //     if(file_type == "application/wasm"){
    //         let ab = await this.file.arrayBuffer();
    //         let wasm_binary = Array.from(new Uint8Array(ab));
    //         let res = await ac.actor_service_instance_manager.reinstallWasm(service_canister_principal, wasm_binary)
    //         let res_ = res;
    //     }
    //
    //     const formData = new FormData();
    // }

    async Test(){ };
}
