import React from "react";
import { Link, useHistory } from "react-router-dom";

import { VKLib } from "../lib/vk";

type Props = {};

export function Dashboard({}: Props) {
  const history = useHistory();

  return(
    <div>
      <h1>Dashboard Page</h1>

      <button onClick={async () => {
        const res = await VKLib.Auth.logout();
        console.log("LOGOUT: ", res);
        history.push("/");
      }}>
        Logout
      </button>
      <br />
      <Link to="/">Go back to Home</Link>
    </div>
  );
}
