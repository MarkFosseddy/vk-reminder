import React from "react";
import { useHistory, useLocation } from "react-router-dom";

import { useStoreDispatch, useStoreSelector } from "./store";
import { persistLoginAction } from "./store/slices/user";

import { AppRoutes } from "./routing/app-routes";

export function App() {
  const history = React.useRef(useHistory());
  const location = useLocation();
  const dispatch = useStoreDispatch();
  const loading = useStoreSelector(state => state.user.initLoading);

  const redirectPath = React.useRef(
    location.pathname !== "/"
      ? location.pathname
      : "/dashboard"
  );

  React.useEffect(() => {
    dispatch(persistLoginAction(history.current, redirectPath.current));
  }, [dispatch]);

  if (loading) {
    return (
      <div>LOADING... App.tsx</div>
    );
  }

  return (
    <AppRoutes />
  );
}
