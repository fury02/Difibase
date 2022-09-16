import React from 'react';
// import ReactDOM from 'react-dom';
// import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom/client';
//React-Reduxe
import {store} from "./redux/app/Store";
import {Provider} from "react-redux";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Navigate, Routes, Route} from "react-router-dom";
//bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderComponent from "./components/header/HeaderComponent";
import BottomComponent from "./components/bottom/BottomComponent";
import ScoreboardComponent from "./components/home/ScoreboardComponent";
import ApiComponent from "./components/tabs/quick_start/ApiComponent";
import RoadmapComponent from "./components/tabs/futuro/RoadmapComponent";
import IntegrationComponent from "./components/tabs/quick_start/IntegrationComponent";
import InformationComponent from "./components/tabs/quick_start/InformationComponent";
import TablesSampleComponent from "./components/tabs/quick_start/TablesSampleComponent";

// import AccountManagerComponent from "./components/tabs/database/not_using/account_manager/AccountManagerComponent";
import AccountDetailsComponent from "./components/tabs/office/account_details/AccountDetailsComponent";
import LoginIdentityComponent from "./components/login/LoginIdentityComponent";
import LoginDfinityIdentityComponent from "./components/login/providers/LoginDfinityIdentityComponent";
import LoginStoicIdentityComponent from "./components/login/providers/LoginStoicIdentityComponent";
import MonitoringDifibaseComponent from "./components/tabs/database/monitor/MonitoringDifibaseComponent";
import WalletActionComponent from "./components/tabs/exchequer/wallet/WalletActionComponent";
import LoginPlugIdentityComponent from './components/login/providers/LoginPlugIdentityComponent';
import {PersistGate} from "redux-persist/integration/react";
import {persistStore} from "redux-persist";
import InstanceLonerCreateComponent from "./components/tabs/database/instances_manager/InstanceLonerCreateComponent";
//local
import TablesCreateUploadComponent from "./components/tabs/examples/local_db/TablesCreateUploadComponent";
import OtherExampleComponent from "./components/tabs/examples/local_db/other/OtherExampleComponent";
import TablesDownloadDeleteComponent from "./components/tabs/examples/local_db/TablesDownloadDeleteComponent";
import {UploadFileComponent} from "./components/tabs/examples/local_db/fragments/tables_create_upload/UploadFileComponent";

//blockchain
// import UploadFileDPComponent from './components/tabs/examples/not_using/UploadFileDPComponent';
// import {UploadFileComponent} from "./components/tabs/examples/blockchain_ic/fragments/tables_add/UploadFileComponent";

import TablesCreateComponentBlockchain from "./components/tabs/examples/blockchain_ic/TablesCreateComponent";
import TablesDeleteComponentBlockchain from "./components/tabs/examples/blockchain_ic/TablesDeleteComponent";

import TablesFilesCreateComponentBlockchain from "./components/tabs/examples/files_blockchain_ic/TablesFilesCreateComponent";
import TablesFilesDeleteComponentBlockchain from "./components/tabs/examples/files_blockchain_ic/TablesFilesDeleteComponent";

import AccountsAdministratorComponent from "./components/tabs/manager/accounts/AccountsAdministratorComponent";
import ClusterCreateComponent from "./components/tabs/database/cluster_manager/ClusterCreateComponent";
import InstancesClusterCreateComponent from "./components/tabs/database/instances_manager/InstancesClusterCreateComponent";
import WasmStorageComponent from "./components/tabs/manager/wasm_admin/WasmStorageComponent";
import ClusterUpdateComponent from "./components/tabs/database/cluster_manager/ClusterUpdateComponent";
import InstancesClusterUpdateComponent from "./components/tabs/database/instances_manager/InstancesClusterUpdateComponent";
import CyclesActionComponent from "./components/tabs/exchequer/cycles/CyclesActionComponent";
import TablesFilesDownloadComponent from "./components/tabs/examples/files_blockchain_ic/TablesFilesDownloadComponent";
import TablesFilesUploadComponent from "./components/tabs/examples/files_blockchain_ic/TablesFilesUploadComponent";

let persistor = persistStore(store);


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

