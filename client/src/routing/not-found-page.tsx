import React from "react";
import { Link } from "react-router-dom";
import { routes } from "./routes";

import { useStoreSelector } from "../store";

export function NotFoundPage() {
  const user = useStoreSelector(state => state.user);

  return (
    <div>
      <h1>404 Not Found :(</h1>
      <Link to={user ? routes.dashboard : routes.home}>
        {user ? "Go to Dashboard" : "Go to Home"}
      </Link>
    </div>
  );
}
