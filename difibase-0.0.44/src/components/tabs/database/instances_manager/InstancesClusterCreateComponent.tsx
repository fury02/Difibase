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
    selectSelectedCluster, set_cluster_instances, set_cluster_instance_create,
    set_selected_cluster
} from "../../../../redux/features/ic/db/cluster-instance/ClusterInstanceSlice";
import {ClusterInstance} from "../../../../redux/features/ic/db/cluster-instance/ClusterInstance";
import {useStyles} from "../../../../common/usestyle/use_styles";
import {CurrentStatusCluster} from "../../../../idls/admin/interface/admin.did";
import {
    Cluster,
    CyclesMarketConversionInfo,
    IcpXdrConversionRateCertifiedResponse
} from "../../../../common/interfaces/interfaces";
import {Actor_ADMIN} from "../../../../util/actors/ic_network/Actor_ic_admin";
import {Actor_CLUSTER} from "../../../../util/actors/ic_network/Actor_ic_cluster";
import {canister_nns_ledger} from "../../../../const/Canisters";
import nns_ledger_did from "../../../../idls/ledger/ledger";
import {Actor} from "@dfinity/agent";
import {principalToBytesAccountDefaultIdentifier, principalToSubAccount} from "../../../../util/crypto/AccountUtils";
import {plug_web_host, plug_whitelist_connect, transaction_icp_fee} from "../../../../const/Website";
import {Actor_CMC} from "../../../../util/actors_external/Actor_ic_cmc";
import {
    selectCyclePriceValues,
    set_cycle_price_values
} from "../../../../redux/features/ic/cycles/CyclesMarketPriceSlice";
import {CycleMarketPrice} from "../../../../util/blockchain/price/CycleMarketPrice";

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

const cmp = new CycleMarketPrice();

