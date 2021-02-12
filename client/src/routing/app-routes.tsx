import React from "react";
import { Switch, Route } from "react-router-dom";

import { routes } from "./routes";

import { PrivateRoute } from "./private-route";

const HomePage = React.lazy(() =>
  import("../features/home").then(m => ({ default: m.HomePage }))
);
const Login = React.lazy(() => import("../pages/login"));
const Dashboard = React.lazy(() => import("../pages/dashboard"));
const AllowCommunityMessages = React.lazy(() => import("../pages/allow-community-messages"));
const NotFoundPage = React.lazy(() =>
  import("./not-found-page").then(m => ({ default: m.NotFoundPage }))
);

export function AppRoutes() {
  return (
    // @TODO: for now fallback is just blank screen
    <React.Suspense fallback={<div></div>}>
      <Switch>
        <Route exact path={routes.home} component={HomePage} />
        <Route path={routes.login} component={Login} />
        <PrivateRoute path={routes.allowCommunityMessages} component={AllowCommunityMessages} />
        <PrivateRoute path={routes.dashboard} component={Dashboard} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </React.Suspense>
  );
}
