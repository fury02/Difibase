import {Actor, HttpAgent} from '@dfinity/agent';
import { idlFactory  as idl} from "../../../idls/token_test/idl/token_test.did";
import { _SERVICE  as service_token_test}  from "../../../idls/token_test/interface/token_test.did";
import {AuthClient} from "@dfinity/auth-client";
import {host_web_http_ii_boundary} from "../../../const/Website";
import {canister_dbs_token_test} from "../../../const/Canisters";

const canister = canister_dbs_token_test;
const host_ic = host_web_http_ii_boundary;
export class Actor_TOKEN_TEST {
    public actor_service_token_test : service_token_test;

    constructor(){
        const host = host_ic;
        let options = {};
        const agentOptions = { ...options,  host: host };
        const agent = new HttpAgent(agentOptions);
        agent.fetchRootKey();
        this.actor_service_token_test = Actor.createActor<service_token_test>( idl, {
            agent,
            canisterId: canister
        });
    }

    public async getActorUseRootKey(){
        const agent = await this.getAgent();
        agent.fetchRootKey();
        const actor_service_token_test = Actor.createActor<service_token_test>(idl, { agent, canisterId: canister})
        return actor_service_token_test
    }

    public async getActor(){
        const agent = await this.getAgent();
        const actor_service_token_test = Actor.createActor<service_token_test>(idl, { agent, canisterId: canister})
        return actor_service_token_test
    }

    private async getAgent(){
        const host = host_ic;
        const auth_client = await AuthClient.create();
        const identity = await auth_client.getIdentity();
        const agent = new HttpAgent({identity, host});
        return  agent;
    }
}
