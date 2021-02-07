import React from "react";
import { useHistory } from "react-router-dom";

import { VKLib } from "../../lib/vk";

import { useStoreDispatch } from "../../store";
import { userSlice } from "../../store/slices/user";

import { Storage } from "../../types";

type Props = {};

export default function Login({}: Props) {
  const history = useHistory();
  const dispatch = useStoreDispatch();

  return(
    <div>
      <h1>Login Page</h1>
      <button onClick={async () => {
        const res = await VKLib.Auth.login();
        console.log("LOGIN: ", res);
        if (res.session) {
          const res2 = await VKLib.Api.getUserInfo(res.session.user.id);

          if (res2.error) return;
          if (!res2.response[0]) return;

          const { id, first_name, last_name, photo_100 } = res2.response[0];
          localStorage.setItem(Storage.VK_ID, id);
          dispatch(userSlice.actions.setUser({
            id,
            first_name,
            last_name,
            photo_100
          }));

          history.push("/dashboard");
        }
      }}>
        VK Auth
      </button>
    </div>
  );
}
