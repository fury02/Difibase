import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    selected_zone: {
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#282c34',
        height: theme.spacing(10),
        outline: 'none',
        fontSize: '18px',
        fontStyle: 'italic',
        color: 'coral'
    },
    root: {
        background: '#282c34',
    },
    input_color_red: {
        color: '#E9A0A0',
    },
    input_color_green: {
        color: 'green',
    },
    input_color_blue: {
        color: '#A0A9E9',
    },
    input_color_white: {
        color: 'white',
        fontStyle: 'italic',
        fontSize: '.8em',
    },
    text_whitesmoke: {
        color: 'whitesmoke',
        fontStyle: 'italic',
        fontSize: '.8em',
    },
    input_color_coral: {
        color: 'coral',
        fontStyle: 'italic',
        fontSize: '.8em',
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