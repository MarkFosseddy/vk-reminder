import React from "react";
import { useHistory } from "react-router-dom";

import { StorageKeys } from "../../types";

import { VKLib } from "../../lib/vk";
import { routes } from "../../routing";

import { useStoreDispatch } from "../../store";
import { userSlice } from "../../store/slices/user";


export function useLogout() {
  const dispatch = useStoreDispatch();
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);

  async function logout() {
    setLoading(true);

    await VKLib.Auth.logout();

    localStorage.removeItem(StorageKeys.VK_ID);
    setLoading(false);

    dispatch(userSlice.actions.setUser(null));

    history.replace(routes.login);
  }

  return { logout, loading };
}
