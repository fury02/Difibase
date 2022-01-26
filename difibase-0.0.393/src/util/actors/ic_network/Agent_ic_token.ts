import {Actor, HttpAgent} from '@dfinity/agent';
import { idlFactory  as idl} from "../../../dfxgen/token/idl/token.did";
import { _SERVICE  as act_serv}  from "../../../dfxgen/token/interface/token.did";
import {AuthClient} from "@dfinity/auth-client";

const canister = "tedy5-fqaaa-aaaah-abj2a-cai";
const host_ic = "https://boundary.ic0.app";
export class Actor_TOKEN {
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
