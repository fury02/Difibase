import {Actor, HttpAgent} from '@dfinity/agent';

import { idlFactory  as idl} from "../../../idls/db_easy/idl/db_easy.did";
import {_SERVICE as actor_service_db_easy} from "../../../idls/db_easy/interface/db_easy.did";

import {AuthClient} from "@dfinity/auth-client";

import {host_web_http_ii_boundary} from "../../../const/Website";


// const canister = ""
const host_ic = host_web_http_ii_boundary;

export class Actor_DATABASE_EASY {
    public actor_service_db_easy : actor_service_db_easy;
    public canister_cluster: string = '';
    constructor(canister_id: string){
        const host = host_ic;
        let options = {};
        const agentOptions = { ...options,  host: host };
        const agent = new HttpAgent(agentOptions);
        agent.fetchRootKey();
        this.actor_service_db_easy = Actor.createActor<actor_service_db_easy>( idl, {
            agent,
            canisterId: canister_id
        });
    }

    public async getActorUseRootKey(canister_id: string){
        const agent = await this.getAgent();
        agent.fetchRootKey();
        const actor_service_db_easy= Actor.createActor<actor_service_db_easy>(idl, { agent, canisterId: canister_id})
        return actor_service_db_easy
    }

    public async getActor(canister_id: string){
        const agent = await this.getAgent();
        const actor_service_db_easy = Actor.createActor<actor_service_db_easy>(idl, { agent, canisterId: canister_id})
        return actor_service_db_easy
    }

    private async getAgent(){
        const host = host_ic;
        const auth_client = await AuthClient.create();
        const identity = await auth_client.getIdentity();
        const agent = new HttpAgent({identity, host});
        return  agent;
    }
}
