import React, {Component, useEffect} from 'react';
import { render } from "react-dom";
import { useState } from 'react';
import {Col, Container, Form, FormControl, InputGroup, Row, Stack, Table} from 'react-bootstrap';
import {Actor_Service_Local} from "../../../../util/actors/local/Actor_local";
import {Actor_DB} from "../../../../util/actors/ic_network/Actor_ic_db";
import FileToUpload from "../../../../util/blockchain/file_operations/files/Upload_blockchain_ic";
import {AddEntityesTableComponent} from "./fragments/tables-crud/AddEntityesTableComponent";
// import {UploadFileComponent} from "./fragments/tables_add/UploadFileComponent";
import {GetEntityesTableComponent} from "./fragments/tables/GetEntityesTableComponent";
import {Button, Divider, FormHelperText, Grid, Input, InputLabel, Select} from "@material-ui/core";
import {useStyles} from "../../../../common/usestyle/use_styles";
import {Cluster, Instance} from "../../../../common/interfaces/interfaces";
import {Principal} from "@dfinity/principal";
import {useAppDispatch, useAppSelector} from "../../../../redux/app/Hooks";
import {selectValues} from "../../../../redux/features/ic/base/AccountSlice";
import {selectTokensBalance} from "../../../../redux/features/ic/token/TokensBalanceSlice";
import {selectUserCluster, set_user_cluster} from "../../../../redux/features/ic/db/cluster/UserClusterSlice";
import {
    selectClusterInstances,
    selectSelectedCluster, selectSelectedInstance, set_cluster_instances, set_selected_cluster, set_selected_instance
} from "../../../../redux/features/ic/db/cluster-instance/ClusterInstanceSlice";
import {Actor_ADMIN} from "../../../../util/actors/ic_network/Actor_ic_admin";
import { UploadFileComponent } from './fragments/tables-files/UploadFileComponent';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

var ac = new Actor_ADMIN();

