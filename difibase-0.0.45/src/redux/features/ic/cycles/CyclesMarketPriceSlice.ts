import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {CyclesMarketPrice} from "./CyclesMarketPrice";
import React from "react";

import {Principal} from "@dfinity/principal";
import {RootState} from "../../../app/Store";
import {TransactionsState} from "../transactions/TransactionsSlice";
import {CyclesMarketConversionInfo} from "../../../../common/interfaces/interfaces";

export interface CyclePriceCMCState {
    price_cycle_market_conversion_value:  CyclesMarketConversionInfo;
}

const initialState: CyclePriceCMCState   = {
    price_cycle_market_conversion_value: {
        cycles_conversion_info: '',
        cycles_amount: BigInt(0),
        cycles_value: ''  }
};

export const cyclesMarketPriceSlice = createSlice({
    name: 'market_price',
    initialState,
    reducers: {
        set_cycle_price_values: (state, action) => {
            state.price_cycle_market_conversion_value  = action.payload;
        },
    },
});

export const { set_cycle_price_values } = cyclesMarketPriceSlice.actions;

export const selectCyclePriceValues  = (state: RootState) => state.cycle_market_price.price_cycle_market_conversion_value


export default cyclesMarketPriceSlice.reducer;