//react v.17
// ReactDOM.render(
//react v.18
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <HeaderComponent></HeaderComponent>
                    <Routes>
                        <Route index element={<ScoreboardComponent></ScoreboardComponent>} />
                        //Home
                        <Route path="/home" element={<ScoreboardComponent></ScoreboardComponent>} />
                        //Example tables
                        {/*local*/}
                        <Route path="/example/local/tables_create_upload" element={<TablesCreateUploadComponent></TablesCreateUploadComponent>} />
                        <Route path="/example/local/tables_download_delete" element={<TablesDownloadDeleteComponent></TablesDownloadDeleteComponent>} />
                        {/*dbeasy*/}
                        <Route path="/example/blockchain_ic/tables_create" element={<TablesCreateComponentBlockchain></TablesCreateComponentBlockchain>} />
                        <Route path="/example/blockchain_ic/tables_delete" element={<TablesDeleteComponentBlockchain></TablesDeleteComponentBlockchain>} />
                        {/*db-files*/}
                        <Route path="/example/files_blockchain_ic/tables_files_create" element={<TablesFilesCreateComponentBlockchain></TablesFilesCreateComponentBlockchain>} />
                        <Route path="/example/files_blockchain_ic/tables_files_delete" element={<TablesFilesDeleteComponentBlockchain></TablesFilesDeleteComponentBlockchain>} />
                        <Route path="/example/files_blockchain_ic/tables_files_upload" element={<TablesFilesUploadComponent></TablesFilesUploadComponent>} />
                        <Route path="/example/files_blockchain_ic/tables_files_download" element={<TablesFilesDownloadComponent></TablesFilesDownloadComponent>} />
                        //Quick start (old the futures)
                        <Route path="quickstart/tables_sample" element={<TablesSampleComponent></TablesSampleComponent>} />
                        <Route path="quickstart/api" element={<ApiComponent></ApiComponent>} />
                        <Route path="quickstart/integration" element={<IntegrationComponent></IntegrationComponent>} />
                        {/*<Route path="/other_example" element={<OtherExampleComponent></OtherExampleComponent>} />*/}
                        {/*<Route path="/info" element={<InformationComponent></InformationComponent>} />*/}
                        {/*<Route path="/roadmapalpha" element={<RoadmapComponent></RoadmapComponent>} />*/}
                        //Admin
                        <Route path="/manager/accounts_admin" element={<AccountsAdministratorComponent></AccountsAdministratorComponent>} />
                        <Route path="/manager/wasm_storage" element={<WasmStorageComponent></WasmStorageComponent>} />
                        {/*<Route path="/manager/monitoring" element={<MonitoringDifibaseComponent></MonitoringDifibaseComponent>} />*/}
                        //Database: clusters; instances
                        <Route path="/database/cluster/create" element={<ClusterCreateComponent></ClusterCreateComponent>} />
                        <Route path="/database/cluster/update" element={<ClusterUpdateComponent></ClusterUpdateComponent>} />
                        <Route path="/database/instances/create" element={<InstancesClusterCreateComponent></InstancesClusterCreateComponent>} />
                        <Route path="/database/instances/loner_create" element={<InstanceLonerCreateComponent></InstanceLonerCreateComponent>} />
                        <Route path="/database/instances/update" element={<InstancesClusterUpdateComponent></InstancesClusterUpdateComponent>} />
                        <Route path="/database/monitoring" element={<MonitoringDifibaseComponent></MonitoringDifibaseComponent>} />
                        //Office
                        <Route path="/office/account_details" element={<AccountDetailsComponent></AccountDetailsComponent>} />
                        {/*<Route path="/office/account_manager" element={<AccountManagerComponent></AccountManagerComponent>} />*/}
                        //Login
                        <Route path="/login" element={<LoginIdentityComponent></LoginIdentityComponent>} />
                        <Route path="/login/dfinity" element={<LoginDfinityIdentityComponent></LoginDfinityIdentityComponent>} />
                        <Route path="/login/stoic" element={<LoginStoicIdentityComponent></LoginStoicIdentityComponent>} />
                        <Route path="/login/plug" element={<LoginPlugIdentityComponent></LoginPlugIdentityComponent>} />
                        <Route path="/login/plug-pg" element={<LoginPlugIdentityComponent></LoginPlugIdentityComponent>} />
                        //Exchequer
                        <Route path="/exchequer/wallet" element={<WalletActionComponent></WalletActionComponent>} />
                        <Route path="/exchequer/cycles" element={<CyclesActionComponent></CyclesActionComponent>} />
                    </Routes>
                    <BottomComponent></BottomComponent>
                </Router>
                <App/>
            </PersistGate>
        </Provider>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for examples: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
