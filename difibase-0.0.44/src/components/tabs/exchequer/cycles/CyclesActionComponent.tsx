import React, {useEffect, useState} from "react";
import '../../../../SelectStyle.css'
import {useAppDispatch, useAppSelector} from "../../../../redux/app/Hooks";
import {Actor_Service_Local} from "../../../../util/actors/local/Actor_local";
import {
    Button,
    Checkbox,
    createMuiTheme,
    createStyles, Divider,
    FormControl,
    FormHelperText,
    Grid,
    Input,
    InputLabel,
    ListItemText,
    MenuItem,
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
    selectDbInstance,
    selectUserInstance, set_db_instances,
    set_user_instances
} from "../../../../redux/features/ic/db/instance/UserInstanceSlice";
import {
    selectClusterInstances,
    selectSelectedCluster, set_cluster_instances, set_cluster_instance_create,
    set_selected_cluster, selectSelectedInstance, set_selected_instance
} from "../../../../redux/features/ic/db/cluster-instance/ClusterInstanceSlice";
import {ClusterInstance} from "../../../../redux/features/ic/db/cluster-instance/ClusterInstance";
import {useStyles} from "../../../../common/usestyle/use_styles";
import {
    Cluster, CyclesMarketConversionInfo, IcpXdrConversionRateCertifiedResponse,
    Instance,
    SelectedClusterInstanceValues,
    SelectedClusterValues
} from "../../../../common/interfaces/interfaces";
import {CurrentStatusCluster, CurrentStatusInstance} from "../../../../idls/admin/interface/admin.did";


import {selectValues} from "../../../../redux/features/ic/base/AccountSlice";
import {
    host_local,
    host_local_web, host_web_ic0_app,
    plug_host_connect,
    plug_web_host,
    plug_whitelist_connect, transaction_icp_coinage_minimal, transaction_icp_fee, transaction_icp_min_value
} from "../../../../const/Website";
import {createAgent} from "@dfinity/utils";
import {Ed25519KeyIdentity} from "@dfinity/identity";
import {Actor, HttpAgent} from "@dfinity/agent";
import {Stack} from "react-bootstrap";
import {Principal} from "@dfinity/principal";
import {HttpAgentRequest} from "@dfinity/agent/lib/esm/agent/http/types";
import {selectTokensBalance} from "../../../../redux/features/ic/token/TokensBalanceSlice";


import {CMCCanister} from "@dfinity/cmc";

import {canister_cycles_minting, canister_nns_ledger} from "../../../../const/Canisters";

import { idlFactory  as idl} from "../../../../idls/db/idl/db_old.did";
import { _SERVICE  as act_serv}  from "../../../../idls/db/interface/db_old.did";

import { idlFactory as idlCyclesProvider } from "../../../../idls/idls_external/cyclesProvider";
import { idlFactory as idlTokenAccessor }  from "../../../../idls/idls_external/tokenAccessor";
import { idlFactory as idlGovernance }  from "../../../../idls/idls_external/governance";
import { idlFactory as idlDip20 } from "../../../../idls/idls_external/dip20";

import { idlFactory as cmcIdlFactory } from "../../../../idls/idls_external/cmc/cmc.utils.did.mjs";
import { _SERVICE as cmc_serv } from "../../../../idls/idls_external/cmc/cmc.did";
import {Actor_CMC} from "../../../../util/actors_external/Actor_ic_cmc";
import {Actor_ADMIN} from "../../../../util/actors/ic_network/Actor_ic_admin";
import nns_ledger_did from "../../../../idls/ledger/ledger";
import {principalToBytesAccountDefaultIdentifier, principalToSubAccount} from "../../../../util/crypto/AccountUtils";
import {Actor_CLUSTER} from "../../../../util/actors/ic_network/Actor_ic_cluster";
import {Actor_DATABASE_EASY} from "../../../../util/actors/ic_network/Actor_ic_db_easy";
import {
    selectCyclePriceValues,
    set_cycle_price_values
} from "../../../../redux/features/ic/cycles/CyclesMarketPriceSlice";
import {CycleMarketPrice} from "../../../../util/blockchain/price/CycleMarketPrice";
import {Actor_DATABASE_FILES} from "../../../../util/actors/ic_network/Actor_ic_db_files";

export interface Identity {
    getPrincipal(): Principal;
    transformRequest(request: HttpAgentRequest): Promise<unknown>;
}

const Identity = require("@dfinity/identity");
// const hdkey = require("hdkey");
const { Secp256k1KeyIdentity } = Identity;

// var ac = new Actor_Service_Local();
var ac = new Actor_ADMIN();
const cmp = new CycleMarketPrice();

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

const host = host_local_web;
const CYCLES_MINTING_CANISTER_ID = canister_cycles_minting;

