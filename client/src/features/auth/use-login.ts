import React from "react";
import { useHistory } from "react-router-dom";

import { StorageKeys } from "../../types";

import { API } from "../../lib/api";
import { VKLib } from "../../lib/vk";
import { routes } from "../../routing";

import { useStoreDispatch } from "../../store";
import { authActions } from "./auth-slice";

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

    const userInfoRes = await API.user.getInfo(loginRes.session.user.id);
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
      history.replace(routes.reminders);
    } else {
      history.replace(routes.allowMessagesFromCommunity);
    }
  }

  return { loading, error, login };
}
