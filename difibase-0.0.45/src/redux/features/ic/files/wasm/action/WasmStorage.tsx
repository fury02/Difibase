import { useAppSelector, useAppDispatch } from '../../../../../app/Hooks';
import {
    selectAlertDialog,
    selectChunksFile,
    selectWasmHash,
    selectWasmInfo,
    selectWasmStorage
} from './WasmStorageSlice';
import React, {useEffect, useState} from "react";
import Alert from "react-bootstrap/Alert";
import {Button} from "@material-ui/core";

export function WasmStorage() {

    const file_value = useAppSelector(selectWasmStorage);
    const file_hash = useAppSelector(selectWasmHash);
    const file_info = useAppSelector(selectWasmInfo);
    const chunks_file = useAppSelector(selectChunksFile);
    const alert_dialog = useAppSelector(selectAlertDialog );

    useEffect(() => {}, []);

    var view = <></>;

    return ( view );
}
