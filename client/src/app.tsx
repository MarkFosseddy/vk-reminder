import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";

import { StorageKeys } from "./types";

import { VKLib } from "./lib/vk";
import { routes, AppRoutes } from "./routing";

import { useStoreDispatch } from "./store";
import { userSlice } from "./store/slices/user";

export function App() {
  const { loading } = useAutoLogin();

  if (loading) {
    return (
      <div>LOADING... App.tsx</div>
    );
  }

  return (
    <AppRoutes />
  );
}

function useAutoLogin() {
  const dispatch = useStoreDispatch();
  const historyRef = React.useRef(useHistory());
  const locationRef = React.useRef(useLocation());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const loginStatusRes = await VKLib.Auth.getLoginStatus();
      const userId = localStorage.getItem(StorageKeys.VK_ID);
      if (!loginStatusRes.session || !userId) {
        setLoading(false);
        return;
      }

      const userInfoRes = await VKLib.Api.getUserInfo(userId);
      if (userInfoRes.error || !userInfoRes.response[0]) {
        localStorage.removeItem(StorageKeys.VK_ID);
        setLoading(false);
        return;
      }

      const { id, last_name, first_name, photo_100 } = userInfoRes.response[0];
      // @TODO: Proper naming
      const { data } = await axios.post("http://192.168.0.78:3000", { id });

      dispatch(userSlice.actions.setUser({ id, last_name, first_name, photo_100 }));

      setLoading(false);

      if (data.is_allowed) {
        const redirectPath = locationRef.current.pathname !== routes.home
          ? locationRef.current.pathname
          : routes.dashboard;
        historyRef.current.replace(redirectPath);
      } else {
        historyRef.current.replace(routes.allowCommunityMessages);
      }
    })();
  }, [dispatch]);

  return { loading };
}
