import { Action, combineReducers, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { authReducer } from "../features/auth";

type StoreDispatch = typeof store.dispatch;

const rootReducer = combineReducers({
  auth: authReducer
});

export const store = configureStore({
  reducer: rootReducer
});

export const useStoreSelector: TypedUseSelectorHook<StoreState> = useSelector;

export function useStoreDispatch() {
  return useDispatch<StoreDispatch>();
}

export type StoreThunk = ThunkAction<void, StoreState, unknown, Action<string>>;
export type StoreState = ReturnType<typeof rootReducer>;
