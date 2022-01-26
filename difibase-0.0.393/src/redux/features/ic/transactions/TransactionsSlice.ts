import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../../app/Store';
import {Transactions} from "./Transactions";
import React from "react";

export interface TransactionsState<T> {
    transactions_values: Array<T>;
    data_message_values: string;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: TransactionsState<any>   = {
    transactions_values: [],
    data_message_values: '',
    status: 'idle',
};

export const transactionsSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        set_transactions: (state, action) => {
            state.transactions_values = action.payload;
        },
        set_data_message: (state, action) => {
            state.data_message_values = action.payload;
        }
    },
});

export const { set_transactions } = transactionsSlice.actions;
export const { set_data_message} = transactionsSlice.actions;

export const selectTransactions = (state: RootState) => state.account_transactions.transactions_values;
export const selectDataMessage = (state: RootState) => state.data_message.data_message_values;

export default transactionsSlice.reducer;
