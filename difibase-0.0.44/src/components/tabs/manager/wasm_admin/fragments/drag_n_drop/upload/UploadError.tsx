import {
  createStyles,
  LinearProgress,
  Typography,
  withStyles
} from '@material-ui/core';
import React from 'react';
import { FileError } from 'react-dropzone';
import { FileHeader } from './FileHeader';
import {UploadErrorProps} from "../../../../../../../common/interfaces/interfaces";

const ErrorLinearProgress = withStyles((theme) =>
  createStyles({
    bar: {
      backgroundColor: theme.palette.error.main,
    },
  })
)(LinearProgress);

export function UploadError({ file, onDelete, errors }: UploadErrorProps) {
  return (
    <React.Fragment>
      <FileHeader file={file} onDelete={onDelete} />
      <ErrorLinearProgress variant="determinate" value={100} />
      {errors.map((error) => (
        <div key={error.code}>
          <Typography color="error">{error.message}</Typography>
        </div>
      ))}
    </React.Fragment>
  );
}
