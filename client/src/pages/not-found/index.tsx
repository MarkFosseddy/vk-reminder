import React from "react";
import { Link } from "react-router-dom";
import { routes } from "../../routing";

import { useStoreSelector } from "../../store";

export default function NotFound() {
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
