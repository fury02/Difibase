import React, {Component, useEffect} from 'react';
import { render } from "react-dom";
import { useState } from 'react';
import {Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {Actor_Service_Local} from "../../../util/actors/local/Agent_local";
import {Actor_DBS} from "../../../util/actors/ic_network/Agent_ic_dbs";
import InstallWasmToCanister from "../../../util/blockchain/file_operations/Install_wasm_ic";
import {AddEntityesTableComponent} from "./fragments/tables_create_upload/AddEntityesTableComponent";
import {UploadFileComponent} from "./fragments/tables_create_upload/UploadFileComponent";
import {GetEntityesTableComponent} from "./fragments/tables_create_upload/GetEntityesTableComponent";
import {DeleteEntityTableComponent} from "./fragments/tables-download-delete/DeleteEntityTableComponent";
import {DeleteRowEntityTableComponent} from "./fragments/tables-download-delete/DeleteRowEntityTableComponent";
import {DownloadFileComponent} from "./fragments/tables-download-delete/DownloadFileComponent";
import FileToDownload from "../../../util/blockchain/file_operations/Download_blockchain_ic";
import Button from "react-bootstrap/Button";
import TablesCreateUploadComponent from "./TablesCreateUploadComponent";

var ac = new Actor_Service_Local();

export const InstallWasmFileComponent: React.FC = () => {

    const [wasmToInstall, setFileInstallWasmToCanister] = useState([] as InstallWasmToCanister[]);
    const [canister_id, setValueCanisterPrincipalId] = useState(undefined);
    const [number_canister_id, setValueCanisterNumberId] = useState(undefined);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;
        if(!files) return;

        let wasmToInstall: InstallWasmToCanister[] = [];

        if(files.length == 1){
            wasmToInstall.push(new InstallWasmToCanister(files[0], canister_id, number_canister_id));
        }

        setFileInstallWasmToCanister(wasmToInstall);
    };

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        wasmToInstall[0].DeployCanisterSimple();
    };

    const handleInputChangeCanisterNumberId = (event: { target: { value: any; }; }) => {
        setValueCanisterNumberId(event.target.value);
        console.warn(number_canister_id);
    }

    const handleInputChangeCanisterPrincipalId = (event: { target: { value: any; }; }) => {
        setValueCanisterPrincipalId(event.target.value);
        console.warn(setValueCanisterNumberId);
    }

    return (
        <div className="white-color">
            <div className="col">
                <div className="upload-container">
                    <h5 className="brown-color">Install (.wasm) file</h5>
                    <div className="upload-form">
                        <h6> </h6>
                        <h6 className="coral-color">Install .wasm file. There is no cycle accounting. This is a test environment. </h6>
                        <h6 className="coral-color">As an example, it is recommended to take the file src/wasm/wasm-actor.wasm </h6>
                        <h6 className="coral-color">After installation, you can check from the command line: </h6>
                        <h6 className="coral-color">"dfx canister call wasm-actor getCanisterVersionFirstOrDefault" </h6>
                        <h6 className="coral-color">Disable cycle tracking in dfx.json on subnet_type:system</h6>
                        <h6> </h6>
                        <Form id="file_upload" onSubmit={onFormSubmit}>
                            <div className="upload-file-select">
                                <label htmlFor="file_1">Select (.wams) file for install in canister</label>
                                <input id="file_1" type="file" multiple onChange={onFileChange}/>
                            </div>
                            <div className="upload-file-list">
                                {wasmToInstall.map((f,i) => <div className="upload-file" key={i}>{f.file.name} - {f.file.size}bytes</div>)}
                            </div>
                            <div className="upload-submit">
                                <input type="submit" value="Install"/>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InstallWasmFileComponent;