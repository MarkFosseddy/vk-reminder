import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { StoreState } from "../../store";

export type Reminder = {
  id: string,
  text: string,
  date: string,
  isSent: boolean
}

type SliceState = {
  entities: Reminder[] | null
}

const initialState = {
  entities: null
} as SliceState;

const remindersSlice = createSlice({
  name: "reminders",
  initialState,
  reducers: {
    setReminders(state, action: PayloadAction<Reminder[]>) {
      state.entities = action.payload;
    },
    deleteReminder(state, action: PayloadAction<string>) {
      if (state.entities == null) return;
      state.entities = state.entities.filter(e => e.id !== action.payload);
    }
  }
});

export const remindersReducer = remindersSlice.reducer;
export const remindersActions = remindersSlice.actions;

export function selectReminders(state: StoreState): Reminder[] | null {
  return state.reminders.entities;
}
