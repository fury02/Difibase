import React from 'react';
import { useState } from 'react';
import {Col, Container, Row, Table} from 'react-bootstrap';
import {Actor_Service_Local} from "../../util/actors/local/Agent_local";
import {string} from "yup";
import {Actor_DBS} from "../../util/actors/ic_network/Agent_ic_dbs";
var ac = new Actor_Service_Local();
// var ac = new Actor_Serv();

class ScoreboardComponent extends React.Component{

    state = {
        service_canister_id: string,
        service_max_buckets: string,
        service_freezing_threshold: string,
        service_compute_allocation: string,
        service_memory_allocation: string,
        service_generated_buckets: string,
        service_using_memory_size: string,
        service_created_tables: string,
    };
    componentDidMount(){
        ac.actor_service_dbs.ui_service_canister_id().then(i => {
            console.log(i);
            this.setState({service_canister_id:i})});
        ac.actor_service_dbs.ui_service_generated_buckets().then(i => {
            console.log(i);
            this.setState({service_generated_buckets:i})});
        ac.actor_service_dbs.ui_service_using_memory_size().then(i => {
            console.log(i);
            this.setState({service_using_memory_size:i})});
        ac.actor_service_dbs.ui_service_created_tables().then(i => {
            console.log(i);
            this.setState({service_created_tables:i})});
        ac.actor_service_dbs.ui_service_max_buckets().then(i => {
            console.log(i);
            this.setState({service_max_buckets:i})});
        ac.actor_service_dbs.ui_service_freezing_threshold().then(i => {
            console.log(i);
            this.setState({service_freezing_threshold:i})});
        ac.actor_service_dbs.ui_service_compute_allocation().then(i => {
            console.log(i);
            this.setState({service_compute_allocation:i})});
        ac.actor_service_dbs.ui_service_memory_allocation().then(i => {
            console.log(i);
            this.setState({service_memory_allocation:i})});
    }
    render() {

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
                            <h6 className="text-lg-start" >Difibase is an experimental project. Funded by the Dfinity Foundation.
                                The goal of the project is to create a database (nosql) on the Internet computer (IC) blockchain
                                Below are links to the source code of the project.</h6>
                            <h6></h6>
                            <h6>
                                <text>Github: </text>
                                <text> backend:<a href="https://github.com/fury02/service-public-version"> click </a></text>
                                <text>; web-ui:<a href="https://github.com/fury02/service-web-ui"> click</a></text>
                                <text>; developer version, completely untested (fixed bugs):<a href="https://github.com/fury02/service-dev-version"> click</a></text>
                            </h6>
                            <h6 className="text-lg-start"><small className="text-muted">If there is a need for long-term testing, write to me by email safiullin@protonmail.com; furysafik@gmail.com; I will update the canisters and throw the cycles</small></h6>
                            <h6><text className="small">You can learn more about the API in the Quick Start tab.</text></h6>
                            <h6><text className="small">If you want to launch your service, some information will be provided on integration into your project in the Integration tab.</text></h6>
                        </Col>
                        <Col>
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
                                    <td>Service canister id</td>
                                    <td>{this.state.service_canister_id}</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Service generated disk(buckets)</td>
                                    <td>{this.state.service_generated_buckets}</td>

                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Using memory (byte)</td>
                                    <td>{this.state.service_using_memory_size}</td>

                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>Created tables database</td>
                                    <td>{this.state.service_created_tables}</td>
                                </tr>
                                <tr>
                                    <td>5</td>
                                    <td>Maximum number of disks(buckets)</td>
                                    <td>{this.state.service_max_buckets}</td>
                                </tr>
                                <tr>
                                    <td>6</td>
                                    <td>Freezing threshold (sec)</td>
                                    <td>{this.state.service_freezing_threshold}</td>
                                </tr>
                                <tr>
                                    <td>7</td>
                                    <td>Compute allocation (percent)</td>
                                    <td>{this.state.service_compute_allocation}</td>
                                </tr>
                                <tr>
                                    <td>8</td>
                                    <td>Memory allocation disk(byte)</td>
                                    <td>{this.state.service_memory_allocation}</td>
                                </tr>
                                </tbody>
                            </Table>
                            {/*<h5 className="text-lg-start">Sample:</h5>*/}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ScoreboardComponent;
