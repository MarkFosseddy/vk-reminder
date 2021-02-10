import React from "react";
import { Link } from "react-router-dom";

import { routes } from "../../routing";

import { useLogout } from "../../hooks/user";

export default function Dashboard() {
  const { logout } = useLogout();

  return (
    <div>
      <h1>Dashboard Page</h1>

      <button onClick={logout}>
        Logout
      </button>

      <br />

      <Link to={routes.home}>Go back to Home</Link>
    </div>
  );
}
