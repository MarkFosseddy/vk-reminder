/* eslint-disable */
import React from "react";

import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { remindersReducer, remindersActions } from "../reminders-slice";
import { useUpdateReminder } from "../use-update-reminder";
import { API } from "../../../lib/api";

jest.mock("../../../lib/api");

describe("useUpdateReminder Hook", () => {
  afterEach(jest.clearAllMocks);

  it("should make api request", async () => {
    (API.reminders.update as jest.Mock).mockResolvedValue({});

    const { result } = setup();

    await act(() => result.current.updateReminder(data));

    expect(API.reminders.update).toHaveBeenCalledTimes(1);
    expect(API.reminders.update).toHaveBeenCalledWith(data);
  });

  it("should update item in redux", async () => {
    (API.reminders.update as jest.Mock).mockResolvedValue({});

    const { result, store } = setup();

    await act(() => result.current.updateReminder(data));
    const reminder = store.getState().reminders.entities?.find(e => e.id == data.id);

    expect(reminder?.text).toBe(data.text);
    expect(reminder?.date).toBe(data.date);
  });

  it("should set loading during request", async () => {
    (API.reminders.update as jest.Mock).mockResolvedValue({});

    const { result, waitFor } = setup();

    act(() => {
      result.current.updateReminder(data)
    });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("should set error", async () => {
    (API.reminders.update as jest.Mock).mockResolvedValue({ error: true });

    const { result, store } = setup();

    await act(() => result.current.updateReminder(data));

    expect(result.current.error).not.toBe(null);
    expect(result.current.loading).toBe(false);
    expect(store.getState().reminders.entities).toStrictEqual(initialState);
  });
});

const data = { id: "1", text: "updated-text", date: "updated-date" };
const initialState = [{ id: "1", text: "test-text", date: "test-date" }];

function setup() {
  const store = configureStore({ reducer: combineReducers({ reminders: remindersReducer }) });

  // @ts-ignore
  store.dispatch(remindersActions.setReminders(initialState));

  const utils = renderHook(() => useUpdateReminder(), {
    wrapper: ({ children }) => (
      <Provider store={store}>
        {children}
      </Provider>
    )
  });

  return { store, ...utils };
}
