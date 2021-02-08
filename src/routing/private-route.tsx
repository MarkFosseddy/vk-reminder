import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

import { useStoreSelector } from "../store";

export function PrivateRoute(props: RouteProps) {
  const user = useStoreSelector(state => state.user.user);

  if (!user) {
    return (
      <Redirect to="/login" />
    );
  }

  return (
    <Route {...props} />
  );
}
