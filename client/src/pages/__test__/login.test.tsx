import React from "react";
import { configureStore, createReducer } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { createMemoryHistory} from "history";

import { screen, render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import Login from "../login";
import { login } from "../../store/slices/user";

describe("Login Component", () => {
  it("should render loading state", async () => {
    renderWithRedux(loadingState);
    expect(await screen.findByText(/loading.../i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /vk auth/i })).not.toBeInTheDocument();
  });

  it("should render error state", async () => {
    renderWithRedux(errorState);
    expect(await screen.findByText(errorState.user.error)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /vk auth/i })).not.toBeInTheDocument();
  });

  it("should dispatch login action on button click", async () => {
    const { store } = renderWithRedux(normalState);

    fireEvent.click(await screen.findByRole("button", { name: /vk auth/i }));

    const calledAction = (store.dispatch as jest.Mock).mock.calls[0][0].toString();
    const loginAction = login(createMemoryHistory()).toString();

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(calledAction).toBe(loginAction);

    jest.clearAllMocks();
  });
});

const loadingState = {
  user: { loading: true }
};

const errorState = {
  user: { error: "Error message" }
};

const normalState = {
  user: {
    loading: false,
    error: null
  }
};

function renderWithRedux(state: Record<string, unknown>) {
  const store = configureStore({ reducer: createReducer(state, {}) });
  store.dispatch = jest.fn();

  const utils = render(
    <Provider store={store}>
      <Login />
    </Provider>
  );

  return { store, ...utils };
}
