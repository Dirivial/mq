import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { env } from "~/env.mjs";

import { api } from "~/utils/api";
import Link from "next/link";

type Track = {
  id: number;
  preview: string;
};

type Quiz = {
  name: string;
  questions: Question[];
};

type Question = {
  name: string;
  url: string;
  answers: Answer[];
};

type Answer = {
  name: string;
  correct: boolean;
};

const exampleQuiz: Quiz = {
  name: "Example Quiz",
  questions: [
    {
      name: "1: What is the name of this song?",
      url: "https://api.deezer.com/track/3135556",
      answers: [
        {
          name: "Around The World",
          correct: false,
        },
        {
          name: "Harder Better Faster Stronger",
          correct: true,
        },
        {
          name: "Get Lucky",
          correct: false,
        },
        {
          name: "Da Funk",
          correct: false,
        },
      ],
    },
    {
      name: "2: What is the name of this song?",
      url: "https://api.deezer.com/track/2514681",
      answers: [
        {
          name: "Something for Money",
          correct: false,
        },
        {
          name: "Nothing for Money",
          correct: false,
        },
        {
          name: "Money for Something",
          correct: false,
        },
        {
          name: "Money for Nothing",
          correct: true,
        },
      ],
    },
  ],
};

export default function QuizMaster() {
  const { data: sessionData } = useSession();

  const searchParams = useSearchParams();
  const [userCode, setUserCode] = useState("");
  const [epicURL, setEpicURL] = useState("");

  const startQuiz = () => {
    if (userCode === "") {
      console.log(searchParams.get("code"));
      return;
    }
  };

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setUserCode(code);
      console.log("Time to do the rest of spotify auth!");
    } else {
      const scope = "user-read-private user-read-email";
      const params = new URLSearchParams();
      params.append("client_id", env.NEXT_PUBLIC_SPOTIFY_ID);
      params.append("response_type", "code");
      params.append("redirect_uri", env.NEXT_PUBLIC_REDIRECT_URL);
      //params.append("state", state);
      params.append("scope", scope);

      const url = "https://accounts.spotify.com/authorize?" + params.toString();

      setEpicURL(url);
    }
  }, [searchParams]);

  return (
    <>
      <Head>
        <title>MQ</title>
        <meta name="description" content="Dashboard för quizmasters." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            QuizMaster
          </h1>
          <button
            onClick={startQuiz}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          >
            Starta Quiz
          </button>

          <Link
            href={epicURL}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          >
            Anslut till Spotify
          </Link>

          <div className="w-1/2">
            <div className="divider">eller</div>
          </div>

          <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
            Logga ut
          </button>
        </div>
      </main>
    </>
  );
}

interface QuestionDisplayerProps {
  question: Question;
  onDone: () => void;
}

function QuestionDisplayer(props: Question) {
  const [timePassed, setTimePassed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimePassed((timePassed) => timePassed + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className="text-center text-2xl font-bold text-white">Question</h1>
      <h2 className="text-center text-xl text-white">{props.name}</h2>

      <div className="mt-10 grid grid-cols-2 gap-2">
        {props.answers.map((answer) => (
          <button className="btn" key={answer.name}>
            <h3>{answer.name}</h3>
          </button>
        ))}
      </div>

      <div className="flex flex-col p-10">
        <progress
          className="progress mx-auto w-56"
          value={timePassed}
          max="30"
        ></progress>
      </div>
    </div>
  );
}
function generateRandomString(arg0: number) {
  throw new Error("Function not implemented.");
}
