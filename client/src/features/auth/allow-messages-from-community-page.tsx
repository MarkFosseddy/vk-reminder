import React from "react";
import { useHistory } from "react-router-dom";

import { VKLib, VKEvents } from "../../lib/vk";
import { routes } from "../../routing";

import { useStoreSelector } from "../../store";
import { userSelector } from "./auth-slice";

import { useLogout } from "./auth-hooks";

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

type Props = {
  onAllow?: (...args: unknown[]) => void,
  onDeny?: (...args: unknown[]) => void
}

function VKAllowMessagesFromCommunityWidget({
  onAllow = () => {},
  onDeny = () => {}
}: Props) {
  const CONTAINER_ID = "vk-allow-messages-from-community-container-id";

  React.useLayoutEffect(() => {
    VKLib.Widgets.AllowMessagesFromCommunity(CONTAINER_ID);
  }, []);

  React.useEffect(() => {
    VKLib.Observer.subscribe(VKEvents.COMMUNITY_MSG_ALLOWED, onAllow);
    VKLib.Observer.subscribe(VKEvents.COMMUNITY_MSG_DENIED, onDeny);

    return () => {
      VKLib.Observer.unsubscribe(VKEvents.COMMUNITY_MSG_ALLOWED, onAllow);
      VKLib.Observer.unsubscribe(VKEvents.COMMUNITY_MSG_DENIED, onDeny);
    };
  });

  return (
    <div id={CONTAINER_ID}></div>
  );
}