const CyclesActionComponent: React.FC = () => {
    const classes = useStyles();

    const [icp_amount, setICPAmount] = useState<string>("");
    const [icp_amount_absolutely, setICPAmountAbsolutely] = useState<string>("");
    const [cycles_amount_receive, setCyclesAmountReceive] = useState<string>("");
    const [cycles_number_receive, setCyclesNumberReceive] = useState<BigInt>(BigInt(0));
    const [cycles_amount_price, setCyclesAmountPrice] = useState<BigInt>(BigInt(0));

    const [cycles_amount_cluster, setCyclesAmountCluster] = useState<BigInt>(BigInt(0));
    const [cycles_amount_instance, setCyclesAmountInstance] = useState<BigInt>(BigInt(0));

    const [user_clusters, setUserClusters] = useState<Array<any>>([]);
    const [user_cluster_instances, setUserClusterInstances] = useState<Array<any>>([]);
    const [mnemonic, setMnemonic] = useState<string>("");
    const [finding_cycles, setFundingCycles] = useState<number>(-1);
    const [icp_cycles_conversion, setIcpCyclesConversion] = useState<string>("");

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
    //Redux cycles price - GET
    const cycles_price_values_redux = useAppSelector(selectCyclePriceValues);

    const oneTrillion = BigInt(1000000) * BigInt(1000000);
    const digitMultiplier = 100000000;
    const cmc = new Actor_CMC();

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
        async function managerAction() {
            await updateView();
        }
        managerAction();
    }, [])

    const updateView = async () => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));

        if(cycles_price_values_redux.cycles_value === ''){
            let amount: String = "1";// ICP
            const conversion_info: CyclesMarketConversionInfo = await cmp.get_cycle_market_info(amount);
            setIcpCyclesConversion(conversion_info.cycles_conversion_info);
            setCyclesAmountPrice(conversion_info.cycles_amount);
            dispatch(set_cycle_price_values(conversion_info));
        }
        else {
            setIcpCyclesConversion(cycles_price_values_redux.cycles_conversion_info);
            setCyclesAmountPrice(cycles_price_values_redux.cycles_amount);
        }

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

    //Selected cluster, instance
    const handleChangeClusterSelected = async (event: { target: { value: any; }; }) => {
        let select_cluster: Cluster = event.target.value;
        dispatch(set_selected_cluster(select_cluster));
        setSelectedCluster(select_cluster);
        await updateInstance(select_cluster);
        setSelectedInstance({
            number_key: -1,
            instance_principal: Principal.fromUint8Array( new Uint8Array()),
            wasm_name: '',
            wasm_version: -1,
            status : {unknown: null},
            description : ''
        });//clean
        await updateClusterCyclesBalance(select_cluster);
        console.warn(event.target.value);
    };
    const handleChangeClusterInstanceSelected = async (event: { target: { value: any; }; }) => {
        let select_instance: Instance = event.target.value;
        dispatch(set_selected_instance(event.target.value));
        setSelectedInstance(event.target.value);
        await updateInstanceCyclesBalance(select_instance);
        console.warn(event.target.value);
    };
    //Update cycles balance cluster, instance
    const updateClusterCyclesBalance = async (cluster: Cluster) => {
        let ac_cluster_this = new Actor_CLUSTER(cluster.cluster_principal.toString());
        let cycles = await ac_cluster_this.actor_service_cluster.cycles_balance();
        setCyclesAmountCluster(cycles);
    };
    const updateInstanceCyclesBalance = async (instance: Instance) => {
        let ac_instance_this = new Actor_DATABASE_FILES(instance.instance_principal.toString());
        let cycles = await ac_instance_this.actor_service_db_files.cycles_balance();
        setCyclesAmountInstance(cycles);
    };

    const onFunding = async () => {
        const amountNumber = Number(icp_amount.replace(',', '.'));
        const amount = amountNumber * digitMultiplier;

        // const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        const principal_user = Principal.fromText(principal);
        const cluster_principal = selected_cluster.cluster_principal;
        const cluster_canister_id = cluster_principal.toString();
        const instance_principal = selected_instance.instance_principal;
        const instance_canister_id = instance_principal.toString();;
        const instance_key = selected_instance.number_key;

        //instance
        if(cluster_canister_id != '' && instance_key != -1){
            if(amount >= transaction_icp_coinage_minimal){
                try{
                            //**1**//Transaction in canister admin
                            //1)Give permission!(does not work if you do not request an actor)
                            const actor_safe = await (window as any)?.ic?.plug?.createActor({
                                canisterId: canister_nns_ledger,
                                interfaceFactory: nns_ledger_did  });
                            //2)Actor transfer
                            const actor = await Actor.createActor(nns_ledger_did , {
                                // @ts-ignore
                                agent: window.ic.plug.agent,
                                canisterId: canister_nns_ledger,
                            });
                            let account_identifier = principalToBytesAccountDefaultIdentifier(instance_principal);
                            let subaccount = principalToSubAccount(instance_principal);

                            const response = await actor.transfer({
                                to: account_identifier,
                                fee: { e8s: BigInt(transaction_icp_fee) },
                                amount: { e8s: BigInt(amount) },
                                memo: 0,
                                from_subaccount: [], // For now, using default subaccount to handle ICP
                                created_at_time: [],
                            });
                            console.log('response', response);

                        // @ts-ignore
                        if(Object.keys(response)[0] == "Ok"){
                            //@ts-ignore
                            var block_index = Object.values(response)[0];
                            // const ac_cluster_this = new Actor_CLUSTER(cluster_canister_id);
                            const ac_instance_this = new Actor_DATABASE_EASY(instance_canister_id);
                            let mint_cycles = await ac_instance_this.actor_service_db_easy.minting_cycles(BigInt(amount));
                            setCyclesAmountInstance(BigInt(Number(cycles_amount_instance) + Number(mint_cycles)));
                            if(mint_cycles > 0){
                                alert("Mint cycles" + ' ' + mint_cycles);
                            }
                            else {
                                alert("Mint cycles error" );
                            }
                        }
                        else {
                            alert("Transaction error" );
                        }


                }
                catch (e){
                    console.log(e);}
            }
            else {

            }
        }
        //cluster
        else if(cluster_canister_id != '' && instance_key == -1){
            if(amount >= transaction_icp_coinage_minimal){
                try{
                    //**1**//Transaction in canister admin
                    //1)Give permission!(does not work if you do not request an actor)
                    const actor_safe = await (window as any)?.ic?.plug?.createActor({
                        canisterId: canister_nns_ledger,
                        interfaceFactory: nns_ledger_did  });
                    //2)Actor transfer
                    const actor = await Actor.createActor(nns_ledger_did , {
                        // @ts-ignore
                        agent: window.ic.plug.agent,
                        canisterId: canister_nns_ledger,
                    });
                    let account_identifier = principalToBytesAccountDefaultIdentifier(cluster_principal);
                    let subaccount = principalToSubAccount(cluster_principal);

                    const response = await actor.transfer({
                        to: account_identifier,
                        fee: { e8s: BigInt(transaction_icp_fee) },
                        amount: { e8s: BigInt(amount) },
                        memo: 0,
                        from_subaccount: [], // For now, using default subaccount to handle ICP
                        created_at_time: [],
                    });
                    console.log('response', response);

                    // @ts-ignore
                    if(Object.keys(response)[0] == "Ok"){
                        // @ts-ignore
                        var block_index = Object.values(response)[0];
                        const ac_cluster_this = new Actor_CLUSTER(cluster_canister_id);
                        let mint_cycles = await ac_cluster_this.actor_service_cluster.minting_cycles(BigInt(amount));
                        setCyclesAmountCluster(BigInt(Number(cycles_amount_cluster) + Number(mint_cycles)));
                        if(mint_cycles > 0){
                            alert("Mint cycles" + ' ' + mint_cycles);
                        }
                        else {
                            alert("Mint cycles error" );
                        }
                    }
                    else {
                        alert("Transaction error" );
                    }
                }
                catch (e){
                    console.log(e);}
            }
            else {

            }
        }
        //no selected
        else {

        }
    }

    const handleInputChangeFundingBalanceCycles = (event: { target: { value: any; }; }) => {
        setFundingCycles(Number(event.target.value));
    };

    const handleInputChangeICPAmountAbsolutely = (event: { target: { value: any; }; }) => {
        setICPAmountAbsolutely(event.target.value);
    };

    const handleInputChangeICPAmount = (event: { target: { value: any; }; }) => {
        setICPAmount(event.target.value);
        const amountNumber = Number(event.target.value.replace(',', '.'));
        const amount = amountNumber * digitMultiplier;
        setICPAmountAbsolutely(amount.toString());
        const cycles_receive = amountNumber * Number(cycles_amount_price);
        setCyclesNumberReceive(BigInt(cycles_receive));
        setCyclesAmountReceive(cycles_receive.toString());
    };

    // //Risk!!! Funding Whith Mnemonic
    // const handleInputChangeMnemonic = (event: { target: { value: any; }; }) => {
    //     setMnemonic(event.target.value);
    // };
    //
    // const onFundingWhithMnemonic = async () => {
    //     setMnemonic("");
    // }

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
                    <h6 className="coral-color">Cycles</h6>
                </div>
                <div className="p-1">
                    <h6 className="App-text-x-small">{'User principal:' +  ' '  +principal}</h6>
                    <h6 className="App-text-x-small">{'User balance icp:' +  ' '  +balance_icp}</h6>
                    <h6 className="App-text-x-small">{'User account id:' +  ' '  +account_id}</h6>
                    <h6 className="App-text-x-small">{'User amount token:' +  ' '  + balance_dbf + ' ' + symbol_dbf}</h6>
                    <h6 className="App-text-x-small">{'Conversion:' +  ' '  + icp_cycles_conversion  }</h6>
                    <h6 className="App-text-x-small">{'Cycles receive (approximately):' +  ' '  + cycles_amount_receive  }</h6>
                    {/*<h6 className="App-text-x-small">{'Cycles cluster :' +  ' '  + cycles_amount_cluster  }</h6>*/}
                    {/*<h6 className="App-text-x-small">{'Cycles instance :' +  ' '  + cycles_amount_instance  }</h6>*/}
                    <h6 className="App-text-x-small">{'Cycles cluster :'  + ' ' +  `${(Number(cycles_amount_cluster) / Number(oneTrillion)).toFixed(5)}T`}</h6>
                    <h6 className="App-text-x-small">{'Cycles instance :'   + ' ' +  `${(Number(cycles_amount_instance) / Number(oneTrillion)).toFixed(5)}T`}</h6>

                </div>

                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
                    <Grid item xs={3}>
                        <Stack>
                            <h6 className="coral-color">Balance</h6>
                            <Divider></Divider>
                            <FormControl>
                                <InputLabel htmlFor="my-input" color="secondary">Value ICP </InputLabel>
                                <Input id="my-input" aria-describedby="my-helper-text" color="primary" type="number" inputProps={{ className: classes.input_color_coral, min: 0.5, max: 10}} onChange={handleInputChangeICPAmount}></Input>
                                <FormHelperText id="my-helper-text"  classes={{ root: classes.input_color_green }}>fill icp amount value</FormHelperText>
                            </FormControl>
                            <Divider></Divider>
                            {/*<TextField*/}
                            {/*    color="primary"*/}
                            {/*    label="set balance cycles"*/}
                            {/*    variant="outlined"*/}
                            {/*    type="number"*/}
                            {/*    inputProps={{ className: classes.text_white}}*/}
                            {/*    onChange={handleInputChangeFundingBalanceCycles} />*/}
                            <Divider></Divider>
                            <InputLabel shrink htmlFor="select-multiple-native" className={classes.text_white}>
                                Select your cluster for funding
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
                                Select your instance for funding
                            </InputLabel>
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
                                {user_cluster_instances.filter(i =>
                                    Object.keys(i.status)[0] != 'abandon').map((i) => (
                                    <option key={i} value={i}>
                                        {i.description}
                                    </option>
                                ))}
                            </Select>
                            <h6 className='transparent-text-color'>_</h6>
                            <Button variant="contained" onClick={onFunding}>Funding</Button>
                            {/*<h6 className='transparent-text-color'>_</h6>*/}
                            {/*<Button variant="contained" onClick={onFundingIdentityPlug}>Funding Plug</Button>*/}
                        </Stack>
                    </Grid>

                    {/*<Grid item xs={3} justifyContent="flex-start"  alignItems="flex-start">*/}
                    {/*    <Stack>*/}
                    {/*        <h6 className="coral-color">Insert your phrase (private key)</h6>*/}
                    {/*        <h6 className="teal-color">(The phrase is not transmitted anywhere, but it is not safe)</h6>*/}
                    {/*        /!*<h6 className="teal-color">(It's not safe)</h6>*!/*/}
                    {/*        <TextField*/}
                    {/*            color="primary"*/}
                    {/*            label="Mnemonic"*/}
                    {/*            variant="outlined"*/}
                    {/*            inputProps={{ className: classes.text_white}}*/}
                    {/*            onChange={handleInputChangeMnemonic} />*/}
                    {/*        <h6 className='transparent-text-color'>_</h6>*/}
                    {/*        <h6 className='transparent-text-color'>_</h6>*/}
                    {/*        <Button variant="contained" onClick={onFundingWhithMnemonic}>Funding (mnemonic)</Button>*/}
                    {/*    </Stack>*/}
                    {/*</Grid>*/}
                    {/*<Grid item xs={4}> <Item>xs=4</Item></Grid>*/}
                    {/*<Grid item xs={4}> <Item>xs=4</Item></Grid>*/}
                </Grid>
                {/*<ClusterInstance></ClusterInstance>*/}
                <h6 className='transparent-text-color'>_</h6>
                <h6 className='transparent-text-color'>_</h6>
                <h6 className='transparent-text-color'>_</h6>
            </div>
        </div>
    )
}

export default CyclesActionComponent;



