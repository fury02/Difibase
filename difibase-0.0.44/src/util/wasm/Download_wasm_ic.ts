import {Actor_Service_Local} from "../actors/local/Actor_local";
import {Actor_WASM_STORAGE} from "../actors/ic_network/Actor_ic_wasm_storage";

// var ac = new Actor_Service_Local();
var ac = new Actor_WASM_STORAGE();

export default class DownloadWasmIc {

    public async getWasm(name: string, version: number): Promise<Array<number>>  {
        // @ts-ignore
        return await ac.actor_service_wasm_storage.read_wasm(name, BigInt(version));
    }
}

