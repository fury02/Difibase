import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {useAppSelector} from "../../../../../redux/app/Hooks";
import {selectValues} from "../../../../../redux/features/ic/base/AccountSlice";
import {Transactions} from "../../../../../redux/features/ic/transactions/Transactions";
import {selectTokensBalance} from "../../../../../redux/features/ic/token/TokensBalanceSlice";
import {Actor_Service_Local} from "../../../../../util/actors/local/Agent_local";
import {Actor_DBS} from "../../../../../util/actors/ic_network/Agent_ic_dbs";
import InstallWasmToCanister from "../../../../../util/blockchain/file_operations/Install_wasm_ic";
import {plug_web_host, plug_whitelist_connect} from "../../../../../const/Website";
import {Principal} from "@dfinity/principal";

import {selectDbInstance, selectUserInstance} from "../../../../../redux/features/ic/db/instance/UserInstanceSlice";
import { set_user_instances, set_db_instances} from "../../../../../redux/features/ic/db/instance/UserInstanceSlice";
import {useAppDispatch} from "../../../../../redux/app/Hooks";
import {UserInstance} from "../../../../../redux/features/ic/db/instance/UserInstance";

// @ts-ignore
import wasm_file_cycle from "../../../../../wasm/support_cycle.wasm";
// @ts-ignore
import wasm_file_actor from "../../../../../wasm/wasm-actor.wasm";
// // @ts-ignore
// import wasm_file_dbs from "../../../../../wasm/dbs.wasm";
// @ts-ignore
import wasm_file_dbs from "../../../../../wasm/dbs_shrink.wasm";

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

const CreateCanisterComponent: React.FC = () => {

    const [created_canister_id, setValueCreatedCanisterPrincipalId] = useState(String);
    const [size_service_canisters, setValueSizeServiceCanisters] = useState(String);

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

    useEffect(() => {
        async function managerAction() {
            const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
            var canisters = await ac.actor_service_instance_manager.getCanisters();
            var user_canisters = await ac.actor_service_instance_manager.getUserCanisters(principal_user);
            dispatch(set_user_instances(user_canisters));
            dispatch(set_db_instances(canisters));
        }
        managerAction();
    }, [])

    const updateView = async () => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        var canisters = await ac.actor_service_instance_manager.getCanisters();
        var user_canisters = await ac.actor_service_instance_manager.getUserCanisters(principal_user);
        dispatch(set_user_instances(user_canisters));
        dispatch(set_db_instances(canisters));
    }

    if(values_token.length > 0) {
        balance_dbf = values_token[0].toString();
        symbol_dbf = values_token[1];
    }

    const handleClickCreateCanister = async () => {
        // fetch(wasm_file_dbs)
        fetch(wasm_file_cycle)
        // fetch(wasm_file_actor)
            .then(response => response.arrayBuffer())
            .then(function(ab) {
                const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
                let wasm_binary = Array.from(new Uint8Array(ab));
                ac.actor_service_instance_manager.deployCanister(wasm_binary, principal_user, "").then(responce_ic => {
                    setValueCreatedCanisterPrincipalId(responce_ic[1]);
                    updateView();
                });
                ac.actor_service_instance_manager.getSizeServiceCanisters().then(size_service_canisters => {
                    setValueSizeServiceCanisters(String(size_service_canisters));
                });
            });
    }

    return (

        <div className="white-color">
            <div className="p-1">
                <div className="p-3">
                    <h6 className="coral-color">Installing instance:</h6>
                    <h6 className="coral-color text-smaller">(Default install dbs.wasm)</h6>
                </div>
                <h6 className="App-text-x-small-green">{'Cycles:' +  ' ' + '(coming soon)'}</h6>
                <h6 className="App-text-x-small-green">{'Principal (owner):' +  ' '  + principal}</h6>
                {/*<h6 className="App-text-x-small-green">{'Service size:' +  ' '  + size_service_canisters}</h6>*/}
                <h6 className="App-text-x-small-green">{'Canister created:' +  ' '  + created_canister_id}</h6>
            </div>
            <div className="p-1 ">
                <h1></h1>
                <Button onClick={handleClickCreateCanister}>Install</Button>
                <h1></h1>
            </div>
        </div>

        )
}

export default CreateCanisterComponent

