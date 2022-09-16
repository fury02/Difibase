import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {useAppSelector} from "../../../../../redux/app/Hooks";
import {selectValues} from "../../../../../redux/features/ic/base/AccountSlice";
import {Transactions} from "../../../../../redux/features/ic/transactions/Transactions";
import {selectTokensBalance} from "../../../../../redux/features/ic/token/TokensBalanceSlice";

import InstallWasmToCanister from "../../../../../util/blockchain/file_operations/not_using/wasm/Install_wasm_ic";
import {plug_web_host, plug_whitelist_connect} from "../../../../../const/Website";
import {Principal} from "@dfinity/principal";

import {selectDbInstance, selectUserInstance} from "../../../../../redux/features/ic/db/instance/UserInstanceSlice";
import { set_user_instances, set_db_instances} from "../../../../../redux/features/ic/db/instance/UserInstanceSlice";
import {useAppDispatch} from "../../../../../redux/app/Hooks";
import {UserInstance} from "../../../../../redux/features/ic/db/instance/UserInstance";

import {Actor_Service_Local} from "../../../../../util/actors/local/Actor_local";
import {Actor_DB} from "../../../../../util/actors/ic_network/Actor_ic_db";

// @ts-ignore
import wasm_file_actor from "../../../../../wasm/wasm-actor.wasm";
// @ts-ignore
import wasm_file_dbs from "../../../../../wasm/db.wasm";

import CreateCanisterComponent from "./fragments/CreateCanisterComponent";
import DeleteCanisterComponent from "./fragments/DeleteCanisterComponent";
import UpdateCanisterComponent from "./fragments/UpdateCanisterComponent";
import {selectWasmObjects} from "../../../../../redux/features/ic/files/wasm/storage/WasmObjectsSlice";

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

const AccountManagerComponent: React.FC = () => {

    const [size_service_canisters, setValueSizeServiceCanisters] = useState(String);

    const dispatch = useAppDispatch();
    //Redux wasm objects - GET
    // const wasm_objects = useAppSelector(selectWasmObjects);
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
    const db_instances_values = useAppSelector(selectDbInstance);
    //Redux database instances - GET
    const user_instanceds_values = useAppSelector(selectUserInstance);

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

    const handleClickDeleteCanister = async () => { }

    return (
        <div className="white-color">
            <div>
                <h4>Manager</h4>

                <div className="row">

                    <div className="row">
                        <div className="col">
                            <div className="p-1">
                                <div className="p-3">
                                    <h6 className="coral-color">Account</h6>
                                </div>
                                <div className="p-1">
                                    <h6 className="App-text-x-small">{'User principal:' +  ' '  +principal}</h6>
                                    <h6 className="App-text-x-small">{'User balance icp:' +  ' '  +balance_icp}</h6>
                                    <h6 className="App-text-x-small">{'User account id:' +  ' '  +account_id}</h6>
                                    <h6 className="App-text-x-small">{'User amount token:' +  ' '  + balance_dbf + ' ' + symbol_dbf}</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="p-3">
                                <UserInstance></UserInstance>
                            </div>
                        </div>
                    </div>

                    {/*<div className="row">*/}
                    {/*    <div className="col">*/}
                    {/*        <div className="p-3">*/}
                    {/*            <h6> </h6>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className="col-2">*/}
                    {/*        <div className="p-3">*/}
                    {/*            <h6> </h6>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className="row">*/}
                    {/*        <div className="col-2">*/}
                    {/*            <div className="p-3">*/}
                    {/*                <h6> </h6>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                </div>

                    <div className="col">
                        <div className="p-3">
                            <CreateCanisterComponent></CreateCanisterComponent>
                        </div>
                    </div>

                    <div className="col-2">
                        <div className="p-3">
                            <UpdateCanisterComponent></UpdateCanisterComponent>
                        </div>
                    </div>

                    <div className="col-2">
                        <div className="p-3">
                            <DeleteCanisterComponent></DeleteCanisterComponent>
                        </div>
                    </div>

            </div>
            <h6>Scenarios for using intsance management</h6>
            <h6>Version: 0.0.1 </h6>
        </div>
    )
}

export default AccountManagerComponent


