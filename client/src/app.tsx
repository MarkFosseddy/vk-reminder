import React from "react";
import { useHistory, useLocation } from "react-router-dom";

import { useStoreDispatch, useStoreSelector } from "./store";
import { autoLogin } from "./store/slices/user";

import { AppRoutes } from "./routing/app-routes";

export function App() {
  const history = React.useRef(useHistory());
  const location = useLocation();
  const dispatch = useStoreDispatch();
  const autoLoginLoading = useStoreSelector(state => state.user.autoLoginLoading);

  const redirectPath = React.useRef(
    location.pathname !== "/"
      ? location.pathname
      : "/dashboard"
  );

  React.useEffect(() => {
    dispatch(autoLogin(history.current, redirectPath.current));
  }, [dispatch]);

  if (autoLoginLoading) {
    return (
      <div>LOADING... App.tsx</div>
    );
  }

  return (
    <AppRoutes />
  );
}
