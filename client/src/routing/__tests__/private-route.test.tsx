import React from "react";
import { Switch, MemoryRouter, Route } from "react-router-dom";

import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { configureStore, createReducer } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import { PrivateRoute } from "../private-route";
import { routes } from "../routes";

describe("PrivateRoute Component", () => {
  it("should render private route", async () => {
    setup({ user: true });
    expect(await screen.findByText(/reminders page/i)).toBeInTheDocument();
  });

  it("should redirect to /login page", async () => {
    setup();
    expect(await screen.findByText(/login page/i)).toBeInTheDocument();
  });
});

function setup(user: { user: null | boolean } = { user: null }) {
  const store = configureStore({
    reducer: createReducer({
      auth: user
    }, {})
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[routes.reminders]}>
        <Switch>
          <Route path={routes.login}>
            <h1>Login Page</h1>
          </Route>
          <PrivateRoute path={routes.reminders}>
            <h1>Reminders Page</h1>
          </PrivateRoute>
        </Switch>
      </MemoryRouter>
    </Provider>
  );
}
