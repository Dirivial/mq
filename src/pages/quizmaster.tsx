import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

import { env } from "process";

import { api } from "~/utils/api";

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

  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [currentPreview, setCurrentPreview] = useState("");

  /*
  Priority 2: Create example quiz with 3 questions and play a song for each of them.

  Priority 3: Automatically go to the next question after the song has finished playing, and some thinking time.
  */

  const startQuiz = () => {
    setCurrentQuestion(0);

    const url =
      (env.CORS_PROXY_URL
        ? env.CORS_PROXY_URL
        : "https://cors-anywhere.herokuapp.com/") +
      exampleQuiz.questions.at(0)?.url;

    // Use the fetch function to make the GET request
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        console.log(response);

        // Check if the response status is OK (200)
        if (!response.ok) {
          throw new Error("Network response was not ok: " + response.status);
        }

        // Parse the response body as JSON (assuming it's JSON data)
        return response.json() as Promise<Track>;
      })
      .then((data) => {
        // Handle the data returned from the server
        console.log(data);
        if (data) {
          const preview = data.preview;
          const audio = new Audio(preview);
          void audio.play();
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch request
        console.error("Fetch error:", error);
      });
  };

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

          {currentQuestion < 0 && (
            <>
              <button
                onClick={startQuiz}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              >
                Starta Quiz
              </button>

              <div className="w-1/2">
                <div className="divider">eller</div>
              </div>

              <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
                Logga ut
              </button>
            </>
          )}
        </div>
        <div>
          {currentQuestion >= 0 && (
            <QuestionDisplayer
              name={
                exampleQuiz.questions.at(currentQuestion)?.name ?? "Question"
              }
              url={exampleQuiz.questions.at(currentQuestion)?.url ?? ""}
              answers={exampleQuiz.questions.at(currentQuestion)?.answers ?? []}
            />
          )}
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
