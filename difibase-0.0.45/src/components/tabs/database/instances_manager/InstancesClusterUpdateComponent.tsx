import React, {useEffect, useState} from "react";
import '../../../../SelectStyle.css'

import {Col, Container, Form, InputGroup, Row, Stack, Table} from 'react-bootstrap';
import {useAppDispatch, useAppSelector} from "../../../../redux/app/Hooks";
import {selectValues} from "../../../../redux/features/ic/base/AccountSlice";
import {selectTokensBalance} from "../../../../redux/features/ic/token/TokensBalanceSlice";
import {
    selectDbInstance,
    selectUserInstance, set_db_instances,
    set_user_instances
} from "../../../../redux/features/ic/db/instance/UserInstanceSlice";
import {Principal} from "@dfinity/principal";
import {Actor_Service_Local} from "../../../../util/actors/local/Actor_local";
import {
    Button, Checkbox,
    createMuiTheme, createStyles,
    FormControl, FormHelperText,
    Grid,
    Input,
    InputLabel, ListItemText, MenuItem,
    Paper,
    Select,
    styled,
    TextField
} from "@material-ui/core";
import {selectUserCluster, set_user_cluster} from "../../../../redux/features/ic/db/cluster/UserClusterSlice";
import {UserCluster} from "../../../../redux/features/ic/db/cluster/UserCluster";
import {makeStyles} from "@material-ui/core/styles";
import {set_values_info_wasm} from "../../../../redux/features/ic/files/wasm/action/WasmStorageSlice";
import {string} from "yup";
import {selectWasmObjects} from "../../../../redux/features/ic/files/wasm/storage/WasmObjectsSlice";

import {
    selectClusterInstances,
    selectSelectedCluster, set_cluster_instances, set_cluster_instance_create,
    set_selected_cluster, selectSelectedInstance, set_selected_instance
} from "../../../../redux/features/ic/db/cluster-instance/ClusterInstanceSlice";
import {ClusterInstance} from "../../../../redux/features/ic/db/cluster-instance/ClusterInstance";
import {useStyles} from "../../../../common/usestyle/use_styles";
import {
    Cluster,
    Instance,
    SelectedClusterInstanceValues,
    SelectedClusterValues
} from "../../../../common/interfaces/interfaces";
import {CurrentStatusCluster, CurrentStatusInstance} from "../../../../idls/admin/interface/admin.did";
import {Actor_ADMIN} from "../../../../util/actors/ic_network/Actor_ic_admin";
import {Actor_CLUSTER} from "../../../../util/actors/ic_network/Actor_ic_cluster";

// var ac = new Actor_Service_Local();
var ac = new Actor_ADMIN();

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

const InstancesClusterUpdateComponent: React.FC = () => {
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

    useEffect(() => {
        async function managerAction() {
            updateCluster();
            // await updateView();
        }
        managerAction();
    }, []);

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

    if(values_token.length > 0) {
        balance_dbf = values_token[0].toString();
        symbol_dbf = values_token[1];
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
        console.warn(event.target.value);
    };

    const onStartClusterInstance = async () => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        // #unknown; #involved; #abandon; #stopped;
        if(selected_instance.number_key != -1
            && (Object.keys(selected_instance.status)[0] == 'stopped')){
            let canister_id = selected_cluster.cluster_principal.toString();
            const ac_this = new Actor_CLUSTER(canister_id);
            let result = await ac_this.actor_service_cluster.start_instance(BigInt(selected_instance.number_key));
            let keys = Object.keys(result);
            if(keys[0] == "ok"){
                var value = Object.values(result);
                var value_principal = value[0];
                alert("Start instance" + " " + " canister id: " + value_principal.toString());
                await updateInstance(selected_cluster);
            }
            else {
                alert("Start instance error" );
            }
        }
    }

    const onStopClusterInstance = async () => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        // #unknown; #involved; #abandon; #stopped;
        if(selected_instance.number_key != -1
            && (Object.keys(selected_instance.status)[0] == 'involved')){
            var inst = selected_instance.instance_principal.toString();
            let canister_id = selected_cluster.cluster_principal.toString();
            const ac_this = new Actor_CLUSTER(canister_id);
            let result = await ac_this.actor_service_cluster.stop_instance(BigInt(selected_instance.number_key));
            let keys = Object.keys(result);
            if(keys[0] == "ok"){
                var value = Object.values(result);
                var value_principal = value[0];
                alert("Stop instance" + " " + " canister id: " + value_principal.toString());
                await updateInstance(selected_cluster);
            }
            else {
                alert("Stop instance error" );
            }
        }
    }

    const onCleanClusterInstance = async () => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        if(selected_instance.number_key != -1
            && (Object.keys(selected_instance.status)[0] == 'involved')){
            let canister_id = selected_cluster.cluster_principal.toString();
            const ac_this = new Actor_CLUSTER(canister_id);
            let result = await ac_this.actor_service_cluster.clean_instance(BigInt(selected_instance.number_key));
            let keys = Object.keys(result);
            if(keys[0] == "ok"){
                var value = Object.values(result);
                var value_principal = value[0];
                alert("Clean instance" + " " + " canister id: " + value_principal.toString());
                await updateInstance(selected_cluster);
            }
            else {
                alert("Clean instance error" );
            }
        }
    }

    const onDeleteClusterInstance = async () => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        // if(selected_instance.number_key != -1
        //     && (Object.keys(selected_instance.status)[0] == 'involved')){
        if(selected_instance.number_key != -1){
            let canister_id = selected_cluster.cluster_principal.toString();
            const ac_this = new Actor_CLUSTER(canister_id);
            let result = await ac_this.actor_service_cluster.delete_instance(BigInt(selected_instance.number_key));
            let keys = Object.keys(result);
            if(keys[0] == "ok"){
                var value = Object.values(result);
                var value_principal = value[0];
                alert("Delete instance" + " " + " canister id: " + value_principal.toString());
                await updateInstance(selected_cluster);
            }
            else {
                alert("Delete instance error" );
            }
        }
    }

    type ViewClusterProps = {
        // name: string;
        canister_id: string;
        cluster_principal : Principal; //ClusterIdentifier (canister_id)
        user_principal : Principal;
        wasm_name: string;
        wasm_version: number;
        // status: CurrentStatusCluster;
        description : string;
        children: React.ReactNode;
    };

    type ViewClusterInstanceProps = {
        number_key: number;
        instance_principal : Principal; //(canister_id)
        wasm_name: string;
        wasm_version: number;
        // status : CurrentStatusInstance;
        description : string;
        children: React.ReactNode;
    };

    const ViewSelectedCluster: React.FunctionComponent<ViewClusterProps> = ({
                                                                                description,
                                                                                canister_id,
                                                                                cluster_principal,
                                                                                user_principal,
                                                                                wasm_name,
                                                                                wasm_version,
                                                                                children}) => {
        let view_id = <></>;
        if(description != '' && canister_id != ''){
            view_id = <>
                <div>
                    <h6 className={classes.input_color_coral}>Cluster name:  {description}</h6>
                    {/*<h6 className={classes.input_color_coral}>Cluster canister id: {canister_id}</h6>*/}
                    <h6 className={classes.input_color_coral}>Cluster id:  {cluster_principal.toString()}</h6>
                    <h6 className={classes.input_color_coral}>Cluster user: {user_principal.toString()}</h6>
                    <h6 className={classes.input_color_coral}>Cluster wasm: {wasm_name}</h6>
                    <h6 className={classes.input_color_coral}>Cluster version: {wasm_version.toString()}</h6>
                </div>
            </>
        }
        return (view_id);
    };

    const ViewSelectedClusterInstance: React.FunctionComponent<ViewClusterInstanceProps> = ({
                                                                                                instance_principal,
                                                                                                wasm_name,
                                                                                                wasm_version,
                                                                                                number_key,
                                                                                                description,
                                                                                                children}) => {
        let view_id = <></>;
        if(description != '' && instance_principal.toString() != ''){
            view_id = <>
                <div>
                    <h6 className={classes.input_color_coral}>Instance name:  {description}</h6>
                    <h6 className={classes.input_color_coral}>Instance id: {instance_principal.toString()}</h6>
                    <h6 className={classes.input_color_coral}>Instance wasm name:  {wasm_name}</h6>
                    <h6 className={classes.input_color_coral}>Instance wasm version:  {wasm_version.toString()}</h6>
                    <h6 className={classes.input_color_coral}>Instance number key:  {number_key.toString()}</h6>
                </div>
            </>
        }
        return (view_id);
    };

    //Test view
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (
        <div className="white-color">
            <div>
                <div className="p-3">
                    <h6 className="coral-color">Account</h6>
                </div>
                <div className="p-1">
                    <h6 className="App-text-x-small">{'User principal:' +  ' '  +principal}</h6>
                    <h6 className="App-text-x-small">{'User balance icp:' +  ' '  +balance_icp}</h6>
                    <h6 className="App-text-x-small">{'User account id:' +  ' '  +account_id}</h6>
                    <h6 className="App-text-x-small">{'User amount token:' +  ' '  + balance_dbf + ' ' + symbol_dbf}</h6>
                </div>


                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justifyContent="center"
                    alignItems="center">

                    <Grid item xs={4}>
                        <Stack>
                            <ViewSelectedCluster
                                description={selected_cluster.description}
                                canister_id={selected_cluster.canister_id}
                                cluster_principal={selected_cluster.cluster_principal}
                                user_principal={selected_cluster.user_principal}
                                wasm_name={selected_cluster.wasm_name}
                                wasm_version={selected_cluster.wasm_version}
                            >
                            </ViewSelectedCluster>
                            <InputLabel shrink htmlFor="select-multiple-native" className={classes.text_white}>
                                Select your cluster
                            </InputLabel>
                            {/*clusters!!!!!!!!!*/}
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
                        </Stack>
                    </Grid>

                    <Grid item xs={5} justifyContent="flex-start"  alignItems="flex-start">
                        <Stack>
                            <ViewSelectedClusterInstance
                                description={selected_instance.description}
                                instance_principal={selected_instance.instance_principal}
                                wasm_name={selected_instance.wasm_name}
                                wasm_version={selected_instance.wasm_version}
                                number_key={selected_instance.number_key}>
                            </ViewSelectedClusterInstance>
                            <h6 className={classes.text_whitesmoke}>(To delete instance, you must first stop the it.)</h6>
                            <h6 className={classes.text_whitesmoke}>(Deleted objects become inactive.)</h6>
                            <InputLabel shrink htmlFor="select-multiple-native" className={classes.text_white}>
                                Select your instance
                            </InputLabel>
                            {/*instance!!!!!!!!!!*/}
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
                                {user_cluster_instances.filter(i =>
                                    Object.keys(i.status)[0] != 'abandon').map((i) => (
                                    <option key={i} value={i}>
                                        {i.description}
                                    </option>
                                ))}
                            </Select>

                            {/*<Button variant="contained" onClick={onCreateClusterDefault} >New Cluster</Button>*/}
                            <h6 className='transparent-text-color'>_</h6>
                            <Button variant="contained" onClick={onStartClusterInstance}>Start</Button>
                            <h6 className='transparent-text-color'>_</h6>
                            <Button variant="contained" onClick={onStopClusterInstance}>Stop</Button>
                            <h6 className='transparent-text-color'>_</h6>
                            <Button variant="contained" onClick={onCleanClusterInstance}>Clean</Button>
                            <h6 className='transparent-text-color'>_</h6>
                            <Button variant="contained" onClick={onDeleteClusterInstance}>Delete</Button>
                        </Stack>
                    </Grid>
                    {/*<Grid item xs={4}> <Item>xs=4</Item></Grid>*/}
                    {/*<Grid item xs={4}> <Item>xs=4</Item></Grid>*/}
                </Grid>
                <ClusterInstance></ClusterInstance>
                <h6 className='transparent-text-color'>_</h6>
                <h6 className='transparent-text-color'>_</h6>
                <h6 className='transparent-text-color'>_</h6>
            </div>
        </div>
    )
}

export default InstancesClusterUpdateComponent
