import React from "react";
import { useLocation } from "react-router-dom";

import { routes, AppRoutes } from "./routing";

import { useStoreDispatch, useStoreSelector } from "./store";
import { autoLogin } from "./store/slices/user";

export function App() {
  const location = useLocation();
  const dispatch = useStoreDispatch();
  const autoLoginLoading = useStoreSelector(state => state.user.autoLoginLoading);

  const redirectPath = React.useRef(
    location.pathname !== routes.home
      ? location.pathname
      : routes.dashboard
  );

  React.useEffect(() => {
    dispatch(autoLogin(redirectPath.current));
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