const InstancesClusterCreateComponent: React.FC = () => {
    const classes = useStyles();

    const [icp_amount, setICPAmount] = useState<string>("");
    const [icp_amount_absolutely, setICPAmountAbsolutely] = useState<string>("");
    const [user_clusters, setUserClusters] = useState<Array<any>>([]);
    const [user_cluster_instances, setUserClusterInstances] = useState<Array<any>>([]);
    const [description, setDescription] = useState<string>("");
    const [descriptionName, setDescriptionName] = useState<string>("");
    const [descriptionVersion, setDescriptionVersion] = useState<number>(-1);
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
    const [icp_cycles_conversion, setIcpCyclesConversion] = useState<string>("");
    const [cycles_amount_price, setCyclesAmountPrice] = useState<BigInt>(BigInt(0));
    const [cycles_amount_receive, setCyclesAmountReceive] = useState<string>("");
    const [cycles_number_receive, setCyclesNumberReceive] = useState<BigInt>(BigInt(0));
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
    //Redux wasm objects - GET
    const selected_cluster_redux = useAppSelector(selectSelectedCluster);
    //Redux database clusters - GET
    const user_cluster_redux = useAppSelector(selectUserCluster);
    //Redux cycles price - GET
    const cycles_price_values_redux = useAppSelector(selectCyclePriceValues);

    const digitMultiplier = 100000000;
    const cyclesRecommend = BigInt(1200000000000);

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
        // async function asyncAction() {
        //     await updateCluster();
        //     if(selected_cluster_change.description == ''){
        //         setSelectedClusterChange(selected_cluster_redux);
        //     }
        //     await updateInstance(selected_cluster);
        // }
        // asyncAction();
    }, [])

    const updateView = async () => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));

        //Conversion ICP in Cycles
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

        //Cluster this principal
        const clusters = await ac.actor_service_admin.user_clusters(principal_user);
        setUserClusters(clusters);
        dispatch(set_user_cluster(clusters));
    }

    const updateInstance = async (cluster: Cluster) => {
        if(cluster.description != ''){
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

    const onCreateInstanceDefault = async () => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        const canister_id  = selected_cluster.cluster_principal.toText();
        if(cyclesRecommend > cycles_number_receive){
            alert("there is not enough ICP to create" );
        };
        if( description != ''
            && description != 'undefined'
            && selected_cluster.cluster_principal.toString() != ''
            && selected_cluster.cluster_principal.toString() != 'undefined'){
            const amountNumber = Number(icp_amount.replace(',', '.'));
            const amount = amountNumber * digitMultiplier;
            // let amount = Number(icp_amount_absolutely);
            if(description != '' && cyclesRecommend < cycles_number_receive && canister_id != "aaaaa-aa"){
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
                    let principal_to = Principal.fromText(canister_id);
                    let account_identifier = principalToBytesAccountDefaultIdentifier(selected_cluster.cluster_principal);
                    // let account_identifier_ = principalToBytesAccountDefaultIdentifier(principal_to);
                    let subaccount = principalToSubAccount(selected_cluster.cluster_principal);

                    const response = await actor.transfer({
                        to: account_identifier,
                        fee: { e8s: BigInt(transaction_icp_fee) },
                        amount: { e8s: BigInt(amount) },
                        memo: 0,
                        from_subaccount: [], // For now, using default subaccount to handle ICP
                        created_at_time: [],
                    });
                    console.log('response', response);

                    // //**3**// Check transaction result amount (WEB Check)
                    // // @ts-ignore
                    // if(Object.keys(response)[0] == "Ok"){
                    //     // @ts-ignore
                    //     var block_index = Object.values(response)[0];
                    //     const account_id_from = getAccountIdAddress(Principal.fromText(principal));
                    //     const account_id_to = getAccountIdAddress(principal_to);
                    //     const ho = new HistoryOperations(account_id_to);
                    //     // @ts-ignore
                    //     var res_amount =  await ho.findTransactionsBlockIndexAmount(block_index.toString(), account_id_from, account_id_to);
                    //     if(Number(res_amount)>0){
                    //         //**4**//
                    //         //minting cycles for "mxjrx-tiaaa-aaaah-aaoxq-cai"
                    //         //**5**//
                    //         //create canister  for user
                    //     }
                    // }

                    //**3**// Check transaction result amount (Blockchain Check)
                    // @ts-ignore
                    if(Object.keys(response)[0] == "Ok"){
                        // @ts-ignore
                        var block_index = Object.values(response)[0];
                        const ac_this = new Actor_CLUSTER(canister_id);
                        let transaction  = await  ac_this.actor_service_cluster.deploy_instance_default(BigInt(Number(block_index)), principal_user, selected_cluster.cluster_principal, description);
                        var values  = Object.values(transaction);
                        var keys = Object.keys(transaction);
                        if(keys[0] == "ok"){
                            var value_principal = values[0];
                            await updateInstance(selected_cluster);
                            alert("Create instance" + " " + " canister id: " + value_principal[1]);
                        }
                        else {
                            alert("Create instance error" );
                        }
                    }
                }
                catch (e) {
                    console.log(e);
                    alert("Create error" );
                }
            }else {
                alert("Errors in filling in fields" );
            }
        }
    }

    const onCreateInstance = async () => {

        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        const canister_id  = selected_cluster.cluster_principal.toText();
        if(cyclesRecommend > cycles_number_receive){
            alert("there is not enough ICP to create" );
        };
        if( description != ''
            && description != 'undefined'
            && selected_cluster.cluster_principal.toString() != ''
            && selected_cluster.cluster_principal.toString() != 'undefined'
            && descriptionName != ''
            && descriptionVersion != -1 && canister_id != "aaaaa-aa") {
            const amountNumber = Number(icp_amount.replace(',', '.'));
            const amount = amountNumber * digitMultiplier;
            // let amount = Number(icp_amount_absolutely);
            if(description != '' && cyclesRecommend < cycles_number_receive && canister_id != "aaaaa-aa"){
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
                    let principal_to = Principal.fromText(canister_id);
                    let account_identifier = principalToBytesAccountDefaultIdentifier(selected_cluster.cluster_principal);
                    // let account_identifier_ = principalToBytesAccountDefaultIdentifier(principal_to);
                    let subaccount = principalToSubAccount(selected_cluster.cluster_principal);

                    const response = await actor.transfer({
                        to: account_identifier,
                        fee: { e8s: BigInt(transaction_icp_fee) },
                        amount: { e8s: BigInt(amount) },
                        memo: 0,
                        from_subaccount: [], // For now, using default subaccount to handle ICP
                        created_at_time: [],
                    });
                    console.log('response', response);

                    // //**3**// Check transaction result amount (WEB Check)
                    // // @ts-ignore
                    // if(Object.keys(response)[0] == "Ok"){
                    //     // @ts-ignore
                    //     var block_index = Object.values(response)[0];
                    //     const account_id_from = getAccountIdAddress(Principal.fromText(principal));
                    //     const account_id_to = getAccountIdAddress(principal_to);
                    //     const ho = new HistoryOperations(account_id_to);
                    //     // @ts-ignore
                    //     var res_amount =  await ho.findTransactionsBlockIndexAmount(block_index.toString(), account_id_from, account_id_to);
                    //     if(Number(res_amount)>0){
                    //         //**4**//
                    //         //minting cycles for "mxjrx-tiaaa-aaaah-aaoxq-cai"
                    //         //**5**//
                    //         //create canister  for user
                    //     }
                    // }

                    //**3**// Check transaction result amount (Blockchain Check)
                    // @ts-ignore
                    if(Object.keys(response)[0] == "Ok"){
                        // @ts-ignore
                        var block_index = Object.values(response)[0];
                        const ac_this = new Actor_CLUSTER(canister_id);
                        let transaction  = await  ac_this.actor_service_cluster.deploy_instance( BigInt(Number(block_index)), principal_user, principal_to, description, descriptionName, BigInt(Number(descriptionVersion)));
                        var values  = Object.values(transaction);
                        var keys = Object.keys(transaction);
                        if(keys[0] == "ok"){
                            var value_principal = values[0];
                            await updateInstance(selected_cluster);
                            alert("Create instance" + " " + " canister id: " + value_principal[1]);
                        }
                        else {
                            alert("Create instance error" );
                        }
                    }
                }
                catch (e) {
                    console.log(e);
                    alert("Create error" );
                }
            }else {
                alert("Errors in filling in fields" );
            }
        }
    };

    //Test
    const onCreateInstanceDefaultInternal = async () => {
        const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));
        if( description != ''
            && description != 'undefined'
            && selected_cluster.cluster_principal.toString() != ''
            && selected_cluster.cluster_principal.toString() != 'undefined'){

            const canister_id  = selected_cluster.cluster_principal.toText();
            const principal_user = Principal.fromUint8Array( new Uint8Array(Object.values(principal_bytes)));

            if(description != '' && canister_id != "aaaaa-aa"){
                try{
                    const ac_this = new Actor_CLUSTER(canister_id);
                    //Create
                    let transaction  = await  ac_this.actor_service_cluster.deploy_instance_default_internal(principal_user, description);
                    var value_transaction  = Object.values(transaction);
                }
                catch (e) {
                    console.log(e);
                }
            }else {
                alert("Errors in filling in fields (ICP; Description; Cluster name)");
            }
        }
    }
    //Test
    const onMintingCyclesDefault = async () => {
        const canister_id  = selected_cluster.cluster_principal.toText();
        if(canister_id != "aaaaa-aa"){
            const ac = new Actor_CLUSTER(canister_id);
            const result = await ac.actor_service_cluster.minting_cycles(BigInt(1000000));
        }
    }

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
        console.warn(description);
    };

    const handleChangeSelected = async (event: { target: { value: Cluster; }; }) => {
        dispatch(set_selected_cluster(event.target.value));
        setSelectedCluster(event.target.value);
        await updateInstance(event.target.value);
        console.warn(event.target.value);
    };

    const handleInputChangeDescription = (event: { target: { value: any; }; }) => {
        setDescription(event.target.value);
    };

    const handleInputChangeDescriptionVersion = (event: { target: { value: any; }; }) => {
        setDescriptionVersion(event.target.value);
    };

    const handleInputChangeDescriptionName = (event: { target: { value: any; }; }) => {
        setDescriptionName(event.target.value);
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
                    <h6 className="App-text-x-small">{'Conversion:' +  ' '  + icp_cycles_conversion  }</h6>
                    <h6 className="App-text-x-small">{'Cycles receive (approximately):' +  ' '  + cycles_amount_receive  }</h6>
                </div>

                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justifyContent="center"
                    alignItems="center">

                    <Grid item xs={8}>
                        <InputLabel shrink htmlFor="select-multiple-native" className={classes.text_white}>
                            Select your cluster
                        </InputLabel>
                        <Select
                            className={classes.selected_zone}
                            // className={'select-css'}
                            value={selected_cluster}
                            // @ts-ignore Typings are not considering `native`
                            onChange={handleChangeSelected}
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
                                )
                            )}
                        </Select>

                    </Grid>
                    <Grid item xs={3}>


                        {/*<FormControl>*/}
                        {/*    <InputLabel htmlFor="my-input" color="secondary">Absolute value ICP funding </InputLabel>*/}
                        {/*    <Input id="my-input" aria-describedby="my-helper-text" color="primary" type="number" inputProps={{ className: classes.input_color_coral, min: 50000000, max: 1000000000}} onChange={handleInputChangeICPAmountAbsolutely}></Input>*/}
                        {/*    <FormHelperText id="my-helper-text"  classes={{ root: classes.input_color_green }}>fill icp amount value (min 50000000 absolute value)</FormHelperText>*/}
                        {/*    <FormHelperText id="my-helper-text"  classes={{ root: classes.input_color_blue }}>1000000 = 0.01 ICP;10000000 = 0.1 ICP; 100000000 = 1 ICP </FormHelperText>*/}
                        {/*</FormControl>*/}

                        <FormControl>
                            <InputLabel htmlFor="my-input" color="secondary">Value ICP </InputLabel>
                            <Input disabled={false} id="my-input" aria-describedby="my-helper-text" color="primary" type="number" inputProps={{ className: classes.input_color_coral, min: 0.5, max: 10}} onChange={handleInputChangeICPAmount}></Input>
                            <FormHelperText id="my-helper-text"  classes={{ root: classes.input_color_green }}>fill icp amount value (min 0.5 ICP)</FormHelperText>
                        </FormControl>

                        <Stack>
                            <h6 className="coral-color">Create a default instance</h6>
                            <h6 className="teal-color">Instance (default):</h6>
                            <TextField
                                color="primary"
                                label="Name of the instance database being created"
                                variant="outlined"
                                inputProps={{ className: classes.text_white}}
                                onChange={handleInputChangeDescription} />
                            <h6></h6>
                            <Button variant="contained" onClick={onCreateInstanceDefault} >New Instance</Button>
                        </Stack>

                        {/*<Stack>*/}
                        {/*    <h6 className="coral-color">Create a default instance</h6>*/}
                        {/*    <h6 className="teal-color">Instance (default):</h6>*/}
                        {/*    <TextField*/}
                        {/*        color="primary"*/}
                        {/*        label="Name of the instance database being created"*/}
                        {/*        variant="outlined"*/}
                        {/*        inputProps={{ className: classes.text_white}}*/}
                        {/*        onChange={handleInputChangeDescription} />*/}
                        {/*    <h6></h6>*/}
                        {/*    <Button variant="contained" onClick={onCreateInstanceDefaultInternal} >New Instance Internal</Button>*/}
                        {/*    <h6></h6>*/}
                        {/*    <Button variant="contained" onClick={onMintingCyclesDefault} >Minting Cycles Default</Button>*/}
                        {/*</Stack>*/}

                        <Stack>
                            <h6 className="coral-color">Create a instance that is defined in the module</h6>
                            <h6 className="teal-color">Instance:</h6>
                            <FormControl>
                                <InputLabel htmlFor="my-input" color="secondary">Version instance dbs_shrink.wasm or other </InputLabel>
                                <Input id="my-input" aria-describedby="my-helper-text" color="primary" type="number" inputProps={{ className: classes.input_color_coral, min: 0, max: 100000}} onChange={handleInputChangeDescriptionVersion}></Input>
                                <FormHelperText id="my-helper-text"  classes={{ root: classes.input_color_green }}>fill in as in the vault wasm (Version)</FormHelperText>
                            </FormControl>
                            <h6 className='transparent-text-color'>_</h6>
                            <FormControl>
                                <InputLabel htmlFor="my-input" color="secondary">Name instance .wasm file(dbs_shrink.wasm or other) </InputLabel>
                                <Input id="my-input" aria-describedby="my-helper-text" color="primary" type="text" inputProps={{ className: classes.input_color_coral, min: 0, max: 100000}} onChange={handleInputChangeDescriptionName}></Input>
                                <FormHelperText id="my-helper-text"  classes={{ root: classes.input_color_green }}>fill in as in the vault wasm (File name)</FormHelperText>
                            </FormControl>
                            <h6 className='transparent-text-color'>_</h6>
                            <FormControl>
                                <InputLabel htmlFor="my-input" color="secondary">Description instance</InputLabel>
                                <Input id="my-input" aria-describedby="my-helper-text" color="primary" type="text" inputProps={{ className: classes.input_color_white, min: 0, max: 100000}} onChange={handleInputChangeDescription}></Input>
                                <FormHelperText id="my-helper-text"  classes={{ root: classes.input_color_green }}>fill (arbitrary)</FormHelperText>
                            </FormControl>
                            <h6 className='transparent-text-color'>_</h6>
                            <Button variant="contained" onClick={onCreateInstance} >New Instance</Button>
                            <h6 className='transparent-text-color'>_</h6>
                            <h6 className='transparent-text-color'>_</h6>
                            <h6 className='transparent-text-color'>_</h6>
                        </Stack>

                    </Grid>
                    <Grid item xs={4}>
                        {/*<ClusterInstance></ClusterInstance>*/}
                        {/*<h6 className='transparent-text-color'>_</h6>*/}
                        {/*<h6 className='transparent-text-color'>_</h6>*/}
                        {/*<h6 className='transparent-text-color'>_</h6>*/}
                    </Grid>
                    {/*<Grid item xs={4}>*/}
                    {/*    <Item>xs=4</Item>*/}
                    {/*</Grid>*/}
                    {/*<Grid item xs={8}>*/}
                    {/*    <Item>xs=8</Item>*/}
                    {/*</Grid>*/}
                </Grid>
                <ClusterInstance></ClusterInstance>
                <h6 className='transparent-text-color'>_</h6>
                <h6 className='transparent-text-color'>_</h6>
                <h6 className='transparent-text-color'>_</h6>
            </div>
        </div>
    )
}

export default InstancesClusterCreateComponent
