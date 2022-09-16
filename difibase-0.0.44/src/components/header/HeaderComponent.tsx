import React from "react";
import {
    Navbar,
    Nav,
    NavDropdown,
    NavLink,
    Container,
    Button,
    Dropdown,
    DropdownButton,
    ButtonGroup
} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'
import logo from '../../assets/logo/logo_5.png' ;
import logo_df2 from "../../assets/img/ic-badge-powered-by_slim-transparent-white-text.svg";
import {NavigateFunction, Route, useNavigate} from "react-router-dom";
import {Account} from "../../redux/features/ic/base/Account";
import {TokensBalance} from "../../redux/features/ic/token/TokensBalance";
import ClusterCreateComponent from "../tabs/database/cluster_manager/ClusterCreateComponent";
import InstancesClusterCreateComponent from "../tabs/database/instances_manager/InstancesClusterCreateComponent";
import {makeStyles} from "@material-ui/core/styles";
import TablesFilesCreateComponentBlockchain from "../tabs/examples/files_blockchain_ic/TablesFilesCreateComponent";
import TablesFilesDeleteComponentBlockchain from "../tabs/examples/files_blockchain_ic/TablesFilesDeleteComponent";
import TablesFilesUploadComponent from "../tabs/examples/files_blockchain_ic/TablesFilesUploadComponent";
import TablesFilesDownloadComponent from "../tabs/examples/files_blockchain_ic/TablesFilesDownloadComponent";

// //material-ui
// import { Button as ButtonMUI } from '@material-ui/core';
// import {
//     createTheme,
//     createStyles,
//     withStyles,
//     makeStyles,
//     Theme,
//     ThemeProvider,
// } from '@material-ui/core/styles';
// import { green, purple } from '@material-ui/core/colors';
// // Create a light theme instance.
// export const lightTheme = createTheme();
// // Create a dark theme instance.
// export const darkTheme = createTheme({
//     palette: {
//         type: 'dark',
//     },
// });


function LoginButton() {
    const navigate = useNavigate();
    const routeChange = () => {
        navigate('/login');
    };
    return (
        <div >

            <style type="text/css">
                {`
    .btn-flat {
      background-color: #A64800;
      color: white;
    }

    .btn-xxl {
      padding: 1rem 1.5rem;
      font-size: 1.5rem;
    }
    `}
            </style>
            <Button variant="flat" onClick={routeChange}>Login</Button>
            {/*<ButtonMUI variant="outlined" color="primary" onClick={routeChange}></ButtonMUI>*/}
        </div>
    );
};

// function MenuDropdownButton() {
//     const navigate = useNavigate();
//     const routeChange = () => {
//         navigate('/');
//     };
//     return (
//         <div >
//
//             <style type="text/css">
//                 {`
//     .btn-flat {
//       background-color: #282c34;
//       color: white;
//     }
//
//     .btn-xxl {
//       padding: 1rem 1.5rem;
//       font-size: 1.5rem;
//     }
//     `}
//             </style>
//             <DropdownButton
//                 as={ButtonGroup}
//                 key={'end'}
//                 id={`dropdown-button-drop-${'end'}`}
//                 drop={'end'}
//                 title={` Drop ${'end'} `}>
//             </DropdownButton>
//         </div>
//     );
// };

const useStyles = makeStyles((theme) => ({
    root: {
        background: '#282c34',
    },
    dropdown_toggle_custom: {
        background: 'transparent',
        color: 'coral',
        border:"none",
        borderColor:'transparent',
        '&:focus': {
            outline: 0,
            color: 'coral',
            background: 'transparent',
            backgroundColor: 'transparent',
            border:"none",
            borderColor:'transparent',
        },
        '&:focus:not(.focus-visible)': {
            outline: 0,
            color: 'coral',
            background: 'transparent',
            backgroundColor: 'transparent',
            border:"none",
            borderColor:'transparent',
        }
    },
    dropdown_toggle_custom_2: {
        background: 'transparent',
        color: 'coral',
        border:"none",
        borderColor:'transparent',
    }
}));

