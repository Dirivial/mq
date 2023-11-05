import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import GoBackButton from "~/components/GoBackButton";

import {
  SkipToNext,
  Play,
  Pause,
  AddSongsToQueue,
  ClearQueueFull,
} from "~/utils/musicPlayer";

import { api } from "~/utils/api";

type Question = {
  name: string;
  songId: string;
  answers: Answer[];
};

type Answer = {
  text: string;
  correct: boolean;
};

export default function QuizCreator() {
  const [questions, setQuestions] = useState<Question[]>([]);

  return (
    <>
      <Head>
        <title>MQ</title>
        <meta name="description" content="Nu är det dags för QUIZ!." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center text-center">
        <GoBackButton />
        <Link
          href={"/quizmaster"}
          onClick={() => {
            Pause();
            void ClearQueueFull();
          }}
          className="mb-12 text-6xl font-extrabold md:text-7xl"
        >
          Skapa Quiz
        </Link>
      </main>
    </>
  );
}
