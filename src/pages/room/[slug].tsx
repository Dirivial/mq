import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import { type Question } from "@prisma/client";

import {
  SkipToNext,
  Play,
  Pause,
  AddSongsToQueue,
  ClearQueueFull,
  ConfigureMusicKit,
} from "~/utils/musicPlayer";
import Head from "next/head";
import Script from "next/script";

type SimpleQuestion = {
  name: string;
  songId: string;
  answers: Answer[];
};

type Answer = {
  text: string;
  correct: boolean;
};

interface UserJoin {
  name: string;
}

export default function Room() {
  const router = useRouter();
  const session = useSession();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [members, setMembers] = useState<string[]>([]);
  const [questions, setQuestions] = useState<SimpleQuestion[]>([]);

  const { data: questionData, isSuccess: gotQuestions } =
    api.question.getSomeQuestions.useQuery();

  const addMemberToList = (name: string) => {
    setMembers((prev) => [...prev, name]);
  };

  const sendStart = () => {
    if (!router.query.slug || router.query.slug.at(0) === "") return;
    fetch(
      "/api/room/" + (router.query.slug.toString() ?? "no-room") + "/start",
      {
        method: "POST",
        body: JSON.stringify({ questionIds: questionData?.map((q) => q.id) }),
      },
    )
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        console.log("fetched");
      });
  };

  const openRoom = () => {
    const p = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
    });

    const channel = p.subscribe("game@" + router.query.slug?.toString());
    channel.bind("join", function (data: UserJoin) {
      try {
        const name = data.name;
        if (name === undefined) {
          throw new Error("Player joined with undefined credentials");
        } else {
          console.log("Player joined with name " + name);
          addMemberToList(name);
        }
      } catch (e) {
        console.log(e);
      }
    });

    setPusher(p);
  };

  const getURL = () => {
    return env.NEXT_PUBLIC_URL + "/play/" + router.query.slug?.toString();
  };

  useEffect(() => {
    if (questionData) {
      setQuestions(PrepareForQuiz(questionData));
    }
  }, [questionData, gotQuestions]);

  const tryAuthorize = async () => {
    if (isAuthorized) return;
    await ConfigureMusicKit(env.NEXT_PUBLIC_APPLE_DEVELOPER_TOKEN)
      .catch((e) => console.log(e))
      .then((authorized) => {
        setIsAuthorized(authorized ?? false);
      });
  };

  return (
    <>
      <Head>
        <title>QuizRoom</title>
        <meta name="description" content="Quizrum" />
        <meta
          name="apple-music-developer-token"
          content={env.NEXT_PUBLIC_APPLE_DEVELOPER_TOKEN}
        />
        <meta name="apple-music-app-name" content="My Cool App" />
        <meta name="apple-music-app-build" content="1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        src="https://js-cdn.music.apple.com/musickit/v3/musickit.js"
        onLoad={() => void tryAuthorize()}
      />
      <div className="flex h-[100vh] flex-grow flex-col items-center">
        <main className="mx-auto my-auto flex h-[50vh] w-4/5 flex-col items-center justify-between">
          <h1 className="text-6xl font-extrabold tracking-tight text-base-content sm:text-[7rem]">
            Quizroom
          </h1>

          <div className="mb-4 flex flex-col gap-5 text-center">
            Room ID: {router.query.slug}
            {pusher != null ? (
              <div>
                <span>{pusher.connection.state}</span>
                <QRCode className="rounded-md bg-white p-2" value={getURL()} />
              </div>
            ) : (
              <button className="btn btn-primary btn-wide" onClick={openRoom}>
                Öppna Rum
              </button>
            )}
            <button
              className="btn btn-primary btn-wide mb-4"
              onClick={sendStart}
            >
              Starta
            </button>
          </div>

          <div className="">
            <div className="mb-4 grid grid-cols-1 grid-rows-2">
              <span className="loading loading-spinner loading-md m-auto"></span>
              <span>{members.length} spelare</span>
            </div>
            <div>
              <h2 className="text-center text-2xl font-bold">Spelare</h2>
              <ul className="text-base-content">
                {members.map((member, index) => (
                  <li key={index}>{member}</li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function PrepareForQuiz(questionData: Question[]): SimpleQuestion[] {
  const questions: SimpleQuestion[] = [];

  questionData.forEach((question) => {
    // Construct question object for this question
    const answers = question.falseAnswers.map((answer) => ({
      text: answer,
      correct: false,
    }));
    answers.splice(Math.floor(Math.random() * 4), 0, {
      text: question.answer,
      correct: true,
    });
    questions.push({
      name: question.text,
      songId: question.content,
      answers: answers,
    });
  });

  ClearQueueFull()
    .then(() => {
      console.log("Cleared queue");
      AddSongsToQueue(questions.map((question) => question.songId))
        .then(() => {
          console.log("Added songs to queue");
        })
        .catch(() => console.log("Error adding songs to queue"));
    })
    .catch(() => console.log("Error clearing queue"));
  return questions;
}
