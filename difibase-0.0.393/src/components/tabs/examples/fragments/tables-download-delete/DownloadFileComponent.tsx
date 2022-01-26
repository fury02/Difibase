import React, {Component} from 'react';
import { useState } from 'react';
import {Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {Actor_Service_Local} from "../../../../../util/actors/local/Agent_local";
import {Actor_DBS} from "../../../../../util/actors/ic_network/Agent_ic_dbs";
import Button from "react-bootstrap/Button";
import FileToUpload from "../../../../../util/blockchain/file_operations/Upload_blockchain_ic";
import FileToDownload from "../../../../../util/blockchain/file_operations/Download_blockchain_ic";
var ac = new Actor_Service_Local();
// var ac = new Actor_Serv();

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

    public handleClickDownloadFile() {
        console.warn(this.state.guid);
        if(this.state.guid != null){
            ac.actor_service_dbs.guid_to_uuid(this.state.guid).then(uuid => { this.setState({ uuid: uuid }); });
            console.warn(this.state)
            if(this.state.uuid != null) {
                new FileToDownload().downloadFile(this.state.uuid);
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