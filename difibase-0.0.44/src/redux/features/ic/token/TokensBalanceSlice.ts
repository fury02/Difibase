import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../../app/Store';

export interface TokensBalancetState {
    values: Array<string>;
    data_message_values: string;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: TokensBalancetState  = {
    values: [],
    data_message_values: '',
    status: 'idle',
};

export const tokensBalanceSlice = createSlice({
    name: 'tokensBalance',
    initialState,
    reducers: {
        set_values_tokens: (state, action) => {
            state.values = action.payload;
        },
        set_data_message_for_tokens: (state, action) => {
            state.data_message_values = action.payload;
        }
    },
});

export const { set_values_tokens } = tokensBalanceSlice.actions;
export const { set_data_message_for_tokens} = tokensBalanceSlice.actions;

export const selectTokensBalance = (state: RootState) => state.token_balances.values;
export const selectDataMessageTokensBalance = (state: RootState) => state.data_message_token_balances.data_message_values;

export default tokensBalanceSlice.reducer;
