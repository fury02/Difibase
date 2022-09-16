import {canister_cycles_minting, canister_dbs} from "../../const/Canisters";
import {host_web_http_ii_boundary, host_web_ic0_app} from "../../const/Website";

import {Actor, HttpAgent} from "@dfinity/agent";

import {AuthClient} from "@dfinity/auth-client";

import { idlFactory as idl } from "../../idls/idls_external/cmc/cmc.utils.did.mjs";
import { _SERVICE as act_serv } from "../../idls/idls_external/cmc/cmc.did";

const canister = canister_cycles_minting;
const host_ic0_app = host_web_ic0_app;
export class Actor_CMC {
    public actor : act_serv;

    constructor(){
        const host = host_ic0_app;
        let options = {};
        const agentOptions = { ...options,  host: host };
        const agent = new HttpAgent(agentOptions);
        agent.fetchRootKey();
        this.actor = Actor.createActor<act_serv>( idl, {
            agent,
            canisterId: canister
        });
    }

    public async getActorUseRootKey(){
        const agent = await this.getAgent();
        agent.fetchRootKey();
        const actor = Actor.createActor<act_serv>(idl, { agent, canisterId: canister})
        return actor;
    }

    public async getActor(){
        const agent = await this.getAgent();
        const actor = Actor.createActor<act_serv>(idl, { agent, canisterId: canister})
        return actor;
    }

    private async getAgent(){
        const host = host_web_ic0_app;
        const auth_client = await AuthClient.create();
        const identity = await auth_client.getIdentity();
        const agent = new HttpAgent({identity, host});
        return  agent;
    }
}
