import {Actor, HttpAgent} from '@dfinity/agent';
import { idlFactory  as idl} from "../../../idls/db/idl/db_old.did";
import { _SERVICE  as act_serv}  from "../../../idls/db/interface/db_old.did";
import {AuthClient} from "@dfinity/auth-client";
import {canister_dbs} from "../../../const/Canisters";
import {host_web_http_ii_boundary} from "../../../const/Website";

const canister = canister_dbs;
const host_ic = host_web_http_ii_boundary;
export class Actor_DB {
    public actor : act_serv;

    constructor(){
        const host = host_ic;
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
        return actor
    }

    public async getActor(){
        const agent = await this.getAgent();
        const actor = Actor.createActor<act_serv>(idl, { agent, canisterId: canister})
        return actor
    }

    private async getAgent(){
        const host = host_ic;
        const auth_client = await AuthClient.create();
        const identity = await auth_client.getIdentity();
        const agent = new HttpAgent({identity, host});
        return  agent;
    }
}
