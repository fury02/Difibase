import React, {useState} from "react";
import {Button, ButtonGroup, Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";

function LoginDfinityButton() {
    const navigate = useNavigate();
    const routeChange = () => {
        navigate('/login/dfinity');
    };
    return (
        <div>
            {/*<Button className="btn btn-primary min-logins-button" size="lg"  onClick={routeChange}>Internet Identity</Button>*/}
            {/*<Button className="btn btn-light min-logins-button" size="lg"  onClick={routeChange} disabled>Internet Identity</Button>*/}
        </div>
    );
}

function LoginStoicButton() {
    const navigate = useNavigate();
    const routeChange = () => {
        navigate('/login/stoic');
    };
    return (
        <div >
            <Button className="btn btn-dark min-logins-button" size="lg"  onClick={routeChange}>Stoic</Button>
            {/*<Button className="btn btn-light min-logins-button" size="lg"  onClick={routeChange} disabled>Stoic</Button>*/}
        </div>
    );
}

function LoginPlugButton() {
    const navigate = useNavigate();
    const routeChange = () => {
        navigate('/login/plug');
    };
    return (
        <div>
            <Button className="btn btn-warning min-logins-button" size="lg"  onClick={routeChange}>Plug</Button>
            {/*<Button className="btn btn-warning min-logins-button" size="lg"  onClick={routeChange} disabled>Plug</Button>*/}
        </div>
    );
}

function LoginPlugButtonPG() {
    const navigate = useNavigate();
    const routeChange = () => {
        navigate('/login/plug-pg');
    };
    return (
        <div>
            <Button className="btn btn-warning min-logins-button" size="lg"  onClick={routeChange}>Plug</Button>
        </div>
    );
}

class LoginIdentityComponent extends React.Component{

    render() {
        return (
            <div className="div_logins_button_centr">
                <ButtonGroup vertical>
                    {/*not work*/}
                    {/*<LoginPlugButton></LoginPlugButton>*/}
                    {/*<h6></h6>*/}
                    <LoginPlugButtonPG></LoginPlugButtonPG>
                    <h6></h6>
                    <LoginDfinityButton></LoginDfinityButton>
                    <h6></h6>
                    <LoginStoicButton></LoginStoicButton>
                </ButtonGroup>
            </div>
         )
    }
}
export default LoginIdentityComponent;
