import React, {useEffect} from 'react';
import { useState } from 'react';
import {Col, Container, Row, Table} from 'react-bootstrap';
import {Actor_Service_Local} from "../../util/actors/local/Actor_local";
import {string} from "yup";
import {Actor_DB} from "../../util/actors/ic_network/Actor_ic_db";
import {Actor_WASM_STORAGE} from "../../util/actors/ic_network/Actor_ic_wasm_storage";
import {Actor_ADMIN} from "../../util/actors/ic_network/Actor_ic_admin";
import {canister_admin, canister_wasm_storage} from "../../const/Canisters";
import {plug_web_host, plug_whitelist_connect} from "../../const/Website";
import {Principal} from "@dfinity/principal";
import {principalToAccountDefaultIdentifier, toHexString} from "../../util/crypto/AccountUtils";
import {getAccountIdAddress} from "../../util/crypto/BundleAccount";

var ac = new Actor_Service_Local();
// var ac = new Actor_Serv();

var ac_wasm_storage = new Actor_WASM_STORAGE();
var ac_admin = new Actor_ADMIN();

const ScoreboardComponent = () => {
    const [admin_canister_id, setAdminCanisterId] = useState<string>("");
    const [admin_count_clusters, setAdminCountClusters] = useState<string>("");
    const [admin_version, setAdminVersion] = useState<string>("");
    const [admin_size_canister, setAdminSizeCanister] = useState<string>("");
    const [admin_cycles_balance, setAdminCyclesBalance] = useState<string>("");
    const [admin_cycles_available, setAdminCyclesAvailable] = useState<string>("");

    const [wasm_canister_id, setWasmCanisterId] = useState<string>("");
    const [wasm_count_files, setWasmCountFiles] = useState<string>("");
    const [wasm_version, setWasmVersion] = useState<string>("");
    const [wasm_size_canister, setWasmSizeCanister] = useState<string>("");
    const [wasm_cycles_balance, setWasmCyclesBalance] = useState<string>("");
    const [wasm_cycles_available, setWasmCyclesAvailable] = useState<string>("");

    useEffect(() => {
        setAdminCanisterId(canister_admin);
        setWasmCanisterId(canister_wasm_storage);

        // const principal_canister_admin = Principal.fromText(canister_admin);
        // const address_canister_admin = principalToAccountDefaultIdentifier(principal_canister_admin);
        // const principal_canister_wasm= Principal.fromText(canister_wasm_storage);
        // const address_canister_wasm= getAccountIdAddress(principal_canister_wasm);

        async function asyncAction() {

            let adm_count_clusters = await ac_admin.actor_service_admin.count_clusters();
            setAdminCountClusters(adm_count_clusters.toString());
            let adm_version = await ac_admin.actor_service_admin.get_version();
            setAdminVersion(adm_version);
            let adm_size_canister = await ac_admin.actor_service_admin.get_rts_memory_size();
            setAdminSizeCanister(adm_size_canister.toString());
            let adm_cycles_balance = await ac_admin.actor_service_admin.cycles_balance();
            setAdminCyclesBalance(adm_cycles_balance.toString());
            // let adm_cycles_available = await ac_admin.actor_service_admin.cycles_available();
            // setAdminCyclesAvailable(adm_cycles_available.toString());


            let wsm_count_files = await ac_wasm_storage.actor_service_wasm_storage.get_count_files();
            setWasmCountFiles(wsm_count_files.toString());
            let wsm_version = await ac_wasm_storage.actor_service_wasm_storage.get_version();
            setWasmVersion(wsm_version);
            let wsm_size_canister = await ac_wasm_storage.actor_service_wasm_storage.get_rts_memory_size();
            setWasmSizeCanister(wsm_size_canister.toString());
            let wsm_cycles_balance = await await ac_wasm_storage.actor_service_wasm_storage.cycles_balance();
            setWasmCyclesBalance(wsm_cycles_balance.toString());
            // let wsm_cycles_available = await await ac_wasm_storage.actor_service_wasm_storage.cycles_available();
            // setWasmCyclesAvailable(wsm_cycles_available.toString());
        }
        asyncAction();
    }, []);

    return (
            <div className="beige-color">
                <Container>
                    <Row>
                        <Col><h1></h1></Col>
                    </Row>
                    <Row>
                        <Col>Project info <h1></h1></Col>
                        <Col>Service info <h1></h1></Col>
                    </Row>
                    <Row>
                        <Col>
                            <h6 className="text-lg-start" >Difibase - NoSQL database management system on the Internet Computer
                                You can create your own database cluster and have several databases in it.
                                It is possible to create a simple database and and with file support.
                                It is also allowed to integrate their own database versions and use them in this service.
                                Detailed information will be displayed a little later.
                            </h6>
                            <h6>
                                The Quick Start tab contains outdated information, but it is still useful for familiarization
                            </h6>
                            <h6>
                                <text>You can view the source code by clicking on the links.</text>
                                <text>Github source:<a href="https://github.com/fury02/Difibase"> click </a></text>
                            </h6>
                            <h6 className="text-lg-start"><small className="text-muted">This is an experimental project.</small></h6>
                        </Col>
                        <Col>
                            <h6>Admin</h6>
                            <Table striped bordered hover className="table-dark">
                                <thead>
                                <tr className="table-success">
                                    <th>#</th>
                                    <th>Parametrs</th>
                                    <th>Records</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Admin canister id</td>
                                    <td>{admin_canister_id}</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Count clusters</td>
                                    <td>{admin_count_clusters}</td>

                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Version</td>
                                    <td>{admin_version}</td>

                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>Size (bytes)</td>
                                    <td>{admin_size_canister}</td>
                                </tr>
                                <tr>
                                    <td>5</td>
                                    <td>Cycles balance</td>
                                    <td>{admin_cycles_balance}</td>
                                </tr>
                                {/*<tr>*/}
                                {/*    <td>6</td>*/}
                                {/*    <td>Cycles available</td>*/}
                                {/*    <td>{admin_cycles_available}</td>*/}
                                {/*</tr>*/}
                                </tbody>
                            </Table>


                            <h6>Wasm storage</h6>
                            <Table striped bordered hover className="table-dark">
                                <thead>
                                <tr className="table-success">
                                    <th>#</th>
                                    <th>Parametrs</th>
                                    <th>Records</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Wasm canister id</td>
                                    <td>{wasm_canister_id}</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Count files(.wasm)</td>
                                    <td>{wasm_count_files}</td>

                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Version</td>
                                    <td>{wasm_version}</td>

                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>Size (bytes)</td>
                                    <td>{wasm_size_canister}</td>
                                </tr>
                                <tr>
                                    <td>5</td>
                                    <td>Cycles balance</td>
                                    <td>{wasm_cycles_balance}</td>
                                </tr>
                                {/*<tr>*/}
                                {/*    <td>6</td>*/}
                                {/*    <td>Cycles available</td>*/}
                                {/*    <td>{wasm_cycles_available}</td>*/}
                                {/*</tr>*/}
                                </tbody>
                            </Table>
                            <h6 className="transparent-text-color">_</h6>
                            <h6 className="transparent-text-color">_</h6>
                            <h6 className="transparent-text-color">_</h6>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
}
export default ScoreboardComponent;
