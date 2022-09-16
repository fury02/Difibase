import React, {useEffect, useState} from "react";
import {Button, ButtonGroup} from 'react-bootstrap';
import PlugConnectButtonComponent from "./PlugConnectButtonComponent";
import {plug_connect, plug_host_connect, plug_web_host, plug_whitelist_connect} from "../../../const/Website";
import { set_values } from "../../../redux/features/ic/base/AccountSlice";
import {useAppDispatch} from "../../../redux/app/Hooks";
import { Principal } from "@dfinity/principal";
import {getAccountIdAddress} from "../../../util/crypto/BundleAccount";

import {disconnectFromStoicIdentity} from "./LoginStoicIdentityComponent";
import {createHash} from "crypto";
// import pemfile from 'pem-file';

import {set_values_tokens} from "../../../redux/features/ic/token/TokensBalanceSlice";

import {Actor_TOKEN_TEST} from "../../../util/actors/ic_network/Actor_ic_token_test";
import {Actor_TOKEN} from "../../../util/actors/ic_network/Actor_ic_token";

const actor_token = new Actor_TOKEN_TEST();
const ac = actor_token.actor_service_token_test;

// const actor_token = new Actor_TOKEN();
// const ac = actor_token.actor_service_token;


// export interface Balance {
//     value: string;
//     decimals: number;
// }

const LoginPlugIdentityComponent = () =>{
    const dispatch = useAppDispatch();

    useEffect(() => { }, []);
    const updateView = () => { }

    const clickSignInIC = async (connected:any) => {

        let account_id = '';
        let derKeyObj: any;
        let rawKeyObj: any;
        let derKeyUint8Array: unknown;
        let rawKeyUint8Array: unknown;

        var _connected = connected;

        Object.entries(connected).forEach(([key, value]) => {
            if(key == "derKey"){
                derKeyObj = value;
            }
            if(key == "rawKey"){
                rawKeyObj = value;
            }
        });

        Object.entries(derKeyObj).forEach(([key, value]) => {
            if(key == "data"){
                derKeyUint8Array = value;
                // @ts-ignore
                var principal = Principal.selfAuthenticating(value);
                account_id = getAccountIdAddress(principal);
            }
        });

        Object.entries(rawKeyObj).forEach(([key, value]) => {
            if(key == "data"){
                rawKeyUint8Array = value;
            }
        })

        if(derKeyUint8Array != 'undefined' && rawKeyUint8Array != 'undefined'){
            // let a : ArrayBuffer = derKeyUint8Array as ArrayBuffer;
            // let b : ArrayBuffer  = rawKeyUint8Array as ArrayBuffer;
            // var identity = Secp256k1KeyIdentity.fromKeyPair(derKeyUint8Array as ArrayBuffer, rawKeyUint8Array as ArrayBuffer);

            // var identity = Ed25519KeyIdentity.fromSecretKey(rawKeyUint8Array as ArrayBuffer);
        }

        // function decode(rawKey: Uint8Array): Ed25519KeyIdentity{
        //     if (rawKey.length != 85) {
        //         throw 'expecting byte length 85 but got ' + rawKey.length;
        //     }
        //     let secretKey = Buffer.concat([rawKey.slice(16, 48), rawKey.slice(53, 85)]);
        //     return Ed25519KeyIdentity.fromSecretKey(secretKey);
        // }

        let principal = await (window as any)?.ic?.plug?.agent.getPrincipal();
        var principal_bytes = principal._arr;
        let principal_txt = String(principal);

        let token_decimals = await ac.decimals();
        let token_balance = await ac.getBalanceOf(principal_txt);
        let token_symbol = await ac.symbol();

        let token = (parseInt(String(token_balance), 10) / 10 ** token_decimals).toString();

        let balance_icp = await (window as any)?.ic?.plug?.requestBalance();

        // Redux
        dispatch(set_values([plug_connect, principal_txt, balance_icp[0].amount.toString(), account_id, principal_bytes]));
        dispatch(set_values_tokens([token.toString(), token_symbol, token_balance.toString()]));

        console.warn(principal);
    };

    const clickSignOutIC_Clean = () =>{
        dispatch(set_values(['', '', '']));
        dispatch(set_values_tokens(['', '', '']));
    }

    return (
        <div className="white-color">
            <div className="div_logins_button_centr">
                <ButtonGroup vertical>
                    <PlugConnectButtonComponent onConnectCallback={(connected) => clickSignInIC(connected)}></PlugConnectButtonComponent>
                    <h6></h6>
                    <Button className="btn btn-info min-logins-button" size="lg"  onClick={clickSignOutIC_Clean}>Disconnect</Button>
                    <h6></h6>
                </ButtonGroup>
            </div>
        </div>
    );
}

export default LoginPlugIdentityComponent;

