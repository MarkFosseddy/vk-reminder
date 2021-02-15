/* eslint-disable */
import React from "react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import { renderHook, act } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../auth-slice";
import { Provider } from "react-redux";
import { VKLib } from "../../../lib/vk";
import { API } from "../../../lib/api";
import { useLogin } from "../use-login";
import { StorageKeys } from "../../../types";
import { routes } from "../../../routing";

jest.mock("../../../lib/vk");
jest.mock("../../../lib/api");

describe("useAutoLogin Hook", () => {
  beforeEach(() => {
    (VKLib.Auth.login as jest.Mock).mockResolvedValue({
      session: {
        user: { id: mockUser.id }
      }
    });
    (API.user.getInfo as jest.Mock).mockResolvedValue({ data: mockUser });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should make vk api request", async () => {
    const { result } = setup();
    await act(() => result.current.login());

    expect(VKLib.Auth.login).toHaveBeenCalledTimes(1);
  });

  it("should make api request", async () => {
    const { result } = setup();
    await act(() => result.current.login());

    expect(API.user.getInfo).toHaveBeenCalledTimes(1);
    expect(API.user.getInfo).toHaveBeenCalledWith(mockUser.id);
  });

  it("should set user to redux", async () => {
    const { result, store } = setup();
    await act(() => result.current.login());

    const { is_allowed, ...expectedUser } = mockUser;
    expect(store.getState().user).toStrictEqual(expectedUser);
  });

  it("should set vk_id in localStorage", async () => {
    const localStorageSpy = jest.spyOn(Storage.prototype, "setItem");
    const { result } = setup();
    await act(() => result.current.login());

    expect(localStorageSpy).toHaveBeenCalledTimes(1);
    expect(localStorageSpy).toHaveBeenLastCalledWith(StorageKeys.VK_ID, mockUser.id);
  });

  it("should redirect to /reminders if messages are allowed", async () => {
    const { result, history } = setup();
    await act(() => result.current.login());

    expect(history.location.pathname).toBe(routes.reminders);
  });

  it("should redirect to /allow-messages if messages are not allowed", async () => {
    (API.user.getInfo as jest.Mock).mockResolvedValue({ data: { ...mockUser, is_allowed: false } });
    const { result, history } = setup();
    await act(() => result.current.login());

    expect(history.location.pathname).toBe(routes.allowMessagesFromCommunity);
  });

  it("should skip if no vk session", async () => {
    (VKLib.Auth.login as jest.Mock).mockResolvedValue({ session: false });
    const { result } = setup();
    await act(() => result.current.login());

    expect(API.user.getInfo).toHaveBeenCalledTimes(0);
    expect(result.current.loading).toBe(false);
  });

  it("should set loading during requests", async () => {
    const { result, waitFor } = setup();

    expect(result.current.loading).toBe(false);

    act(() => {
      result.current.login();
    });

    await waitFor(() => expect(result.current.loading).toBe(true));
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("should set error", async () => {
    (API.user.getInfo as jest.Mock).mockResolvedValue({ error: true });

    const { result } = setup();
    await act(() => result.current.login());

    expect(result.current.error).not.toBe(null);
    expect(result.current.loading).toBe(false);
  });
});

const mockUser = {
  id: "id",
  last_name: "last_name",
  first_name: "first_name",
  photo_100: "photo_100",
  is_allowed: true
};

function setup() {
  const store = configureStore({ reducer: authReducer });
  const history = createMemoryHistory();

  const utils = renderHook(() => useLogin(), {
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
