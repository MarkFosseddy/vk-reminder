import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { StoreState } from "../../store";

type User = {
  id: string,
  first_name: string,
  last_name: string,
  photo_100: string
}

type SliceState = {
  user: User | null
}

const initialState = {
  user: null
} as SliceState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    }
  }
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;

export function userSelector(state: StoreState): User | null {
  return state.auth.user;
}
