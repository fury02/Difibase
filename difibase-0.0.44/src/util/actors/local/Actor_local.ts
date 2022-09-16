import { Actor, HttpAgent } from '@dfinity/agent';

import { idlFactory  as idl_db_old} from "../../../idls/db/idl/db_old.did";
import { _SERVICE  as service_db_old}  from "../../../idls/db/interface/db_old.did";

import { idlFactory  as idl_db_easy} from "../../../idls/db_easy/idl/db_easy.did";
import { _SERVICE  as service_db_easy}  from "../../../idls/db_easy/interface/db_easy.did";

import { idlFactory  as idl_db_files} from "../../../idls/db_files/idl/db_files.did";
import { _SERVICE  as service_db_files}  from "../../../idls/db_files/interface/db_files.did";

import { idlFactory  as idl_wasm_storage} from "../../../idls/wasm_storage/idl/wasm_storage.did";
import { _SERVICE  as service_wasm_storage}  from "../../../idls/wasm_storage/interface/wasm_storage.did";

import { idlFactory  as idl_admin} from "../../../idls/admin/idl/admin.did";
import { _SERVICE  as service_admin}  from "../../../idls/admin/interface/admin.did";

import { idlFactory  as idl_token} from "../../../idls/token/idl/token.did";
import { _SERVICE  as service_token}  from "../../../idls/token/interface/token.did";

import { idlFactory  as idl_token_test} from "../../../idls/token_test/idl/token_test.did";
import { _SERVICE  as service_token_test}  from "../../../idls/token_test/interface/token_test.did";

import {host_local, host_web_empty} from "../../../const/Website";

//Separate pluggable ****.wasm modules
//db
const canister_id_service_db_files = "rno2w-sqaaa-aaaaa-aaacq-cai";
const canister_id_service_db_easy = "rkp4c-7iaaa-aaaaa-aaaca-cai";
// const canister_id_service_db_old = "rkp4c-7iaaa-aaaaa-aaaca-cai";

//System
const canister_id_service_admin = "rrkah-fqaaa-aaaaa-aaaaq-cai";
const canister_id_service_wasm_storage = "renrk-eyaaa-aaaaa-aaada-cai";

//Tokens
const canister_id_service_token = "rkp4c-7iaaa-aaaaa-aaaca-cai";
const canister_id_service_token_test = "rno2w-sqaaa-aaaaa-aaacq-cai";
//

export class Actor_Service_Local {
    //db
    public actor_service_db_files : service_db_files;
    public actor_service_db_easy : service_db_easy;
    // public actor_service_db_old : service_db_old;
    //admin; wasm
    public actor_service_admin : service_admin;
    public actor_service_wasm_storage : service_wasm_storage;
    //token
    public actor_service_token : service_token;
    public actor_service_token_test : service_token_test;

    constructor(){
        const host = host_local;
        let options = {};
        const agentOptions = { ...options,  host: host };
        const agent = new HttpAgent(agentOptions);
        agent.fetchRootKey();

        this.actor_service_db_files = Actor.createActor<service_db_files>( idl_db_files, {
            agent,
            canisterId: canister_id_service_db_files
        });

        this.actor_service_db_easy = Actor.createActor<service_db_easy>( idl_db_easy, {
            agent,
            canisterId: canister_id_service_db_easy
        });

        // this.actor_service_db_old = Actor.createActor<service_db_old>( idl_db_old, {
        //     agent,
        //     canisterId: canister_id_service_db_old
        // });

        this.actor_service_wasm_storage = Actor.createActor<service_wasm_storage>( idl_wasm_storage, {
            agent,
            canisterId: canister_id_service_wasm_storage
        });

        this.actor_service_admin= Actor.createActor<service_admin>( idl_admin, {
            agent,
            canisterId: canister_id_service_admin
        });

        this.actor_service_token  = Actor.createActor<service_token>( idl_token, {
            agent,
            canisterId: canister_id_service_token
        });

        this.actor_service_token_test  = Actor.createActor<service_token_test>( idl_token_test, {
            agent,
            canisterId: canister_id_service_token_test
        });
    }
}