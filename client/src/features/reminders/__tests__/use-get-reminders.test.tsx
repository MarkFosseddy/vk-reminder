/* eslint-disable */
import React from "react";

import { renderHook } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import { useGetReminders } from "../use-get-reminders";
import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { API } from "../../../lib/api";
import { remindersActions, remindersReducer } from "../reminders-slice";

jest.mock("../../../lib/api");

describe("useGetReminder Hook", () => {
  afterEach(jest.clearAllMocks);

  it("should fetch reminders", async () => {
    (API.reminders.getAll as jest.Mock).mockResolvedValueOnce({ data: [] });

    const { waitForNextUpdate } = setup();
    await waitForNextUpdate();

    expect(API.reminders.getAll).toHaveBeenCalledTimes(1);
  });

  it("should set reminders to redux", async () => {
    const data = [
      { "id": "1", "text": "Buy milk", "date": "2020-5-8 10:35", "isSent": false },
      { "id": "2", "text": "Wash dishes", "date": "2020-5-8 10:35", "isSent": false }
    ];
    (API.reminders.getAll as jest.Mock).mockResolvedValue({ data });

    const { store, waitForNextUpdate } = setup();
    await waitForNextUpdate();

    expect(store.getState().reminders.entities).toBe(data);
  });

  it("should skip if reminders already exist in redux", async () => {
    const data = [{ id: "1" }, { id: "2" }];
    const newData = [{ id: 1 }];
    (API.reminders.getAll as jest.Mock).mockResolvedValue({ data: newData });

    // @ts-ignore
    const { store } = setup(data);

    expect(API.reminders.getAll).toHaveBeenCalledTimes(0);
    expect(store.getState().reminders.entities).not.toBe(newData);
  });

  it("should set error", async () => {
    (API.reminders.getAll as jest.Mock).mockResolvedValue({ error: true });

    const { result, waitForNextUpdate, store } = setup();
    await waitForNextUpdate();

    expect(result.current.error).not.toBe(null);
    expect(store.getState().reminders.entities).toBe(null);
  });
});

function setup(initialState = null) {
  const store = configureStore({ reducer: combineReducers({ reminders: remindersReducer }) });

  if (initialState) {
    store.dispatch(remindersActions.setReminders(initialState!));
  }

  const utils = renderHook(() => useGetReminders(), {
    wrapper: ({ children }) => (
      <Provider store={store}>
        {children}
      </Provider>
    )
  });

  return { store, ...utils };
}
