import React, {useEffect, useState} from "react";
import {Button, ButtonGroup, Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {Actor, HttpAgent, Identity} from "@dfinity/agent";
import { DelegationIdentity } from "@dfinity/identity";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import {canister_ii} from "../../../const/Canisters";
import {host_web_http_ii_boundary, host_web_http_ii_identity} from "../../../const/Website";

export const LoginDfinityIdentityComponent: React.FC = () => {
    const [http_identity, setHttpIdentity] = useState<string | null>(null);
    const [http_boundary, setHttpBoundary] = useState<string | null>(null);
    const [identity_value, setInputValue] = useState<string>("");
    const [canister, setCanister] = useState<string | null>(null);
    const [max_time_to_live, setMaxTimeToLive] = useState<number | null>(null);
    const [authClient, setAuthClient] = useState<AuthClient | null>(null);
    const [identity, setIdentity] = useState<Identity | null>(null);
    const [principal, setPrincipal] = useState<Principal | null>(null);

    useEffect(() => {
        setHttpIdentity(host_web_http_ii_identity);
        setHttpBoundary(host_web_http_ii_boundary);
        setCanister(canister_ii);
        setMaxTimeToLive(500_000_000);
        AuthClient.create().then(i => {
            setAuthClient(i);
            let identity = i.getIdentity()
            setIdentity(identity);
            setPrincipal(identity.getPrincipal());
            console.warn(identity);
            console.warn(principal);
        });
    }, []);

    const updateView = () => {
        if(authClient != null){
            const identity = authClient.getIdentity();
            const principal  = identity.getPrincipal();
            setInputValue(principal.toText);
        }
    }

    const clickSignInIC= () =>{
        if(max_time_to_live != null && authClient != null && http_identity != null){
            if (BigInt(max_time_to_live) > BigInt(0)) {
                authClient.login({
                    identityProvider: http_identity,
                    maxTimeToLive: BigInt(max_time_to_live),
                    onSuccess: updateView
                })
            } else {
                authClient.login({
                    identityProvider: http_identity,
                    onSuccess: updateView
                });
            }
        }
    };

    const clickSignOutIC = () =>{
        if(authClient != null){
            authClient.logout();
        }
        setInputValue("");
        updateView();
    }

    return (
        <div>
            <div className="d-flex align-items-center justify-content-center">
                <h4>Internet Identity (Dfinity)</h4>
            </div>
            <div className="d-flex align-items-center justify-content-center">
                <h4>{identity_value}</h4>
            </div>
            <div className="div_logins_button_centr">
                <ButtonGroup vertical>
                    <Button className="btn btn-info min-logins-button" size="lg"  onClick={clickSignInIC}>Connect to II</Button>
                    <h6></h6>
                    <Button className="btn btn-info min-logins-button" size="lg"  onClick={clickSignOutIC}>Disconnect</Button>
                    <h6></h6>
                </ButtonGroup>
            </div>
        </div>
    );
}

export default LoginDfinityIdentityComponent;
