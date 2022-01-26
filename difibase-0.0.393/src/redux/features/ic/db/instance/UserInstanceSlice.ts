import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../../../app/Store';
import {UserInstance} from "./UserInstance";
import React from "react";

export interface UserInstanceState<T> {
    user_instances_values: Array<T>;
    db_instances_values: Array<T>;
    data_message_values: string;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: UserInstanceState<any>   = {
    user_instances_values: [],
    db_instances_values: [],
    data_message_values: '',
    status: 'idle',
};

export const userInstancesSlice = createSlice({
    name: 'user_instances ',
    initialState,
    reducers: {
        set_user_instances: (state, action) => {
            state.user_instances_values= action.payload;
        },
        set_db_instances: (state, action) => {
            state.db_instances_values = action.payload;
        },
        set_data_message: (state, action) => {
            state.data_message_values = action.payload;
        }
    },
});

export const { set_user_instances } = userInstancesSlice.actions;
export const { set_db_instances } = userInstancesSlice.actions;
export const { set_data_message } = userInstancesSlice.actions;

export const selectUserInstance = (state: RootState) => state.instances_values.user_instances_values;
export const selectDbInstance = (state: RootState) => state.instances_values.db_instances_values;
export const selectDataMessage = (state: RootState) => state.data_message.data_message_values;

export default userInstancesSlice.reducer;