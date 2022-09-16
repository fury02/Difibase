import React, {Component, useEffect} from 'react';
import { render } from "react-dom";
import { useState } from 'react';
import {Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {Actor_Service_Local} from "../../../../../../util/actors/local/Actor_local";
import {Actor_DB} from "../../../../../../util/actors/ic_network/Actor_ic_db";
import FileToUpload from "../../../../../../util/blockchain/file_operations/files/Upload_blockchain_ic";
import {AddEntityesTableComponent} from "./AddEntityesTableComponent";
import {UploadFileComponent} from "./UploadFileComponent";

var ac = new Actor_Service_Local();

export const GetEntityesTableComponent: React.FC = () => {
    const [table_id, setValueTable] = useState(null);
    const [data, setArrayData] = useState<Array<any>>( []);
    const [column, setArrayColumn] = useState<Array<any>>([]);

    let onClearArrayData = () => { };
    let onClearArrayColumn = () => { };

    const get_table_entityes = (table_id: string) => {
        if(table_id != null){
            const json = ac.actor_service_db_files.get_table_entityes_json(table_id).then(json =>
            {
                var arr_json = JSON.parse(json);
                if(Array.isArray(arr_json))
                {
                    if(arr_json.length > 0){
                        setArrayData(arr_json);
                        var keys_column = Object.keys(arr_json[0]);
                        setArrayColumn(keys_column);
                        console.warn(data);
                    }
                }
            });
        }
    }

    useEffect(() => {
        if(table_id != null) { get_table_entityes(table_id);}
    }, []);

    const handleInputChangeTable = (event: { target: { value: any; }; }) => {
        setValueTable(event.target.value);
        if(event.target.value != null) { get_table_entityes(event.target.value);}
        console.warn(table_id);
    };

    // get table heading
    const ThData = () =>{
        return column.map((data)=>{
            return <th className="beige-color" key={data}>{data}</th>
        })
    };
    // get table row
    const TdData = () => {
        return data.map((data)=>{
            return(
                <tr className="white-color">
                    {
                        column.map((v)=>{
                            return <td>{data[v]}</td>
                        })
                    }
                </tr>
            )
        })
    };

    return(
        <div className="App-header">
            <Container>
                {/*<h5 className="">Table</h5>*/}
                <Form id="file_upload"  >
                    <Form.Group className="mb-3" controlId="formBasicKey">
                        <Form.Label>Table ID</Form.Label>
                        <Form.Control as="textarea" name="table_id" onChange={handleInputChangeTable}  type="table_id" placeholder="Enter table(key)" />
                    </Form.Group>
                </Form>

                {/*<table className="table">*/}
                {/*    <tbody style={{'height': '200px', 'overflow':'scroll', 'display': 'block'}}>*/}
                {/*    <thead style={{'display': 'block'}}>*/}
                {/*    <tr>{ThData()}</tr>*/}
                {/*    </thead>*/}
                {/*    <tbody > {TdData()} </tbody>*/}
                {/*    </tbody>*/}
                {/*</table>*/}

                <table className="table">
                    <thead>
                    <tr>{ThData()}</tr>
                    </thead>
                    <tbody> {TdData()} </tbody>
                </table>
            </Container>
        </div>

    )
}