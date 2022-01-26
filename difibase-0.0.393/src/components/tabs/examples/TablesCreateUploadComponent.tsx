import React, {Component, useEffect} from 'react';
import { render } from "react-dom";
import { useState } from 'react';
import {Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {Actor_Service_Local} from "../../../util/actors/local/Agent_local";
import {Actor_DBS} from "../../../util/actors/ic_network/Agent_ic_dbs";
import FileToUpload from "../../../util/blockchain/file_operations/Upload_blockchain_ic";
import {AddEntityesTableComponent} from "./fragments/tables_create_upload/AddEntityesTableComponent";
import {UploadFileComponent} from "./fragments/tables_create_upload/UploadFileComponent";
import {GetEntityesTableComponent} from "./fragments/tables_create_upload/GetEntityesTableComponent";

var ac = new Actor_Service_Local();

const TablesCreateUploadComponent: React.FC = () => {
    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <AddEntityesTableComponent></AddEntityesTableComponent>
                    </div>
                    <div className="col">
                        <UploadFileComponent></UploadFileComponent>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <GetEntityesTableComponent></GetEntityesTableComponent>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default TablesCreateUploadComponent;

