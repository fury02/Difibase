import React, {Component} from 'react';
import { useState } from 'react';
import {Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {Actor_Service_Local} from "../../../../../../util/actors/local/Actor_local";
import {Actor_DB} from "../../../../../../util/actors/ic_network/Actor_ic_db";
import Button from "react-bootstrap/Button";
import FileToUpload from "../../../../../../util/blockchain/file_operations/files/Upload_blockchain_ic";
import FileToDownload from "../../../../../../util/blockchain/file_operations/files/Download_blockchain_ic";

var CryptoJS = require("crypto-js");

var ac = new Actor_Service_Local();

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

    // public async hexToBytes(hex) {
    //     for (var bytes = [], c = 0; c < hex.length; c += 2)
    //         bytes.push(parseInt(hex.substr(c, 2), 16));
    //     return bytes;
    // }
    //
    // public async bytesToHex(bytes: number[]) {
    //     for (var hex = [], i = 0; i < bytes.length; i++) {
    //         var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
    //         hex.push((current >>> 4).toString(16));
    //         hex.push((current & 0xF).toString(16));
    //     }
    //     return hex.join("");
    // }

    public async handleClickDownloadFile() {
        console.warn(this.state.guid);
        if(this.state.guid != null){
            //TODO
            const res = await ac.actor_service_db_files.guid_to_uuid(this.state.guid);
            this.setState({ uuid: res });
            // var text_encoder = new TextEncoder();
            // var bytes = text_encoder.encode(this.state.guid);
            // var bytes_js = CryptoJS.enc.Hex.parse(this.state.guid);
            console.warn(this.state)
            if(this.state.uuid != null) {
                let fd = new FileToDownload();
                await fd.local_downloadFile(this.state.uuid);
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