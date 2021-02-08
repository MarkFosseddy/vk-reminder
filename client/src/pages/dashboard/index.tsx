import React from "react";
import { Link, useHistory } from "react-router-dom";

import { useStoreDispatch } from "../../store";
import { logout } from "../../store/slices/user";

export default function Dashboard() {
  const history = useHistory();
  const dispatch = useStoreDispatch();

  return (
    <div>
      <h1>Dashboard Page</h1>

      <button onClick={() => dispatch(logout(history))}>
        Logout
      </button>
      <br />
      <Link to="/">Go back to Home</Link>
    </div>
  );
}
