import React from "react";
import { useHistory } from "react-router-dom";

import { VKLib, VKEvents } from "../../lib/vk";
import { routes } from "../../routing";

import { useStoreSelector } from "../../store";

import { useLogout } from "../../hooks/user";

const ALLOW_VK_COMMUNITY_MSG_CONTAINER_ID = "allow-vk-community-messages";

export default function AllowCommunityMessages() {
  const user = useStoreSelector(state => state.user);
  const { logout } = useLogout();

  useVKCommunityMessagesWidget(ALLOW_VK_COMMUNITY_MSG_CONTAINER_ID);
  useAllowVKCommunityMessagesSubscription();

  return (
    <div>
      <h1>Allow Messages</h1>

      <div>
        <img src={user?.photo_100} alt="user avatar"/>
        <p>{user?.first_name} {user?.last_name}</p>
      </div>

      <div id={ALLOW_VK_COMMUNITY_MSG_CONTAINER_ID}></div>

      <button onClick={logout}>
        Cancel
      </button>
    </div>
  );
}

function useVKCommunityMessagesWidget(elementId: string) {
  const id = React.useRef(elementId);

  React.useLayoutEffect(() => {
    VKLib.Widgets.AllowMessagesFromCommunity(id.current);
  }, []);
}

function useAllowVKCommunityMessagesSubscription() {
  const history = useHistory();

  React.useEffect(() => {
    VKLib.Observer.subscribe(VKEvents.COMMUNITY_MSG_ALLOWED, () => {
      history.replace(routes.dashboard);
    });

    return () => VKLib.Observer.unsubscribe(VKEvents.COMMUNITY_MSG_ALLOWED);
  });
}
