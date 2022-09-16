import {Actor, HttpAgent} from '@dfinity/agent';

import { idlFactory  as idl} from "../../../idls/wasm_storage/idl/wasm_storage.did";
import {_SERVICE as service_wasm_storage} from "../../../idls/wasm_storage/interface/wasm_storage.did";

import {AuthClient} from "@dfinity/auth-client";
import {canister_wasm_storage} from "../../../const/Canisters";
import {host_web_http_ii_boundary} from "../../../const/Website";

const canister = canister_wasm_storage;
const host_ic = host_web_http_ii_boundary;

export class Actor_WASM_STORAGE {
    public actor_service_wasm_storage : service_wasm_storage;

    constructor(){
        const host = host_ic;
        let options = {};
        const agentOptions = { ...options,  host: host };
        const agent = new HttpAgent(agentOptions);
        agent.fetchRootKey();
        this.actor_service_wasm_storage = Actor.createActor<service_wasm_storage>( idl, {
            agent,
            canisterId: canister
        });
    }

    public async getActorUseRootKey(){
        const agent = await this.getAgent();
        agent.fetchRootKey();
        const actor_service_wasm_storage = Actor.createActor<service_wasm_storage>(idl, { agent, canisterId: canister})
        return actor_service_wasm_storage
    }

    public async getActor(){
        const agent = await this.getAgent();
        const actor_service_wasm_storage = Actor.createActor<service_wasm_storage>(idl, { agent, canisterId: canister})
        return actor_service_wasm_storage
    }

    private async getAgent(){
        const host = host_ic;
        const auth_client = await AuthClient.create();
        const identity = await auth_client.getIdentity();
        const agent = new HttpAgent({identity, host});
        return  agent;
    }
}
