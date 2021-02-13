import axios from "axios";
import { VKLib } from "../vk";
import { UserInfo } from "../vk/api";

type R = {
  data?: {
    is_allowed: boolean
  },
  error?: any
}

// @TODO: typing
export async function isVKCommunityMessagesAllowed(userId: string): Promise<R> {
  try {
    const res = await axios.post("http://192.168.0.78:3000", { id: userId });
    return { data: res.data };
  } catch (err) {
    return { error: err };
  }
}

type Res = {
  data?: UserInfo & { is_allowed: boolean },
  error?: boolean
};

// @TODO: typing
export async function getInfo(id: string): Promise<Res> {
  const userInfoRes = await VKLib.Api.getUserInfo(id);
  if (userInfoRes.error || !userInfoRes.response[0]) {
    return { error: true };
  }

  const user = userInfoRes.response[0];
  const { data, error } = await isVKCommunityMessagesAllowed(user.id);

  if (error || !data) {
    return { error: true };
  }

  return { data: { ...data, ...user} };
}
