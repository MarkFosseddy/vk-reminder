import React from "react";
import { useHistory, useLocation } from "react-router-dom";

import { useStoreDispatch, useStoreSelector } from "./store";
import { persistLoginAction } from "./store/slices/user";

import { AppRoutes } from "./routing/app-routes";

export function App() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useStoreDispatch();
  const loading = useStoreSelector(state => state.user.initLoading);

  React.useEffect(() => {
    const redirectPath = location.pathname !== "/"
      ? location.pathname
      : "/dashboard";

    dispatch(persistLoginAction(history, redirectPath));
  }, []);

  if (loading) {
    return(
      <div>LOADING... App.tsx</div>
    );
  }

  return(
    <AppRoutes />
  );
}
