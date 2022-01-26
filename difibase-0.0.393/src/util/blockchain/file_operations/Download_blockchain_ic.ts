import {Actor_Service_Local} from "../../actors/local/Agent_local";
import crc from 'crc';

var ac = new Actor_Service_Local();

export default class DownloadFileBlockchain{

    private arr: number[] = [];

    constructor( ) { }

    public async downloadFile(uuid:number[]) {
        var chunk_number: number = 1;
        var fi = await ac.actor_service_dbs.get_file_info(uuid);
        var chunksCount = Number(fi[0]);
        var typeFile = fi[1];
        var nameFile = fi[4];
        while (chunk_number < chunksCount+ 1){
            var request = await ac.actor_service_dbs.download_chunks(uuid, BigInt(chunk_number));
            if(request[0] != null){
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

        this.arr = [];
    }
}