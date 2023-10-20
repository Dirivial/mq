import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";
import { env } from "~/env.mjs";

type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { slug } = req.query; // contains the room ID

  const pusher = new Pusher({
    appId: env.PUSHER_APP_ID,
    key: env.NEXT_PUBLIC_PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    cluster: "eu",
    useTLS: true,
  });

  console.log(req.body);

  pusher
    .trigger("join-room:" + slug?.toString(), "my-event", {
      message: "hello world from someone",
    })
    .catch((e) => {
      console.log(e);
    });

  res.status(200).json({ message: "Created a new pusher instance." });
}
