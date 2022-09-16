import React, {useEffect} from 'react';
import { useState } from 'react';
import {Button, Col, Container, Row, Table} from 'react-bootstrap';
import {Actor_Service_Local} from "../../../util/actors/local/Actor_local";
import {string} from "yup";
import {Actor_DB} from "../../../util/actors/ic_network/Actor_ic_db";
import {useAppDispatch} from "../../../redux/app/Hooks";
import {plug_web_host, plug_whitelist_connect} from "../../../const/Website";
import {getAccountIdAddress} from "../../../util/crypto/BundleAccount";
import {Principal} from "@dfinity/principal";
import HistoryOperations from "../../../util/blockchain/account/history/HistoryOperations";
import {set_transactions} from "../../../redux/features/ic/transactions/TransactionsSlice";
import {set_values} from "../../../redux/features/ic/base/AccountSlice";
import {Transactions} from "../../../redux/features/ic/transactions/Transactions";

// var ac = new Actor_Local();
var ac = new Actor_DB();

const IntegrationComponent = () => {
    const [service_canister_id, setCanisterId] = useState<string>("");
    useEffect(() => {
        ac.actor.ui_service_canister_id().then(i => {
            console.log(i);
            setCanisterId(i)});
       updateView();
    }, [])
    const updateView = async () => {  }
    return(
        <div className="badge bg-light flex-sm-column d-flex justify-content-center">
            <Container>
                <Row>
                    <Col>
                        <h1></h1>
                        <a href="#" className="text-decoration-none text-lg-center fs-4">Integration:</a>
                        <h1></h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1></h1>
                        <h6 className="text-lg-start">
                            <text className="text-black">1) You need to initialize the actor and agent, you can read the material on the website</text>
                            <text className="text-black"><a href="https://smartcontracts.org/docs/http-middleware.html#_agent_and_actor_creation">link</a></text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">And also see the source code of this version of frontend</text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">There are two use cases. Create your own service or test the official one.</text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">General information will be provided below.</text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">You can skip some of the information and use a working service. Service ID:  {service_canister_id}</text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">2) If you decide to deploy your own service (database) using the software sources </text>
                            <text className="text-black"><a href="https://github.com/fury02/service-public-version"> link</a></text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">3) You should generate the ".dfx" files by deploying on the local SDK Dfinity (IC) </text>
                            <text className="text-black"><a href="https://smartcontracts.org/docs/quickstart/local-quickstart.html"> link</a></text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">(The functions may be updated so it is better to re-generate)</text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">Using commands:</text>
                        </h6>
                        <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx start</code></h6>
                        <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx deploy difi</code></h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">To create an actor (an intermediary between your application and the Ic network of your canister)</text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">You will use files with the extension "***.did.js" and "***.did.d.ts" </text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">There are several import options, I use them directly (copy to the dfxgen folder)</text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">But this is not enough for proper initialization of the actor</text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">4) In the keysmith utility, you must generate a new identity (a private - public key bundle)</text>
                            <text className="text-black"><a href="https://github.com/dfinity/keysmith"> link</a></text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">5)  Next, already working with the network and not with the local SDK, create a file "canister_ids.json"</text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">Official documentation can help you, as well as information provided by "dank"</text>
                            <text className="text-black"><a href="https://docs.dank.ooo/xtc/canister-development/"> link</a></text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">6) After all the operations, you can initialize the actor correctly. Something like this:</text>
                        </h6>
                        <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>var act = Actor.createActor({});</code></h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">7) At the final stage, you collect the code and send it to the previously created canister of the IC network.</text>
                        </h6>
                        <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx deploy --network=ic</code></h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">At this stage, there is no possibility of commercial operation of this service. The service is in test operation mode.</text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">You can create your own service using this source code and work with it at your own risk. </text>
                        </h6>
                        <h6 className="text-lg-start">
                            <text className="text-black">Work and development will continue and in the future integration into your project will become seamless and really fast.</text>
                        </h6>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
export default IntegrationComponent;
