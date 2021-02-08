import React from "react";
import { Switch, Route } from "react-router-dom";
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
        <Route exact path="/" component={Home} />

        <Route exact path="/login" component={Login} />
        <PrivateRoute path="/allow-community-messages" component={AllowCommunityMessages} />

        <PrivateRoute path="/dashboard" component={Dashboard} />
        <Route path="*">
          <div>404 Not Found :(</div>
        </Route>
      </Switch>
    </React.Suspense>
  );
}
