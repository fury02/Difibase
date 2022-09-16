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

import {SingleFileUploadWithProgress} from "./upload/SingleFileUploadWithProgress";
import { UploadError } from './upload/UploadError';
import {UploadWasmIc} from "../../../../../../util/wasm/Upload_wasm_ic";
import {forEach} from "react-bootstrap/ElementChildren";
import DownloadWasmIc from "../../../../../../util/wasm/Download_wasm_ic";
import Array_hash from "../../../../../../util/helpers/calculate/hash/Array_hash";
import {CombinedWasmInfo, CountedSha256, UploadableFile, UploadProgress} from "../../../../../../common/interfaces/interfaces";
import {useAppDispatch, useAppSelector} from "../../../../../../redux/app/Hooks";
import {set_values} from "../../../../../../redux/features/ic/base/AccountSlice";
import {plug_connect} from "../../../../../../const/Website";
import {
    selectAlertDialog,
    selectChunksFile,
    selectWasmHash, selectWasmInfo,
    selectWasmStorage, set_alert_progress, set_chunks_file_wasm, set_counted_hash_wasm,
    set_values_file_wasm, set_values_info_wasm
} from "../../../../../../redux/features/ic/files/wasm/action/WasmStorageSlice";
import File_hash from "../../../../../../util/helpers/calculate/hash/File_hash";
import {Actor_Service_Local} from "../../../../../../util/actors/local/Actor_local";
import {AlertResultDialog} from "./AlertResultDialogComponent";
import {set_wasm_objects_values} from "../../../../../../redux/features/ic/files/wasm/storage/WasmObjectsSlice";


import {Wasm} from "../../../../../../idls/wasm_storage/interface/wasm_storage.did";
import {Actor_WASM_STORAGE} from "../../../../../../util/actors/ic_network/Actor_ic_wasm_storage";

let currentId = 0;

function getNewId() { return ++currentId; }

