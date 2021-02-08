import { Action, combineReducers, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { userSlice } from "./slices/user";

type StoreState = ReturnType<typeof rootReducer>;
type StoreDispatch = typeof store.dispatch;

const rootReducer = combineReducers({
  user: userSlice.reducer
});

export const store = configureStore({
  reducer: rootReducer
});

export const useStoreSelector: TypedUseSelectorHook<StoreState> = useSelector;

export function useStoreDispatch() {
  return useDispatch<StoreDispatch>();
}

export type StoreThunk = ThunkAction<void, StoreState, unknown, Action<string>>;
