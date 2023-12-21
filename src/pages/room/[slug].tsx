import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import { type Question } from "@prisma/client";
import FloatingShapes from "~/components/animations/floatingShapes";
import ShowCurrentQuestion from "~/components/quiz/quizdisplay/ShowCurrentQuestion";
//import { SimpleQuestion } from "~/utils/types";

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
import { useSearchParams } from "next/navigation";

type SimpleQuestion = {
  id: number;
  name: string;
  songId: string;
  answers: Answer[];
};

type Answer = {
  text: string;
  correct: boolean;
};

type Player = {
  id: string;
  name: string;
  score: number;
};

interface UserJoin {
  id: string;
  name: string;
}

export default function Room() {
  const router = useRouter();
  const session = useSession();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [members, setMembers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<SimpleQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("waiting");
  const [counter, setCounter] = useState<number>(5);
  const [showQuestion, setShowQuestion] = useState(false);
  const searchParams = useSearchParams();

  const { data: quizData, isSuccess: gotQuiz } = api.quiz.getQuiz.useQuery(
    {
      id: Number(searchParams.get("qid") ?? 1),
    },
    {
      enabled: questions.length === 0,
    },
  );

  const addMemberToList = (id: string, name: string) => {
    setMembers((prev) => [...prev, { id: id, name: name, score: 0 }]);
  };

  const getTopPlayers = () => {
    if (members.length > 3) {
      return members.sort((a, b) => b.score - a.score).slice(0, 3);
    }
    return members.sort((a, b) => b.score - a.score);
  };

  const sendStart = () => {
    if (!router.query.slug || router.query.slug.at(0) === "") return;
    console.log(
      "Sending start",
      questions.map((q) => q.id),
    );
    fetch(
      "/api/room/" +
        (router.query.slug.toString().toUpperCase() ?? "no-room") +
        "/start",
      {
        method: "POST",
        body: JSON.stringify({ questionIds: questions.map((q) => q.id) }),
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
        setCounter(0);
        setPhase("starting");
      });
  };

  const openRoom = () => {
    const p = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
    });

    const channel = p.subscribe(
      "game@" + router.query.slug?.toString().toUpperCase(),
    );

    // Listen for join events
    channel.bind("join", function (data: UserJoin) {
      try {
        const name = data.name;
        const id = data.id;
        if (name === undefined || id === undefined) {
          throw new Error("Player joined with undefined credentials");
        } else {
          console.log("Player joined with name " + name);
          addMemberToList(id, name);
        }
      } catch (e) {
        console.log(e);
      }
    });

    // Listen for score events
    channel.bind("score", function (data: { id: string; score: number }) {
      try {
        const id = data.id;
        const score = data.score;
        if (id === undefined || score === undefined) {
          throw new Error("Player scored with undefined credentials");
        } else {
          setMembers((prev) =>
            prev.map((p) => {
              if (p.id === id) {
                return { ...p, score: score };
              } else {
                return p;
              }
            }),
          );
        }
      } catch (e) {
        console.log(e);
      }
    });

    setPusher(p);
  };

  const getURL = () => {
    return (
      env.NEXT_PUBLIC_URL +
      "/play/" +
      router.query.slug?.toString().toUpperCase()
    );
  };

  useEffect(() => {
    if (gotQuiz && quizData?.questions && questions.length === 0) {
      setQuestions(PrepareForQuiz(quizData.questions, quizData.questionsOrder));
    }
  }, [gotQuiz, quizData, questions]);

  // Music kit authorization
  const tryAuthorize = async () => {
    if (isAuthorized) return;
    await ConfigureMusicKit(env.NEXT_PUBLIC_APPLE_DEVELOPER_TOKEN)
      .catch((e) => console.log(e))
      .then((authorized) => {
        setIsAuthorized(authorized ?? false);
      });
  };

  useEffect(() => {
    const openRoomAutomatically = () => {
      const p = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: "eu",
      });

      const channel = p.subscribe(
        "game@" + router.query.slug?.toString().toUpperCase(),
      );

      // Bind to Pusher events (join, score, etc.)
      channel.bind("join", function (_data: UserJoin) {
        // ... existing join logic
      });
      channel.bind("score", function (_data: { id: string; score: number }) {
        // ... existing score logic
      });

      setPusher(p);
    };

    if (router.query.slug) {
      openRoomAutomatically();
    }
  }, [router.query.slug]);


  useEffect(() => {
    const sendNext = (nextQuestionIndex: number) => {
      if (!router.query.slug || router.query.slug.at(0) === "") return;
      GenericBroadcast(
        router.query.slug.toString().toUpperCase() ?? "no-room",
        "new-question",
        {
          newQuestionIndex: nextQuestionIndex,
        },
      );
    };

    

    // TODO: Implement this
    const handleGameEnd = () => {
      if (!router.query.slug || router.query.slug.at(0) === "") return;
      GenericBroadcast(
        router.query.slug.toString().toUpperCase() ?? "no-room",
        "end",
        {
          topThree: [],
        },
      );
      setPhase("results");
      Pause();
      void ClearQueueFull();
    };

    const interval = setInterval(() => {
      if (phase === "playing" && counter > 30) {
        // Go to next question, or end the game
        setCounter(0);
        const nextQuestionIndex = currentIndex + 1;

        if (nextQuestionIndex < 5) {
          setCurrentIndex(nextQuestionIndex);
          sendNext(nextQuestionIndex);
          setShowQuestion(false);
          SkipToNext()
            .then(() => {
              console.log("Skipped to next song");
              setCounter(0);
              setShowQuestion(true);
            })
            .catch(() => console.log("Error skipping to next song"));
        } else {
          handleGameEnd();
        }
      } else if (phase === "starting" && counter > 5) {
        setPhase("playing");
        Play()
          .then(() => {
            setCounter(0);
            sendNext(0);
            setShowQuestion(true);
          })
          .catch(() => {
            console.log("Error playing");
          });
      } else {
        setCounter((counter) => counter + 0.1);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [currentIndex, counter, phase, router.query.slug]);

  
  const members_display = [
    { name: 'Diana Jones' },
    { name: 'Bob Brown' },
    { name: 'Charlie Smith' },
    { name: 'Diana Smith' },
    { name: 'Bob Johnson' },
    { name: 'Bob Johnson' },
    { name: 'Alice Johnson' }
  ];

  
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
      <FloatingShapes />
      <div className="flex flex-1 flex-col items-center z-10 ">
        <main className="mx-auto my-auto flex h-[50vh] w-[90vw] flex-col items-center justify-center card">
          {phase === "results" && (
            <div className="my-12 flex h-full flex-col justify-start">
              <h1 className="mb-12 text-center text-6xl font-extrabold tracking-tight text-base-content sm:text-[7rem]">
                Bra Spelat!
              </h1>
              <h2 className="text-center text-xl font-extrabold tracking-tight text-base-content sm:text-[2rem]">
                Här kommer resultaten
              </h2>
              <ul>
                {getTopPlayers().map((user, index) => (
                  <li
                    key={index}
                    className="text-center text-xl font-extrabold tracking-tight text-base-content sm:text-[2rem]"
                  >
                    {user.name} - {user.score}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {phase === "playing" && (
              <div className="flex flex-grow w-full">
              <ShowCurrentQuestion
                question={
                  questions.at(currentIndex) ?? {
                    id: 0,
                    name: "",
                    songId: "",
                    answers: [],
                  }
                }
                time={counter}
                currentIndex={currentIndex}
                show={showQuestion}
                allowAnswerSelection={false}
                quizLength={questions.length}
              />
              </div>
          )}

          {phase === "starting" && (
            <>
              <ShowQuizStarting time={counter} />
            </>
          )}

          {phase === "waiting" && (
            <div className="">
            <div className="flex card bg-base-100 p-5 pl-10 pr-10 shadow-xl">

              <div className="mb-8 flex flex-col items-center gap-3 text-center">
                <div>
                  <span className="text-xl font-bold ">RUM ID</span>
                  <div className="text-3xl font-bold text-accent">
                    {String(router.query.slug).toUpperCase()}
                  </div>
                </div>
                {pusher != null && (
                <div className="flex flex-col items-center">
                  <QRCode
                    className="rounded-md bg-white p-2"
                    value={getURL()}
                  />
                </div>
              )}
                <button
                  className="btn btn-primary btn-wide mt-4"
                  onClick={sendStart}
                >
                  Starta
                </button>
              </div>
              <div className="flex flex-col items-center mb-4">
                <span className="loading loading-ring loading-lg"></span>
                  <span>{members.length} spelare</span>
              </div>
            </div>

                <div className="flex flex-col items-center pt-5">
                  <h2 className="text-center text-2xl font-bold mb-5">Spelare</h2>
                  {members.map((member, index) => (
                    <div
                      key={index}
                      className="flex flex-col floating-player"
                    >
                      {member.name}
                    </div>
                  ))}
                </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function GenericBroadcast(roomId: string, action: string, body: unknown) {
  fetch("/api/room/" + roomId + "/" + action, {
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    });
}

interface CurrentQuestionInterface {
  question: SimpleQuestion;
  time: number;
  currentIndex: number;
  show: boolean;
}


interface QuizStartingInterface {
  time: number;
}

function ShowQuizStarting(props: QuizStartingInterface) {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold">Quizet börjar om</h1>
      <h2 className="text-2xl font-bold">{5 - Math.floor(props.time)}</h2>
    </div>
  );
}

function PrepareForQuiz(
  questionData: Question[],
  order: number[],
): SimpleQuestion[] {
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
      id: question.id,
      name: question.text,
      songId: question.content,
      answers: answers,
    });
  });

  // Sort questions in the order specified
  questions.sort((a, b) => {
    return order.indexOf(a.id) - order.indexOf(b.id);
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
