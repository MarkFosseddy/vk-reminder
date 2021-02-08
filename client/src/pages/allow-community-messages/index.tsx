import React from "react";
import { useHistory } from "react-router-dom";

import { VKLib, VKEvents } from "../../lib/vk";
import { routes } from "../../routing/routes";

import { useStoreDispatch, useStoreSelector } from "../../store";
import { logout } from "../../store/slices/user";

const ALLOW_MSG_CONTAINER_ID = "allow-messages";

export default function AllowCommunityMessages() {
  const history = useHistory();
  const dispatch = useStoreDispatch();
  const user = useStoreSelector(state => state.user.user);

  React.useLayoutEffect(() => {
    VKLib.Widgets.AllowMessagesFromCommunity(ALLOW_MSG_CONTAINER_ID);
  }, []);

  React.useEffect(() => {
    VKLib.Observer.subscribe(VKEvents.COMMUNITY_MSG_ALLOWED, () => {
      history.replace(routes.dashboard);
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

      <button onClick={() => dispatch(logout(history))}>
        Cancel
      </button>
    </div>
  );
}
