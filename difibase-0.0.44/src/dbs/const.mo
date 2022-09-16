import Nat64  "mo:base/Nat64";

module {
    //Admins 
    public let admin_principal = "mlx7d-nlzwm-jsiyr-txxc2-mlgsf-hafo6-73wnd-du4xx-f2tsd-mjtum-pae";
    // public let admin_principal = "3sq5w-t7zis-qf3wl-vgvih-byre2-ttswt-vzupn-6mnpw-mju7l-jhbfi-hae";
    
    public let transfer_icp_fee: Nat64 = 10_000;
    //Versions ***.mo
    public let cluster_version = "v: 0.0.16 (cluster.mo)";
    public let admin_version = "v: 0.0.16 (admin.mo)";
    public let wasm_storage_version = "v: 0.0.16 (wasm-storage.mo)";
    public let db_easy_version = "db easy version: 0.1.0";
    public let db_files_version = "db files version: 0.0.9";
    //memo
    public let coinage_cycles_memo = 0x50555054 : Nat64;
    public let create_canister_memo = 0x41455243 : Nat64;
    //Wasms name (***.wasm)
    public let wasm_actor = "wasm_actor.wasm"; //test

    public let db_easy = "db_easy.wasm";
    public let db_default = "db_easy.wasm";
    public let db_files = "db_files.wasm";
    //using
    public let db_old = "db_old.wasm";

    public let cluster = "cluster.wasm"; 
    public let support_cycle = "support_cycle.wasm"; //test
    //ic
    public let canister_ic = "aaaaa-aa";
    //https://icscan.io/canister/ryjl3-tyaaa-aaaaa-aaaba-cai
    public let canister_nns_ledger = "ryjl3-tyaaa-aaaaa-aaaba-cai"; 
    //https://icscan.io/canister/rkp4c-7iaaa-aaaaa-aaaca-cai
    public let canister_nns_cycles_minting = "rkp4c-7iaaa-aaaaa-aaaca-cai"; 
    //sonic
    public let canister_sonic_swap = "3xwpq-ziaaa-aaaah-qcn4a-cai";
    //https://dank.ooo/xtc
    public let canister_dank_wicp =  "utozz-siaaa-aaaam-qaaxq-cai";
    //https://dank.ooo/wicp
    public let canister_dank_xtc = "aanaa-xaaaa-aaaah-aaeiq-cai";
    //cycles wallet for "mlx7d-nlzwm-jsiyr-txxc2-mlgsf-hafo6-73wnd-du4xx-f2tsd-mjtum-pae"
    public let canister_project_cycles_wallet = "ygvtn-qaaaa-aaaan-qa32a-cai";
    //ii
    public let canister_ii = "4k2wq-cqaaa-aaaab-qac7q-cai";
    //cycles wallet controller: mlx7d-nlzwm-jsiyr-txxc2-mlgsf-hafo6-73wnd-du4xx-f2tsd-mjtum-pae;
    public let canister_wallet_cycles = "ygvtn-qaaaa-aaaan-qa32a-cai";
    //free canister 
    //controller:l3hrb-vboyy-2kyuv-avynm-qmq62-facvc-e44bd-hputk-ivn2q-4onyz-4qe
    public let canister_cycles_testing_ic = "yfsj5-qaaaa-aaaah-aav2a-cai";
    
    //local
    // public let canister_wasm_storage = "";
    // public let canister_admin = "";
    // public let canister_support_cycles = "";

    //ic
    //https://icscan.io/canister/n2hvz-4aaaa-aaaah-aaoqa-cai
    public let canister_wasm_storage = "n2hvz-4aaaa-aaaah-aaoqa-cai";
    //https://icscan.io/canister/mxjrx-tiaaa-aaaah-aaoxq-cai
    public let canister_admin = "mxjrx-tiaaa-aaaah-aaoxq-cai";
    //https://icscan.io/canister/tedy5-fqaaa-aaaah-abj2a-cai
    public let canister_token = "tedy5-fqaaa-aaaah-abj2a-cai";
    //https://icscan.io/canister/vgjfw-jiaaa-aaaah-abjmq-cai
    public let canister_token_test = "vgjfw-jiaaa-aaaah-abjmq-cai";
    public let canister_support_cycles = "";
    //fleek ic web canister
    // https://bnc6j-7iaaa-aaaad-qeo6q-cai.ic.fleek.co/

    // w7th3-hiaaa-aaaap-aao4a-cai
    // p4pfq-zaaaa-aaaak-qbffq-cai
    // pvfex-gyaaa-aaaal-qbh7a-cai
    // el3bb-oyaaa-aaaak-adp4a-cai
    // 7rxpc-qqaaa-aaaan-qbgua-cai
    //web 
    // 7wwjw-5iaaa-aaaan-qbguq-cai

};
