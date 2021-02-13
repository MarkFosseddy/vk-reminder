import React from "react";
import * as Widgets from "./widgets";
import * as Observer from "./observer";

import { VKEvents } from "./index";

type Props = {
  onAllow: Observer.ObserverCallback
  onDeny?: Observer.ObserverCallback
}

export function VKAllowMessagesFromCommunityWidget({
  onAllow = () => {},
  onDeny = () => {}
}: Props) {
  const CONTAINER_ID = "vk-allow-msgs-container-id";

  React.useLayoutEffect(() => {
    Widgets.AllowMessagesFromCommunity(CONTAINER_ID);
  }, []);

  React.useEffect(() => {
    Observer.subscribe(VKEvents.COMMUNITY_MSG_ALLOWED, onAllow);
    Observer.subscribe(VKEvents.COMMUNITY_MSG_DENIED, onDeny);

    return () => {
      Observer.unsubscribe(VKEvents.COMMUNITY_MSG_ALLOWED, onAllow);
      Observer.unsubscribe(VKEvents.COMMUNITY_MSG_DENIED, onDeny);
    };
  });

  return (
    <div id={CONTAINER_ID}></div>
  );
}
