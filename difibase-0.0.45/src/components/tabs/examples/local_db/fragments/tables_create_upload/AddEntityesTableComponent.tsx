import React, {Component} from 'react';
import { useState } from 'react';
import {Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {Actor_Service_Local} from "../../../../../../util/actors/local/Actor_local";
import {Actor_DB} from "../../../../../../util/actors/ic_network/Actor_ic_db";
import Button from "react-bootstrap/Button";
import FileToUpload from "../../../../../../util/blockchain/file_operations/files/Upload_blockchain_ic";

var ac = new Actor_Service_Local();

export class AddEntityesTableComponent extends Component{

    constructor(props: any){
        super(props);
        this.handleInputChangeTable = this.handleInputChangeTable.bind(this);
        this.handleInputChangeColumn = this.handleInputChangeColumn.bind(this);
        this.handleInputChangeKey = this.handleInputChangeKey.bind(this);
        this.handleInputChangeValue = this.handleInputChangeValue.bind(this);
        this.handleClickSend = this.handleClickSend.bind(this);
    }

    state = {
        table:null,
        key:null,
        column:null,
        value:null
    }

    handleInputChangeTable(event: { target: { value: any; }; }) {
        this.setState({
            table: event.target.value,
        });
        console.warn(this.state)
    }

    handleInputChangeColumn(event: { target: { value: any; }; }) {
        this.setState({
            column: event.target.value
        });
        console.warn(this.state)
    }

    handleInputChangeKey(event: { target: { value: any; }; }) {
        this.setState({
            key: event.target.value
        });
        console.warn(this.state)
    }

    handleInputChangeValue(event: { target: { value: any; }; }) {
        this.setState({
            value: event.target.value
        });
        console.warn(this.state)
    }

    public handleClickSend( ) {
        if(this.state.table != null && this.state.column != null && this.state.key != null && this.state.value != null){
            let result = ac.actor_service_db_files.replace_value(this.state.table, this.state.column, this.state.key, this.state.value).then(
                i =>
                {
                    console.warn(i);
                    alert("save");
                }
            );
        }
    }

    render(){
        return(
            <div className="white-color">
                <Container>
                    <h5 className="upload-title">Add new value (IC)</h5>
                    {/*<Form>*/}
                        <Form.Group className="mb-3" controlId="formBasicTable">
                            <Form.Label>Table</Form.Label>
                            <Form.Control as="textarea" name="table" onChange={this.handleInputChangeTable}  type="table" placeholder="Table name" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicColumn">
                            <Form.Label>Column</Form.Label>
                            <Form.Control as="textarea" name="column" onChange={this.handleInputChangeColumn}  type="column" placeholder="Column name" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicKey">
                            <Form.Label>Key</Form.Label>
                            <Form.Control as="textarea" name="key" onChange={this.handleInputChangeKey}  type="key" placeholder="Key value" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicValue">
                            <Form.Label>Value</Form.Label>
                            <Form.Control as="textarea" name="value" onChange={this.handleInputChangeValue}  type="value" placeholder="" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Button variant="primary" type="submit" onClick={this.handleClickSend}> Write </Button>
                        </Form.Group>
                    {/*</Form>*/}
                </Container>
            </div>
        )
    }
}