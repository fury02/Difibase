import {Actor, HttpAgent} from '@dfinity/agent';
import { idlFactory  as idl} from "../../../idls/token/idl/token.did";
import { _SERVICE  as service_token}  from "../../../idls/token/interface/token.did";
import {AuthClient} from "@dfinity/auth-client";
import {host_web_http_ii_boundary} from "../../../const/Website";
import {canister_dbs_token} from "../../../const/Canisters";

const canister = canister_dbs_token;
const host_ic = host_web_http_ii_boundary;
export class Actor_TOKEN {
    public actor_service_token : service_token;

    constructor(){
        const host = host_ic;
        let options = {};
        const agentOptions = { ...options,  host: host };
        const agent = new HttpAgent(agentOptions);
        agent.fetchRootKey();
        this.actor_service_token = Actor.createActor<service_token>( idl, {
            agent,
            canisterId: canister
        });
    }

    public async getActorUseRootKey(){
        const agent = await this.getAgent();
        agent.fetchRootKey();
        const actor_service_token = Actor.createActor<service_token>(idl, { agent, canisterId: canister})
        return actor_service_token
    }

    public async getActor(){
        const agent = await this.getAgent();
        const actor_service_token = Actor.createActor<service_token>(idl, { agent, canisterId: canister})
        return actor_service_token
    }

    private async getAgent(){
        const host = host_ic;
        const auth_client = await AuthClient.create();
        const identity = await auth_client.getIdentity();
        const agent = new HttpAgent({identity, host});
        return  agent;
    }
}