const useStyles = makeStyles((theme) => ({
    dropzone: {
        border: `2px dashed ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#A64800',
        height: theme.spacing(10),
        outline: 'none',
    },
    root: {
        background: '#282c34',
    },
    input_color_red: {
        color: '#E9A0A0',
    },
    input_color_blue: {
        color: '#A0A9E9',
    },
    text_helper: {
        color: '#A0A9E9',
        fontSize: '.8em',
    },
    text_white: {
        color: 'white',
        fontStyle: 'italic',
        fontSize: '.8em',
    }
}));

// var ac = new Actor_Service_Local();
var ac = new Actor_WASM_STORAGE();


const WasmUploadComponent: React.FC = () => {
    const classes = useStyles();
    //Redux dispatch
    const dispatch = useAppDispatch();
    //Redux GET
    const file_value = useAppSelector(selectWasmStorage);
    const file_hash = useAppSelector(selectWasmHash);
    const file_info = useAppSelector(selectWasmInfo);
    const file_chunks = useAppSelector(selectChunksFile);
    // const alert_dialog = useAppSelector(selectAlertDialog);
    const [showAlert, setAlertShow] = useState(false);
    const [progress, setProgress] = useState(0);
    const [size, setSize] = useState<number>();
    const [formatsize, setFormatSize] = useState<string>();
    const [hash, setHash] = useState<string>("");
    const [formathash, setFormatHash] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [version, setVersion] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [files, setFiles] = useState<UploadableFile[]>([]);

    useEffect(() => { },[]);

    const kByte = 1024;
    const chunkSize32Kb = kByte * 32;
    const chunkSize64Kb = kByte * 64;
    const chunkSize128Kb = kByte * 128;

    function createChunksBlob(file: File, chunkSize: number): Array<Blob>{
        const fileChunks: Array<Blob> = [ ];
        var startByte = 0;
        var countByte = 0;
        var endByte = chunkSize > file.size ? file.size : chunkSize;
        while (file.size > countByte) {
            fileChunks.push(file.slice(startByte, endByte));
            countByte += endByte - startByte;
            startByte = endByte;
            endByte = file.size - endByte >= chunkSize ? endByte + chunkSize  : file.size;
        }
        return fileChunks;
    };
    const arrayBufferToNumberArray = (ab: ArrayBuffer): Array<number> =>{
        let na = new Array<number>();
        let temp = new Uint8Array(ab);
        temp.forEach(d => {
            na.push(d);
        });
        return  na;
    };
    //**1**//
    async function *uploadWasmFileChunks(): AsyncIterableIterator<UploadProgress> {
        let hash_text_value = file_hash.text_value.toString();
        let hash_arr_value: Uint8Array = file_hash.array_value;

        var chunks_count = file_chunks!.length;
        var chunk_number: number = 0;

        while (chunk_number < chunks_count){
            let arr_blob = await file_chunks![chunk_number].arrayBuffer();
            let arr_blob_number = arrayBufferToNumberArray(arr_blob);
            var chunk_size: number = arr_blob_number.length;
            // @ts-ignore
            var result = await ac.actor_service_wasm_storage.upload_progress(
                BigInt(chunk_number),
                hash_text_value,
                // @ts-ignore
                arr_blob_number);
            chunk_number = chunk_number + 1;
            yield  {percent: Math.round((chunk_number/chunks_count!)*100), step: chunk_number}
        }
    }
    //**2**//
    async function installLoadedWasmFile()  {
        let hash_text_value = file_hash.text_value.toString();
        let hash_arr_value: Uint8Array = file_hash.array_value;

        // await ac.actor_service_wasm_storage.install_wasm(
        // @ts-ignore
        var result = await ac.actor_service_wasm_storage.install_wasm(
            BigInt(file_chunks!.length),
            hash_text_value,
            file_value.name,
            file_info.description,
            BigInt(file_info.version),
            // @ts-ignore
            Array.from(hash_arr_value),
            hash_text_value,
            {sha256: null}
        );
    }
    //**3**//
    async function getWasm(name: string, version: number): Promise<Wasm>  {
        let wasm = await ac.actor_service_wasm_storage.read_wasm(name, BigInt(version));
        return wasm;
    }

    const onDrop = useCallback((accFiles: File[], rejFiles: FileRejection[]) => {
        setFiles([]);//clean, only one file

        const mappedAcc = accFiles.map((file) => ({ file, errors: [], id: getNewId() }));
        const mappedRej = rejFiles.map((r) => ({ ...r, id: getNewId() }));
        setFiles((curr) => [...curr, ...mappedAcc, ...mappedRej]);
        var file = mappedAcc.map(i =>{
            // Redux SET
            dispatch(set_values_file_wasm(i.file));
            setProgress(0); // new progress
            new File_hash(i.file).file_sha256().then(i=>{
                dispatch(set_counted_hash_wasm(i));
                setHash((i.text_value).toString());
                setFormatHash('SHA256' + ' ' + (i.text_value).toString());
            });
            dispatch(set_chunks_file_wasm(createChunksBlob(
                i.file,
                chunkSize64Kb)));

            setSize(i.file.size);
            setName(i.file.name);
            setFormatSize(formatSize(i.file.size));
        });
    }, []);
    const onUpload = async () => {
        var result = false;
        setHash((file_hash.text_value).toString());
        setFormatHash('SHA256' + ' ' + (file_hash.text_value).toString());
        let res_progress =  await onUploadWithProgress();
        if(res_progress){
            await onInstall();
            result = await checkInstall();
            return result;
        }
        return result
    };

    //**1-Upload**//
    const onUploadWithProgress = async (): Promise<boolean | undefined> => {
        if(files.length > 0){
            let uwc = uploadWasmFileChunks();
            let count = file_chunks.length;
            var progress = 0;
            var step = 0;

            if(count != undefined){
                while (step <= count){
                    var ir: IteratorResult<UploadProgress> = await uwc.next();
                    var up = ir.value;
                    if(typeof up == "object"){
                        progress = up.percent;
                        step = up.step;
                        setProgress(progress);
                    }
                    if(ir.done){
                        setProgress(100);
                        return true;
                        break; }
                }
            }
            return undefined;
        }
    };
    //**2-Upload**//
    const onInstall = async () => {
        await installLoadedWasmFile();
    };
    //**Check**//
    const checkInstall = async (): Promise<boolean> => {
        var bytes = await getWasm(file_value.name, file_info.version);
        // @ts-ignore
        var sha: CountedSha256 = await new Array_hash().sha256(bytes);
        if(sha.text_value == file_hash.text_value){
            // dispatch(set_alert_progress({isShow: true}));
            alert(file_value.name + " " + "installing done");
            //Update: WasmObjectsComponent
            // @ts-ignore
            var vals: Array<CombinedWasmInfo> = await ac.actor_service_wasm_storage.objects();
            //Redux SET
            dispatch(set_wasm_objects_values(vals));
            return true;
        }
        else {
            // dispatch(set_alert_progress({isShow: false}));
            alert("Installing" + " " + file_value.name + " " + "error");
            return false;
        }
    };

    function onDelete(file: File) {
        setFiles((curr) => curr.filter((fw) => fw.file !== file));
        setProgress(0);
        setHash('');
        setFormatHash('');
        setSize(0);
        setFormatSize('');
        setVersion(0);
        setDescription('');
        dispatch(set_values_file_wasm(new File([],'')));
        dispatch(set_counted_hash_wasm({text_value:  '', array_value: new Uint8Array()}));
        dispatch(set_values_info_wasm({ version: 0, description: ''}));
        dispatch(set_chunks_file_wasm([]));
        dispatch(set_alert_progress({isShowAlert: false,isInstallWasm: false}));
    }
    const handleInputChangeVersion = (event: { target: { value: any; }; }) => {
        setVersion(Number(event.target.value));
        dispatch(set_values_info_wasm({ version: Number(event.target.value), description: file_info.description}))
        console.warn(version);
    };
    const handleInputChangeDes = (event: { target: { value: any; }; }) => {
        setDescription(event.target.value);
        dispatch(set_values_info_wasm({ version: file_info.version, description: event.target.value}))
        console.warn(description);
    };
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: ['.wasm'],
        maxSize: 3000 * 1024, // 3000KB
        maxFiles: 1
    });
    function formatSize(bytes: number): string{
        var s: string = '';
        if      (bytes >= 1073741824) { s = 'File size' + ' ' + '≈' + ' ' + (bytes / 1073741824).toFixed(2) + ' ' + 'GB'; }
        else if (bytes >= 1048576)    { s = 'File size' + ' ' + '≈' + ' ' + (bytes / 1048576).toFixed(2)  + ' ' + 'MB'; }
        else if (bytes >= 1024)       { s = 'File size' + ' ' + '≈' + ' ' + (bytes / 1024).toFixed(2)  + ' ' + 'KB'; }
        else if (bytes > 1)           { s = 'File size' + ' ' + '≈' + ' ' + (bytes  + ' ' + 'bytes'); }
        else if (bytes == 1)          { s = 'File size 1 byte'; }
        else                          { s = 'undefined'; }
        return s;
    }
    // @ts-ignore
    // @ts-ignore
    return (
        <Card
            classes={{ root: classes.root,}}>
            <CardContent>
                <Formik
                    initialValues={{ files: [] }}
                    validationSchema={object({
                        files: array(
                            object({
                                url: string().required(),
                            })
                        ),
                    })}
                    onSubmit={(values) => {
                        //**Func ->
                        console.log('values', values);
                        return new Promise((res) => setTimeout(res, 1000)); }}>

                    {({ values, errors, isValid, isSubmitting }) => (
                        <Form id="file_upload" >
                            <Grid container spacing={2} direction="column" >
                                
                                <FormControl>
                                    <InputLabel htmlFor="my-input" color="primary">Description .wasm file </InputLabel>
                                    <Input id="my-input" aria-describedby="my-helper-text" color="primary" inputProps={{ className: classes.input_color_blue}} onChange={handleInputChangeDes}></Input>
                                    <FormHelperText id="my-helper-text"  classes={{ root: classes.text_helper }}>(not compulsory)</FormHelperText>
                                </FormControl>

                                <Divider></Divider>

                                <FormControl>
                                    <InputLabel htmlFor="my-input" color="secondary">Version .wasm file </InputLabel>
                                    <Input id="my-input" aria-describedby="my-helper-text" color="secondary" type="number" inputProps={{ className: classes.input_color_red, min: 0, max: 100000}} onChange={handleInputChangeVersion}></Input>
                                    <FormHelperText id="my-helper-text"  classes={{ root: classes.input_color_red }}>(compulsory)</FormHelperText>
                                </FormControl>

                                <Grid item>
                                    <div {...getRootProps({ className: classes.dropzone })}>
                                        <input {...getInputProps()} />
                                        <p>Drag 'n' drop *.wasm  file here, or click to select files</p>
                                    </div>
                                </Grid>

                                {files.map((fileWrapper) => (
                                    <Grid item key={fileWrapper.id}>
                                        {fileWrapper.errors.length ? (
                                            <UploadError
                                                file={fileWrapper.file}
                                                errors={fileWrapper.errors}
                                                onDelete={onDelete}/>
                                        ) : (
                                            <SingleFileUploadWithProgress
                                                onDelete={onDelete}
                                                file={fileWrapper.file}
                                                loadProgress={progress}
                                            />
                                        )}
                                    </Grid>
                                ))}

                                <Grid item>
                                    <div>
                                        <Typography  classes={{ root: classes.text_white }}>{formathash}</Typography>
                                    </div>
                                </Grid>
                                <Grid item>
                                    <div>
                                        <Typography  classes={{ root: classes.text_white }}>{formatsize}</Typography>
                                    </div>
                                </Grid>

                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={onUpload}
                                        type="submit">
                                        Install
                                    </Button>
                                </Grid>
                                {/*<AlertResultDialog isShow={showAlert}/>*/}
                            </Grid>

                            {/*<pre>{JSON.stringify({ values, errors }, null, 4)}</pre>*/}
                        </Form>
                    )}
                </Formik>

            </CardContent>
        </Card>

    );
}

export default WasmUploadComponent
