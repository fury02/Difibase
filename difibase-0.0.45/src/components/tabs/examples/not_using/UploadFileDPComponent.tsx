import React, {Component, useEffect} from 'react';
import { render } from "react-dom";
import { useState } from 'react';
import {Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {Actor_Service_Local} from "../../../../util/actors/local/Actor_local";
import {Actor_DB} from "../../../../util/actors/ic_network/Actor_ic_db";
import InstallWasmToCanister from "../../../../util/blockchain/file_operations/not_using/wasm/Install_wasm_ic";
import {AddEntityesTableComponent} from "../local_db/fragments/tables_create_upload/AddEntityesTableComponent";
import {UploadFileComponent} from "../local_db/fragments/tables_create_upload/UploadFileComponent";
import {GetEntityesTableComponent} from "../local_db/fragments/tables_create_upload/GetEntityesTableComponent";
import {DeleteEntityTableComponent} from "../local_db/fragments/tables-download-delete/DeleteEntityTableComponent";
import {DeleteRowEntityTableComponent} from "../local_db/fragments/tables-download-delete/DeleteRowEntityTableComponent";
import {DownloadFileComponent} from "../local_db/fragments/tables-download-delete/DownloadFileComponent";
import FileToDownload from "../../../../util/blockchain/file_operations/files/Download_blockchain_ic";
import Button from "react-bootstrap/Button";
import TablesCreateUploadComponent from "../local_db/TablesCreateUploadComponent";
import FileToUploadDP from "../../../../util/blockchain/file_operations/not_using/wasm/Upload_blockchain_ic_dp";
// import sha256 from 'crypto-js/sha256';
// @ts-ignore
import CryptoJS from 'crypto-js';
import File_hash from "../../../../util/helpers/calculate/hash/File_hash";

var SHA512 = require("crypto-js/sha512");
var SHA384 = require("crypto-js/sha384");
var SHA256 = require("crypto-js/sha256");
var SHA224 = require("crypto-js/sha224");
var SHA1 = require("crypto-js/sha1");
var SHA3 = require("crypto-js/sha3");


export const UploadFileDPComponent: React.FC = () => {

    const [filesToUpload, setFilesToUpload] = useState([] as FileToUploadDP[]);
    const [file_sha512, setFilesSha512] = useState("");
    const [file_sha384, setFilesSha384] = useState("");
    const [file_sha256, setFilesSha256] = useState("");
    const [file_sha224, setFilesSha224] = useState("");
    const [file_sha1, setFilesSha1] = useState("");
    const [file_sha3, setFilesSha3] = useState("");
;

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;
        if(!files) return;

        let filesToUpload: FileToUploadDP[] = [];
        for (let i = 0; i < files.length; i++) {
            filesToUpload.push(new FileToUploadDP(files[i], files[i].name)); // default
        }
        const file: File = files[0];

        var hc = new File_hash(file);

        hc.file_sha512().then(i => {
            var itv = i.text_value;
            var iav = i.array_value;
            setFilesSha512(i.text_value.toString());
            console.warn(i.text_value);
        });

        hc.file_sha384().then(i => {
            var itv = i.text_value;
            var iav = i.array_value;
            setFilesSha384(i.text_value.toString());
            console.warn(i.text_value);
        });

        hc.file_sha256().then(i => {
            var itv = i.text_value;
            var iav = i.array_value;
            setFilesSha256(i.text_value.toString());
            console.warn(i.text_value);
        });

        hc.file_sha224().then(i => {
            var itv = i.text_value;
            var iav = i.array_value;
            setFilesSha224(i.text_value.toString());
            console.warn(i.text_value);
        });

        setFilesToUpload(filesToUpload);
    };

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        for (let i = 0; i < filesToUpload.length; i++) {
            filesToUpload[i].uploadFile();
        }
    };

    return (
        <div className="white-color">
            <div className="col">
                <div className="upload-container">
                    <h5 className="upload-title">Upload file (IC)</h5>
                    <div className="upload-form">
                        <Form id="file_upload" onSubmit={onFormSubmit}>

                            <div className="upload-file-select">
                                <label htmlFor="file_1">Select files for upload</label>
                                <input id="file_1" type="file" multiple onChange={onFileChange}/>
                            </div>

                            <div className="upload-file-list">
                                {filesToUpload.map((f,i) => <div className="upload-file" key={i}>{f.file.name} - {f.file.size}bytes</div>)}
                            </div>

                            <div className="upload-submit">
                                <input type="submit" value="Download"/>
                            </div>

                            <h6>SHA512: {file_sha512}</h6>
                            <h6>SHA384: {file_sha384}</h6>
                            <h6>SHA256: {file_sha256}</h6>
                            <h6>SHA224: {file_sha224}</h6>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadFileDPComponent;