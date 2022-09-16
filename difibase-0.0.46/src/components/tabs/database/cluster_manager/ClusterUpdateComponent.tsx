import React, {useEffect, useState} from "react";
import {Col, Container, Form,  InputGroup, Row, Stack, Table} from 'react-bootstrap';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    Input,
    InputLabel,
    TextField,
    Typography,
    Paper,
    styled, Select
} from '@material-ui/core';
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

import {selectUserCluster, set_user_cluster} from "../../../../redux/features/ic/db/cluster/UserClusterSlice";
import {UserCluster} from "../../../../redux/features/ic/db/cluster/UserCluster";
import {makeStyles} from "@material-ui/core/styles";
import {set_values_info_wasm} from "../../../../redux/features/ic/files/wasm/action/WasmStorageSlice";
import {string} from "yup";
import {
    selectSelectedCluster, set_cluster_instances,
    set_selected_cluster
} from "../../../../redux/features/ic/db/cluster-instance/ClusterInstanceSlice";
import {SelectedClusterValues} from "../../../../common/interfaces/interfaces";
import {useStyles} from "../../../../common/usestyle/use_styles";
import {Actor_ADMIN} from "../../../../util/actors/ic_network/Actor_ic_admin";

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

const ClusterUpdateComponent: React.FC = () => {
    const classes = useStyles();

    const [cluster_canister_id, setClusterCanisterId] = useState<string>('');
    const [cluster_principal, setClusterPrincipal] = useState<Principal>(Principal.fromUint8Array(new Uint8Array()));
    const [cluster_name, setClusterName] = useState<string>('');
    const [clusters_canister_id, setClustersCanisterId] = useState<Array<string>>([]);
    const [clusters_name, setClustersName] = useState<Array<string>>([]);
    const [selected_cluster_values, setSelectedClusterValue] = useState<SelectedClusterValues>({
        name: '',
        canister_id: '',
        principal: Principal.fromUint8Array(new Uint8Array())
    });

    //Redux
    const dispatch = useAppDispatch();
    //Redux account - GET
    const values = useAppSelector(selectValues);
    const principal = values[1];
    const balance_icp = values[2];
    const account_id = values[3];
    const principal_bytes = values[4];
    // const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
    //Redux account tokens - GET
    const values_token = useAppSelector(selectTokensBalance);
    let balance_dbf = '';
    let symbol_dbf = '';
    //Redux instances - GET
    const db_instances_values = useAppSelector(selectDbInstance);
    //Redux database instances - GET
    const user_instances_values = useAppSelector(selectUserInstance);
    //Redux database clusters - GET
    const user_cluster = useAppSelector(selectUserCluster);
    //Redux wasm objects - GET
    const selected_cluster = useAppSelector(selectSelectedCluster);

    useEffect(() => {
        async function managerAction() {
            await updateView();
            await updateClusterName();
        }
        managerAction();
    }, [])

    const updateView = async () => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        const clusters = await ac.actor_service_admin.user_clusters(principal_user);
        dispatch(set_user_cluster(clusters));
    }

    const updateClusterName = async () => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        let uc = user_cluster.valueOf();
        if(Array.isArray(uc)){
            if(uc.length > 0){
                await clustersNameIdInit(user_cluster);
            }
            else {
                const clusters = await ac.actor_service_admin.user_clusters(principal_user);
                dispatch(set_user_cluster(clusters));
                await clustersNameIdInit(clusters);
            }
        }
    }

    const updateClusterValue = async (cluster_name: string) => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        if(cluster_name != ''){
            if(user_cluster.length > 0){
                user_cluster.forEach(i => {
                    if(i.description == cluster_name){
                        setClusterCanisterId(i.cluster_principal.toString());
                        setClusterPrincipal(i.cluster_principal);
                        setSelectedClusterValue({
                            name: cluster_name,
                            canister_id: i.cluster_principal.toString(),
                            principal: i.cluster_principal});
                    }
                });
            }
            else {
                const clusters = await ac.actor_service_admin.user_clusters(principal_user);
                if(clusters.length > 0){
                    dispatch(set_user_cluster(clusters));
                    clusters.forEach(i => {
                        if(i.description == cluster_name){
                            setClusterCanisterId(i.cluster_principal.toString());
                            setClusterPrincipal(i.cluster_principal);
                            setSelectedClusterValue({
                                name: cluster_name,
                                canister_id: i.cluster_principal.toString(),
                                principal: i.cluster_principal});
                        }
                    });
                }
            }
        }
    }

    const clustersNameIdInit = async (clusters : Array<any>) => {
        let uc  = clusters.valueOf();
        if(Array.isArray(uc)){
            if(uc.length > 0){
                let j = 0;
                var arr = new Array<string>(uc.length);
                var arr_id = new Array<string>(uc.length);
                uc.forEach(i=>{
                    arr[j] = i.description;
                    arr_id[j] = i.cluster_principal.toString();
                    j++;
                });
                setClustersName(arr);
                setClustersCanisterId(arr_id);
            }
        }
    }

    if(values_token.length > 0) {
        balance_dbf = values_token[0].toString();
        symbol_dbf = values_token[1];
    }

    const handleChangeClusterSelected = async (event: { target: { value: any; }; }) => {
        dispatch(set_selected_cluster(event.target.value));
        setClusterName(event.target.value);
        await updateClusterValue(event.target.value);
        console.warn(event.target.value);
    };

    const onStartCluster = async () => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        if(selected_cluster_values.name != '' && selected_cluster_values.canister_id != ''){
            const result = await ac.actor_service_admin.cluster_start(principal_user, selected_cluster_values.name);
            var keys = Object.keys(result);
            if(keys[0] == "ok"){
                var value = Object.values(result);
                var value_principal = value[0];
                alert("Start cluster" + " " + " canister id: " + value_principal.toString());
                await updateView();
            }
            else {
                alert("Cluster starting error" );
            }
        }
    }


    const onStopCluster = async () => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        if(selected_cluster_values.name != '' && selected_cluster_values.canister_id != ''){
            const result = await ac.actor_service_admin.cluster_stop(principal_user, selected_cluster_values.name);
            var keys = Object.keys(result);
            if(keys[0] == "ok"){
                var value = Object.values(result);
                var value_principal = value[0];
                alert("Stop cluster" + " " + " canister id: " + value_principal.toString());
                await updateView();
            }
            else {
                alert("Cluster stopping error" );
            }
        }
    }

    //Test view
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    type ViewClusterProps = {
        name: string;
        canister_id: string;
        children: React.ReactNode;
    };


    const ViewSelectedCluster: React.FunctionComponent<ViewClusterProps> = ({name, canister_id, children}) => {
        let view_id = <></>;
        if(name != '' && canister_id != ''){
            view_id = <>
                <div>
                    <h6 className={classes.input_color_coral}>Cluster name:  {name}</h6>
                    <h6 className={classes.input_color_coral}>Cluster canister id: {canister_id}</h6>
                </div>
            </>
        }
        return (view_id);
    };

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

                    <Grid item xs={5}>
                        <UserCluster></UserCluster>
                        <h6 className='transparent-text-color'>_</h6>
                        <h6 className='transparent-text-color'>_</h6>
                        <h6 className='transparent-text-color'>_</h6>
                    </Grid>

                    <Grid item xs={5} justifyContent="flex-start"  alignItems="flex-start">
                        <Stack>
                            <ViewSelectedCluster
                                name={selected_cluster_values.name}
                                canister_id={selected_cluster_values.canister_id}>
                            </ViewSelectedCluster>
                            <InputLabel shrink htmlFor="select-multiple-native" className={classes.text_white}>
                                Select your cluster
                            </InputLabel>
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
                                {clusters_name.map((j) => (
                                    <option key={j} value={j}>
                                        {j}
                                    </option>
                                ))}
                            </Select>

                            {/*<Button variant="contained" onClick={onCreateClusterDefault} >New Cluster</Button>*/}
                            <h6 className='transparent-text-color'>_</h6>
                            <Button variant="contained" onClick={onStartCluster}>Start</Button>
                            <h6 className='transparent-text-color'>_</h6>
                            <Button variant="contained" onClick={onStopCluster}>Stop</Button>
                        </Stack>
                    </Grid>

                    {/*<Grid item xs={4}>*/}
                    {/*    <Item>xs=4</Item>*/}
                    {/*</Grid>*/}
                    {/*<Grid item xs={8}>*/}
                    {/*    <Item>xs=8</Item>*/}
                    {/*</Grid>*/}
                </Grid>
            </div>
        </div>
    )
}

export default ClusterUpdateComponent

