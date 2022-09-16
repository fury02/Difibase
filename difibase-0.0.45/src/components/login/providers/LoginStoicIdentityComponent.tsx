import React, {useEffect, useState} from "react";
import {Button, ButtonGroup} from 'react-bootstrap';
import {Identity, SignIdentity} from "@dfinity/agent";

// ic-stoic-identity is not typed
// @ts-ignore
import {StoicIdentity as StoicIdentityImport} from 'ic-stoic-identity';
import {set_values} from "../../../redux/features/ic/base/AccountSlice";
import {useAppDispatch} from "../../../redux/app/Hooks";
import {getAccountIdAddress} from "../../../util/crypto/BundleAccount";
import {plug_connect, stoic_connect} from "../../../const/Website";
import {set_values_tokens} from "../../../redux/features/ic/token/TokensBalanceSlice";
export const StoicIdentity: StoicIdentity & StoicIdentityStaticTypes = StoicIdentityImport;

type StoicIdentityStaticTypes = {
    disconnect(): Promise<void>;
};

export interface StoicIdentity extends SignIdentity {
    connect(): Promise<StoicIdentity>;
    load(host?: string): Promise<StoicIdentity | undefined>;
}

export async function createNewStoicIdentityConnection(): Promise<StoicIdentity> {
    const currentStoicAuth = await loadStoredStoicIdentity();
    if (currentStoicAuth) {
        return currentStoicAuth;
    } else {
        const newStoicAuth = await StoicIdentity.connect();
        return newStoicAuth;
    }
}

export async function loadStoredStoicIdentity(): Promise<StoicIdentity | undefined> {
    const stoicIdentity = await StoicIdentity.load();
    if (stoicIdentity) {
        return stoicIdentity;
    } else {
        return undefined;
    }
}

export async function disconnectFromStoicIdentity(): Promise<void> {
    return StoicIdentity.disconnect();
}

const LoginStoicIdentityComponent: React.FC = () =>{
    const dispatch = useAppDispatch();

    const [stoic_identity, setNewStoicIdentity] = useState<StoicIdentity | null>(null);
    const [identity_value, setInputValue] = useState<string>("");


    useEffect(() => { }, []);

    const updateView = () => { }

    const clickSignInIC = () => {
        let balance = '';
        createNewStoicIdentityConnection().then(i => {
                setNewStoicIdentity(i);
                let pubKey = i.getPublicKey();
                let principal = i.getPrincipal();
                let account_id = getAccountIdAddress(principal);
                dispatch(set_values([stoic_connect, principal.toString(), balance, account_id]));
                dispatch(set_values_tokens(['', '', '']));
            }
        );
    };

    const clickSignOutIC = () =>{
        disconnectFromStoicIdentity().then(i => { });
        dispatch(set_values(['', '', '']));
        dispatch(set_values_tokens(['', '', '']));
        // setInputValue("");
    }

    return (
        <div className="white-color">
            {/*<div className="d-flex align-items-center justify-content-center">*/}
            {/*    <Account></Account>*/}
            {/*</div>*/}
            <div className="div_logins_button_centr">
                <ButtonGroup vertical>
                    <Button className="btn btn-info min-logins-button" size="lg"  onClick={clickSignInIC}>Connect</Button>
                    <h6></h6>
                    <Button className="btn btn-info min-logins-button" size="lg"  onClick={clickSignOutIC}>Disconnect</Button>
                    <h6></h6>
                </ButtonGroup>
            </div>
        </div>
    );
}

export default LoginStoicIdentityComponent;
