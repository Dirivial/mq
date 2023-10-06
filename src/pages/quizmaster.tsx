import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

import { api } from "~/utils/api";

const exampleQuiz = {
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

  /*
  Pritority 1: Connect to deezer API and play a couple of songs.

  Priority 2: Create example quiz with 3 questions and play a song for each of them.

  Priority 3: Automatically go to the next question after the song has finished playing, and some thinking time.
  */

  const startQuiz = () => {
    setCurrentQuestion(0);

    const url = exampleQuiz.questions.at(0).url;
    console.log("Fetching with url: " + url);
    // Use the fetch function to make the GET request
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        // Check if the response status is OK (200)
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Parse the response body as JSON (assuming it's JSON data)
        return response.json();
      })
      .then((data) => {
        // Handle the data returned from the server
        console.log(data);
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
        </div>
        <div>{currentQuestion >= 0 && <span>{exampleQuiz.name}</span>}</div>
      </main>
    </>
  );
}
