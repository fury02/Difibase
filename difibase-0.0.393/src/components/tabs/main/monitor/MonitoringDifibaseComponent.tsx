// import React, {useState} from "react";
// import {Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
//
//
// const MonitoringDifibaseComponent: React.FC = () => {
//
//     return (
//         <div>
//             <h4>Monitoring</h4>
//         </div>
//     )
// }
//
// export default MonitoringDifibaseComponent;

import React, {useState} from "react";
import {Col, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {useAppSelector} from "../../../../redux/app/Hooks";
import {selectValues} from "../../../../redux/features/ic/base/AccountSlice";


const MonitoringDifibaseComponent: React.FC = () => {

    //**Получение принципала с редукса**//

    // const values = useAppSelector(selectValues);
    // const principal = values[1];

    return (
        <div className="white-color">
            <h4>Monitoring.In development.Coming soon.</h4>
        </div>
    )
}

export default MonitoringDifibaseComponent;

