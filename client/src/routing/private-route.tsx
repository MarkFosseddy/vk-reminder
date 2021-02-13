import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

import { routes } from "./routes";

import { useStoreSelector } from "../store";
import { userSelector } from "../features/auth";

export function PrivateRoute(props: RouteProps) {
  const user = useStoreSelector(userSelector);

  if (!user) {
    return (
      <Redirect to={routes.login} />
    );
  }

  return (
    <Route {...props} />
  );
}
