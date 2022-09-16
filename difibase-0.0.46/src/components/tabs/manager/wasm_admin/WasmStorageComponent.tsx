import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    Input,
    InputLabel,
    TextField,
    Typography
} from '@material-ui/core';
// import { Alert } from '@mui/material';
import Alert from 'react-bootstrap/Alert';
import { Form, Formik } from 'formik';
import React, {Fragment, useCallback, useEffect, useState } from 'react';
import { FileError, FileRejection, useDropzone } from 'react-dropzone';
import { useField } from 'formik';
import { array, object, string } from 'yup';
import { makeStyles } from '@material-ui/core/styles';

import {SingleFileUploadWithProgress} from "./fragments/drag_n_drop/upload/SingleFileUploadWithProgress";
import { UploadError } from './fragments/drag_n_drop/upload/UploadError';
import {UploadWasmIc} from "../../../../util/wasm/Upload_wasm_ic";
import {forEach} from "react-bootstrap/ElementChildren";
import DownloadWasmIc from "../../../../util/wasm/Download_wasm_ic";
import Array_hash from "../../../../util/helpers/calculate/hash/Array_hash";
import {CountedSha256, UploadProgress} from "../../../../common/interfaces/interfaces";
import {useAppDispatch, useAppSelector} from "../../../../redux/app/Hooks";
import {set_values} from "../../../../redux/features/ic/base/AccountSlice";
import {plug_connect} from "../../../../const/Website";
import {
    selectAlertDialog,
    selectChunksFile,
    selectWasmHash, selectWasmInfo,
    selectWasmStorage, set_alert_progress, set_chunks_file_wasm, set_counted_hash_wasm,
    set_values_file_wasm, set_values_info_wasm
} from "../../../../redux/features/ic/files/wasm/action/WasmStorageSlice";
import File_hash from "../../../../util/helpers/calculate/hash/File_hash";
import {Actor_Service_Local} from "../../../../util/actors/local/Actor_local";
import {AlertResultDialog} from "./fragments/drag_n_drop/AlertResultDialogComponent";
import WasmUploadComponent from "./fragments/drag_n_drop/WasmUploadComponent";
import WasmObjectsComponent from "./fragments/WasmObjectsComponent";

const WasmStorageComponent: React.FC = () => {
    // const classes = useStyles();
    //Redux dispatch
    const dispatch = useAppDispatch();
    //Redux GET
    const file_value = useAppSelector(selectWasmStorage);
    const file_hash = useAppSelector(selectWasmHash);
    const file_info = useAppSelector(selectWasmInfo);
    const file_chunks = useAppSelector(selectChunksFile);
    const alert_dialog = useAppSelector(selectAlertDialog);

    // const [showAlert, setAlertShow] = useState(alert_dialog.isShow);
    // useEffect(() => {  setAlertShow(alert_dialog.isShow); },[showAlert]);

    useEffect(() => {   },[]);

    return (
        <div>
            <React.Fragment>
                <WasmUploadComponent></WasmUploadComponent>
                <WasmObjectsComponent></WasmObjectsComponent>
                {/*<AlertResultDialog isShow={showAlert}/>*/}
            </React.Fragment>
        </div>
    );
}

export default WasmStorageComponent
