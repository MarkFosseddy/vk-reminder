import React from "react";
import { Link, useHistory } from "react-router-dom";

import { VKLib } from "../../lib/vk";
import { useStoreSelector } from "../../store";

type Props = {};

export default function Dashboard({}: Props) {
  const history = useHistory();
  const user = useStoreSelector(state => state.user);

  console.log("CURR USER: ", user);

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
