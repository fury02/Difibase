import React, {useEffect, useState} from "react";
import {ButtonGroup} from 'react-bootstrap';
import PlugConnectButtonComponent from "./PlugConnectButtonComponent";
import {plug_connect, plug_host_connect, plug_web_host, plug_whitelist_connect} from "../../../const/Website";
import { set_values } from "../../../redux/features/ic/base/AccountSlice";
import {useAppDispatch} from "../../../redux/app/Hooks";
import { Principal } from "@dfinity/principal";
import {getAccountId} from "../../../util/crypto/BundleAccount";

import {Actor_TOKEN_TEST} from "../../../util/actors/ic_network/Agent_ic_token_test";
import {set_values_tokens} from "../../../redux/features/ic/token/TokensBalanceSlice";
const actor_token = new Actor_TOKEN_TEST();

// import {Actor_TOKEN} from "../../../util/actors/ic_network/Agent_ic_token";
// import {set_values_tokens} from "../../../redux/features/ic/token/TokensBalanceSlice";
// const actor_token = new Actor_TOKEN();

const ac = actor_token.actor;

export interface Balance {
    value: string;
    decimals: number;
}

const LoginPlugIdentityComponent = () =>{
    const dispatch = useAppDispatch();

    useEffect(() => { }, []);
    const updateView = () => { }

    const clickSignInIC = async (connected:any) => {

        let account_id = '';
        let derKeyUint8Array: any;
        Object.entries(connected).forEach(([key, value]) => {
            if(key == "derKey"){
                derKeyUint8Array = value
            }
        });

        Object.entries(derKeyUint8Array).forEach(([key, value]) => {
            if(key == "data"){
                // @ts-ignore
                var principal = Principal.selfAuthenticating(value);
                account_id = getAccountId(principal);
            }
        });

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

    const clickSignOutIC = async () =>{
        // dispatch(set_values(Map({ provider: '', principal: '', balance: '' })));
    }

    // const parseBalance = (balance: Balance) => {
    //     return (parseInt(balance.value, 10) / 10 ** balance.decimals).toString();
    // }

    return (
        <div className="white-color">
            <div className="div_logins_button_centr">
                <ButtonGroup vertical>
                    <ButtonGroup vertical>
                        <PlugConnectButtonComponent onConnectCallback={(connected) => clickSignInIC(connected)}></PlugConnectButtonComponent>
                    </ButtonGroup>
                </ButtonGroup>
            </div>
        </div>
    );
}

export default LoginPlugIdentityComponent;

