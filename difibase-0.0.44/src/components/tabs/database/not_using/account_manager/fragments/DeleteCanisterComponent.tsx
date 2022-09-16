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
import wasm_file_actor from "../../../../wasm/wasm-actor.wasm";
// @ts-ignore
import wasm_file_dbs from "../../../../wasm/db.wasm";

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

const DeleteCanisterComponent: React.FC = () => {

    const [delete_canister_id, setValueDeleteCanisterId] = useState(undefined);

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

    const handleInputChangeCanisterId = (event: { target: { value: any; }; }) => {
        setValueDeleteCanisterId(event.target.value);
        console.warn(delete_canister_id);
    }

    const handleClickDeleteCanister = async () => {
        if(user_instances.length > 0){
            // let principal = new Uint8Array(Object.values(principal_bytes));
            user_instances.forEach(i => {
                var v = Object.values(i);
                var instance_canister_id =  String(v[3]);
                if(instance_canister_id == delete_canister_id){
                    let consecutive_number = v[4];
                    let user_principal = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
                    // @ts-ignore
                    let service_canister_principal = v[1] ;
                    // ac.actor_service_instance_manager.rejectCanister(
                    //     // @ts-ignore
                    //     BigInt(consecutive_number),
                    //     user_principal,
                    //     // @ts-ignore
                    //     service_canister_principal).then(isDelete => {
                    //         if(isDelete){
                    //             updateView();
                    //         }
                    // });
                }
            });
        }
    }

    return (

        <div className="white-color">
            <div className="p-1">
                <div className="p-3">
                    <h6 className="coral-color">Delete instance:</h6>
                </div>
                <h6 className="App-text-x-small-green">{'Principal id:' +  ' '  + principal}</h6>
                <h6 className="App-text-x-small-green">{'Delete canister id:' +  ' '  + delete_canister_id}</h6>
                <InputGroup>
                    <input name="key" onChange={handleInputChangeCanisterId}  type="id" placeholder="Canister id"/>
                </InputGroup>
            </div>
            <div className="p-1 ">
                <h1></h1>
                <Button onClick={handleClickDeleteCanister}>Delete</Button>
                <h1> </h1>
            </div>
        </div>

    )
}

export default DeleteCanisterComponent
