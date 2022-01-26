import { useAppSelector, useAppDispatch } from '../../../app/Hooks';
import {selectTransactions} from './TransactionsSlice';
import React, {Component} from "react";

function TypeViewTransactions(type: any) {
    if(type.type == 'RECEIVE') {
        return <h6 className="App-text-x-small-green">{type.type}</h6>;
    }
    else{
        return <h6 className="App-text-x-small-darkred">{type.type}</h6>;
    }
}

export function Transactions() {

    const transactions = useAppSelector(selectTransactions);

    const ListViewItems = transactions.map((i) =>
        <li>
            <TypeViewTransactions type = {i.type}/>
            <h6 className="App-text-x-small">{i.to}</h6>
            <h6 className="App-text-x-small">{i.amount}</h6>
        </li>
    );

    let view;

    if(transactions.length > 0){
        view =
            <div>
                {/*<h6 className="coralText">Last transactions</h6>*/}

                <ul>{ListViewItems}</ul>

                {/*<ListViewRenderer items={transactions} renderer={*/}
                {/*    (item) =>*/}
                {/*        // @ts-ignore*/}
                {/*        // <div> if({item.type} == 'SEND') { <small className="brownText">{item.type}</small> } else {<small className="greenText">{item.type}</small>} <small>{item.status}</small> <small>{item.to}</small> <small>{item.amount}</small> <small>{item.from}</small>*/}
                {/*        //     /!*{item.status}*!/*/}
                {/*        // </div>*/}

                {/*        <div> <small>{item.type}</small>  <small>{item.status}</small> <small>{item.to}</small> <small>{item.amount}</small> <small>{item.from}</small>*/}
                {/*        </div>*/}
                {/*}></ListViewRenderer>*/}

            </div>
    }
    else{
        view = <div> </div>
    }

    return ( view );
}
