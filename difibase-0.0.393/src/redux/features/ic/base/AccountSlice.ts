import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../../app/Store';

export interface AccountState {
    values: Array<any>;
    data_message_values: string;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: AccountState  = {
    values: [],
    data_message_values: '',
    status: 'idle',
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        set_values: (state, action) => {
            state.values = action.payload;
        },
        set_data_message: (state, action) => {
            state.data_message_values = action.payload;
        }
    },
});

export const { set_values } = accountSlice.actions;
export const { set_data_message} = accountSlice.actions;

export const selectValues = (state: RootState) => state.account_values.values;
export const selectDataMessage = (state: RootState) => state.data_message.data_message_values;

export default accountSlice.reducer;
