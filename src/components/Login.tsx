import React from "react";
import { useHistory } from "react-router-dom";

import { VKLib } from "../lib/vk";

type Props = {};

export function Login({}: Props) {
  const history = useHistory();

  return(
    <div>
      <h1>Login Page</h1>
      <button onClick={async () => {
        const res = await VKLib.Auth.login();
        console.log("LOGIN: ", res);
        if (res.session) {
          history.push("/dashboard");
        }
      }}>
        VK Auth
      </button>
    </div>
  );
}
