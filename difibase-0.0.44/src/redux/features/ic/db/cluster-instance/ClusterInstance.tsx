import {useAppDispatch, useAppSelector} from "../../../../app/Hooks";
// import {selectUserInstance, selectDbInstance} from "./UserClusterSlice";
import React, {useEffect, useState} from "react";
import {
    selectClusterInstances,
    selectClusterInstanceCreate,
    selectSelectedCluster,
    selectSelectedInstance
} from "./ClusterInstanceSlice";
import {selectUserCluster, set_user_cluster} from "../cluster/UserClusterSlice";
import {Principal} from "@dfinity/principal";
import {selectWasmObjects} from "../../files/wasm/storage/WasmObjectsSlice";
import {selectValues} from "../../base/AccountSlice";
import {Actor_Service_Local} from "../../../../../util/actors/local/Actor_local";
import {string} from "yup";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {makeStyles} from "@material-ui/core/styles";


var ac = new Actor_Service_Local();

const useStyles = makeStyles((theme) => ({
    table: {
        maxWidth: "auto",
        border: "2px ",
        solid: "#282c24",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sticky: {
        position: "sticky",
        left: 0,
        background: "#282c34",
        borderRight: "1px solid #282c24",
        boxShadow: "5px 2px 5px grey",
        color: 'white',
        width: "max-content",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 4,
        borderRadius: 2,
        maxHeight: 500,
        fontStyle: 'oblique',
        fontSize: '.9em',
    },
    sticky_2: {
        position: "sticky",
        left: 0,
        background: "#282c34",
        borderRight: "1px solid #282c24",
        boxShadow: "5px 2px 5px grey",
        color: 'red',
        width: "max-content",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 4,
        borderRadius: 2,
        maxHeight: 500,
        fontStyle: 'oblique',
        fontSize: '.9em',
    },
    sticky_3: {
        position: "sticky",
        left: 0,
        background: "coral",
        borderRight: "1px solid #282c24",
        boxShadow: "5px 2px 5px grey",
        color: 'white',
        width: "max-content",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 4,
        borderRadius: 2,
        maxHeight: 500,
        fontStyle: 'oblique',
        fontSize: '.9em',
    },
    sticky_4: {
        position: "sticky",
        left: 0,
        background: "#282c34",
        borderRight: "1px solid #282c24",
        boxShadow: "5px 2px 5px grey",
        color: 'coral',
        width: "max-content",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 4,
        borderRadius: 2,
        maxHeight: 500,
        fontStyle: 'oblique',
        fontSize: '.9em',
    },
    sticky_5: {
        position: "sticky",
        left: 0,
        background: "gray",
        borderRight: "1px solid #282c24",
        boxShadow: "5px 2px 5px grey",
        color: "white",
        width: "max-content",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 4,
        borderRadius: 2,
        maxHeight: 500,
        fontStyle: 'oblique',
        fontSize: '.9em',
    },
    sticky_6: {
        position: "sticky",
        left: 0,
        background: "#282c34",
        borderRight: "1px solid #282c24",
        boxShadow: "5px 2px 5px grey",
        color: "red",
        width: "max-content",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 4,
        borderRadius: 2,
        maxHeight: 500,
        fontStyle: 'oblique',
        fontSize: '.9em',
    }
}));

export function ClusterInstance() {
    const classes = useStyles();
    const dispatch = useAppDispatch();

    //Redux account - GET
    const values = useAppSelector(selectValues);
    const principal = values[1];
    const balance_icp = values[2];
    const account_id = values[3];
    const principal_bytes = values[4];

    //Redux cluster; instance - GET
    const user_cluster = useAppSelector(selectUserCluster);
    const selected_cluster = useAppSelector(selectSelectedCluster);
    const selected_instance = useAppSelector(selectSelectedInstance);
    const cluster_instances = useAppSelector(selectClusterInstances);
    const cluster_instance_create = useAppSelector(selectClusterInstanceCreate);

    useEffect(() => {
        async function asyncAction() {
           await updateAsyncAction();
        }
        asyncAction();
    }, [])

    const updateAsyncAction = async () => {
    }

    const renderTableUserInstanceHeader = () => {
        if(cluster_instances.length > 0) {
            let header = ["Number key", "Wasm name", "Instance id(Principal)", "Description", "Version"];
            return header.map((key, index) => {
                return <th key={index}>{key}</th>
            })
        }
    }

    const renderTableUserInstance = () => {
        return cluster_instances.map((i, index) => {
            const { number_key, wasm_name, instance_principal, description, wasm_version} = i
            return (
                <tr className="App-table"  >
                    <td>{String(number_key)}</td>
                    <td className="App-text-small-coral-table">{String(wasm_name)}</td>
                    <td>{String(instance_principal)}</td>
                    <td className="App-text-small-teal-table">{String(description)}</td>
                    <td className="App-text-x-small-darkred-table">{String(wasm_version)}</td>
                </tr>
            )
        })
    }

    let view;

    let view_table_v1 =
        <>
            <div>
                <h6 className="coral-color">User instances(in cluster):</h6>
                <table id='clusters'>
                    <tbody>
                    <tr className="App-text-xx-small">{renderTableUserInstanceHeader()}</tr>
                    {renderTableUserInstance()}
                    </tbody>
                </table>
            </div>
        </>;

    type ViewClusterInstanceProps = {
        number_key:string;
        wasm_name:string;
        instance_principal:string;
        description:string;
        wasm_version:string;
        status:string;
    };

    const ViewRowColors: React.FunctionComponent<ViewClusterInstanceProps> = ({
                                                                                  number_key,
                                                                                  wasm_name,
                                                                                  instance_principal,
                                                                                  description,
                                                                                  wasm_version,
                                                                                  status,
                                                                                  }) => {
        let view_id = <></>;

        if(status == 'involved'){
            view_id = <>
                <TableRow selected={true}>
                    <TableCell className={classes.sticky} component="th" scope="row" width="5%"> {number_key}  </TableCell>
                    <TableCell align="right" className={classes.sticky_4} width="5%">{wasm_name}</TableCell>
                    <TableCell align="right" className={classes.sticky} width="25%">{instance_principal}</TableCell>
                    <TableCell align="right" className={classes.sticky} width="25%">{description}</TableCell>
                    <TableCell align="right" className={classes.sticky_2} width="25%">{wasm_version}</TableCell>
                    <TableCell align="right" className={classes.sticky_3} width="10%">{"#"+status}</TableCell>
                </TableRow>
            </>
        }
        if(status == 'stopped'){
            view_id = <>
                <TableRow selected={true}>
                    <TableCell className={classes.sticky} component="th" scope="row" width="5%"> {number_key}  </TableCell>
                    <TableCell align="right" className={classes.sticky_4} width="5%">{wasm_name}</TableCell>
                    <TableCell align="right" className={classes.sticky} width="25%">{instance_principal}</TableCell>
                    <TableCell align="right" className={classes.sticky} width="25%">{description}</TableCell>
                    <TableCell align="right" className={classes.sticky_2} width="25%">{wasm_version}</TableCell>
                    <TableCell align="right" className={classes.sticky_5} width="10%">{"#"+status}</TableCell>
                </TableRow>
            </>
        }
        if(status == 'abandon'){
            view_id = <>
                <TableRow selected={true}>
                    <TableCell className={classes.sticky} component="th" scope="row" width="5%"> {number_key}  </TableCell>
                    <TableCell align="right" className={classes.sticky_4} width="5%">{wasm_name}</TableCell>
                    <TableCell align="right" className={classes.sticky} width="25%">{instance_principal}</TableCell>
                    <TableCell align="right" className={classes.sticky} width="25%">{description}</TableCell>
                    <TableCell align="right" className={classes.sticky_2} width="25%">{wasm_version}</TableCell>
                    <TableCell align="right" className={classes.sticky_6} width="10%">{"#"+status}</TableCell>
                </TableRow>
            </>
        }
        return (view_id);
    };

    let view_table_v2 =
        <>
            <div>
                <h6 className="coral-color">User instances(in cluster):</h6>
                <TableContainer className={classes.table}>
                    <Table aria-label="wasm table">
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.sticky} width="5%"> Number key </TableCell>
                                <TableCell align="right" className={classes.sticky} width="5%">Wasm name</TableCell>
                                <TableCell align="right" className={classes.sticky} width="25%">Instance id(Principal)</TableCell>
                                <TableCell align="right" className={classes.sticky}width="25%">Description</TableCell>
                                <TableCell align="right" className={classes.sticky}width="5%">Version</TableCell>
                                <TableCell align="right" className={classes.sticky}width="10%">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/*{cluster_instances.map((row) => (*/}
                            {/*     <TableRow selected={true}>*/}
                            {/*        <TableCell className={classes.sticky} component="th" scope="row" width="5%"> {row.number_key.toString()}  </TableCell>*/}
                            {/*        <TableCell align="right" className={classes.sticky_4} width="5%">{row.wasm_name.toString()}</TableCell>*/}
                            {/*        <TableCell align="right" className={classes.sticky} width="25%">{row.instance_principal.toString()}</TableCell>*/}
                            {/*        <TableCell align="right" className={classes.sticky} width="25%">{row.description.toString()}</TableCell>*/}
                            {/*        <TableCell align="right" className={classes.sticky_2} width="25%">{row.wasm_version.toString()}</TableCell>*/}
                            {/*        <TableCell align="right" className={classes.sticky_3} width="10%">{"#"+Object.keys(row.status)}</TableCell>*/}
                            {/*    </TableRow>*/}
                            {/*))}*/}
                            {cluster_instances.map((row) => (
                                 <ViewRowColors
                                    number_key = {row.number_key.toString()}
                                    wasm_name = {row.wasm_name.toString()}
                                    instance_principal = {row.instance_principal.toString()}
                                    description = {row.description.toString()}
                                    wasm_version  = {row.wasm_version.toString()}
                                    status={Object.keys(row.status).toString()}></ViewRowColors>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>;

    let view_empty =
        <>
            {/*<div>*/}
            {/*    <h6 className="coral-color">User instances(in cluster):</h6>*/}
            {/*    <h6 className="App-text-xx-small">No instance.</h6>*/}
            {/*    <h6 className="App-text-xx-small">Create a new instance to use.</h6>*/}
            {/*</div>*/}
        </>;

    if(cluster_instances.length > 0){
            view =  view_table_v2
        }
        else{
            view = view_empty;
        }
    return ( view );
}
