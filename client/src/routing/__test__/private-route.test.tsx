import React from "react";
import { Provider } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import { configureStore, createReducer } from "@reduxjs/toolkit";

import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { PrivateRoute } from "../private-route";

describe("PrivateRoute Component", () => {
  it("should render route", async () => {
    renderRoutes(withUserState);
    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
  });

  it("should redirect to /login", async () => {
    renderRoutes(noUserState);
    expect(await screen.findByText(/login/i)).toBeInTheDocument();
    expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument();
  });
});

const withUserState = {
  user: {
    user: { id: "test-id" }
  }
};
const noUserState = {
  user: { user: null }
};

function renderRoutes(state: Record<string, unknown>) {
  const history = createMemoryHistory();
  const store = configureStore({ reducer: createReducer(state, {}) });

  history.push("/dashboard");

  return render(
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route path="/login">
            <div>Login Page</div>
          </Route>
          <PrivateRoute path="/dashboard">
            <div>Dashboard Page</div>
          </PrivateRoute>
        </Switch>
      </Router>
    </Provider>
  );
}
