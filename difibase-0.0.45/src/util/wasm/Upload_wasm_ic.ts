import {Actor_Service_Local} from "../actors/local/Actor_local";
import crc from 'crc';
import DeleteFileBlockchain from "../blockchain/file_operations/files/Delete_blockchain_ic";
import DownloadFileBlockchain from "../blockchain/file_operations/files/Download_blockchain_ic";
import {Principal} from "@dfinity/principal";
import {
    CountedSha224,
    CountedSha256,
    CountedSha384,
    CountedSha512,
    UploadProgress
} from "../../common/interfaces/interfaces";
import File_hash from "../helpers/calculate/hash/File_hash";
import {useAppDispatch, useAppSelector} from "../../redux/app/Hooks";
import {selectWasmHash, selectWasmInfo, selectWasmStorage} from "../../redux/features/ic/files/wasm/action/WasmStorageSlice";
import file_hash from "../helpers/calculate/hash/File_hash";
import {Actor_WASM_STORAGE} from "../actors/ic_network/Actor_ic_wasm_storage";

// var ac = new Actor_Service_Local();
var ac = new Actor_WASM_STORAGE();

export const UploadWasmIc = () => {
    const kByte = 1024;
    const chunkSize32Kb = kByte * 32;
    const chunkSize64Kb = kByte * 64;
    const chunkSize128Kb = kByte * 128;
    const chunkSize256Kb = kByte * 256;
    const chunkSize500Kb = kByte * 500;
    const chunkSize1000Kb = kByte * 1000;

    //Redux dispatch
    const dispatch = useAppDispatch();
    //Redux GET
    const file_value = useAppSelector(selectWasmStorage);
    const file_hash = useAppSelector(selectWasmHash);
    const file_info = useAppSelector(selectWasmInfo);

    async function createChunksBlob(file: File, chunkSize: number): Promise<Array<Blob>>{
        const fileChunks: Array<Blob> = [ ];
        var startByte = 0;
        var countByte = 0;
        var endByte = chunkSize > file_value.size ? file_value.size : chunkSize;
        while (file_value.size > countByte) {
            fileChunks.push(file.slice(startByte, endByte));
            countByte += endByte - startByte;
            startByte = endByte;
            endByte = file_value.size - endByte >= chunkSize ? endByte + chunkSize  : file_value.size;
        }
        return fileChunks;
    };

    const arrayBufferToNumberArray = (ab: ArrayBuffer): Array<number> =>{
        let na = new Array<number>();
        let temp = new Uint8Array(ab);
        temp.forEach(d => {
            na.push(d);
        });
        return  na;
    };

    //**1**//
    async function *uploadWasmFileChunks(): AsyncIterableIterator<UploadProgress> {
            let hash_text_value = file_hash.text_value.toString();
            let hash_arr_value: Uint8Array = file_hash.array_value;

            let chunks = await createChunksBlob(
                file_value,
                chunkSize64Kb);

            var chunks_count = chunks!.length;
            var chunk_number: number = 0;

            while (chunk_number < chunks_count){
                let arr_blob = await chunks![chunk_number].arrayBuffer();
                let arr_blob_number = arrayBufferToNumberArray(arr_blob);
                var chunk_size: number = arr_blob_number.length;
                var result = await ac.actor_service_wasm_storage.upload_progress(BigInt(chunk_number), hash_text_value,
                    // @ts-ignore
                    arr_blob_number);
                chunk_number = chunk_number + 1;
                yield  {percent: Math.round((chunk_number/chunks_count!)*100), step: chunk_number}
            }
    }

    //**2**//
    async function installLoadedWasmFile(version: number, description: string)  {
        let hash_text_value = file_hash.text_value.toString();
        let hash_arr_value: Uint8Array = file_hash.array_value;
        let chunks = await createChunksBlob(
            file_value,
            chunkSize64Kb);

        await ac.actor_service_wasm_storage.install_wasm( BigInt(chunks!.length), hash_text_value, file_value.name, description, BigInt(version),
            // @ts-ignore
            Array.from(hash_arr_value),
            hash_text_value,
            {sha256: null}
        );
        var test = 1;
    }
}