import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";
import { z } from "zod";
import { env } from "~/env.mjs";

type ResponseData = {
  message: string;
};

const UserJoinSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const UserScoreSchema = z.object({
  id: z.string(),
  score: z.number(),
});

const GameStartSchema = z.object({
  questionIds: z.number().array(),
});

const NewQuestionSchema = z.object({
  newQuestionIndex: z.number(),
});

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: "eu",
  useTLS: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { slug } = req.query; // contains the room ID
  //console.log(req.body);

  if (typeof req.body === "string") {
    try {
      const rawData = JSON.parse(req.body) as unknown;

      if (slug?.at(1) === "join") {
        const body = UserJoinSchema.parse(rawData);

        await pusher
          .trigger("game@" + slug?.at(0)?.toString().toUpperCase(), "join", {
            id: body.id,
            name: body.name,
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (slug?.at(1) === "start") {
        const body = GameStartSchema.parse(rawData);
        const questionIds = body.questionIds;

        await pusher
          .trigger("game@" + slug?.at(0)?.toString().toUpperCase(), "start", {
            questionIds: questionIds,
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (slug?.at(1) === "new-question") {
        const body = NewQuestionSchema.parse(rawData);
        const newQuestionIndex = body.newQuestionIndex;
        await pusher
          .trigger(
            "game@" + slug?.at(0)?.toString().toUpperCase(),
            "new-question",
            {
              newQuestionIndex: newQuestionIndex,
            },
          )
          .catch((e) => {
            console.log(e);
          });
      } else if (slug?.at(1) === "score") {
        const body = UserScoreSchema.parse(rawData);

        await pusher
          .trigger("game@" + slug?.at(0)?.toString().toUpperCase(), "score", {
            id: body.id,
            score: body.score,
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (slug?.at(1) === "end") {
        await pusher
          .trigger("game@" + slug?.at(0)?.toString().toUpperCase(), "end", {
            topThree: [],
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        console.log("No action given/unhandled action: " + slug?.at(1));
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Invalid body" });
      return;
    }
  } else {
    console.log("Invalid body");
    res.status(400).json({ message: "Invalid body" });
    return;
  }

  res.status(200).json({ message: "Request fulfilled." });
}
