import Head from "next/head";
import { useEffect, useState } from "react";

import { api } from "~/utils/api";

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
  name: "SuperQuizzet",
  questions: [
    {
      name: "Vad heter låten?",
      url: "2WfaOiMkCvy7F5fcp2zZ8L",
      answers: [
        {
          name: "Take on this",
          correct: false,
        },
        {
          name: "Take on me",
          correct: true,
        },
        {
          name: "Take on that",
          correct: false,
        },
        {
          name: "Take on them",
          correct: false,
        },
      ],
    },
    {
      name: "Vad heter låten?",
      url: "4bO6DljpuAeQh6HS20i0I5",
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

export default function Quiz() {
  const [timePassed, setTimePassed] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>();

  useEffect(() => {
    setCurrentQuestion(exampleQuiz.questions[0]);
    const interval = setInterval(() => {
      setTimePassed((timePassed) => timePassed + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>MQ</title>
        <meta name="description" content="Välj en match att vadslå på." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            {exampleQuiz.name}
          </h1>
        </div>
        <div>
          <h1 className="text-center text-2xl font-bold text-white">
            {currentQuestion?.name}
          </h1>

          <div className="mt-10 grid grid-cols-2 gap-2">
            {currentQuestion?.answers.map((answer) => (
              <button className="text btn h-24 text-lg" key={answer.name}>
                <h3>{answer.name}</h3>
              </button>
            ))}
          </div>

          <div className="flex flex-col p-10">
            <progress
              className="progress mx-auto w-96"
              value={timePassed}
              max="30"
            ></progress>
          </div>
        </div>
      </main>
    </>
  );
}
