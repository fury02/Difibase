import { Grid, LinearProgress, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { FileHeader } from './FileHeader';
import {SingleFileUploadWithProgressProps} from "../../../../../../../common/interfaces/interfaces";
// import UploadWasmIc from "../Upload_wasm_ic";


export function SingleFileUploadWithProgress({ file, onDelete, loadProgress}: SingleFileUploadWithProgressProps) {
  useEffect(() => {  }, []);
  return (
      <Grid item>
        <FileHeader file={file} onDelete={onDelete}/>
        <LinearProgress variant="determinate" value={loadProgress} />
      </Grid>
  );
}


