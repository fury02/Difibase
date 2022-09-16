import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../../../../app/Store';
import {CombinedWasmInfo,} from "../../../../../../common/interfaces/interfaces";

export interface WasmObjectsState {
    wasm_objects_values: Array<CombinedWasmInfo>;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: WasmObjectsState  = {
    wasm_objects_values: [],
    status: 'idle',
};

export const wasmObjectsSlice = createSlice({
    name: 'wasmObjects',
    initialState,
    reducers: {
        set_wasm_objects_values: (state, action) => {
            state.wasm_objects_values = action.payload;
        },

    },
});


export const { set_wasm_objects_values} = wasmObjectsSlice.actions;

export const selectWasmObjects = (state: RootState) => state.wasm_objects.wasm_objects_values;

export default wasmObjectsSlice.reducer;
