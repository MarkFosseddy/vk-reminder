import React from "react";
import { useHistory } from "react-router-dom";

import { VKLib } from "../../lib/vk";

import { useStoreSelector } from "../../store";

export default function AllowCommunityMessages() {
  const user = useStoreSelector(state => state.user.user);
  const history = useHistory();

  React.useLayoutEffect(() => {
    VKLib.Widgets.AllowMessagesFromCommunity("allow-messages", { height: 30 }, "202435034");
  }, []);

  React.useEffect(() => {
    VKLib.Observer.subscribe("widgets.allowMessagesFromCommunity.allowed", res => {
      console.log("OBSERVER ALLOWED RES: ", res);
      history.replace("/dashboard");
    });

    return () => {
      VKLib.Observer.unsubscribe("widgets.allowMessagesFromCommunity.allowed");
    };
  });

  return (
    <div>
      <h1>Allow Messages</h1>

      <div>
        <img src={user?.photo_100} alt="user avatar"/>
        <p>{user?.first_name} {user?.last_name}</p>
      </div>

      <div id="allow-messages"></div>
    </div>
  );
}
