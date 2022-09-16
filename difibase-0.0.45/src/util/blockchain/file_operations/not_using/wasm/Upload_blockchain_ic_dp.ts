import {Actor_Service_Local} from "../../../../actors/local/Actor_local";
import crc from 'crc';
import DeleteFileBlockchain from "../../files/Delete_blockchain_ic";
import DownloadFileBlockchain from "../../files/Download_blockchain_ic";

var ac = new Actor_Service_Local();

export default class FileToUploadBlockchainDP {
    static kByte = 1024;
    static chunkSize32Kb = this.kByte * 32;
    static chunkSize64Kb = this.kByte * 64;
    static chunkSize128Kb = this.kByte * 128;
    static chunkSize256Kb = this.kByte * 256;
    static chunkSize500Kb = this.kByte * 500;
    static chunkSize1000Kb = this.kByte * 1000;

    private guid: string;
    private bind_key: string;
    private bind_table: string;
    private name: string;
    private type: string;
    private hash: number;
    private uuid: number[]
    private arr: number[] = [];

    readonly file: File;

    private deleteFileBlockchain: DeleteFileBlockchain = new DeleteFileBlockchain();
    private downloadFileBlockchain: DownloadFileBlockchain = new DownloadFileBlockchain();

    constructor(file: File,  name: string, private key ? : string, private table ? : string,) {
        this.file = file;
        this.name = file.name;
        this.type = file.type;
        this.hash = 0;
        this.uuid = Array<number>();
        this.guid = '';

        if (key != null) { this.bind_key = key; }
        else {this.bind_key = '';}
        if (table != null) { this.bind_table = table; }
        else {this.bind_table = '';}
    }

    async createChunksBlob(file: File, chunkSize: number): Promise<Array<Blob>> {
        const fileChunks: Array<Blob> = [ ];
        var startByte = 0;
        var countByte = 0;
        var endByte = chunkSize > this.file.size ? this.file.size : chunkSize;
        while (this.file.size > countByte) {
            fileChunks.push(file.slice(startByte, endByte));
            countByte += endByte - startByte;
            startByte = endByte;
            endByte = this.file.size - endByte >= chunkSize ? endByte + chunkSize  : this.file.size;
        }
        return fileChunks;
    }

    arrayBufferToNumberArray(ab: ArrayBuffer): Array<number>{
        let na = new Array<number>();
        let temp = new Uint8Array(ab);
        temp.forEach(d => {
            na.push(d);
        });
        return  na;
    }

    public async uploadFile() {
        var file_size = this.file.size;
        var chunks = await this.createChunksBlob(this.file, FileToUploadBlockchainDP.chunkSize64Kb);
        var chunks_count = chunks.length;
        var chunk_number: number = 1;

        // await ac.actor_service_psha.clean_file_chunks();
        var count = 0;
        while (count < chunks_count){
            let arr_blob = await chunks[count].arrayBuffer();
            let arr_blob_number = this.arrayBufferToNumberArray(arr_blob);
            var chunk_size: number = arr_blob_number.length;
            // var result = await ac.actor_service_psha.upload_file_chunks(BigInt(count), arr_blob_number);
            chunk_number = chunk_number + 1;
            count++;
        };
        // await ac.actor_service_psha.file_chunks_to_blob();
        // // //Test
        // await this.Test();
        await this.fakeDownload();

        const formData = new FormData();
    }

    async Test(){
        // // //Test
        // await this.downloadFileBlockchain.downloadFile(this.uuid);
        // // // //Test
        // await this.deleteFileBlockchain.deleteFile(this.uuid);
        // // // //Test
        // await this.downloadFileBlockchain.downloadFile(this.uuid);
    };

    async fakeDownload(){
        await this.downloadFileBlockchain.local_downloadFile([]);
    };
}

