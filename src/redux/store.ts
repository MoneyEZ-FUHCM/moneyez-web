import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import modalReducer from "./slices/modalSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authApi from "@/services/auth";

const rootReducer = combineReducers({
  user: userReducer,
  [authApi.reducerPath]: authApi.reducer,
  modal: modalReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
