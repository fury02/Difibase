import {Actor_Service_Local} from "../../../actors/local/Actor_local";
import {Principal} from "@dfinity/principal";
import crc from 'crc';
import DeleteFileBlockchain from "../files/Delete_blockchain_ic";
import DownloadFileBlockchain from "../files/Download_blockchain_ic";
import {Actor_ADMIN} from "../../../actors/ic_network/Actor_ic_admin";

// var ac = new Actor_Service_Local();
var ac = new Actor_ADMIN();

export default class InstallWasmIC {

    private name: string;
    private type: string;
    private hash: number;

    readonly file: File;

    constructor(file: File) {
        this.file = file;
        this.name = file.name;
        this.type = file.type;
        this.hash = 0;
    }

    public async DeployCanister(user_principal: Principal): Promise<String> {
        let file_type = this.file.type;
        if(file_type == "application/wasm"){
            let ab = await this.file.arrayBuffer();
            let wasm_binary = Array.from(new Uint8Array(ab));
            // @ts-ignore
            var result = await ac.actor_service_admin.deploy_singleton_instance(wasm_binary, user_principal);

            var keys = Object.keys(result);

            if(keys[0] == "ok"){
                var value = Object.values(result);
                var value_principal = value[0];
                return value_principal[1];
            }
            else {
                return '';
            }

        }
        const formData = new FormData();
        return '';
    }
}
