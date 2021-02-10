import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: string,
  first_name: string,
  last_name: string,
  photo_100: string
};

type SliceState = User | null;

const initialState = null as SliceState;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(_, action: PayloadAction<User | null>) {
      return action.payload;
    }
  }
});