const TablesFilesUploadComponent: React.FC = (props) => {
    const classes = useStyles();

    const [user_clusters, setUserClusters] = useState<Array<any>>([]);
    const [user_cluster_instances, setUserClusterInstances] = useState<Array<any>>([]);

    const [selected_cluster, setSelectedCluster] = useState<Cluster>({
        name: '',
        canister_id: '',
        cluster_principal: Principal.fromUint8Array( new Uint8Array()),
        user_principal: Principal.fromUint8Array( new Uint8Array()),
        wasm_name: '',
        wasm_version: -1,
        status: {unknown: null},
        description: ''
    });

    const [selected_instance, setSelectedInstance] = useState<Instance>({
        number_key: -1,
        instance_principal: Principal.fromUint8Array( new Uint8Array()),
        wasm_name: '',
        wasm_version: -1,
        status : {unknown: null},
        description : ''
    });



    //Redux
    const dispatch = useAppDispatch();

    //Redux account - GET
    const values = useAppSelector(selectValues);
    const principal = values[1];
    const balance_icp = values[2];
    const account_id = values[3];
    const principal_bytes = values[4];
    //Redux account tokens - GET
    const values_token = useAppSelector(selectTokensBalance);
    let balance_dbf = '';
    let symbol_dbf = '';
    //Redux database clusters - GET
    const user_clusters_redux = useAppSelector(selectUserCluster);
    //Redux database cluster instances - GET
    const user_cluster_instances_redux = useAppSelector(selectClusterInstances);
    //Redux selected cluster - GET
    const selected_cluster_redux = useAppSelector(selectSelectedCluster);
    //Redux selected cluster - GET
    const selected_instance_redux = useAppSelector(selectSelectedInstance);

    props = {id:selected_instance_redux.instance_principal.toString()};

    useEffect(() => {
        async function managerAction() {
            updateCluster();
        }
        managerAction();
    }, []);

    function updateState(state: any) {

    }

    const updateCluster = async () => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        const clusters = await ac.actor_service_admin.user_clusters(principal_user);
        setUserClusters(clusters);
        dispatch(set_user_cluster(clusters));
    }

    const updateInstance = async (cluster: Cluster) => {
        // @ts-ignore
        if(cluster.description != '' && cluster.status !=  {unknown: null}){
            if(user_clusters.length > 0){
                user_clusters.forEach(async i => {
                    if(i.description == cluster.description){
                        const id = i.cluster_principal.toString();
                        const instance = await ac.actor_service_admin.cluster_reade_instances_info(id);
                        setUserClusterInstances(instance);
                        dispatch(set_cluster_instances(instance));
                    }
                });
            }
            else {
                const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
                const clusters = await ac.actor_service_admin.user_clusters(principal_user);
                clusters.forEach(async i => {
                    if(i.description == cluster.description){
                        const id = i.cluster_principal.toString();
                        const instance = await ac.actor_service_admin.cluster_reade_instances_info(id);
                        setUserClusterInstances(instance);
                        dispatch(set_cluster_instances(instance));
                    }
                });
            }
        }
    }

    const handleChangeClusterSelected = async (event: { target: { value: any; }; }) => {
        dispatch(set_selected_cluster(event.target.value));
        setSelectedCluster(event.target.value);
        await updateInstance(event.target.value);
        setSelectedInstance({
            number_key: -1,
            instance_principal: Principal.fromUint8Array( new Uint8Array()),
            wasm_name: '',
            wasm_version: -1,
            status : {unknown: null},
            description : ''
        });//clean
        console.warn(event.target.value);
    };

    const handleChangeClusterInstanceSelected = async (event: { target: { value: any; }; }) => {
        dispatch(set_selected_instance(event.target.value));
        setSelectedInstance(event.target.value);
        // props={id:event.target.value.instance_principal.toString()}
        console.warn(event.target.value);
    };

    return (
        <div>
            <Grid
                container
                spacing={3}
                direction="row"
                justifyContent="center"
                alignItems="center">
                <Grid item xs={3}>
                    <Stack>
                        <Divider></Divider>
                        <InputLabel shrink htmlFor="select-multiple-native" className={classes.text_white}>
                            Select your cluster
                        </InputLabel>
                        {/*clusters*/}
                        <Select
                            className={classes.selected_zone}
                            // className={'select-css'}
                            value={selected_cluster}
                            // @ts-ignore Typings are not considering `native`
                            onChange={handleChangeClusterSelected}
                            label="Native"
                            input={<Input />}
                            MenuProps={MenuProps}
                            inputProps={{
                                id: 'select-multiple-native',
                            }}>
                            {
                                user_clusters.filter(j =>
                                    Object.keys(j.status)[0] == 'involved').map((j) =>
                                    (
                                        <option key={j} value={j}>
                                            {
                                                j.description
                                            }
                                        </option>
                                    ))
                            }
                        </Select>
                        <InputLabel shrink htmlFor="select-multiple-native" className={classes.text_white}>
                            Select your instance
                        </InputLabel>
                        <Divider></Divider>
                        {/*instance*/}
                        <Select
                            className={classes.selected_zone}
                            value={selected_instance}
                            // @ts-ignore Typings are not considering `native`
                            onChange={handleChangeClusterInstanceSelected}
                            label="Native"
                            input={<Input />}
                            MenuProps={MenuProps}
                            inputProps={{
                                id: 'select-multiple-native',
                            }}>
                            {user_cluster_instances.filter(i => Object.values(i)[5] === "db_files.wasm").filter(i =>
                                Object.keys(i.status)[0] != 'abandon').map((i) => (
                                <option key={i} value={i}>
                                    {i.description}
                                </option> ))
                            }
                            {/*{user_cluster_instances.filter(i =>*/}
                            {/*    Object.keys(i.status)[0] != 'abandon').map((i) => (*/}
                            {/*    <option key={i} value={i}>*/}
                            {/*        {i.description}*/}
                            {/*    </option>*/}
                            {/*))}*/}
                        </Select>
                        <h6 className='transparent-text-color'>_</h6>
                    </Stack>
                </Grid>
                {/*<Grid item xs={4}  >*/}
                {/*    <AddEntityesTableComponent {...props}></AddEntityesTableComponent>*/}
                {/*</Grid>*/}
                <Grid item xs={4}  >
                    <UploadFileComponent {...props}></UploadFileComponent>
                </Grid>
            </Grid>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <GetEntityesTableComponent></GetEntityesTableComponent>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default TablesFilesUploadComponent;

