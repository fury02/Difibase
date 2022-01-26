import { useAppSelector, useAppDispatch } from '../../../app/Hooks';
import {selectValues} from './AccountSlice';
import React from "react";
import {plug_connect, stoic_connect} from "../../../../const/Website";

export function Account() {
    const values = useAppSelector(selectValues);

    const provider = values[0];
    const principal = values[1];
    const balance = values[2];
    const account_id = values[3];

    let view;

    if(provider === plug_connect){
        const principal_ = 'Principal:' + ' ' + principal.toString().substring(0, 12) + ' ' + '...' + ' ' + principal.toString().substring((principal.toString().length - 4), principal.toString().length + 1 );
        const account_id_ =  account_id.toString().substring(0, 15) + ' ' + '...' + ' ' + account_id.toString().substring((principal.toString().length - 4), principal.toString().length + 1);
        if(balance !== undefined){
            const balanceSymbol = 'ICP';
            const balance_icp  = 'Balance:' + ' ' +  balance + ' ' + balanceSymbol;
            view =
                <div>
                    <div>
                        <h6 className="App-text-x-small col-0 text-truncate">{principal_}</h6>
                        <h6 className="App-text-micro col-0 text-truncate">{account_id_}</h6>
                        <h6 className="App-text-micro-green col-0 text-truncate">{provider + ';' + ' ' + balance_icp}</h6>
                    </div>
                </div>
        }
        else { view = <div> </div> }
    }
    else if(provider === stoic_connect){
        const principal_ = 'Principal:' + ' ' + principal.toString().substring(0, 12) + ' ' + '...' + ' ' + principal.toString().substring((principal.toString().length - 4), principal.toString().length + 1 );
        const account_id_ = account_id.toString().substring(0, 15) + ' ' + '...' + ' ' + account_id.toString().substring((principal.toString().length - 4), principal.toString().length + 1);
        if(balance !== undefined){
            const balanceSymbol = 'ICP';
            const balance_icp  = 'Balance:' + ' ' +  balance + ' ' + balanceSymbol;
            view =
                <div>
                    <div>
                        <h6 className="App-text-x-small col-0 text-truncate">{principal_}</h6>
                        <h6 className="App-text-micro col-0 text-truncate">{account_id_}</h6>
                        <h6 className="App-text-x-small-green col-0 text-truncate">{provider}</h6>
                    </div>
                </div>
        }
        else { view = <div> </div> }
    }
    else { view = <div> </div> }

    return ( view );
}
