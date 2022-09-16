import { configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage';

import wasmStorageReducer from '../features/ic/files/wasm/action/WasmStorageSlice';
import accountReducer from '../features/ic/base/AccountSlice';
import transactionsReducer from '../features/ic/transactions/TransactionsSlice';
import tokenBalanceReducer from '../features/ic/token/TokensBalanceSlice';
import cycleMarketPriceReducer from '../features/ic/cycles/CyclesMarketPriceSlice';
import userInstanceReducer from '../features/ic/db/instance/UserInstanceSlice';
import userClusterReducer from '../features/ic/db/cluster/UserClusterSlice';
import wasmObjectsReducer from "../features/ic/files/wasm/storage/WasmObjectsSlice";
import clusterInstanceReducer from "../features/ic/db/cluster-instance/ClusterInstanceSlice";

const reducers = combineReducers({
    account_values: accountReducer,//whitelist
    instances_values: userInstanceReducer,
    user_cluster_values: userClusterReducer,//!!!blacklist
    cluster_instance_values: clusterInstanceReducer,//whitelist
    cluster_instance_create: clusterInstanceReducer,//!!!blacklist
    cycle_market_price: cycleMarketPriceReducer,//!!!blacklist
    selected_cluster: clusterInstanceReducer,//whitelist
    selected_instance: clusterInstanceReducer,//whitelist
    account_transactions: transactionsReducer,//whitelist
    token_balances: tokenBalanceReducer,//whitelist
    wasm_objects: wasmObjectsReducer,//whitelist
    wasm_storage: wasmStorageReducer,//blacklist
    data_message_token_balances: tokenBalanceReducer,
    data_message: accountReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage ,
  blacklist: [
      'navigation',
      'wasm_storage',
      'user_cluster_values',
      'cluster_instance_create',
      'cycle_market_price'
  ],
  whitelist: [
      'data_message',
      'account_values',
      'account_transactions',
      'token_balances',
      'instances_values',
      // 'user_cluster_values', !!! Black list
      'cluster_instance_values',
      // 'cluster_instance_create', !!! Black list
      'selected_cluster_value',
      'wasm_objects',
      'data_message_token_balances'
  ],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  // devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
