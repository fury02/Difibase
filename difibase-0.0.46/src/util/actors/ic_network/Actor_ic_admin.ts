import {Actor, HttpAgent} from '@dfinity/agent';

import { idlFactory  as idl} from "../../../idls/admin/idl/admin.did";
import {_SERVICE as actor_service_admin} from "../../../idls/admin/interface/admin.did";

import {AuthClient} from "@dfinity/auth-client";
import {canister_admin} from "../../../const/Canisters";
import {host_web_http_ii_boundary} from "../../../const/Website";


const canister = canister_admin;
const host_ic = host_web_http_ii_boundary;

export class Actor_ADMIN {
    public actor_service_admin : actor_service_admin;

    constructor(){
        const host = host_ic;
        let options = {};
        const agentOptions = { ...options,  host: host };
        const agent = new HttpAgent(agentOptions);
        agent.fetchRootKey();
        this.actor_service_admin = Actor.createActor<actor_service_admin>( idl, {
            agent,
            canisterId: canister
        });
    }

    public async getActorUseRootKey(){
        const agent = await this.getAgent();
        agent.fetchRootKey();
        const actor_service_admin = Actor.createActor<actor_service_admin>(idl, { agent, canisterId: canister})
        return actor_service_admin
    }

    public async getActor(){
        const agent = await this.getAgent();
        const actor_service_admin = Actor.createActor<actor_service_admin>(idl, { agent, canisterId: canister})
        return actor_service_admin
    }

    private async getAgent(){
        const host = host_ic;
        const auth_client = await AuthClient.create();
        const identity = await auth_client.getIdentity();
        const agent = new HttpAgent({identity, host});
        return  agent;
    }
}
