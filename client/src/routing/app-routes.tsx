import React from "react";
import { Switch, Route } from "react-router-dom";

import { routes } from "./routes";

import { PrivateRoute } from "./private-route";

const HomePage = React.lazy(() => import("../features/home").then(m => ({ default: m.HomePage })));
const LoginPage = React.lazy(() => import("../features/auth").then(m => ({ default: m.LoginPage })));
const AllowMessagesFromCommunityPage = React.lazy(() => import("../features/auth").then(m => ({ default: m.AllowMessagesFromCommunityPage })));
const RemindersPage = React.lazy(() => import("../features/reminders").then(m => ({ default: m.RemindersPage })));
const NotFoundPage = React.lazy(() => import("./not-found-page").then(m => ({ default: m.NotFoundPage })));

export function AppRoutes() {
  return (
    // @TODO: for now fallback is just blank screen
    <React.Suspense fallback={<div></div>}>
      <Switch>
        <Route exact path={routes.home} component={HomePage} />

        <Route path={routes.login} component={LoginPage} />
        <PrivateRoute path={routes.allowMessagesFromCommunity} component={AllowMessagesFromCommunityPage} />

        <PrivateRoute path={routes.reminders} component={RemindersPage} />

        <Route path="*" component={NotFoundPage} />
      </Switch>
    </React.Suspense>
  );
}
