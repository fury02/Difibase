
// import {selectUserInstance, selectDbInstance} from "./UserClusterSlice";
import React, {useEffect, useState} from "react";
import {  cyclesMarketPriceSlice } from "./CyclesMarketPriceSlice";

import {Principal} from "@dfinity/principal";
import {string} from "yup";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {makeStyles} from "@material-ui/core/styles";
import {selectValues} from "../base/AccountSlice";
import {useAppDispatch, useAppSelector} from "../../../app/Hooks";
import {
    selectClusterInstanceCreate,
    selectClusterInstances,
    selectSelectedCluster, selectSelectedInstance
} from "../db/cluster-instance/ClusterInstanceSlice";


export function CyclesMarketPrice() {

    const dispatch = useAppDispatch();

    useEffect(() => {
        async function asyncAction() {
           await updateAsyncAction();
        }
        asyncAction();
    }, [])
    const updateAsyncAction = async () => { }

    let view =
        <>
            <div>
                <h6 className="coral-color"></h6>
            </div>
        </>;
    return ( view );
}
