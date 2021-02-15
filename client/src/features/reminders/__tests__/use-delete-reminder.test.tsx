/* eslint-disable */
import React from "react";

import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { remindersActions, remindersReducer } from "../reminders-slice";
import { useDeleteReminder } from "../use-delete-reminder";
import { API } from "../../../lib/api";

jest.mock("../../../lib/api");

describe("useDeleteReminder Component", () => {
  afterEach(jest.clearAllMocks);

  it("should call api", async () => {
    (API.reminders.deleteReminder as jest.Mock).mockResolvedValue({ success: true });

    const { result, waitForNextUpdate } = setup();
    act(() => {
      result.current.deleteReminder("1");
    });
    await waitForNextUpdate();

    expect(API.reminders.deleteReminder).toHaveBeenCalledTimes(1);
  });

  it("should delete from redux", async () => {
    (API.reminders.deleteReminder as jest.Mock).mockResolvedValue({ success: true });

    const { store, result, waitForNextUpdate } = setup();
    const id = "1";

    act(() => {
      result.current.deleteReminder(id);
    });
    await waitForNextUpdate();

    expect(store.getState().reminders.entities).toStrictEqual(initialState.filter(s => s.id !== id));
  });

  it("should set error", async () => {
    (API.reminders.deleteReminder as jest.Mock).mockResolvedValue({ error: true });

    const id = "1";
    const { store, result, waitForNextUpdate } = setup();

    act(() => {
      result.current.deleteReminder(id);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();

    expect(result.current.error).not.toBe(null);
    expect(result.current.loading).toBe(false);
    expect(store.getState().reminders.entities).toStrictEqual(initialState);
  });

  it("should set loading during api request", async () => {
    const id = "1";
    const { result, waitForNextUpdate } = setup();

    act(() => {
      result.current.deleteReminder(id);
    });

    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
  });
});

const initialState = [{ id: "1" }, { id: "2" }];

function setup() {
  const store = configureStore({ reducer: combineReducers({ reminders: remindersReducer }) });

  // @ts-ignore
  store.dispatch(remindersActions.setReminders(initialState));

  const utils = renderHook(() => useDeleteReminder(), {
    wrapper: ({ children }) => (
      <Provider store={store}>
        {children}
      </Provider>
    )
  });

  return { store, ...utils };
}
