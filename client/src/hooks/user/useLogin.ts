import React from "react";
import { useHistory } from "react-router-dom";

import { StorageKeys } from "../../types";

import { VKLib } from "../../lib/vk";
import { API } from "../../api";
import { routes } from "../../routing";

import { useStoreDispatch } from "../../store";
import { userSlice } from "../../store/slices/user";

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

    const userInfoRes = await VKLib.Api.getUserInfo(loginRes.session.user.id);
    if (userInfoRes.error || !userInfoRes.response[0]) {
      setError("Something went wrong :(");
      setLoading(false);
      return;
    }

    const { id, last_name, first_name, photo_100 } = userInfoRes.response[0];
    const { data } = await API.user.isVKCommunityMessagesAllowed(id);
    if (data.error) {
      setError("Something went wrong :(");
      setLoading(false);
      return;
    }

    dispatch(userSlice.actions.setUser({ id, last_name, first_name, photo_100 }));
    localStorage.setItem(StorageKeys.VK_ID, id);

    setLoading(false);

    if (data.is_allowed) {
      history.replace(routes.dashboard);
    } else {
      history.replace(routes.allowCommunityMessages);
    }
  }

  return { loading, error, login };
}
