export default class FileUpload {
    static chunkSize = 1000000;

    static uploadUrl = 'http://localhost:8080/api/v1/test';

    readonly request: XMLHttpRequest;
    readonly file: File;
    currentChunkStartByte: number;

    currentChunkFinalByte: number;

    constructor(file: File, name: string) {
        this.request = new XMLHttpRequest();
        this.request.overrideMimeType('application/octet-stream');

        this.file = file;
        this.currentChunkStartByte = 0;
        this.currentChunkFinalByte = FileUpload.chunkSize > this.file.size ? this.file.size : FileUpload.chunkSize;
    }

    uploadFile() {
        this.request.open('POST', FileUpload.uploadUrl, true);

        let chunk: Blob = this.file.slice(this.currentChunkStartByte, this.currentChunkFinalByte);
        this.request.setRequestHeader('Content-Range', `bytes ${this.currentChunkStartByte}-${this.currentChunkFinalByte}/${this.file.size}`);

        this.request.onload = () => {
            const remainingBytes = this.file.size - this.currentChunkFinalByte;

            if(this.currentChunkFinalByte === this.file.size) {
                alert('download completed');
                return;
            } else if (remainingBytes < FileUpload.chunkSize) {
                this.currentChunkStartByte = this.currentChunkFinalByte;
                this.currentChunkFinalByte = this.currentChunkStartByte + remainingBytes;
            }
            else {
                this.currentChunkStartByte = this.currentChunkFinalByte;
                this.currentChunkFinalByte = this.currentChunkStartByte + FileUpload.chunkSize;
            }

            this.uploadFile();
        }

        const formData = new FormData();
        formData.append('file', chunk, this.file.name);
        this.request.send(formData);
    }
}
