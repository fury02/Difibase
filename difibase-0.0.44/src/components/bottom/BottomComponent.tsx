import React from "react";
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
    Typography,
} from '@material-ui/core';
import {Navbar, Image, Nav,} from 'react-bootstrap';
import logo from '../../assets/img/ic-badge-powered-by_slim-transparent-white-text.svg' ;

// import {makeStyles} from "@material-ui/core/styles";
// const classes = makeStyles((theme) => ({
//     navbar_sm: {
//         height: 10,
//     }}));

class BottomComponent extends React.Component {
    render() {
        return (
            <Navbar collapseOnSelect expand="sm"  bg="dark" variant="dark" fixed={"bottom"}>
                <Nav className="justify-content-center" activeKey="https://dfinity.org/">
                    <Nav.Item>
                        <Nav.Link eventKey="https://dfinity.org/">
                            <Image src={logo}
                                   width="auto"
                                   height="25">
                            </Image>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                <Nav className="justify-content-end p-2" style={{ width: "100%" }} activeKey="/home">
                    <Nav.Item>
                        <Nav.Link eventKey="/home"> MIT License. 2021-2023</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar>
            );
    }
}
export default BottomComponent;
