import React from "react";
import { useHistory, useLocation } from "react-router-dom";

import { StorageKeys } from "../../types";

import { API } from "../../lib/api";
import { VKLib } from "../../lib/vk";
import { routes } from "../../routing";

import { useStoreDispatch } from "../../store";
import { authActions } from "./auth-slice";

export function useAutoLogin() {
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

      const userInfoRes = await API.user.getInfo(userId);
      if (userInfoRes.error || !userInfoRes.data) {
        localStorage.removeItem(StorageKeys.VK_ID);
        setLoading(false);
        return;
      }

      const { id, last_name, first_name, photo_100, is_allowed } = userInfoRes.data;

      dispatch(authActions.setUser({ id, last_name, first_name, photo_100 }));

      setLoading(false);

      if (is_allowed) {
        const redirectPath = locationRef.current.pathname !== routes.home
          ? locationRef.current.pathname
          : routes.reminders;

        historyRef.current.replace(redirectPath);
      } else {
        historyRef.current.replace(routes.allowMessagesFromCommunity);
      }
    })();
  }, [dispatch]);

  return { loading };
}
