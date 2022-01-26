import { configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage';
import accountReducer from '../features/ic/base/AccountSlice';
import transactionsReducer from '../features/ic/transactions/TransactionsSlice';
import tokenBalanceReducer from '../features/ic/token/TokensBalanceSlice';
import userInstanceReducer from '../features/ic/db/instance/UserInstanceSlice';

const reducers = combineReducers({
  account_values: accountReducer,
  instances_values: userInstanceReducer,
  account_transactions: transactionsReducer,
  token_balances: tokenBalanceReducer,
  data_message_token_balances: tokenBalanceReducer,
  data_message: accountReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage ,
  blacklist: ['navigation'],
  whitelist: ['counter', 'data_message', 'account_values', 'account_transactions', 'token_balances', 'instances_values', 'data_message_token_balances'],
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
