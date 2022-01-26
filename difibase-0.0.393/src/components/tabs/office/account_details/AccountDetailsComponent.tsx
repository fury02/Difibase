import React, {useState} from "react";
import {Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {useAppSelector} from "../../../../redux/app/Hooks";
import {selectValues} from "../../../../redux/features/ic/base/AccountSlice";

// export default class AccountDetailsComponent extends React.Component {
//     render() {
//         return ( <div></div> );
//     }
// }
//

const AccountDetailsComponent: React.FC = () => {

    // const values = useAppSelector(selectValues);
    // const principal = values[1];

    return (
        <div className="white-color">
            <h4>Details. In development. Coming soon.</h4>
        </div>
    )
}

export default AccountDetailsComponent