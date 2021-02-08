import React from "react";
import { Switch, Route } from "react-router-dom";

import { routes } from "./routes";

import { PrivateRoute } from "./private-route";
const Home = React.lazy(() => import("../pages/home"));
const Login = React.lazy(() => import("../pages/login"));
const Dashboard = React.lazy(() => import("../pages/dashboard"));
const AllowCommunityMessages = React.lazy(() => import("../pages/allow-community-messages"));

export function AppRoutes() {
  return (
    // for now fallback is just blank screen
    <React.Suspense fallback={<div></div>}>
      <Switch>
        <Route exact path={routes.home} component={Home} />

        <Route exact path={routes.login} component={Login} />
        <PrivateRoute path={routes.allowCommunityMessages} component={AllowCommunityMessages} />

        <PrivateRoute path={routes.dashboard} component={Dashboard} />
        <Route path="*">
          <div>404 Not Found :(</div>
        </Route>
      </Switch>
    </React.Suspense>
  );
}
