import React, {Component} from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import {Col, Container, Form, FormControl, InputGroup, Row, Stack, Table} from 'react-bootstrap';
import {Actor_Service_Local} from "../../../../../../util/actors/local/Actor_local";
import {Actor_DB} from "../../../../../../util/actors/ic_network/Actor_ic_db";
import Button from "react-bootstrap/Button";
import FileToUpload from "../../../../../../util/blockchain/file_operations/files/Upload_blockchain_ic";
import {useAppSelector} from "../../../../../../redux/app/Hooks";
import {selectSelectedInstance} from "../../../../../../redux/features/ic/db/cluster-instance/ClusterInstanceSlice";
import {Actor_DATABASE_EASY} from "../../../../../../util/actors/ic_network/Actor_ic_db_easy";
import {Divider, FormHelperText, Input, InputLabel} from "@material-ui/core";
import classes from "*.module.sass";

export class AddEntityesTableComponent extends Component{

    constructor(props: any){
        super(props);
        this.handleInputChangeTable = this.handleInputChangeTable.bind(this);
        this.handleInputChangeColumn = this.handleInputChangeColumn.bind(this);
        this.handleInputChangeEntityesKey = this.handleInputChangeEntityesKey.bind(this);
        this.handleInputChangeEntityesValue = this.handleInputChangeEntityesValue.bind(this);
        this.handleClickSend = this.handleClickSend.bind(this);
    }

    state = {
        table:null,
        entityes_key:null,
        column:null,
        entityes_value:null,
    }

    handleInputChangeTable(event: { target: { value: any; }; }) {
        const temp = event.target.value.toString();
        this.setState({
            table: temp
        });
        console.warn(this.state)
    }

    handleInputChangeColumn(event: { target: { value: any; }; }) {
        const temp = event.target.value.toString();
        this.setState({
            column: temp
        });
        console.warn(this.state)
    }

    handleInputChangeEntityesKey(event: { target: { value: any; }; }) {
        const temp = event.target.value.toString();
        this.setState({
            entityes_key: temp
        });
        console.warn(this.state)
    }

    handleInputChangeEntityesValue(event: { target: { value: any; }; }) {
        const temp = event.target.value.toString();
        this.setState({
            entityes_value: temp
        });
        // console.warn(this.state)
    }

    public async handleClickSend( ) {
        let values = this.props;
        var id = Object.values(values)[0];
        if(id != "aaaaa-aa"){
            // @ts-ignore
            const ac_instance_this = new Actor_DATABASE_EASY(id);
            if(this.state.table != null &&
                this.state.table != 'undefined' &&
                this.state.column != null &&
                this.state.column != 'undefined' &&
                this.state.entityes_key != null &&
                this.state.entityes_key != 'undefined' &&
                this.state.entityes_value != null &&
                this.state.entityes_value  != 'undefined'){
                let result = await ac_instance_this.actor_service_db_easy.replace_value(
                    this.state.table,
                    this.state.column,
                    this.state.entityes_key,
                    this.state.entityes_value);
                alert("save");
            }
        };
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
                            <Form.Control as="textarea" name="key" onChange={this.handleInputChangeEntityesKey}  type="key" placeholder="Key value" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicValue">
                            <Form.Label>Save value</Form.Label>
                            <Form.Control as="textarea" name="save" onChange={this.handleInputChangeEntityesValue}  type="save" placeholder="Save value" />
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