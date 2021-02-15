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
  // @TODO: probably should be an empty array
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
    },
    add(state, action: PayloadAction<Reminder>) {
      if (state.entities == null) return;
      state.entities.unshift(action.payload);
    },
    // @TODO: typing
    update(state, action: PayloadAction<{ id: string, text: string, date: string }>) {
      if (state.entities == null) return;
      const reminder = state.entities.find(e => e.id === action.payload.id);
      if (!reminder) return;
      reminder.text = action.payload.text;
      reminder.date = action.payload.date;
    }
  }
});

export const remindersReducer = remindersSlice.reducer;
export const remindersActions = remindersSlice.actions;

export function selectReminders(state: StoreState): Reminder[] | null {
  return state.reminders.entities;
}

export function selectReminderById(state: StoreState, id: string) {
  const reminders = selectReminders(state);
  if (!reminders) return null;

  const r = reminders.find(r => r.id === id);
  if (!r) return null;

  return r;
}
