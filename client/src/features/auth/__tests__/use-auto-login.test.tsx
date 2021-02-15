/* eslint-disable */
import React from "react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import { renderHook } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../auth-slice";
import { useAutoLogin } from "../use-auto-login";
import { Provider } from "react-redux";
import { VKLib } from "../../../lib/vk";
import { StorageKeys } from "../../../types";
import { API } from "../../../lib/api";
import { routes } from "../../../routing";

jest.mock("../../../lib/vk");
jest.mock("../../../lib/api");

describe("useAutoLogin Hook", () => {
  beforeEach(() => {
    (VKLib.Auth.getLoginStatus as jest.Mock).mockResolvedValue({ session: true });
    (API.user.getInfo as jest.Mock).mockResolvedValue({ data: mockUser });
    localStorage.setItem(StorageKeys.VK_ID, mockUser.id);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should make vk api request", async () => {
    const { waitForNextUpdate } = setup();
    await waitForNextUpdate();

    expect(VKLib.Auth.getLoginStatus).toHaveBeenCalledTimes(1);
  });

  it("should make api request", async () => {
    const { waitForNextUpdate } = setup();
    await waitForNextUpdate();

    expect(API.user.getInfo).toHaveBeenCalledTimes(1);
    expect(API.user.getInfo).toHaveBeenCalledWith(mockUser.id);
  });

  it("should set user to redux", async () => {
    const { store, waitForNextUpdate } = setup();
    await waitForNextUpdate();

    const { is_allowed, ...expectedUser } = mockUser;
    expect(store.getState().user).toStrictEqual(expectedUser);
  });

  it("should redirect to /allow-messages if messages are not allowed", async () => {
    (API.user.getInfo as jest.Mock).mockResolvedValue({ data: { ...mockUser, is_allowed: false } });

    const { history, waitForNextUpdate } = setup();
    await waitForNextUpdate();

    expect(history.location.pathname).toBe(routes.allowMessagesFromCommunity);
  });

  it("should redirect to /reminders if messages are allowed and url is home path", async () => {
    const { history, waitForNextUpdate } = setup();
    await waitForNextUpdate();

    expect(history.location.pathname).toBe(routes.reminders);
  });

  it("should redirect to path in url if messages are allowed and not home is not current path", async () => {
    const route = "/random-path";
    const { history, waitForNextUpdate } = setup(route);
    await waitForNextUpdate();

    expect(history.location.pathname).toBe(route);
  });

  it("should set loading during requests", async () => {
    const { result, waitFor } = setup();

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("should skip if no vk session", async () => {
    (VKLib.Auth.getLoginStatus as jest.Mock).mockResolvedValue({ session: false });
    const { result, waitForNextUpdate } = setup();
    await waitForNextUpdate();

    expect(VKLib.Auth.getLoginStatus).toHaveBeenCalledTimes(1);
    expect(API.user.getInfo).toHaveBeenCalledTimes(0);
    expect(result.current.loading).toBe(false);
  });

  it("should skip if no vk_id in localStorage", async () => {
    localStorage.removeItem(StorageKeys.VK_ID);

    const { result, waitForNextUpdate } = setup();
    await waitForNextUpdate();

    expect(VKLib.Auth.getLoginStatus).toHaveBeenCalledTimes(1);
    expect(API.user.getInfo).toHaveBeenCalledTimes(0);
    expect(result.current.loading).toBe(false);
  });

  it("should clear vk_id from localStorage and skip if api error", async () => {
    (API.user.getInfo as jest.Mock).mockResolvedValue({ error: true });
    const localStorageMock = jest.spyOn(Storage.prototype, "removeItem");

    const { result, waitForNextUpdate, store } = setup();
    await waitForNextUpdate();

    expect(localStorageMock).toHaveBeenCalledTimes(1);
    expect(localStorageMock).toHaveBeenCalledWith(StorageKeys.VK_ID);
    expect(result.current.loading).toBe(false);
    expect(store.getState().user).toBe(null);
  });
});

const mockUser = {
  id: "id",
  last_name: "last_name",
  first_name: "first_name",
  photo_100: "photo_100",
  is_allowed: true
};

function setup(route = "/") {
  const store = configureStore({ reducer: authReducer });
  const history = createMemoryHistory();

  if (route !== "/") history.push(route);

  const utils = renderHook(() => useAutoLogin(), {
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
