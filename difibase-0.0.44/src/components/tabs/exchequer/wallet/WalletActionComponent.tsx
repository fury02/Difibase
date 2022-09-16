import React, {Component, useEffect, useState} from "react";
import {Button, ButtonGroup, Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {plug_host_connect, plug_web_host, plug_whitelist_connect, plug_timeout_connect} from "../../../../const/Website";
import {
    canister_cycles_minting,
    canister_nns_ledger,
    canister_wicp,
    canister_xtc
} from "../../../../const/Canisters";
import {AddEntityesTableComponent} from "../../examples/local_db/fragments/tables_create_upload/AddEntityesTableComponent";
import {UploadFileComponent} from "../../examples/local_db/fragments/tables_create_upload/UploadFileComponent";
import {GetEntityesTableComponent} from "../../examples/local_db/fragments/tables_create_upload/GetEntityesTableComponent";
import {useAppDispatch} from "../../../../redux/app/Hooks";
import {AnyAction, Dispatch} from "@reduxjs/toolkit";
import HistoryOperations from "../../../../util/blockchain/account/history/HistoryOperations";
import {Principal} from "@dfinity/principal";
import {getAccountIdAddress} from "../../../../util/crypto/BundleAccount";
import {set_values} from "../../../../redux/features/ic/base/AccountSlice";
import ListViewRenderer from "../../../../redux/features/ic/transactions/ListViewRenderer";
import {set_transactions} from "../../../../redux/features/ic/transactions/TransactionsSlice";
import {Transactions} from "../../../../redux/features/ic/transactions/Transactions";

import {set_values_tokens} from "../../../../redux/features/ic/token/TokensBalanceSlice";

import {Actor_TOKEN_TEST} from "../../../../util/actors/ic_network/Actor_ic_token_test";
import {Actor_TOKEN} from "../../../../util/actors/ic_network/Actor_ic_token";

const actor_token = new Actor_TOKEN_TEST();
const ac = actor_token.actor_service_token_test;

// const actor_token = new Actor_TOKEN();
// const ac = actor_token.actor_service_token;


const WalletActionComponent = () => {
    const [principalTo, setPrincipalTo] = useState<string>("");
    const [amountTo, setAmountTo] = useState<string>("");

    const digitMultiplier = 100000000;
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function plugAction() {
            const isConnected = await (await (window as any)?.ic.plug.isConnected());
            if (!isConnected) {
                const connected = (await (window as any)?.ic.plug.requestConnect({ plug_whitelist_connect, plug_web_host }));
                await updateView();
            }
            if (isConnected && !(window as any)?.ic.plug.agent) {
                const agent = await (window as any)?.ic.plug.createAgent({ plug_whitelist_connect, plug_web_host });
                await updateView();
            }
        }
        plugAction();
    }, [])

    const updateView = async () => {
        let account_id = '';
        var transactions: [] = [];
        var count = 3;

        // let identity= await (window as any)?.ic?.plug?.getIdentity();???

        let balance = await (window as any)?.ic?.plug?.requestBalance();
        let principal = String(await (window as any)?.ic?.plug?.agent.getPrincipal());
        account_id = getAccountIdAddress(Principal.fromText(principal));

        // let token_balance = await actor_token.getBalanceOf(principal);
        // let token_decimals = await ac.decimals();
        // let token_balance = await ac.getBalanceOf(principal);

        if(account_id != ''){
            const ho = new HistoryOperations(account_id);
            ho.getICPTransactions().then(i => {
                //@ts-ignore
                if(i.length > 0){
                    var k = 0;
                    //@ts-ignore
                    i.forEach(
                        // @ts-ignore
                        function (value){
                            var type_opr = value.type;
                            Object.entries(value).forEach(([key, value_details]) => {
                                if(k < count) {
                                    if(key == "details"){
                                        k++;
                                        // @ts-ignore
                                        transactions.push({ type: type_opr, status: value_details.status, to: value_details.to, amount: value_details.amount, from: value_details.from});
                                    }
                                }
                            });
                        });
                    dispatch(set_transactions(transactions));
                };
            });
        };

        // Redux
        dispatch(set_values(['Plug' + ' ' + 'connected', principal, balance[0].amount.toString(), 'Account:' + ' ' + account_id]));
        // dispatch(set_values_tokens([token_balance.toString()]));
    }

    const handleInputChangePrincipalTo = (event: { target: { value: any; }; }) => {
        let value: String = event.target.value;
        let count = value.split('-').length - 1;
        if(count == 10){ setPrincipalTo(value.toString());  }
        else{
            alert('Invalid departure address. Use the Principal ID');
        }
    }

    const handleInputChangeAmountTo = (event: { target: { value: any; }; }) => {
        let value: String = event.target.value;
        setAmountTo(value.toString());
    }

    const handleClickSend = async () => {
        const to = principalTo;
        const amount_input = String(amountTo);
        if(to != null && amount_input != null){
            const amountNumber = Number(amount_input.replace(',', '.'));
            const amount = amountNumber * digitMultiplier;
            const requestTransferArg = { to, amount };
            const response = await (window as any)?.ic?.plug?.requestTransfer(requestTransferArg);
            console.warn("click send");
        }
    }

    const handleClickIsConnect = async () => {
        const response = await (window as any)?.ic?.plug?.isConnected();
        if(response){
            alert('Plug connected');
        }
        else{
            alert('Plug disconnect');
        }
        console.warn("click connect")
    }

    return(
        <div className="white-color">
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="white-color">
                                <Container>

                                    <div className="p-3">
                                        <h6 className="coral-color">Address (Plug Account):</h6>
                                        <input className="p-2 rounded-3" name="Address" onChange={handleInputChangePrincipalTo}  placeholder="Address To"/>
                                        <h6 className="">Amount:</h6>
                                        <input className="p-2 rounded-3" name="Amount" onChange={handleInputChangeAmountTo}  placeholder="Amount To"/>
                                    </div>

                                    <div className="p-3 ">
                                        <Button onClick={handleClickSend}>Send</Button>
                                        <h1></h1>
                                        <Button onClick={handleClickIsConnect}>IsConnect</Button>
                                    </div>

                                </Container>
                            </div>
                        </div>

                        <div className="col">
                            <div className="p-3">
                                {/*<Transactions></Transactions>*/}
                            </div>
                        </div>
                        <div className="col-3">
                            {/*<h6>4</h6>*/}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="p-3">
                                <Transactions></Transactions>
                            </div>
                        </div>
                        {/*<div className="col-2">*/}
                        {/*    <h6>4</h6>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WalletActionComponent;


// if(i.length > 0){
//     //@ts-ignore
//     i.forEach(
//         // @ts-ignore
//         function (value){
//             Object.entries(value).forEach(([key, value_details]) => {
//                 if(key == "details"){
//                     const obj = value_details;
//                     // @ts-ignore
//                     Object.entries(obj).forEach(([key, value_field]) => {
//                         if(key == "status"){
//                             // @ts-ignore
//                             tbi.push(value_field);
//                             const field = value_field;
//                             var field_ = field;
//                         }
//                     });
//                 }
//             });
//
//             const mapObj = new Map( Object.keys(value).map(key => [key, value[key]]));
//             var mapObj_ = mapObj;
//         });
//
//
//     // Object.entries(i).forEach(([key, value]) => {
//     //     if(key == "details"){
//     //         const obj = value;
//     //         var obj_ = obj;
//     //     }
//     // });
//
//     // Object.entries(derKeyUint8Array).forEach(([key, value]) => {
//     //     if(key == "data"){
//     //         // @ts-ignore
//     //         var principal = Principal.selfAuthenticating(value);
//     //         account_id = getAccountId(principal);
//     //     }
//     // });
//
// };





























// import React, {Component, useEffect, useState} from "react";
// import {Button, ButtonGroup, Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
// import {plug_host_connect, plug_web_host, plug_whitelist_connect, plug_timeout_connect} from "../../../../const/Website";
// import {
//     canister_nns_cycles_minting,
//     canister_nns_ledger,
//     canister_wicp,
//     canister_xtc
// } from "../../../../const/Canisters";
// import {AddEntityesTableComponent} from "../../examples/fragments/tables_add/AddEntityesTableComponent";
// import {UploadFileComponent} from "../../examples/fragments/tables_add/UploadFileComponent";
// import {GetEntityesTableComponent} from "../../examples/fragments/tables_add/GetEntityesTableComponent";
// import {useAppDispatch} from "../../../../redux/app/Hooks";
// import {AnyAction, Dispatch} from "@reduxjs/toolkit";
// import HistoryOperations from "../../../../util/blockchain/account/history/HistoryOperations";
// import {Principal} from "@dfinity/principal";
// import {getAccountId} from "../../../../util/crypto/BundleAccount";
// import {set_values} from "../../../../redux/features/ic/base/AccountSlice";
// import ListViewRenderer from "../../../../redux/features/ic/transactions/ListViewRenderer";
// import {set_transactions} from "../../../../redux/features/ic/transactions/TransactionsSlice";
// import {Transactions} from "../../../../redux/features/ic/transactions/Transactions";
//
// import {Actor_TOKEN_TEST} from "../../../../util/actors/ic_network/Agent_ic_token_test";
// import {Actor_TOKEN} from "../../../../util/actors/ic_network/Agent_ic_token";
//
// // const actor_token = Actor_TOKEN();
// const actor_token = new Actor_TOKEN_TEST();
// const ac = actor_token.actor;
//
// const WalletActionComponent = () => {
//     const [principalTo, setPrincipalTo] = useState<string>("");
//     const [amountTo, setAmountTo] = useState<string>("");
//
//     const digitMultiplier = 100000000;
//     const dispatch = useAppDispatch();
//
//     useEffect(() => {
//         async function plugAction() {
//             const isConnected = await (await (window as any)?.ic.plug.isConnected());
//             if (!isConnected) {
//                 const connected = (await (window as any)?.ic.plug.requestConnect({ plug_whitelist_connect, plug_web_host }));
//                 await updateView();
//             }
//             if (isConnected && !(window as any)?.ic.plug.agent) {
//                 const agent = await (window as any)?.ic.plug.createAgent({ plug_whitelist_connect, plug_web_host });
//                 await updateView();
//             }
//         }
//         plugAction();
//     }, [])
//
//     const updateView = async () => {
//         let account_id = '';
//         var transactions: [] = [];
//         var count = 3;
//
//         let balance = await (window as any)?.ic?.plug?.requestBalance();
//         let principal = String(await (window as any)?.ic?.plug?.agent.getPrincipal());
//         account_id = getAccountId(Principal.fromText(principal));
//
//         // let token_balance = await actor_token.getBalanceOf(principal);
//         let token_balance = await ac.getBalanceOf(principal);
//
//         if(account_id != ''){
//             const ho = new HistoryOperations(account_id);
//             ho.getICPTransactions().then(i => {
//                 //@ts-ignore
//                 if(i.length > 0){
//                     var k = 0;
//                     //@ts-ignore
//                     i.forEach(
//                         // @ts-ignore
//                         function (value){
//                             var type_opr = value.type;
//                             Object.entries(value).forEach(([key, value_details]) => {
//                                 if(k < count) {
//                                     if(key == "details"){
//                                         k++;
//                                         // @ts-ignore
//                                         transactions.push({ type: type_opr, status: value_details.status, to: value_details.to, amount: value_details.amount, from: value_details.from});
//                                     }
//                                 }
//                             });
//                         });
//                     dispatch(set_transactions(transactions));
//                 };
//             });
//         };
//
//         // Redux
//         dispatch(set_values(['Plug' + ' ' + 'connected', principal, balance[0].amount.toString(), 'Account:' + ' ' + account_id]));
//     }
//
//     const handleInputChangePrincipalTo = (event: { target: { value: any; }; }) => {
//         let value: String = event.target.value;
//         let count = value.split('-').length - 1;
//         if(count == 10){ setPrincipalTo(value.toString());  }
//         else{
//             alert('Invalid departure address. Use the Principal ID');
//         }
//     }
//
//     const handleInputChangeAmountTo = (event: { target: { value: any; }; }) => {
//         let value: String = event.target.value;
//         setAmountTo(value.toString());
//     }
//
//     const handleClickSend = async () => {
//         const to = principalTo;
//         const amount_input = String(amountTo);
//         if(to != null && amount_input != null){
//             const amountNumber = Number(amount_input.replace(',', '.'));
//             const amount = amountNumber * digitMultiplier;
//             const requestTransferArg = { to, amount };
//             const response = await (window as any)?.ic?.plug?.requestTransfer(requestTransferArg);
//             console.warn("click send");
//         }
//     }
//
//     const handleClickIsConnect = async () => {
//         const response = await (window as any)?.ic?.plug?.isConnected();
//         if(response){
//             alert('Plug connected');
//         }
//         else{
//             alert('Plug disconnect');
//         }
//         console.warn("click connect")
//     }
//
//     return(
//         <div className="whiteText">
//             <div>
//                 <div className="container">
//                     <div className="row">
//                         <div className="col">
//                             <div className="whiteText">
//                                 <Container>
//                                     <div className="p-3">
//                                         <h6 className="coralText">Address (Plug Account):</h6>
//                                         <input className="p-2 rounded-3" name="Address" onChange={handleInputChangePrincipalTo}  placeholder="Address To"/>
//                                         <h6 className="">Amount:</h6>
//                                         <input className="p-2 rounded-3" name="Amount" onChange={handleInputChangeAmountTo}  placeholder="Amount To"/>
//                                     </div>
//                                     <div className="p-3 ">
//                                         <Button onClick={handleClickSend}>Send</Button>
//                                         <h1></h1>
//                                         <Button onClick={handleClickIsConnect}>IsConnect</Button>
//                                     </div>
//                                 </Container>
//                             </div>
//                         </div>
//
//                         <div className="col">
//                             <div className="p-3">
//                                 {/*<Transactions></Transactions>*/}
//                             </div>
//                         </div>
//                         <div className="col-3">
//                             <h6>4</h6>
//                         </div>
//                     </div>
//                     <div className="row">
//                         <div className="col">
//                             <div className="p-3">
//                                 <Transactions></Transactions>
//                             </div>
//                         </div>
//                         {/*<div className="col-2">*/}
//                         {/*    <h6>4</h6>*/}
//                         {/*</div>*/}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default WalletActionComponent;
//
//
// // if(i.length > 0){
// //     //@ts-ignore
// //     i.forEach(
// //         // @ts-ignore
// //         function (value){
// //             Object.entries(value).forEach(([key, value_details]) => {
// //                 if(key == "details"){
// //                     const obj = value_details;
// //                     // @ts-ignore
// //                     Object.entries(obj).forEach(([key, value_field]) => {
// //                         if(key == "status"){
// //                             // @ts-ignore
// //                             tbi.push(value_field);
// //                             const field = value_field;
// //                             var field_ = field;
// //                         }
// //                     });
// //                 }
// //             });
// //
// //             const mapObj = new Map( Object.keys(value).map(key => [key, value[key]]));
// //             var mapObj_ = mapObj;
// //         });
// //
// //
// //     // Object.entries(i).forEach(([key, value]) => {
// //     //     if(key == "details"){
// //     //         const obj = value;
// //     //         var obj_ = obj;
// //     //     }
// //     // });
// //
// //     // Object.entries(derKeyUint8Array).forEach(([key, value]) => {
// //     //     if(key == "data"){
// //     //         // @ts-ignore
// //     //         var principal = Principal.selfAuthenticating(value);
// //     //         account_id = getAccountId(principal);
// //     //     }
// //     // });
// //
// // };