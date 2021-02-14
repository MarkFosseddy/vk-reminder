/* eslint-disable */
import React from "react";

import { act, renderHook } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { remindersReducer, remindersActions } from "../reminders-slice";
import { useCreateReminder } from "../use-create-reminder";
import { API } from "../../../lib/api";

jest.mock("../../../lib/api");

describe("useCreateReminder Hook", () => {
  afterEach(jest.clearAllMocks);

  it("should make api call", async () => {
    (API.reminders.create as jest.Mock).mockResolvedValue({ data: {} });
    const { result } = setup();

    await act(() => result.current.createReminder(newReminderMock));

    expect(API.reminders.create).toHaveBeenCalledTimes(1);
    expect(API.reminders.create).toHaveBeenCalledWith(newReminderMock);
  });

  it("should add new reminder to redux", async () => {
    
    const createdData = {
      data: { ...newReminderMock, id: String(Date.now()), isSent: false }
    };
    (API.reminders.create as jest.Mock).mockReturnValue(createdData);

    const { store, result } = setup();

    await act(() => result.current.createReminder(newReminderMock));

    expect(store.getState().reminders.entities).toContain(createdData.data)
  });

  it("should set loading during request", async () => {
    (API.reminders.create as jest.Mock).mockReturnValue({ data: {} });

    const { result, waitFor } = setup();

    expect(result.current.loading).toBe(false);

    act(() => {
      result.current.createReminder(newReminderMock);
    });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("should set error", async () => {
    (API.reminders.create as jest.Mock).mockReturnValue({ error: true });

    const { store, result } = setup();

    await act(() => result.current.createReminder(newReminderMock));

    expect(result.current.error).not.toBe(null);
    expect(result.current.loading).toBe(false);
    expect(store.getState().reminders.entities).toHaveLength(0);
  });
});

const newReminderMock = { text: "test-text", date: "test-date" };

function setup() {
  const store = configureStore({ reducer: combineReducers({ reminders: remindersReducer }) });

  store.dispatch(remindersActions.setReminders([]));

  const utils = renderHook(() => useCreateReminder(), {
    wrapper: ({ children }) => (
      <Provider store={store}>
        {children}
      </Provider>
    )
  });

  return { store, ...utils };
}
