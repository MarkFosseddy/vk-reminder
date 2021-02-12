import React from "react";
import { useHistory, useLocation } from "react-router-dom";

import { StorageKeys } from "../../types";
import { UserInfo } from "../../lib/vk/api";

import { API } from "../../api";
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

      const userInfoRes = await getUserInfo(userId);
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
          : routes.dashboard;

        historyRef.current.replace(redirectPath);
      } else {
        historyRef.current.replace(routes.allowMessagesFromCommunity);
      }
    })();
  }, [dispatch]);

  return { loading };
}

export function useLogin() {
  const dispatch = useStoreDispatch();
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function login() {
    const loginRes = await VKLib.Auth.login();
    if (!loginRes.session) return;

    setLoading(true);
    setError(null);

    const userInfoRes = await getUserInfo(loginRes.session.user.id);
    if (userInfoRes.error || !userInfoRes.data) {
      setError("Something went wrong :(");
      setLoading(false);
      return;
    }

    const { id, last_name, first_name, photo_100, is_allowed } = userInfoRes.data;

    dispatch(authActions.setUser({ id, last_name, first_name, photo_100 }));
    localStorage.setItem(StorageKeys.VK_ID, id);

    setLoading(false);

    if (is_allowed) {
      history.replace(routes.dashboard);
    } else {
      history.replace(routes.allowMessagesFromCommunity);
    }
  }

  return { loading, error, login };
}

export function useLogout() {
  const dispatch = useStoreDispatch();
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);

  async function logout() {
    setLoading(true);

    await VKLib.Auth.logout();

    localStorage.removeItem(StorageKeys.VK_ID);
    setLoading(false);

    dispatch(authActions.setUser(null));

    history.replace(routes.login);
  }

  return { logout, loading };
}

type Res = {
  data?: UserInfo & { is_allowed: boolean },
  error?: boolean
};

// @TODO: probably need to put this in API
async function getUserInfo(id: string): Promise<Res> {
  const userInfoRes = await VKLib.Api.getUserInfo(id);
  if (userInfoRes.error || !userInfoRes.response[0]) {
    return { error: true };
  }

  const user = userInfoRes.response[0];
  // @TODO: Proper naming
  const { data } = await API.user.isVKCommunityMessagesAllowed(user.id);
  if (data.error) {
    return { error: true };
  }

  return { data: { ...user, is_allowed: data.is_allowed } };
}
