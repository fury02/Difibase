import { Actor, HttpAgent } from '@dfinity/agent';

import { idlFactory  as idl_dbs} from "../../../dfxgen/dbs/idl/dbs.did";
import { _SERVICE  as service_dbs}  from "../../../dfxgen/dbs/interface/dbs.did";

import { idlFactory  as idl_instance_manager} from "../../../dfxgen/instance_manager/idl/instance-manager.did";
import { _SERVICE  as service_instance_manager}  from "../../../dfxgen/instance_manager/interface/instance-manager.did";

import { idlFactory  as idl_wasm_manager} from "../../../dfxgen/wasm-manager/idl/wasm-manager.did";
import { _SERVICE  as service_wasm_manager}  from "../../../dfxgen/wasm-manager/interface/wasm-manager.did";


import { idlFactory  as idl_token} from "../../../dfxgen/token/idl/token.did";
import { _SERVICE  as service_token}  from "../../../dfxgen/token/interface/token.did";

import { idlFactory  as idl_token_test} from "../../../dfxgen/token-test/idl/token-test.did";
import { _SERVICE  as service_token_test}  from "../../../dfxgen/token-test/interface/token-test.did";

// const canister_id_service_dbs = "ryjl3-tyaaa-aaaaa-aaaba-cai";
// const canister_id_service_instance_manager = "r7inp-6aaaa-aaaaa-aaabq-cai";
// const canister_id_service_wasm_manager = "renrk-eyaaa-aaaaa-aaada-cai";
// const canister_id_service_token = "rkp4c-7iaaa-aaaaa-aaaca-cai";
// const canister_id_service_token_test = "rno2w-sqaaa-aaaaa-aaacq-cai";

const canister_id_service_dbs = "rrkah-fqaaa-aaaaa-aaaaq-cai";
const canister_id_service_instance_manager = "ryjl3-tyaaa-aaaaa-aaaba-cai";
const canister_id_service_wasm_manager = "rno2w-sqaaa-aaaaa-aaacq-cai";
const canister_id_service_token = "r7inp-6aaaa-aaaaa-aaabq-cai";
const canister_id_service_token_test = "rkp4c-7iaaa-aaaaa-aaaca-cai";

const host_local = "http://127.0.0.1:8000";
export class Actor_Service_Local {
    public actor_service_dbs : service_dbs;
    public actor_service_instance_manager : service_instance_manager;
    public actor_service_wasm_manager : service_wasm_manager;
    public actor_service_token : service_token;
    public actor_service_token_test : service_token_test;

    constructor(){
        const host = host_local;
        let options = {};
        const agentOptions = { ...options,  host: host };
        const agent = new HttpAgent(agentOptions);
        agent.fetchRootKey();

        this.actor_service_dbs = Actor.createActor<service_dbs>( idl_dbs, {
            agent,
            canisterId: canister_id_service_dbs
        });

        this.actor_service_instance_manager = Actor.createActor<service_instance_manager>( idl_instance_manager, {
            agent,
            canisterId: canister_id_service_instance_manager
        });

        this.actor_service_wasm_manager = Actor.createActor<service_wasm_manager>( idl_wasm_manager, {
            agent,
            canisterId: canister_id_service_wasm_manager
        });

        this.actor_service_token  = Actor.createActor<service_token>( idl_token, {
            agent,
            canisterId: canister_id_service_token
        });

        this.actor_service_token_test  = Actor.createActor<service_token_test>( idl_token, {
            agent,
            canisterId: canister_id_service_token
        });
    }
}