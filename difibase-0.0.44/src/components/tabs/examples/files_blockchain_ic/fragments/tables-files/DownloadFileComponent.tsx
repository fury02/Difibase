import React, {Component} from 'react';
import { useState } from 'react';
import {Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {Actor_Service_Local} from "../../../../../../util/actors/local/Actor_local";
import {Actor_DB} from "../../../../../../util/actors/ic_network/Actor_ic_db";
import Button from "react-bootstrap/Button";
import FileToUpload from "../../../../../../util/blockchain/file_operations/files/Upload_blockchain_ic";
import FileToDownload from "../../../../../../util/blockchain/file_operations/files/Download_blockchain_ic";
import {Actor_DATABASE_FILES} from "../../../../../../util/actors/ic_network/Actor_ic_db_files";

var CryptoJS = require("crypto-js");

export class DownloadFileComponent extends Component{

    constructor(props: any){
        super(props);
        this.handleInputChangeGuid = this.handleInputChangeGuid.bind(this);
        this.handleClickDownloadFile = this.handleClickDownloadFile.bind(this);
    }

    state = {
        guid:null,
        uuid:null,
    }

    handleInputChangeGuid(event: { target: { value: any; }; }) {
        this.setState({ guid: event.target.value });
        console.warn(this.state)
    }

    public async handleClickDownloadFile() {
        let values = this.props;
        var id = Object.values(values)[0];
        if(id != "aaaaa-aa"){
            console.warn(this.state.guid);
            if(this.state.guid != null){
                // @ts-ignore
                const ac_instance_this = new Actor_DATABASE_FILES(id);
                //TODO
                const res = await ac_instance_this.actor_service_db_files.guid_to_uuid(this.state.guid);
                this.setState({ uuid: res });
                console.warn(this.state)
                if(this.state.uuid != null) {
                    let fd = new FileToDownload();
                    // @ts-ignore
                    await fd.ic_blockchain_downloadFile(this.state.uuid, id);
                }
            }
        }
    }

    render(){
        return(
            <div className="white-color">
                <Container>
                    <h5 className="download-title">Download file</h5>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicGuid">
                            <Form.Label>Guid</Form.Label>
                            <Form.Control as="textarea" name="guid" onChange={this.handleInputChangeGuid}  type="table" placeholder="Guid-file-upload" />
                        </Form.Group>
                    </Form>
                    <Button variant="primary" type="button" onClick={this.handleClickDownloadFile}> Download file</Button>
                </Container>
            </div>
        )
    }
}