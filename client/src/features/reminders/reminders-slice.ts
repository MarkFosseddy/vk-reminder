import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { StoreState } from "../../store";

export type Reminder = {
  id: string,
  text: string,
  date: string,
  isSent: boolean
}

type SliceState = {
  entities: Reminder[]
}

const initialState = {
  entities: []
} as SliceState;

const remindersSlice = createSlice({
  name: "reminders",
  initialState,
  reducers: {
    setReminders(state, action: PayloadAction<Reminder[]>) {
      state.entities = action.payload;
    }
  }
});

export const remindersReducer = remindersSlice.reducer;
export const remindersActions = remindersSlice.actions;

export function selectReminders(state: StoreState): Reminder[] {
  return state.reminders.entities;
}
