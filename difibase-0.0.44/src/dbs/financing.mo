import Array "mo:base/Array";
import Blob  "mo:base/Blob";
import Bool "mo:base/Bool";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Hash "mo:base/Hash";
import Int  "mo:base/Int";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat  "mo:base/Nat";
import Nat64  "mo:base/Nat64";
import Nat8  "mo:base/Nat8";
import Prim "mo:⛔";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";
import TrieSet "mo:base/TrieSet";

import Hex "mo:encoding/Hex";

import Const "const";
import Helpers "lib/util/helpers";
import Interfaces "interfaces";
import Tools "lib/tools/tools";
import Types "types";

module{
    //Types
    type TransferResult = Types.TransferResult; 
    type TransferResultExpanded = Types.TransferResultExpanded;
    type BlockIndex = Types.BlockIndex;
    type LedgerError = Types.LedgerError;
    type NotifyTopUpResult = Types.NotifyTopUpResult;
    type Cycles = Types.Cycles;
    type NotifyError = Types.NotifyError;
    type Tokens = Types.Tokens;
    type AccountBalanceArgs = Types.AccountBalanceArgs;
    type AccountIdentifier = Types.AccountIdentifier; //[Nat8];
    type SubAccount = Types.SubAccount; //[Nat8];
    type SubAccountValues = Types.SubAccountValues;
    type CanisterAccounting = Types.CanisterAccounting;
    type PrincipalAccounting = Types.PrincipalAccounting;
    type TransferNotifyTopUpResult = Types.TransferNotifyTopUpResult;
    type QueryBlocksResponse = Types.QueryBlocksResponse;
    type GetBlocksArgs = Types.GetBlocksArgs;
    type NotifyCreateCanisterArg = Types.NotifyCreateCanisterArg;
    type NotifyCreateCanisterResult = Types.NotifyCreateCanisterResult;
    type Block = Types.BlockIndex;
    type Transaction = Types.Transaction;
    type Operation = Types.Operation;
    type TransferOperation = Types.TransferOperation;
    type BlockParticipants = Types.BlockParticipants;

    //Interfaces
    type IIC = Interfaces.IInternetComputer;
    type ILedger = Interfaces.IPublicLedger;
    type ICyclesConversionNotify = Interfaces.ICyclesConversionNotify;
    //class financing
    public class Financing(){
        let actor_ic : IIC = actor(Const.canister_ic);
        let public_ledger: ILedger = actor(Const.canister_nns_ledger);
        let public_coinage: ICyclesConversionNotify = actor(Const.canister_nns_cycles_minting);
        let principal_public_ledger: Principal = Principal.fromText(Const.canister_nns_ledger);
        let principal_public_coinage: Principal = Principal.fromText(Const.canister_nns_cycles_minting);
        let empty_principal: Principal = Principal.fromBlob(Blob.fromArrayMut(Array.init(32, 0 : Nat8)));
        func get_empty_principal(): Principal {empty_principal};
        //full balance; address; cycles; icp; subaccount; identifier
        //Helper utils
        public func canister_accounting(caller: Principal): async CanisterAccounting {
            let _account_identifier: [Nat8] = Tools.principalToAccount(caller, null); //default account-identifier
            let _subaccount: SubAccount = Tools.principalToSubAccount(caller); //default subaccount      
            let _address: Hex.Hex = Tools.principalToAccountHex(caller, null);
            let _principal_value: Text = Tools.principalArrToText(_subaccount);
            let _tokens_balance = await public_ledger.account_balance({ account = _account_identifier });
            let _cycles = ExperimentalCycles.balance();
            return {
                account_identifier = _account_identifier;
                subaccount = _subaccount; //subaccount = accountidentifier
                address = _address; // send address
                principal = caller;
                principal_value = _principal_value;
                tokens_balance = _tokens_balance; //e8s
                cycles = ?_cycles; //cycles balance
            };
        };
         public func accounting_by_id(id: Text): async PrincipalAccounting {
            let caller = Principal.fromText(id);
            let _account_identifier: [Nat8] = Tools.principalToAccount(caller, null); //default account-identifier
            let _subaccount: SubAccount = Tools.principalToSubAccount(caller); //default subaccount      
            let _address: Hex.Hex = Tools.principalToAccountHex(caller, null);
            let _principal_value: Text = Tools.principalArrToText(_subaccount);
            return {
                account_identifier = _account_identifier;
                subaccount = _subaccount; //subaccount = accountidentifier
                address = _address; // send address
                principal = caller;
                principal_value = _principal_value;
            };
        };
        public func principal_to_account(canister_id: Principal): async [Nat8] {
            let ai: [Nat8] = Tools.principalToAccount(canister_id, null);// null - default account identifier
            return ai;
        };
        public func minting_cycles_return_value(canister_id: Principal, icp_amount: Nat): async Cycles { 
            var cycles: Cycles = 0;
            let tn : TransferNotifyTopUpResult = await minting_cycles_here(canister_id, icp_amount);
            let tnn : NotifyTopUpResult = tn.notify_topup_result;
            switch(tnn){
                case(#Err(e)){return cycles;};
                case(#Ok(c)){
                    cycles := c;
                    return cycles;
                };
            };
            return cycles;
        };
        public func query_bloks(sbi : Nat, n : Nat): async QueryBlocksResponse {// BlockIndex = Nat64; GetBlocksArgs = { start : BlockIndex; length : Nat64 };
            let ba = {start =  Nat64.fromNat(sbi); length = Nat64.fromNat(n)};
            let qbr = await public_ledger.query_blocks(ba); 
            return qbr;
        };
        public func block_participants(sbi : Nat): async BlockParticipants {// BlockIndex = Nat64; GetBlocksArgs = { start : BlockIndex; length : Nat64 };
            let ba = {start =  Nat64.fromNat(sbi); length = Nat64.fromNat(1)};
            let qbr: QueryBlocksResponse = await public_ledger.query_blocks(ba);
            let blocks = qbr.blocks;
            var amount: Nat64 = Nat64.fromNat(0);
            var from: AccountIdentifier = Tools.principalToAccount(get_empty_principal(), null);
            var to: AccountIdentifier = Tools.principalToAccount(get_empty_principal(), null);
            var bp: BlockParticipants =  { amount = amount; to = to; from = from; verify = false;};
            for(b in blocks.vals()){
            let transaction: Transaction = b.transaction;
            let operation: ?Operation = transaction.operation;
            switch(operation){
                case(null){return bp;};
                case(?operation){
                    switch(operation){
                        case(#Transfer(tr)){ 
                            var trop: TransferOperation = tr;
                            amount := trop.amount.e8s;
                            from := trop.from;
                            to := trop.to;
                            var bp_: BlockParticipants =  { amount = amount; to = to; from = from; verify = false;};
                            return bp_;
                        };
                        case(#Burn(bn)){ };
                        case(#Mint(mt)){ };
                        };
                    };
                }
            };
            return bp;
        };
        public func check_participants(
            sbi : Nat, 
            user_principal: Principal, 
            canister: Principal): async BlockParticipants { 
            var res_check = false;
            let user_ai: AccountIdentifier = Tools.principalToAccount(user_principal, null);
            let canister_ai: AccountIdentifier = Tools.principalToAccount(canister, null);
            var bp: BlockParticipants = await block_participants(sbi);
            //!!!TODO add logging to check for repeated spending (since a call from outside is possible)
            if(user_ai == bp.to and canister_ai == bp.from){
                res_check := true;
            };
            var bp_: BlockParticipants =  { amount = bp.amount; to = bp.to; from = bp.from; verify = res_check;};
            return bp_ 
        };

        //Transfer utils

        ////Create canister with coinage memo
        // public func create_canister(
        //         owner: Principal,
        //         caller: Principal,
        //         icp_amount: Nat) : async Principal{
        //     var amount = Nat64.fromNat(icp_amount);
        //      //TODO 'amount' depends on the exchange price for cycles. Provide for price variations
        //     assert(amount > (Const.transfer_icp_fee + 2_000_000));
        //     let time = { timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
        //     let amount_res = { e8s = amount - (Const.transfer_icp_fee + 1_010_000)};
        //     var can = Principal.fromBlob(Blob.fromArrayMut(Array.init(32, 0 : Nat8)));
        //     var transfer_res: TransferResult = #Err(#TxCreatedInFuture);
           
        //     let subaccount = Tools.principalToSubAccount(caller); // work
        //     let to_icp_coinage = Tools.principalToAccount(principal_public_coinage, ?subaccount);
            
        //     try{
        //         transfer_res := await public_ledger.transfer({
        //             to = to_icp_coinage;
        //             fee = { e8s = Const.transfer_icp_fee; };
        //             memo = Const.create_canister_memo;
        //             from_subaccount = null;
        //             // from_subaccount = ?subaccount;
        //             created_at_time = ?time;
        //             amount = amount_res;
        //         });
        //         switch(transfer_res){
        //             case(#Err(e)){
        //                 return can;
        //             };
        //             case(#Ok(height)){
        //                 let ncca : NotifyCreateCanisterResult = await public_coinage.notify_create_canister({
        //                     block_index = height;
        //                     controller = owner;
        //                 });
        //                 switch(ncca){
        //                     case(#Err(e)){
        //                         return can;
        //                     };
        //                     case(#Ok(p)){
        //                         can := p;
        //                         return can;
        //                     };
        //                 };
        //                 return can;
        //             };
        //         };
        //     }
        //     catch(e){ 
        //         return can;
        //     };
        // };
        //Coinage ICP in cycles - this canister
        public func minting_cycles_here(
                caller: Principal,
                icp_amount: Nat) : async TransferNotifyTopUpResult{
            var amount = Nat64.fromNat(icp_amount);
            assert(amount > (Const.transfer_icp_fee + 100_000));
            var transfer_res: TransferResult = #Err(#TxCreatedInFuture);
            var transform_notify_res: NotifyTopUpResult = #Err(#InvalidTransaction(""));
            var transfer_transform_res: TransferNotifyTopUpResult = {
                transfer_result = transfer_res;
                notify_topup_result = transform_notify_res;
            };
            let time = { timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
            let amount_res = { e8s = amount - (Const.transfer_icp_fee + 100_000)};
 
            let subaccount = Tools.principalToSubAccount(caller); // work
            let to_cycles = Tools.principalToAccount(principal_public_coinage, ?subaccount);
        
            try{
                transfer_res := await public_ledger.transfer({
                    to = to_cycles;
                    fee = { e8s = Const.transfer_icp_fee; };
                    memo = Const.coinage_cycles_memo;
                    from_subaccount = null;
                    // from_subaccount = ?subaccount;
                    created_at_time = ?time;
                    amount = amount_res;
            });
            switch(transfer_res){
                    case(#Err(e)){
                        return transfer_transform_res;
                    };
                    case(#Ok(height)){
                        transform_notify_res := await public_coinage.notify_top_up({
                                    block_index = height;
                                    canister_id = caller;
                                });
                        return  { 
                                    transfer_result = transfer_res;
                                    notify_topup_result = transform_notify_res;
                                };
                    };
                };
            }
            catch(e){ 
                return transfer_transform_res;
            };
        };
        //Coinage ICP in cycles by canister
        public func minting_cycles(
                canister_id: Principal,
                icp_amount: Nat) : async TransferNotifyTopUpResult{
            var amount = Nat64.fromNat(icp_amount);
            assert(amount > (Const.transfer_icp_fee + 100_000));

            var transfer_res: TransferResult = #Err(#TxCreatedInFuture);
            var transform_notify_res: NotifyTopUpResult = #Err(#InvalidTransaction(""));
            var transfer_transform_res: TransferNotifyTopUpResult = {
                transfer_result = transfer_res;
                notify_topup_result = transform_notify_res;
            };
            let time = { timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
            let amount_res = { e8s = amount - (Const.transfer_icp_fee + 100_000)};
 
            let subaccount = Tools.principalToSubAccount(canister_id); // work
            let to_cycles = Tools.principalToAccount(principal_public_coinage, ?subaccount);
        
            try{
             transfer_res := await public_ledger.transfer({
                to = to_cycles;
                fee = { e8s = Const.transfer_icp_fee; };
                memo = Const.coinage_cycles_memo;
                from_subaccount = null;
                // from_subaccount = ?subaccount;
                created_at_time = ?time;
                amount = amount_res;
            });
            switch(transfer_res){
                case(#Err(e)){
                    return transfer_transform_res;
                };
                case(#Ok(height)){
                    transform_notify_res := await public_coinage.notify_top_up({
                                block_index = height;
                                canister_id = canister_id;
                            });
                    return  { 
                                transfer_result = transfer_res;
                                notify_topup_result = transform_notify_res;
                            };
                    };
                };
            }
            catch(e){ 
            return transfer_transform_res;
            };
        };
        public func minting_cycles_by_canister_id(
            // where principal text (sample "oku77-aaaaa-aaaah-aaoya-cai")
                canister_id: Text,
                icp_amount: Nat) : async TransferNotifyTopUpResult{
            var amount = Nat64.fromNat(icp_amount);
            assert(amount > (Const.transfer_icp_fee + 100_000));
            var transfer_res: TransferResult = #Err(#TxCreatedInFuture);
            var transform_notify_res: NotifyTopUpResult = #Err(#InvalidTransaction(""));
            var transfer_transform_res: TransferNotifyTopUpResult = {
                transfer_result = transfer_res;
                notify_topup_result = transform_notify_res;
            };
            let time = { timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
            let amount_res = { e8s = amount - (Const.transfer_icp_fee + 100_000)};

            // let transfer_ledger_subaccount = Tools.principalTextToSubAccount(Const.canister_transfer_ledger);

            let from_principal = Principal.fromText(canister_id);     
            let subaccount = Tools.principalToSubAccount(from_principal); // work
            let to_cycles = Tools.principalToAccount(principal_public_coinage, ?subaccount);
        
            try{
             transfer_res := await public_ledger.transfer({
                to = to_cycles;
                fee = { e8s = Const.transfer_icp_fee; };
                memo = Const.coinage_cycles_memo;
                from_subaccount = null;
                // from_subaccount = ?subaccount;
                created_at_time = ?time;
                amount = amount_res;
            });
            switch(transfer_res){
                case(#Err(e)){
                    return transfer_transform_res;
                };
                case(#Ok(height)){
                    transform_notify_res := await public_coinage.notify_top_up({
                                block_index = height;
                                canister_id = from_principal;
                            });
                    return  { 
                                transfer_result = transfer_res;
                                notify_topup_result = transform_notify_res;
                            };
                };
            };
        }
        catch(e){ 
            return transfer_transform_res;
            };
        };

        //**Transfer ICP**//

        public func transfer_icp(
            canister_id: Principal,
            icp_amount: Nat) : async TransferResultExpanded{
            var amount = Nat64.fromNat(icp_amount);
            assert(amount - Const.transfer_icp_fee > 0);
            var transfer_res: TransferResult = #Err(#TxCreatedInFuture);
            let time = { timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
            let amount_res = { e8s = amount - Const.transfer_icp_fee };

            let to_address = Tools.principalToAccount(canister_id, null);// null - default account identifier
        
            try{
            transfer_res := await public_ledger.transfer({
                to = to_address;
                fee = { e8s = Const.transfer_icp_fee; };
                memo = 0;
                from_subaccount = null;
                created_at_time = ?time;
                amount = amount_res;
            });
            switch(transfer_res){
                case(#Err(e)){
                    return {
                        transfer_result = transfer_res; 
                        created_at_time = { timestamp_nanos = 0}; 
                        amount = { e8s = 0 };
                    };
                };
                case(#Ok(height)){
                    return  {
                        transfer_result = transfer_res; 
                        created_at_time = time; 
                        amount = amount_res;
                    };
                };
            };
        }
        catch(e){ 
            return {
                transfer_result = transfer_res; 
                created_at_time = { timestamp_nanos = 0}; 
                amount = { e8s = 0 };
                };
            };
        };
        public func transfer_icp_by_canister_id(
            // where principal text (sample "oku77-aaaaa-aaaah-aaoya-cai")
                canister_id: Text,
                icp_amount: Nat) : async TransferResultExpanded{
            var amount = Nat64.fromNat(icp_amount);
            assert(amount - Const.transfer_icp_fee > 0);
            var transfer_res: TransferResult = #Err(#TxCreatedInFuture);
            let time = { timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
            let amount_res = { e8s = amount - Const.transfer_icp_fee };

            let to_address = Tools.principalToAccount(Principal.fromText(canister_id), null);// null - default account identifier
        
            try{
            transfer_res := await public_ledger.transfer({
                to = to_address;
                fee = { e8s = Const.transfer_icp_fee; };
                memo = 0;
                from_subaccount = null;
                created_at_time = ?time;
                amount = amount_res;
            });
            switch(transfer_res){
                case(#Err(e)){
                    return {
                        transfer_result = transfer_res; 
                        created_at_time = { timestamp_nanos = 0}; 
                        amount = { e8s = 0 };
                    };
                };
                case(#Ok(height)){
                    return  {
                        transfer_result = transfer_res; 
                        created_at_time = time; 
                        amount = amount_res;
                    };
                };
            };
        }
        catch(e){ 
            return {
                transfer_result = transfer_res; 
                created_at_time = { timestamp_nanos = 0}; 
                amount = { e8s = 0 };
                };
            };
        };
        public func transfer_icp_by_address_hex(
        // where address in CanisterAccounting (sample "d64d3af5c9115464a3d27c1eb775c8e3068ab8bb10964a7c0a676a86c180b1ea")
            address: Hex.Hex, 
            icp_amount: Nat) : async TransferResultExpanded{
            var amount = Nat64.fromNat(icp_amount);
            assert(amount - Const.transfer_icp_fee > 0);
            var transfer_res: TransferResult = #Err(#TxCreatedInFuture);
            let time = { timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
            let amount_res = { e8s = amount - Const.transfer_icp_fee };

            let ab = Tools.accountHexToAccountBlob(address);

            switch(ab){
                case(null){
                    return   {
                        transfer_result = transfer_res; 
                        created_at_time = { timestamp_nanos = 0}; 
                        amount = { e8s = 0 };
                    }
                };
                case(?ab){
                let to_address = Blob.toArray(ab);
                try{
                    transfer_res := await public_ledger.transfer({
                    to = to_address;
                    fee = { e8s = Const.transfer_icp_fee; };
                    memo = 0;
                    from_subaccount = null;
                    created_at_time = ?time;
                    amount = amount_res;
                });
                switch(transfer_res){
                    case(#Err(e)){
                        return {
                            transfer_result = transfer_res; 
                            created_at_time = { timestamp_nanos = 0}; 
                            amount = { e8s = 0 };
                        };
                    };
                    case(#Ok(height)){
                        return  {
                            transfer_result = transfer_res; 
                            created_at_time = time; 
                            amount = amount_res;
                            };
                        };
                    };
                }
                catch(e){ 
                    return {
                        transfer_result = transfer_res; 
                        created_at_time = { timestamp_nanos = 0}; 
                        amount = { e8s = 0 };
                        };
                    };
                };
            };
        };
    }
}