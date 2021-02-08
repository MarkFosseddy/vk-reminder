import React from "react";
import { useHistory } from "react-router-dom";

import { VKLib, VKEvents } from "../../lib/vk";

import { useStoreSelector } from "../../store";

const ALLOW_MSG_CONTAINER_ID = "allow-messages";

export default function AllowCommunityMessages() {
  const user = useStoreSelector(state => state.user.user);
  const history = useHistory();

  React.useLayoutEffect(() => {
    VKLib.Widgets.AllowMessagesFromCommunity(ALLOW_MSG_CONTAINER_ID);
  }, []);

  React.useEffect(() => {
    VKLib.Observer.subscribe(VKEvents.COMMUNITY_MSG_ALLOWED, () => {
      history.replace("/dashboard");
    });

    return () => VKLib.Observer.unsubscribe(VKEvents.COMMUNITY_MSG_ALLOWED);
  });

  return (
    <div>
      <h1>Allow Messages</h1>

      <div>
        <img src={user?.photo_100} alt="user avatar"/>
        <p>{user?.first_name} {user?.last_name}</p>
      </div>

      <div id={ALLOW_MSG_CONTAINER_ID}></div>
    </div>
  );
}