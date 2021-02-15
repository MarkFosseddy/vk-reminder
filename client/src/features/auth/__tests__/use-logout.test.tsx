/* eslint-disable */
import React from "react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import { configureStore } from "@reduxjs/toolkit";
import { authActions, authReducer } from "../auth-slice";
import { Provider } from "react-redux";
import { VKLib } from "../../../lib/vk";
import { useLogout } from "../use-logout";
import { StorageKeys } from "../../../types";
import { routes } from "../../../routing";

jest.mock("../../../lib/vk");

describe("useAutoLogin Hook", () => {
  beforeEach(() => {
    (VKLib.Auth.logout as jest.Mock).mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should make vk api request", async () => {
    const { result } = setup();
    await act(() => result.current.logout());

    expect(VKLib.Auth.logout).toHaveBeenCalledTimes(1);
  });

  it("should remove vk_id from localStorage", async () => {
    localStorage.setItem(StorageKeys.VK_ID, mockUser.id)
    const { result } = setup();
    await act(() => result.current.logout());

    expect(localStorage.getItem(StorageKeys.VK_ID)).toBe(null);
  });

  it("should remove user from redux", async () => {

    const { result, store } = setup();
    await act(() => result.current.logout());

    expect(store.getState().user).toBe(null);
  });

  it("should redirect to /login", async () => {
    const { result, history } = setup();
    await act(() => result.current.logout());

    expect(history.location.pathname).toBe(routes.login);
  });

  it("should set loading during request", async () => {
    const { result, waitFor } = setup();

    expect(result.current.loading).toBe(false);
    act(() => {
      result.current.logout()
    });

    await waitFor(() => expect(result.current.loading).toBe(true));
    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});

const mockUser = {
  id: "id",
  last_name: "last_name",
  first_name: "first_name",
  photo_100: "photo_100"
};

function setup() {
  const store = configureStore({ reducer: authReducer });
  const history = createMemoryHistory();

  store.dispatch(authActions.setUser(mockUser));

  const utils = renderHook(() => useLogout(), {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <Router history={history}>
          {children}
        </Router>
      </Provider>
    )
  });

  return { store, history, ...utils };
}
