import React from "react";
import { Link, useHistory } from "react-router-dom";

import { routes } from "../../routing";

import { useStoreDispatch } from "../../store";
import { logout } from "../../store/slices/user";

export default function Dashboard() {
  const dispatch = useStoreDispatch();
  const history = useHistory();

  return (
    <div>
      <h1>Dashboard Page</h1>

      <button onClick={() => dispatch(logout(history))}>
        Logout
      </button>
      <br />
      <Link to={routes.home}>Go back to Home</Link>
    </div>
  );
}