const HeaderComponent: React.FC = () =>   {
    // constructor(props: any){ super(props); }

    const classes = useStyles();
    // render() {
        return (
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <LinkContainer to="/home">
                    <Navbar bg="dark">
                        <Container>
                            <Navbar.Brand>
                                <img
                                    alt=""
                                    src={logo}
                                    width="99"
                                    height="45"
                                    className="d-inline-block align-top"
                                />{' '}
                            </Navbar.Brand>
                        </Container>
                    </Navbar>
                </LinkContainer>

                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>

                <Navbar.Collapse id="responsive-navbar-nav">
                {/*<Nav className="justify-content-end" style={{ width: "100%" }}>*/}
                    <Nav className="mr-auto">

                        {/*Roadmap info*/}
                        {/*<Navbar.Collapse id="responsive-navbar-nav">*/}
                        {/*    <Nav className="ms-auto text-center">*/}
                        {/*        <Dropdown  >*/}
                        {/*            <Dropdown.Toggle as={NavLink}>Info</Dropdown.Toggle>*/}
                        {/*            <Dropdown.Menu variant="dark">*/}
                        {/*                <Dropdown.Item href="/roadmap">Roadmap</Dropdown.Item>*/}
                        {/*            </Dropdown.Menu>*/}
                        {/*        </Dropdown>*/}
                        {/*    </Nav>*/}
                        {/*</Navbar.Collapse>*/}

                        {/*Manager*/}
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="ms-auto text-center">
                                <Dropdown>
                                    <Dropdown.Toggle as={NavLink}>Manager</Dropdown.Toggle>
                                    <Dropdown.Menu variant="dark">

                                        {/*<Dropdown.Menu variant="dark">*/}
                                            <NavDropdown.Item>
                                                <LinkContainer to="/manager/wasm_storage">
                                                    <NavLink><h6 className="coral-color">Storage wasm</h6></NavLink>
                                                </LinkContainer>
                                            </NavDropdown.Item>
                                        {/*</Dropdown.Menu>*/}

                                        {/*/!*<Dropdown.Menu variant="dark">*!/*/}
                                        {/*    <NavDropdown.Item>*/}
                                        {/*        <LinkContainer to="/manager/monitoring">*/}
                                        {/*            <NavLink><h6 className="coral-color">Monitoring</h6></NavLink>*/}
                                        {/*        </LinkContainer>*/}
                                        {/*    </NavDropdown.Item>*/}
                                        {/*/!*</Dropdown.Menu>*!/*/}

                                        {/*<Dropdown.Menu variant="dark">*/}
                                        {/*    <NavDropdown.Item>*/}
                                        {/*        <LinkContainer to="/manager/accounts_admin">*/}
                                        {/*            <NavLink><h6 className="coral-color">Admin</h6></NavLink>*/}
                                        {/*         </LinkContainer>*/}
                                        {/*    </NavDropdown.Item>*/}
                                        {/*</Dropdown.Menu>*/}

                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                        </Navbar.Collapse>

                        {/*Database*/}
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="ms-auto text-center">
                                <Dropdown>
                                    <Dropdown.Toggle as={NavLink}>Database</Dropdown.Toggle>
                                    <Dropdown.Menu variant="dark">

                                        <Dropdown className="d-inline mx-2" autoClose="inside">
                                            <Dropdown.Toggle className={classes.dropdown_toggle_custom} variant="dark" >
                                                Clusters
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu variant="dark">
                                                <NavDropdown.Item>
                                                    <LinkContainer to="/database/cluster/create">
                                                        <NavLink><h6 className="coral-color">Create</h6></NavLink>
                                                    </LinkContainer>
                                                </NavDropdown.Item>
                                                <NavDropdown.Divider/>
                                                <NavDropdown.Item>
                                                    <LinkContainer to="/database/cluster/update">
                                                        <NavLink><h6 className="coral-color">Update</h6></NavLink>
                                                    </LinkContainer>
                                                </NavDropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <NavDropdown.Divider/>
                                        <Dropdown className="d-inline mx-2" autoClose="inside">
                                            <Dropdown.Toggle className={classes.dropdown_toggle_custom} variant="dark" >
                                                Instances
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu variant="dark">
                                                <NavDropdown.Item>
                                                    <LinkContainer to="/database/instances/create">
                                                        <NavLink><h6 className="coral-color">Create</h6></NavLink>
                                                    </LinkContainer>
                                                </NavDropdown.Item>
                                                <NavDropdown.Divider/>
                                                <NavDropdown.Item>
                                                    <LinkContainer to="/database/instances/update">
                                                        <NavLink><h6 className="coral-color">Update</h6></NavLink>
                                                    </LinkContainer>
                                                </NavDropdown.Item>
                                                {/*<NavDropdown.Divider/>*/}
                                                {/*<NavDropdown.Item>*/}
                                                {/*    <LinkContainer to="/database/instances/loner_create">*/}
                                                {/*        <NavLink><h6 className="brown-color">Loner create</h6></NavLink>*/}
                                                {/*    </LinkContainer>*/}
                                                {/*</NavDropdown.Item>*/}
                                            </Dropdown.Menu>
                                        </Dropdown>

                                        {/*<NavDropdown.Divider/>*/}
                                        {/*/!*<Dropdown.Menu variant="dark">*!/*/}
                                        {/*<NavDropdown.Item>*/}
                                        {/*    <LinkContainer to="/database/monitoring">*/}
                                        {/*        <NavLink><h6 className="coral-color">Monitoring</h6></NavLink>*/}
                                        {/*    </LinkContainer>*/}
                                        {/*</NavDropdown.Item>*/}

                                        {/*</Dropdown.Menu>*/}

                                        {/*<NavDropdown.Divider/>*/}
                                        {/*<NavDropdown.Item>*/}
                                        {/*    <LinkContainer to="/office/account_manager">*/}
                                        {/*        <NavLink><h6 className="gray">Manager(not_using)</h6></NavLink>*/}
                                        {/*    </LinkContainer>*/}
                                        {/*</NavDropdown.Item>*/}

                                        {/*<NavDropdown.Divider/>*/}
                                        {/*<Dropdown className="d-inline mx-2" autoClose="inside">*/}
                                        {/*    <Dropdown.Toggle className={classes.dropdown_toggle_custom} variant="dark" >*/}
                                        {/*        View dropdown toggle*/}
                                        {/*    </Dropdown.Toggle>*/}
                                        {/*    <Dropdown.Menu variant="dark">*/}
                                        {/*        */}
                                        {/*    </Dropdown.Menu>*/}
                                        {/*</Dropdown>*/}

                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                        </Navbar.Collapse>

                        {/*Office*/} 
                        {/*<Navbar.Collapse id="responsive-navbar-nav">*/}
                        {/*    <Nav className="ms-auto text-center">*/}
                        {/*        <Dropdown>*/}
                        {/*            <Dropdown.Toggle as={NavLink}>Office</Dropdown.Toggle>*/}
                        {/*            <Dropdown.Menu variant="dark">*/}

                        {/*                <NavDropdown.Item>*/}
                        {/*                    <LinkContainer to="/office/account_details">*/}
                        {/*                        <NavLink><h6 className="coral-color">Details</h6></NavLink>*/}
                        {/*                    </LinkContainer>*/}
                        {/*                </NavDropdown.Item>*/}

                        {/*            </Dropdown.Menu>*/}
                        {/*        </Dropdown>*/}
                        {/*    </Nav>*/}
                        {/*</Navbar.Collapse>*/}

                        {/*Quick start*/}
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="ms-auto text-center">
                                <Dropdown  >
                                    <Dropdown.Toggle as={NavLink}>Quick start</Dropdown.Toggle>
                                    <Dropdown.Menu variant="dark">

                                        {/*<Dropdown.Item href="/api">Base API</Dropdown.Item>*/}
                                        {/*<NavDropdown.Divider/>*/}
                                        {/*<Dropdown.Item href="/integration">Integration</Dropdown.Item>*/}
                                        {/*<NavDropdown.Divider/>*/}
                                        {/*<Dropdown.Item href="/tables_sample">Tables sample</Dropdown.Item>*/}
                                        {/*/!*<NavDropdown.Divider/>*!/*/}
                                        {/*/!*<Dropdown.Item href="/info">Information</Dropdown.Item>*!/*/}

                                        <NavDropdown.Item>
                                            <LinkContainer to="quickstart/api">
                                                <NavLink><h6 className="coral-color">Base API</h6></NavLink>
                                            </LinkContainer>
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider/>
                                        <NavDropdown.Item>
                                            <LinkContainer to="quickstart/integration">
                                                <NavLink><h6 className="coral-color">Integration</h6></NavLink>
                                            </LinkContainer>
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider/>
                                        <NavDropdown.Item>
                                            <LinkContainer to="quickstart/tables_sample">
                                                <NavLink><h6 className="coral-color">Tables sample</h6></NavLink>
                                            </LinkContainer>
                                        </NavDropdown.Item>

                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                        </Navbar.Collapse>

                        {/*Examples*/}

                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="ms-auto text-center">
                                <Dropdown>
                                    <Dropdown.Toggle as={NavLink}>Examples</Dropdown.Toggle>
                                    <Dropdown.Menu variant="dark">

                                        {/*!!!!!!!Local test*/}

                                        {/*<Dropdown className="d-inline mx-2" autoClose="inside">*/}
                                        {/*    <Dropdown.Toggle className={classes.dropdown_toggle_custom} variant="dark" >*/}
                                        {/*        Local*/}
                                        {/*    </Dropdown.Toggle>*/}
                                        {/*    <Dropdown.Menu variant="dark">*/}
                                        {/*        <NavDropdown.Item>*/}
                                        {/*            <LinkContainer to="/example/local/tables_create_upload">*/}
                                        {/*                <NavLink><h6 className="coral-color">Add-Upload</h6></NavLink>*/}
                                        {/*            </LinkContainer>*/}
                                        {/*        </NavDropdown.Item>*/}
                                        {/*        <NavDropdown.Divider/>*/}
                                        {/*        <NavDropdown.Item>*/}
                                        {/*            <LinkContainer to="/example/local/tables_download_delete">*/}
                                        {/*                <NavLink><h6 className="coral-color">Download-Delete</h6></NavLink>*/}
                                        {/*            </LinkContainer>*/}
                                        {/*        </NavDropdown.Item>*/}
                                        {/*    </Dropdown.Menu>*/}
                                        {/*</Dropdown>*/}

                                        {/*<NavDropdown.Divider/>*/}

                                        {/*dbeasy*/}
                                        <Dropdown className="d-inline mx-2" autoClose="inside">
                                            <Dropdown.Toggle className={classes.dropdown_toggle_custom} variant="dark" >
                                                Databases (easy)
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu variant="dark">
                                                <NavDropdown.Item>
                                                    <LinkContainer to="/example/blockchain_ic/tables_create">
                                                        <NavLink><h6 className="coral-color">Add (entityes)</h6></NavLink>
                                                    </LinkContainer>
                                                </NavDropdown.Item>
                                                <NavDropdown.Divider/>
                                                <NavDropdown.Item>
                                                    <LinkContainer to="/example/blockchain_ic/tables_delete">
                                                        <NavLink><h6 className="coral-color">Delete (entityes)</h6></NavLink>
                                                    </LinkContainer>
                                                </NavDropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>

                                        <NavDropdown.Divider/>

                                        {/*db-files*/}
                                        <Dropdown className="d-inline mx-2" autoClose="inside">
                                            <Dropdown.Toggle className={classes.dropdown_toggle_custom} variant="dark" >
                                                Databases (files)
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu variant="dark">
                                                <NavDropdown.Item>
                                                    <LinkContainer to="/example/files_blockchain_ic/tables_files_create">
                                                        <NavLink><h6 className="coral-color">Add (entityes)</h6></NavLink>
                                                    </LinkContainer>
                                                </NavDropdown.Item>
                                                <NavDropdown.Divider/>
                                                <NavDropdown.Item>
                                                    <LinkContainer to="/example/files_blockchain_ic/tables_files_delete">
                                                        <NavLink><h6 className="coral-color">Delete (entityes)</h6></NavLink>
                                                    </LinkContainer>
                                                </NavDropdown.Item>
                                                <NavDropdown.Divider/>
                                                <NavDropdown.Item>
                                                    <LinkContainer to="/example/files_blockchain_ic/tables_files_upload">
                                                        <NavLink><h6 className="coral-color">Upload file</h6></NavLink>
                                                    </LinkContainer>
                                                </NavDropdown.Item>
                                                <NavDropdown.Divider/>
                                                <NavDropdown.Item>
                                                    <LinkContainer to="/example/files_blockchain_ic/tables_files_download">
                                                        <NavLink><h6 className="coral-color">Download file</h6></NavLink>
                                                    </LinkContainer>
                                                </NavDropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>

                                        {/*<NavDropdown.Divider/>*/}

                                        {/*New support files*/}

                                        {/*<NavDropdown.Divider/>*/}
                                        {/*<Dropdown className="d-inline mx-2" autoClose="inside">*/}
                                        {/*    <Dropdown.Toggle className={classes.dropdown_toggle_custom} variant="dark" >*/}
                                        {/*        Blockchain (files)*/}
                                        {/*    </Dropdown.Toggle>*/}
                                        {/*    <Dropdown.Menu variant="dark">*/}
                                        {/*        <NavDropdown.Item>*/}
                                        {/*            <LinkContainer to="/example/tables_add">*/}
                                        {/*                <NavLink><h6 className="coral-color">Add-Upload</h6></NavLink>*/}
                                        {/*            </LinkContainer>*/}
                                        {/*        </NavDropdown.Item>*/}
                                        {/*        <NavDropdown.Divider/>*/}
                                        {/*        <NavDropdown.Item>*/}
                                        {/*            <LinkContainer to="/example/tables_download_delete">*/}
                                        {/*                <NavLink><h6 className="coral-color">Download-Delete</h6></NavLink>*/}
                                        {/*            </LinkContainer>*/}
                                        {/*        </NavDropdown.Item>*/}
                                        {/*    </Dropdown.Menu>*/}
                                        {/*</Dropdown>*/}

                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                        </Navbar.Collapse>

                        {/*Exchequer*/}
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="ms-auto text-center">
                                <Dropdown>
                                    <Dropdown.Toggle as={NavLink}>Exchequer</Dropdown.Toggle>
                                    <Dropdown.Menu variant="dark">
                                        <NavDropdown.Item>
                                            <LinkContainer to="/exchequer/wallet">
                                                <NavLink><h6 className="coral-color">Wallet</h6></NavLink>
                                            </LinkContainer>
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider/>
                                        <NavDropdown.Item>
                                            <LinkContainer to="/exchequer/cycles">
                                                <NavLink><h6 className="coral-color">Cycles</h6></NavLink>
                                            </LinkContainer>
                                        </NavDropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                        </Navbar.Collapse>

                    </Nav>
                </Navbar.Collapse>

                {/*Login*/}
                <Navbar.Collapse>
                    <Nav className="justify-content-end p-0" style={{ width: "95%" }}>
                        <TokensBalance></TokensBalance>
                        <h1 className="transparent-text-color">' '</h1>
                        <Account></Account>
                        <h1 className="transparent-text-color">' '</h1>
                        <LoginButton></LoginButton>
                    </Nav>
                </Navbar.Collapse>

            </Navbar>
        );
    // }
}
export default HeaderComponent;
