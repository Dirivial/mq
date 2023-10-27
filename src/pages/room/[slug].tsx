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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("waiting");
  const [counter, setCounter] = useState<number>(5);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>();

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
        setPhase("starting");
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

  const NextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      if (currentIndex === -1) {
        Play()
          .then(() => {
            setCurrentIndex((prev) => prev + 1);
            setCounter(0);
            setPhase("playing");
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        Pause();
        SkipToNext()
          .then(() => {
            setCurrentIndex((prev) => prev + 1);
            setCounter(0);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } else {
      setPhase("results");
    }
  };

  const getURL = () => {
    return env.NEXT_PUBLIC_URL + "/play/" + router.query.slug?.toString();
  };

  useEffect(() => {
    if (gotQuestions && questions.length === 0) {
      setQuestions(PrepareForQuiz(questionData));
    }
  }, [questionData, gotQuestions, questions]);

  const tryAuthorize = async () => {
    if (isAuthorized) return;
    await ConfigureMusicKit(env.NEXT_PUBLIC_APPLE_DEVELOPER_TOKEN)
      .catch((e) => console.log(e))
      .then((authorized) => {
        setIsAuthorized(authorized ?? false);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (phase === "playing" && counter > 30) {
        console.log("Time passed");
        setCounter(0);
        const nextQuestionIndex = currentIndex + 1;

        if (nextQuestionIndex < 5) {
          setCurrentIndex(nextQuestionIndex);
        } else {
          setPhase("results");
        }
      } else if (phase === "starting" && counter > 5) {
        setPhase("playing");
        setCounter(0);
      } else {
        setCounter((counter) => counter + 0.1);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [currentIndex, counter, phase]);

  useEffect(() => {
    if (phase === "playing") {
      if (currentIndex === 0) {
        Play()
          .then(() => {
            setCounter(0);
            //setShowQuestion(true);
          })
          .catch(() => {
            console.log("Error playing");
          });
      } else {
        SkipToNext()
          .then(() => {
            console.log("Skipped to next song");
            setCounter(0);
            //setShowQuestion(true);
          })
          .catch(() => console.log("Error skipping to next song"));
      }
    } else if (phase === "results") {
      Pause();
      void ClearQueueFull();
    }
  }, [currentIndex, phase]);

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
          <h3>{phase}</h3>

          {phase === "playing" && (
            <>
              <ShowCurrentQuestion
                question={
                  questions.at(currentIndex) ?? {
                    name: "",
                    songId: "",
                    answers: [],
                  }
                }
                time={counter}
                currentIndex={currentIndex}
                done={NextQuestion}
              />
            </>
          )}

          {phase === "starting" && (
            <>
              <ShowQuizStarting time={counter} />
            </>
          )}

          {phase === "waiting" && (
            <>
              <div className="mb-4 flex flex-col gap-5 text-center">
                Room ID: {router.query.slug}
                {pusher != null ? (
                  <div>
                    <span>{pusher.connection.state}</span>
                    <QRCode
                      className="rounded-md bg-white p-2"
                      value={getURL()}
                    />
                  </div>
                ) : (
                  <button
                    className="btn btn-primary btn-wide"
                    onClick={openRoom}
                  >
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
            </>
          )}
        </main>
      </div>
    </>
  );
}

interface CurrentQuestionInterface {
  question: SimpleQuestion;
  time: number;
  currentIndex: number;
  done: () => void;
}

function ShowCurrentQuestion(props: CurrentQuestionInterface) {
  return (
    <div>
      <h1 className="text-2xl font-bold ">{props.question.name}</h1>
      <div className="mt-10 grid grid-cols-2 gap-2">
        {props.question.answers.map((answer, index) => (
          <button
            className="btn btn-accent btn-outline h-24 text-lg"
            key={index}
          >
            <h3>{answer.text}</h3>
          </button>
        ))}
      </div>
      <div className="flex flex-col p-10">
        <progress
          className="progress mx-auto w-96"
          value={props.time}
          max="30"
        ></progress>
        <h3 className="text-xl font-bold ">{props.currentIndex + 1}/5</h3>
      </div>
    </div>
  );
}

interface QuizStartingInterface {
  time: number;
}

function ShowQuizStarting(props: QuizStartingInterface) {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold">Quizet börjar om</h1>
      <h2 className="text-2xl font-bold">{props.time}</h2>
    </div>
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
