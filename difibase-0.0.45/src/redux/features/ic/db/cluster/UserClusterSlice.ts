import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../../../app/Store';
import {UserCluster} from "./UserCluster";
import React from "react";

export interface UserClusterState<T> {
    user_cluster_values: Array<T>;
}

const initialState: UserClusterState<any>   = {
    user_cluster_values: [],
};

export const userClusterSlice = createSlice({
    name: 'user_cluster',
    initialState,
    reducers: {
        set_user_cluster: (state, action) => {
            state.user_cluster_values  = action.payload;
        },
    },
});

export const { set_user_cluster } = userClusterSlice.actions;

export const selectUserCluster = (state: RootState) => state.user_cluster_values.user_cluster_values;

export default userClusterSlice.reducer;