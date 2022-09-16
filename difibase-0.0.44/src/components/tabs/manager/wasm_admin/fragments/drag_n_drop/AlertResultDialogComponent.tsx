import React, { useEffect, useState } from 'react';
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
import {useAppSelector} from "../../../../../../redux/app/Hooks";
import {AlertProgressInstalling} from "../../../../../../common/interfaces/interfaces";
import {set_alert_progress} from "../../../../../../redux/features/ic/files/wasm/action/WasmStorageSlice";

export function AlertResultDialog({isShow}:AlertProgressInstalling) {
    const [show, setShow] = useState(isShow);

    useEffect(() => { setShow(isShow); }, [show]);

    var view = <></>;

    if(show){
        if(isShow){
            view =
                <div>
                    <Alert variant="success" >
                        <Alert.Heading>Info</Alert.Heading>
                        <p>
                            Completed (.wasm) install
                        </p>
                        <Button  variant="contained" color="primary" onClick={() =>setShow(false)}>Close</Button>
                    </Alert>
                </div>
        }
        else{
            view =
                <div>
                    <Alert variant="danger" >
                        <Alert.Heading>Info</Alert.Heading>
                        <p>
                            Error (.wasm) install
                        </p>
                        <Button  variant="contained" color="primary" onClick={() => setShow(false)}>Close</Button>
                    </Alert>
                </div>
        }
    }

    return (
        view
    );
}

