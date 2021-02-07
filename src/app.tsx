import React from "react";
import { useHistory } from "react-router-dom";

import { VKLib } from "./lib/vk";

import { useStoreDispatch } from "./store";
import { userSlice } from "./store/slices/user";

import { AppRoutes } from "./routing/app-routes";
import { Storage } from "./types";

export function App() {
  const history = useHistory();
  const dispatch = useStoreDispatch();

  React.useEffect(() => {
    (async () => {
      const res = await VKLib.Auth.getLoginStatus();
      const vkId = localStorage.getItem(Storage.VK_ID);
      console.log("GET STATUS LOGIN: ", res);
      console.log("VK ID: ", vkId);

      if (res.session && vkId) {
        const res2 = await VKLib.Api.getUserInfo(vkId);
        console.log("USER INFO: ", res2);

        if (res2.error) return;
        if (!res2.response[0]) return;

        const { id, first_name, last_name, photo_100 } = res2.response[0];
        dispatch(userSlice.actions.setUser({
          id,
          first_name,
          last_name,
          photo_100
        }));

        if (location.pathname !== "/") {
          history.replace(location.pathname);
        } else {
          history.replace("/dashboard");
        }
      }
    })();
  }, []);

  return(
    <AppRoutes />
  );
}
