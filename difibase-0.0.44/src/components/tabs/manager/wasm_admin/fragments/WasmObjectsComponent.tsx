import React, {Fragment, useCallback, useEffect, useState } from 'react';
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
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {CombinedWasmInfo, CountedSha256, UploadProgress} from "../../../../../common/interfaces/interfaces";
import {useAppDispatch, useAppSelector} from "../../../../../redux/app/Hooks";
import {Actor_Service_Local} from "../../../../../util/actors/local/Actor_local";
import {
    selectWasmObjects,
    set_wasm_objects_values
} from "../../../../../redux/features/ic/files/wasm/storage/WasmObjectsSlice";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {Actor_WASM_STORAGE} from "../../../../../util/actors/ic_network/Actor_ic_wasm_storage";


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
        background: "#282c24",
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
    }
}));

// var ac = new Actor_Service_Local();
var ac = new Actor_WASM_STORAGE();

const WasmObjectsComponent: React.FC = () => {
    const classes = useStyles();
    //Redux dispatch
    const dispatch = useAppDispatch();
    //Redux GET
    const wasm_objects = useAppSelector(selectWasmObjects);

    useEffect(() => {
        async function actionUpdate(){
            if(wasm_objects.length == 0){
                // @ts-ignore
                var vals: Array<CombinedWasmInfo> = await ac.actor_service_wasm_storage.objects();
                //Redux SET
                dispatch(set_wasm_objects_values(vals));
            }
        };
        actionUpdate();
    },[]);

    var view = <></>;

    if(wasm_objects.length != 0){
        view =
            <>
                <Grid container spacing={2} direction="column" >
                    <Grid item>
                        <div>
                            <TableContainer className={classes.table}>
                                <Table aria-label="wasm table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.sticky_2} width="5%"> File name </TableCell>
                                            <TableCell align="right" className={classes.sticky_2} width="5%">Version</TableCell>
                                            <TableCell align="right" className={classes.sticky} width="25%">Description</TableCell>
                                            <TableCell align="right" className={classes.sticky}width="25%">Hash</TableCell>
                                            {/*<TableCell align="right" className={classes.sticky}width="25%">Guid</TableCell>*/}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {wasm_objects.map((row) => (
                                            <TableRow >
                                                <TableCell className={classes.sticky} component="th" scope="row" width="5%"> {row.name}  </TableCell>
                                                <TableCell align="right" className={classes.sticky} width="5%">{row.version.toString()}</TableCell>
                                                <TableCell align="right" className={classes.sticky} width="25%">{row.description}</TableCell>
                                                <TableCell align="right" className={classes.sticky} width="25%">{row.text_hash}</TableCell>
                                                {/*<TableCell align="right" className={classes.sticky} width="25%">{row.guid}</TableCell>*/}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <h6 className="transparent-text-color">_</h6>
                            <h6 className="transparent-text-color">_</h6>
                            <h6 className="transparent-text-color">_</h6>
                        </div>
                    </Grid>
                </Grid>
            </>
    }
    else {
        view = <></>
    };

    return (view);
}

export default WasmObjectsComponent



