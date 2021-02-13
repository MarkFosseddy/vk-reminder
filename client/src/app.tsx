import React from "react";

import { AppRoutes } from "./routing";

import { useAutoLogin } from "./features/auth";

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
