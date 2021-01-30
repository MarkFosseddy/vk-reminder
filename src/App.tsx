import React from "react";
import { Route, Switch, Link, useHistory } from "react-router-dom";

import { VKLib } from "./lib/vk";

import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";

export function App() {
  const history = useHistory();

  React.useEffect(() => {
    (async () => {
      const res = await VKLib.Auth.getLoginStatus();
      console.log("GET STATUS LOGIN: ", res);

      if (!res.session) {
        history.push("/login");
        return;
      }

      history.push("/dashboard");
    })();
  }, []);

  return(
    <Switch>
      <Route exact path="/">
        <h1>Home</h1>
        <Link to="/login">Go to Login</Link>
      </Route>
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
    </Switch>
  );
}
