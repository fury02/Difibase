import {useAppSelector} from "../../../../app/Hooks";
// import {selectUserInstance, selectDbInstance} from "./UserClusterSlice";
import React from "react";
import {selectUserCluster} from "./UserClusterSlice";
import {makeStyles} from "@material-ui/core/styles";

// const useStyles = makeStyles((theme) => ({
//     table: {
//         marginBottom: "inherit",
//         marginLeft:"initial",
//     },
// }));

export function UserCluster() {

    // const classes = useStyles();

    const user_cluster = useAppSelector(selectUserCluster);

    const renderTableUserInstanceHeader = () => {
        if(user_cluster.length > 0) {
            let header = ["Wasm", "Cluster id(Principal)", "Description", "Version", "Status",];
            return header.map((key, index) => {
                return <th key={index}>{key}</th>
            })

        }
    }

    const renderTableUserInstance = () => {
        return user_cluster.map((i, index) => {
            const { wasm_name, cluster_principal, description, status, wasm_version  } = i

            let view =<></>;

            if(Object.keys(status).toString() == 'stopped'){
                view =
                    <tr>
                        <td className="App-text-small-coral-table">{String(wasm_name)}</td>
                        <td className="App-text-small-gray-table">{String(cluster_principal)}</td>
                        <td className="App-text-small-gray-table">{String(description)}</td>
                        <td className="App-text-small-gray-table">{String(wasm_version)}</td>
                        <td className="App-text-x-small-gray">{"#"+Object.keys(status)}</td>
                    </tr>
            }
            else {
                view =
                <tr>
                    <td className="App-text-small-coral-table">{String(wasm_name)}</td>
                    <td className="App-text-x-small-whitesmoke-table">{String(cluster_principal)}</td>
                    <td className="App-text-x-small-whitesmoke-table">{String(description)}</td>
                    <td className="App-text-x-small-whitesmoke-table">{String(wasm_version)}</td>
                    <td className="App-text-x-small-green">{"#"+Object.keys(status)}</td>
                </tr>
            }

            return (
                view
            )
        })
    }

    let view;

    if(user_cluster.length > 0){
            view =
                <div>
                    <h6 className="coral-color">User clusters:</h6>
                    <table id='clusters'>
                        <tbody>
                        <tr className="App-text-xx-small">{renderTableUserInstanceHeader()}</tr>
                        {renderTableUserInstance()}
                        </tbody>
                    </table>
                </div>
        }
        else{
            view = <div>
                <h6 className="coral-color">User clusters:</h6>
                <h6 className="App-text-xx-small">No clusters.</h6>
                <h6 className="App-text-xx-small">Create a new container to use.</h6>
            </div>
        }


    return ( view );
}
