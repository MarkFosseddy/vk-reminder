import React from "react";
import { Switch, MemoryRouter, Route } from "react-router-dom";

import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { configureStore, createReducer } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import { NotFoundPage } from "../not-found-page";
import { routes } from "../routes";

describe("NotFoundPage Component", () => {
  it("should render Go to Dashboard link for logged in user", async () => {
    setup({ user: true });
    const link = await screen.findByRole("link");

    expect(link.textContent).toContain("Dashboard");
    expect(link).toHaveAttribute("href", routes.reminders);
  });

  it("should render Go to Home link if user not logged in", async () => {
    setup();
    const link = await screen.findByRole("link");

    expect(link.textContent).toContain("Home");
    expect(link).toHaveAttribute("href", routes.home);
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
      <MemoryRouter>
        <Switch>
          <Route path="*">
            <NotFoundPage />
          </Route>
        </Switch>
      </MemoryRouter>
    </Provider>
  );
}
