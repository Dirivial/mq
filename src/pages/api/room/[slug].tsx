import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";
import { z } from "zod";
import { env } from "~/env.mjs";

type ResponseData = {
  message: string;
};

const UserJoinSchema = z.object({
  name: z.string(),
});

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: "eu",
  useTLS: true,
});

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { slug } = req.query; // contains the room ID
  //console.log(req.body);

  if (typeof req.body === "string") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const rawData = JSON.parse(req.body);
    const b = UserJoinSchema.parse(rawData);
    const name = b.name;

    pusher
      .trigger("game@" + slug?.toString(), "join", {
        name: name,
      })
      .catch((e) => {
        console.log(e);
      });
  }

  //console.log(req.query.body); // undefined

  // This works but it throws a lot of eslint errors
  /*
  try {
    const body: UserJoin = JSON.parse(req.body);
    if ("name" in body && typeof body.name === "string") {
      const name = body.name;

      pusher
        .trigger("users", "join", {
          message: typeof name === "string" ? name : "",
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      console.log("Invalid body");
      res.status(400).json({ message: "Invalid body" });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Invalid body" });
    return;
  }
  */

  res.status(200).json({ message: "Request fulfilled." });
}
