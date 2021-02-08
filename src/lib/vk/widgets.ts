// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const VK: any;

const GROUP_ID = "202435034";

export function AllowMessagesFromCommunity(elementId: string, height = 30) {
  VK.Widgets.AllowMessagesFromCommunity(elementId, { height }, GROUP_ID);
}
