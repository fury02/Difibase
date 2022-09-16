import {useAppSelector} from "../../../../app/Hooks";
import {selectUserInstance, selectDbInstance} from "./UserInstanceSlice";
import React from "react";

export function UserInstance() {

    const user_instances = useAppSelector(selectUserInstance);
    const db_instances = useAppSelector(selectDbInstance);

    const renderTableUserInstanceHeader = () => {
        if(user_instances.length > 0) {
            // let header = Object.keys(user_canisters[0])
            // return header.map((key, index) => {
            //     return <th key={index}>{key}</th>
            // })
            let header = ["ID", "Canister"];
            return header.map((key, index) => {
                return <th key={index}>{key}</th>
            })
        }
    }

    const renderTableUserInstance = () => {
        return user_instances.map((i, index) => {
            const { consecutive_number, canister_id, user_principal } = i
            return (
                <tr className="App-text-beige-smaller" key={Number(consecutive_number)}>
                    <td className="App-text-beige-smaller">{String(consecutive_number)}</td>
                    <td className="App-text-beige-smaller">{String(canister_id)}</td>
                    {/*<td className="beigeText">{String(user_principal)}</td>*/}
                </tr>
            )
        })
    }

    let view;

    if(user_instances.length > 0){
        view =
            <div>
                <h6 className="coral-color">Instances:</h6>
                <table id='instances'>
                    <tbody>
                    <tr className="App-text-xx-small">{renderTableUserInstanceHeader()}</tr>
                    {renderTableUserInstance()}
                    </tbody>
                </table>
            </div>
    }
    else{
        view = <div>
            <h6 className="coral-color">Instances:</h6>
            <h6 className="App-text-xx-small">No databases installed.</h6>
            <h6 className="App-text-xx-small">Create a new container to use.</h6>
        </div>
    }

    return ( view );
}
