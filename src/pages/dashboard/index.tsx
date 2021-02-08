import React from "react";
import { Link, useHistory } from "react-router-dom";

import { useStoreDispatch, useStoreSelector } from "../../store";
import { logoutAction } from "../../store/slices/user";

export default function Dashboard() {
  const history = useHistory();
  const dispatch = useStoreDispatch();
  const user = useStoreSelector(state => state.user);

  console.log("CURR USER: ", user);

  return (
    <div>
      <h1>Dashboard Page</h1>

      <button onClick={() => dispatch(logoutAction(history))}>
        Logout
      </button>
      <br />
      <Link to="/">Go back to Home</Link>
    </div>
  );
}
