import React from "react";
import { Provider } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { createReducer, createStore } from "@reduxjs/toolkit";

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { PrivateRoute } from "./private-route";

const Dashboard = () => <div>Dashboard Page</div>;
const Login = () => <div>Login Page</div>;

const noUserState = {
  user: {
    user: null
  }
};

const userState = {
  user: {
    user: {
      id: "test-id"
    }
  }
};

function renderRoutes(storeState: Record<string, unknown>, pushPath: string) {
  const history = createBrowserHistory();
  history.push(pushPath);

  return render(
    <Provider store={createStore(createReducer(storeState, {}), storeState)}>
      <Router history={history}>
        <Switch>
          <Route path="/login" component={Login} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
    </Provider>
  );
}

describe("PrivateRoute component", () => {
  it("should redirect to login", () => {
    renderRoutes(noUserState, "/dashboard");
    expect(screen.queryByText("Login Page")).toBeInTheDocument();
  });

  it("should render route", () => {
    renderRoutes(userState, "/dashboard");
    expect(screen.queryByText("Dashboard Page")).toBeInTheDocument();
  });
});
