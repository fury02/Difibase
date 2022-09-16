import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../../../../app/Store';
import {
    AlertProgressInstalling,
    CountedHash,
    CountedSha224,
    CountedSha256,
    CountedSha384,
    CountedSha512,
    UploadProgress, WasmDescription
} from "../../../../../../common/interfaces/interfaces";

export interface WasmStorageState {
    values: Array<string>;
    files_values: Array<File>;
    file_value: File;
    // CountedHash
    counted_hash: CountedHash,
    // WasmDescription
    wasm_description: WasmDescription;
    //Chunks
    file_chunks: Array<Blob>,
    // Alert Progress
    alert_dialog:AlertProgressInstalling

    status: 'idle' | 'loading' | 'failed';
}

const initialState: WasmStorageState  = {
    values: [],
    files_values: [],
    file_value: new File([],''),
    // CountedHash
    counted_hash: {text_value:  '', array_value: new Uint8Array()},
    // WasmDescription
    wasm_description:{version:0,description:''},
    //Chunks
    file_chunks: [ ],
    // Alert Progress
    alert_dialog:{isShow:false},

    status: 'idle',
};

export const wasmStorageSlice = createSlice({
    name: 'wasmStorage',
    initialState,
    reducers: {
        set_values_file_wasm: (state, action) => {
            state.file_value = action.payload;
        },
        // CountedHash
        set_counted_hash_wasm: (state, action) => {
            state.counted_hash = action.payload;
        },
        // WasmDescription
        set_values_info_wasm: (state, action) => {
            state.wasm_description = action.payload;
        },
        //Chunks
        set_chunks_file_wasm: (state, action) => {
            state.file_chunks = action.payload;
        },
        //Alert P
        set_alert_progress: (state, action) => {
            state.alert_dialog = action.payload;
        }
    },
});


export const { set_values_file_wasm } = wasmStorageSlice.actions;
export const { set_counted_hash_wasm } = wasmStorageSlice.actions;
export const { set_values_info_wasm } = wasmStorageSlice.actions;
export const { set_chunks_file_wasm } = wasmStorageSlice.actions;
export const { set_alert_progress} = wasmStorageSlice.actions;

export const selectWasmStorage = (state: RootState) => state.wasm_storage.file_value;
export const selectWasmHash = (state: RootState) => state.wasm_storage.counted_hash;
export const selectWasmInfo = (state: RootState) => state.wasm_storage.wasm_description;
export const selectChunksFile = (state: RootState) => state.wasm_storage.file_chunks;
export const selectAlertDialog = (state: RootState) => state.wasm_storage.alert_dialog;

export default wasmStorageSlice.reducer;
