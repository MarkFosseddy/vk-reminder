import * as Auth from "./auth";
import * as Api from "./api";
import * as Observer from "./observer";
import * as Widgets from "./widgets";

export * from "./widgets-react";

export const VKLib = {
  Auth,
  Api,
  Widgets,
  Observer
};

export enum VKEvents {
  COMMUNITY_MSG_ALLOWED = "widgets.allowMessagesFromCommunity.allowed",
  COMMUNITY_MSG_DENIED = "widgets.allowMessagesFromCommunity.denied"
}
