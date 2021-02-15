import { useHistory } from "react-router-dom";

import { StorageKeys } from "../../types";

import { VKLib } from "../../lib/vk";
import { routes } from "../../routing";

import { useStoreDispatch } from "../../store";
import { authActions } from "./auth-slice";
import { useLoading } from "../shared";

export function useLogout() {
  const dispatch = useStoreDispatch();
  const history = useHistory();
  const { loading, setLoading } = useLoading();

  async function logout() {
    setLoading(true);

    await VKLib.Auth.logout();

    localStorage.removeItem(StorageKeys.VK_ID);
    setLoading(false);

    // @TODO: clear reminders
    dispatch(authActions.setUser(null));

    history.replace(routes.login);
  }

  return { logout, loading };
}
