import React from "react";
import { Link } from "react-router-dom";
import { routes } from "./routes";

import { useStoreSelector } from "../store";
import { userSelector } from "../features/auth";

export function NotFoundPage() {
  const user = useStoreSelector(userSelector);

  return (
    <div>
      <h1>404 Not Found :(</h1>
      <Link to={user ? routes.reminders : routes.home}>
        {user ? "Go to Dashboard" : "Go to Home"}
      </Link>
    </div>
  );
}
