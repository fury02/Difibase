import React from 'react';
import ReactDOM from 'react-dom';
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
import RoadmapComponent from "./components/futuro/RoadmapComponent";
import IntegrationComponent from "./components/tabs/quick_start/IntegrationComponent";
import InformationComponent from "./components/tabs/quick_start/InformationComponent";
import TablesSampleComponent from "./components/tabs/quick_start/TablesSampleComponent";
import TablesCreateUploadComponent from "./components/tabs/examples/TablesCreateUploadComponent";
import OtherExampleComponent from "./components/tabs/examples/other/OtherExampleComponent";
import TablesDownloadDeleteComponent from "./components/tabs/examples/TablesDownloadDeleteComponent";
import AccountManagerComponent from "./components/tabs/office/account_manager/AccountManagerComponent";
import AccountDetailsComponent from "./components/tabs/office/account_details/AccountDetailsComponent";
import LoginIdentityComponent from "./components/login/LoginIdentityComponent";
import LoginDfinityIdentityComponent from "./components/login/providers/LoginDfinityIdentityComponent";
import LoginStoicIdentityComponent from "./components/login/providers/LoginStoicIdentityComponent";
import MonitoringDifibaseComponent from "./components/tabs/main/monitor/MonitoringDifibaseComponent";
import WalletActionComponent from "./components/tabs/main/wallet/WalletActionComponent";
import LoginPlugIdentityComponent from './components/login/providers/LoginPlugIdentityComponent';
import {PersistGate} from "redux-persist/integration/react";
import {persistStore} from "redux-persist";
import InstallWasmFileComponent from "./components/tabs/examples/InstallWasmFileComponent";

let persistor = persistStore(store);


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <HeaderComponent></HeaderComponent>
                    <Routes>
                        <Route index element={<ScoreboardComponent></ScoreboardComponent>} />
                        <Route path="/home" element={<ScoreboardComponent></ScoreboardComponent>} />
                        <Route path="/api" element={<ApiComponent></ApiComponent>} />
                        <Route path="/tables_sample" element={<TablesSampleComponent></TablesSampleComponent>} />
                        <Route path="/tables_create_upload" element={<TablesCreateUploadComponent></TablesCreateUploadComponent>} />
                        <Route path="/tables_download_delete" element={<TablesDownloadDeleteComponent></TablesDownloadDeleteComponent>} />
                        <Route path="/install_wasm_file" element={<InstallWasmFileComponent></InstallWasmFileComponent>} />
                        <Route path="/other_example" element={<OtherExampleComponent></OtherExampleComponent>} />
                        <Route path="/info" element={<InformationComponent></InformationComponent>} />
                        <Route path="/integration" element={<IntegrationComponent></IntegrationComponent>} />
                        <Route path="/roadmapalpha" element={<RoadmapComponent></RoadmapComponent>} />
                        <Route path="/office/account_manager" element={<AccountManagerComponent></AccountManagerComponent>} />
                        <Route path="/office/account_details" element={<AccountDetailsComponent></AccountDetailsComponent>} />
                        <Route path="/login" element={<LoginIdentityComponent></LoginIdentityComponent>} />
                        <Route path="/login/dfinity" element={<LoginDfinityIdentityComponent></LoginDfinityIdentityComponent>} />
                        <Route path="/login/stoic" element={<LoginStoicIdentityComponent></LoginStoicIdentityComponent>} />
                        <Route path="/login/plug" element={<LoginPlugIdentityComponent></LoginPlugIdentityComponent>} />
                        <Route path="/login/plug-pg" element={<LoginPlugIdentityComponent></LoginPlugIdentityComponent>} />
                        <Route path="/main/monitoring" element={<MonitoringDifibaseComponent></MonitoringDifibaseComponent>} />
                        <Route path="/main/wallet" element={<WalletActionComponent></WalletActionComponent>} />
                    </Routes>
                    <BottomComponent></BottomComponent>
                </Router>
                <App />
            </PersistGate>
        </Provider>
    </React.StrictMode>,
  document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for examples: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
