import React from "react";
import { useHistory } from "react-router-dom";

import { VKAllowMessagesFromCommunityWidget } from "../../lib/vk";
import { routes } from "../../routing";

import { useStoreSelector } from "../../store";
import { userSelector } from "./auth-slice";

import { useLogout } from "./use-logout";

export function AllowMessagesFromCommunityPage() {
  const user = useStoreSelector(userSelector);
  const history = useHistory();
  const { logout } = useLogout();

  return (
    <div>
      <h1>Allow Messages</h1>

      <div>
        <img src={user?.photo_100} alt="user avatar" />
        <p>{user?.first_name} {user?.last_name}</p>
      </div>

      <VKAllowMessagesFromCommunityWidget
        onAllow={() => history.replace(routes.dashboard)}
      />

      <button onClick={logout}>
        Cancel
      </button>
    </div>
  );
}
