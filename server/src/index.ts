import axios from "axios";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

type Body = { id: string };

app.post("/", async (req, res) => {
  const { id } = req.body as Body;
  if (!id) return res.status(400).json({ error: "No user id" });

  const { data } = await axios.get(`https://api.vk.com/method/messages.isMessagesFromGroupAllowed?group_id=202435034&user_id=${id}&access_token=b76546debb5b7eaaf6ddf1c2839643aff090862728efe09743f2733033b5f40ad5e8d9d5d5753523bbda6&v=5.126`);

  const is_allowed = !!data.response.is_allowed;

  return res.status(200).json({ is_allowed });
});

app.listen(3000, () => console.log("Server is listening on port 3000"));
