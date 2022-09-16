import {Actor_Service_Local} from "../../../actors/local/Actor_local";
import crc from 'crc';
import {Actor_DATABASE_FILES} from "../../../actors/ic_network/Actor_ic_db_files";

var ac = new Actor_Service_Local();

export default class DownloadFileBlockchain{

    private arr: number[] = [];

    constructor( ) { }

    public async local_downloadFile(uuid:number[]) {
        var chunk_number: number = 1;
        // @ts-ignore
        var fi = await ac.actor_service_db_files.get_file_info_by_uuid(uuid);
        var chunksCount = Number(fi[0]);
        var typeFile = fi[1];
        var nameFile = fi[4];
        while (chunk_number < chunksCount+ 1){
            // @ts-ignore
            var request = await ac.actor_service_db_files.download_chunks_by_uuid(uuid, BigInt(chunk_number));
            if(request[0] != null){
                // @ts-ignore
                var blob_array: number[] = request[0];
                blob_array.forEach(i=>{
                    this.arr.push(i);
                });
            }
            chunk_number = chunk_number + 1;
        }
        var bytes = new Uint8Array(this.arr);
        var blob = new Blob([bytes], {type: typeFile});
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = nameFile;
        link.click();
        if(this.arr.length == 0){
            alert("Error file download");
        }
        else {
            alert("File download done");
        }
        this.arr = [];
    }

    public async ic_blockchain_downloadFile(uuid: number[], canister_id: string) {
        var chunk_number: number = 1;
        const ac_instance_this = new Actor_DATABASE_FILES(canister_id);
        // @ts-ignore
        var fi = await ac_instance_this.actor_service_db_files.get_file_info_by_uuid(uuid);
        var chunksCount = Number(fi[0]);
        var typeFile = fi[1];
        var nameFile = fi[4];
        while (chunk_number < chunksCount+ 1){
            // @ts-ignore
            var request = await ac_instance_this.actor_service_db_files.download_chunks_by_uuid(uuid, BigInt(chunk_number));
            if(request[0] != null){
                // @ts-ignore
                var blob_array: number[] = request[0];
                blob_array.forEach(i=>{
                    this.arr.push(i);
                });
            }
            chunk_number = chunk_number + 1;
        }
        var bytes = new Uint8Array(this.arr);
        var blob = new Blob([bytes], {type: typeFile});
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = nameFile;
        link.click();
        if(this.arr.length == 0){
            alert("Error file download");
        }
        else {
            alert("File download done");
        }
        this.arr = [];
    }

}