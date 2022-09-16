import { useAppSelector, useAppDispatch } from '../../../app/Hooks';
import {selectTokensBalance} from './TokensBalanceSlice';
import React from "react";
import {plug_connect, stoic_connect} from "../../../../const/Website";

export function TokensBalance() {
    const values = useAppSelector(selectTokensBalance);

    let view;

    view =
        <div>
            <h6 className="App-text-x-small col-0 text-truncate"></h6>
        </div>

    if(values.length > 0){
        const balance_dbf = values[0].toString();
        const symbol_dbf = values[1];
        if(balance_dbf != ""){
            view =
                <div>
                    {/*<h6 className="App-text-x-small col-0 text-truncate coralText">{'Amount:' + balance_dbf}</h6>*/}
                    {/*<h6 className="App-text-x-small col-0 text-truncate coralText">{symbol_dbf}</h6>*/}

                    <h6 className="App-text-x-small col-0 text-truncate teal-color">{'Amount:' + balance_dbf}</h6>
                    <h6 className="App-text-x-small col-0 text-truncate teal-color">{'Symbol:' + '  ' + symbol_dbf}</h6>
                </div>
        }
    }
    else {
        view =
            <div>
                <h6 className="App-text-x-small col-0 text-truncate"></h6>
            </div>
    }

    return ( view );
}
