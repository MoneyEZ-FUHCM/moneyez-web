import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./slices/userSlice";

import { setupListeners } from "@reduxjs/toolkit/query";
import authApi from "@/services/auth";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [],
};

const rootReducer = {
  user: userReducer,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers(rootReducer),
);

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
        ignoredPaths: ["register"],
      },
    }).concat(authApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
