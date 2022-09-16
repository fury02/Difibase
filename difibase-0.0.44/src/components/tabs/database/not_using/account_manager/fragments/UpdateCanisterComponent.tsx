import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {useAppSelector} from "../../../../../../redux/app/Hooks";
import {selectValues} from "../../../../../../redux/features/ic/base/AccountSlice";
import {Transactions} from "../../../../../../redux/features/ic/transactions/Transactions";
import {selectTokensBalance} from "../../../../../../redux/features/ic/token/TokensBalanceSlice";
import {Actor_Service_Local} from "../../../../../../util/actors/local/Actor_local";
import {Actor_DB} from "../../../../../../util/actors/ic_network/Actor_ic_db";
import InstallWasmToCanister from "../../../../../../util/blockchain/file_operations/not_using/wasm/Install_wasm_ic";
import {plug_web_host, plug_whitelist_connect} from "../../../../../../const/Website";
import {Principal} from "@dfinity/principal";

import {selectDbInstance, selectUserInstance} from "../../../../../../redux/features/ic/db/instance/UserInstanceSlice";
import { set_user_instances, set_db_instances} from "../../../../../../redux/features/ic/db/instance/UserInstanceSlice";
import {useAppDispatch} from "../../../../../../redux/app/Hooks";
import {UserInstance} from "../../../../../../redux/features/ic/db/instance/UserInstance";

// @ts-ignore
import wasm_file_cycle from "../../../../../../wasm/support_cycle.wasm";
// @ts-ignore
import wasm_file_actor from "../../../../../../wasm/wasm-actor.wasm";
// @ts-ignore
import wasm_file_dbs from "../../../../../../wasm/db.wasm";

var ac = new Actor_Service_Local();

export interface Canister {
    'value_hash' : [] | [string],
    'name' : string,
    'canister_id' : Principal,
    'wasm' : [] | [Array<number>],
    'description' : string,
    'wasm_hash' : [] | [Array<number>],
}

export interface UserIdentity {
    'user_principal' : Principal,
    'instance_id' : string,
    'consecutive_number' : bigint,
}

export interface UserInstance {
    'value_hash' : [] | [string],
    'user_principal' : Principal,
    'instance_id' : string,
    'canister_id' : Principal,
    'consecutive_number' : bigint,
}

enum UpdateMode { Upgrade, Reinstall, Install, Unknown}

const UpdateCanisterComponent: React.FC = () => {

    const [wasmToInstall, setFileInstallWasmToCanister] = useState([] as InstallWasmToCanister[]);
    const [canister_id, setValueCanisterPrincipalId] = useState(undefined);
    const [update_canister_id, setValueUpdateCanisterId] = useState(undefined);
    const [update_canister_result, setValueUpdateCanisterResult] = useState(false);
    const [number_canister_id, setValueCanisterNumberId] = useState(undefined);
    const [update_mode, setValueUpdateMode] = useState(UpdateMode.Unknown);


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
    //Redux instances - GET
    const db_instances = useAppSelector(selectDbInstance);
    //Redux database instances - GET
    const user_instances = useAppSelector(selectUserInstance);

    useEffect(() => {
        async function managerAction() {
            const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
            // var canisters = await ac.actor_service_instance_manager.getCanisters();
            // var user_canisters = await ac.actor_service_instance_manager.getUserCanisters(principal_user);
            // dispatch(set_user_instances(user_canisters));
            // dispatch(set_db_instances(canisters));
        }
        managerAction();
    }, [])

    const updateView = async () => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        // var canisters = await ac.actor_service_instance_manager.getCanisters();
        // var user_canisters = await ac.actor_service_instance_manager.getUserCanisters(principal_user);
        // dispatch(set_user_instances(user_canisters));
        // dispatch(set_db_instances(canisters));
    }

    if(values_token.length > 0) {
        balance_dbf = values_token[0].toString();
        symbol_dbf = values_token[1];
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;
        if(!files) return;

        let wasmToInstall: InstallWasmToCanister[] = [];

        if(files.length == 1){
            wasmToInstall.push(new InstallWasmToCanister(files[0], canister_id, number_canister_id));
        }

        setFileInstallWasmToCanister(wasmToInstall);
    };

    const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value == "Default"){
            setValueUpdateMode(UpdateMode.Upgrade);
        }
        if(e.target.value == "Upgrade"){
            setValueUpdateMode(UpdateMode.Upgrade);
        }
        else if(e.target.value == "Reinstall"){
            setValueUpdateMode(UpdateMode.Reinstall);
        }
        else if(e.target.value == "Install"){
            setValueUpdateMode(UpdateMode.Install);
        }
        else{
            setValueUpdateMode(UpdateMode.Unknown);
        }

    };

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(user_instances.length > 0){
            user_instances.forEach(i => {
                var val = Object.values(i);
                var this_canister_id =  val[3];
                if(String(this_canister_id) == update_canister_id){
                    // @ts-ignore
                    if(wasmToInstall.length > 0){
                        // @ts-ignore
                        wasmToInstall[0].DeployCanisterMode(this_canister_id, update_mode).then(isUpdated => {
                            // @ts-ignore
                            setValueUpdateCanisterResult(isUpdated);
                        });
                    }
                }
            });
        }
    };

    const handleInputChangeCanisterId = async (event: { target: { value: any; }; }) => {
        setValueUpdateCanisterId(event.target.value);
        console.warn(update_canister_id);
    }

    return (
        <div className="white-color">
            <div className="p-1">
                <div className="p-3">
                    <h6 className="coral-color">Update instance:</h6>
                    <h6 className="coral-color text-smaller">(Update, reinstall any wasm to an already functioning canister)</h6>
                </div>
                <h6 className="App-text-x-small-green">{'Principal id:' +  ' '  + principal}</h6>
                <h6 className="App-text-x-small-green">{'Update canister id:' +  ' '  + update_canister_id}</h6>
                <h6 className="App-text-x-small-green">{'Update result:' +  ' '  + update_canister_result}</h6>
            </div>

            <InputGroup>
                <input name="key" onChange={handleInputChangeCanisterId}  type="id" placeholder="Canister id"/>
            </InputGroup>

            <Form id="file_upload" onSubmit={onFormSubmit}>
                <div className="upload-file-select">
                    <label htmlFor="file_1">Select (.wams) file for update in canister</label>
                    <input id="file_1" type="file" multiple onChange={onFileChange}/>
                </div>
                <div className="upload-file-list">
                    {wasmToInstall.map((f,i) => <div className="upload-file" key={i}>{f.file.name} - {f.file.size}bytes</div>)}
                </div>

                {/*<div>*/}

                <h6 className="beige-color text-smaller">Mode:</h6>

                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadioDefault"
                           value="Default" checked onChange={onRadioChange}/>
                    <label className="form-check-label" htmlFor="inlineRadio2">Default</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadioUpgrade"
                           value="Upgrade" onChange={onRadioChange}/>
                    <label className="form-check-label" htmlFor="inlineRadio2">Upgrade</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadioReInstall"
                           value="Reinstall" onChange={onRadioChange}/>
                    <label className="form-check-label" htmlFor="inlineRadio1">Re-install</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadioInstall"
                           value="Install" disabled onChange={onRadioChange}/>
                    <label className="form-check-label" htmlFor="inlineRadio3">Install</label>
                </div>

                <div className="p-1 ">
                    <h1></h1>
                    <Button type="submit" value="Update" >Update</Button>
                    <h1></h1>
                </div>
            </Form>

        </div>
    )
}

export default UpdateCanisterComponent
