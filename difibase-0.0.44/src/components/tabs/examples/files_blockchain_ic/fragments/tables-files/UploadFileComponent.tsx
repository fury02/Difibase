import React, {Component} from 'react';
import { useState } from 'react';
import {Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {Actor_Service_Local} from "../../../../../../util/actors/local/Actor_local";
import {Actor_DB} from "../../../../../../util/actors/ic_network/Actor_ic_db";
import Button from "react-bootstrap/Button";
import FileToUpload from "../../../../../../util/blockchain/file_operations/files/Upload_blockchain_ic";
import {useAppSelector} from "../../../../../../redux/app/Hooks";
import {selectUserCluster} from "../../../../../../redux/features/ic/db/cluster/UserClusterSlice";
import {
    selectClusterInstances,
    selectSelectedCluster, selectSelectedInstance
} from "../../../../../../redux/features/ic/db/cluster-instance/ClusterInstanceSlice";

export const UploadFileComponent: React.FC = () => {

    const [filesToUpload, setFilesToUpload] = useState([] as FileToUpload[]);
    const [key_id, setValueKey] = useState(null);
    const [table_id, setValueTable] = useState(null);

    //Redux database clusters - GET
    const user_clusters_redux = useAppSelector(selectUserCluster);
    //Redux database cluster instances - GET
    const user_cluster_instances_redux = useAppSelector(selectClusterInstances);
    //Redux selected cluster - GET
    const selected_cluster_redux = useAppSelector(selectSelectedCluster);
    //Redux selected cluster - GET
    const selected_instance_redux = useAppSelector(selectSelectedInstance);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;
        if(!files) return;

        let filesToUpload: FileToUpload[] = [];
        for (let i = 0; i < files.length; i++) {
            if(key_id != null && table_id != null){
                filesToUpload.push(new FileToUpload(files[i],  files[i].name, key_id, table_id));
            }
            else{
                filesToUpload.push(new FileToUpload(files[i], files[i].name)); // default
            }
        }

        setFilesToUpload(filesToUpload);
    };

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        var id = selected_instance_redux.instance_principal.toString();
        if(id != "aaaaa-aa"){
            for (let i = 0; i < filesToUpload.length; i++) {
                // filesToUpload[i].ic_blockchain_uploadFileCheckUpResult(id);
                filesToUpload[i].ic_blockchain_uploadFileResult(id)
            }
        }
    };

    const handleInputChangeKey = (event: { target: { value: any; }; }) => {
        setValueKey(event.target.value);
        console.warn(key_id);
    };

    const handleInputChangeTable = (event: { target: { value: any; }; }) => {
        setValueTable(event.target.value);
        console.warn(table_id);
    };

    return (
        <div className="white-color">
            <div className="col">
                <div className="upload-container">
                    <h5 className="upload-title">Upload file (IC)</h5>
                    <div className="upload-form">
                        <Form id="file_upload" onSubmit={onFormSubmit}>

                            <Form.Group className="mb-3" controlId="formBasicKey">
                                <Form.Label>Bind-table</Form.Label>
                                <Form.Control as="textarea" name="table_id" onChange={handleInputChangeTable}  type="table_id" placeholder="Bind-table value" />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicKey">
                                <Form.Label>Bind-key</Form.Label>
                                <Form.Control as="textarea" name="key_id" onChange={handleInputChangeKey}  type="key_id" placeholder="Bind-key value" />
                            </Form.Group>

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
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}
