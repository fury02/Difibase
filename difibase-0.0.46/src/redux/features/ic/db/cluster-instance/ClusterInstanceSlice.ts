import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../../../app/Store';
import {ClusterInstance} from "./ClusterInstance";
import React from "react";
import {Cluster, Instance} from "../../../../../common/interfaces/interfaces";
import {Principal} from "@dfinity/principal";

export interface ClusterInstanceState<T> {
    cluster_instance_values: Array<T>;
    cluster_instance_create_value: Array<T>;
    selected_cluster_value: Cluster;
    selected_instance_value: Instance;
}

const initialState: ClusterInstanceState<any>   = {
    cluster_instance_values: [],
    cluster_instance_create_value: [],
    selected_cluster_value: {
        name: '',
        canister_id: '',
        cluster_principal: Principal.fromUint8Array( new Uint8Array()),
        user_principal: Principal.fromUint8Array( new Uint8Array()),
        wasm_name: '',
        wasm_version: -1,
        status: {unknown: null},
        description: ''
    },
    selected_instance_value: {
        number_key: -1,
        instance_principal: Principal.fromUint8Array( new Uint8Array()),
        wasm_name: '',
        wasm_version: -1,
        status : {unknown: null},
        description : ''
    }
};

export const clusterInstanceSlice = createSlice({
    name: 'cluster_instance',
    initialState,
    reducers: {
        set_cluster_instances: (state, action) => {
            state.cluster_instance_values  = action.payload;
        },
        set_cluster_instance_create: (state, action) => {
            state.cluster_instance_create_value  = action.payload;
        },
        set_selected_cluster: (state, action) => {
            state.selected_cluster_value = action.payload;
        },
        set_selected_instance: (state, action) => {
            state.selected_instance_value= action.payload;
        },
    },
});

export const { set_cluster_instances } = clusterInstanceSlice.actions;
export const { set_selected_cluster } = clusterInstanceSlice.actions;
export const { set_selected_instance } = clusterInstanceSlice.actions;
export const { set_cluster_instance_create } = clusterInstanceSlice.actions;

export const selectClusterInstances = (state: RootState) => state.cluster_instance_values.cluster_instance_values;
export const selectSelectedCluster = (state: RootState) => state.selected_cluster.selected_cluster_value;
export const selectSelectedInstance = (state: RootState) => state.selected_instance.selected_instance_value;
export const selectClusterInstanceCreate = (state: RootState) => state.cluster_instance_create.cluster_instance_create_value;

export default clusterInstanceSlice.reducer;