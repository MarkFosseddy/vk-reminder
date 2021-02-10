import React from "react";

import { AppRoutes } from "./routing";

import { useAutoLogin } from "./hooks/user";

export function App() {
  const { loading } = useAutoLogin();

  if (loading) {
    return (
      <div>LOADING... App.tsx</div>
    );
  }

  return (
    <AppRoutes />
  );
}
