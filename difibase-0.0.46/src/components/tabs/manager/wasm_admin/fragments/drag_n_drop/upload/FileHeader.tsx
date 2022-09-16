import { Button, Grid } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {FileHeaderProps} from "../../../../../../../common/interfaces/interfaces";

const useStyles = makeStyles({
    root: {
        background: 'white',
    }
});

export function FileHeader({ file, onDelete }: FileHeaderProps) {
    const classes = useStyles();
    return (
        <Grid container justify="space-between" alignItems="center">
            <Grid item classes={{ root: classes.root,}}>{file.name}</Grid>
            <Grid item>
                <Button size="small" onClick={() => onDelete(file)} color="secondary">
                    Delete
                </Button>
            </Grid>
        </Grid>
    );
}
