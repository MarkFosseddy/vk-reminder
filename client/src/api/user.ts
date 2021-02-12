import axios from "axios";

export async function isVKCommunityMessagesAllowed(userId: string) {
  try {
    const res = await axios.post("http://192.168.0.78:3000", { id: userId });
    return res;
  } catch (err) {
    return err.response;
  }
}
