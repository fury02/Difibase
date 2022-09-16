import React, {Component, useEffect} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    Input,
    InputLabel,
    TextField,
    Typography,
    Paper,

    styled
} from '@material-ui/core';
import { render } from "react-dom";
import { useState } from 'react';
import {Col, Container, Form, InputGroup, Row, Table} from 'react-bootstrap';
import {Actor_Service_Local} from "../../../../util/actors/local/Actor_local";
import {Actor_DB} from "../../../../util/actors/ic_network/Actor_ic_db";
import InstallWasmIC from "../../../../util/blockchain/file_operations/wasm/Install_wasm_ic";
import {AddEntityesTableComponent} from "../../examples/local_db/fragments/tables_create_upload/AddEntityesTableComponent";
import {UploadFileComponent} from "../../examples/local_db/fragments/tables_create_upload/UploadFileComponent";
import {GetEntityesTableComponent} from "../../examples/local_db/fragments/tables_create_upload/GetEntityesTableComponent";
import {DeleteEntityTableComponent} from "../../examples/local_db/fragments/tables-download-delete/DeleteEntityTableComponent";
import {DeleteRowEntityTableComponent} from "../../examples/local_db/fragments/tables-download-delete/DeleteRowEntityTableComponent";
import {DownloadFileComponent} from "../../examples/local_db/fragments/tables-download-delete/DownloadFileComponent";
import FileToDownload from "../../../../util/blockchain/file_operations/files/Download_blockchain_ic";
import TablesCreateUploadComponent from "../../examples/local_db/TablesCreateUploadComponent";
import {useAppDispatch, useAppSelector} from "../../../../redux/app/Hooks";
import {selectValues} from "../../../../redux/features/ic/base/AccountSlice";
import {selectTokensBalance} from "../../../../redux/features/ic/token/TokensBalanceSlice";
import {Principal} from "@dfinity/principal";

var ac = new Actor_Service_Local();

export const InstanceLonerCreateComponent: React.FC = () => {

    const [wasmToInstall, setFileInstallWasmToCanister] = useState([] as InstallWasmIC[]);
    const [canister_id, setValueCanisterPrincipalId] = useState('');


    //Redux
    const dispatch = useAppDispatch();
    //Redux account - GET
    const values = useAppSelector(selectValues);
    const principal = values[1];
    const balance_icp = values[2];
    const account_id = values[3];
    const principal_bytes = values[4];
    //Redux account tokens - GET
    const values_token = useAppSelector(selectTokensBalance);
    let balance_dbf = '';
    let symbol_dbf = '';

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;
        if(!files) return;

        let wasmToInstall: InstallWasmIC[] = [];

        if(files.length == 1){
            wasmToInstall.push(new InstallWasmIC(files[0]));
        }

        setFileInstallWasmToCanister(wasmToInstall);
    };

    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        e.preventDefault();
        var result = await wasmToInstall[0].DeployCanister(principal_user);
        if(result != ''){
            alert("Installing" + " " + " canister id: " + result);
            // @ts-ignore
            setValueCanisterPrincipalId("Canister:" + " " + result);
        }
        else {
            alert("Installing" + " " + "error " );
            setValueCanisterPrincipalId('');
        }

    };

    if(values_token.length > 0) {
        balance_dbf = values_token[0].toString();
        symbol_dbf = values_token[1];
    }

    //Test view
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));


    return (
        <div className="white-color">

            <div className="p-1">
                <h6 className="App-text-x-small">{'User principal:' +  ' '  +principal}</h6>
                <h6 className="App-text-x-small">{'User balance icp:' +  ' '  +balance_icp}</h6>
                <h6 className="App-text-x-small">{'User account id:' +  ' '  +account_id}</h6>
                <h6 className="App-text-x-small">{'User amount token:' +  ' '  + balance_dbf + ' ' + symbol_dbf}</h6>
            </div>
            <h6 className='transparent-text-color'>_</h6>
            <h6 className='transparent-text-color'>_</h6>
            <h6 className='transparent-text-color'>_</h6>
            <Grid container spacing={3}>
                <Grid item xs={5}>
                    <h6 className="coral-color">Use outside the cluster.</h6>
                    <h6 className="coral-color">Write down the canister_id.</h6>
                    <h6 className="coral-color">It will not be visible in the system.</h6>
                </Grid>
                <Grid item xs={4}>
                    <div className="upload-form">
                        <h6> </h6>
                        <h6 className="coral-color">Install dbs.wasm; dbs-shrink.wasm file.</h6>
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
                </Grid>
                <Grid item xs={2}>
                    <h6>{canister_id}</h6>
                </Grid>
            </Grid>
        </div>
    );
}

export default InstanceLonerCreateComponent;