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

const NUM_QUESTIONS = 5;

export default function Quiz() {
  const [timePassed, setTimePassed] = useState(0);

  const { isLoading: questionsLoading, data: questionData } =
    api.question.getSomeQuestions.useQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timePassed > 30) {
        console.log("Time passed");
        setTimePassed(0);
        setShowQuestion(false);
        const nextQuestionIndex = currentIndex + 1;

        if (nextQuestionIndex < NUM_QUESTIONS) {
          setCurrentIndex(nextQuestionIndex);
        } else {
          setGameOver(true);
        }
      } else {
        setTimePassed((timePassed) => timePassed + 0.1);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [currentIndex, timePassed]);

  useEffect(() => {
    if (songsLoaded && !gameOver) {
      if (currentIndex === 0) {
        Play()
          .then(() => {
            setTimePassed(0);
            setShowQuestion(true);
          })
          .catch(() => {
            console.log("Error playing");
          });
      } else {
        SkipToNext()
          .then(() => {
            console.log("Skipped to next song");
            setTimePassed(0);
            setShowQuestion(true);
          })
          .catch(() => console.log("Error skipping to next song"));
      }
    } else if (gameOver) {
      Pause();
      void ClearQueueFull();
    }
  }, [currentIndex, songsLoaded, gameOver]);

  useEffect(() => {
    if (!songsLoaded && !questionsLoading && questionData) {
      const questions: Question[] = [];

      questionData.forEach((question) => {
        console.log(question.answer);

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

      setQuestions(questions);

      ClearQueueFull()
        .then(() => {
          console.log("Cleared queue");
          AddSongsToQueue(questions.map((question) => question.songId))
            .then(() => {
              console.log("Added songs to queue");
              setSongsLoaded(true);
            })
            .catch(() => console.log("Error adding songs to queue"));
        })
        .catch(() => console.log("Error clearing queue"));
    }
  }, [songsLoaded, questionsLoading, questionData]);

  return (
    <>
      <Head>
        <title>MQ</title>
        <meta name="description" content="Nu är det dags för QUIZ!." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col min-h-screen items-center justify-center text-center">
      <GoBackButton />
          <Link
            href={"/quizmaster"}
            onClick={() => {
              Pause();
              void ClearQueueFull();
            }}
            className="text-6xl font-extrabold md:text-7xl mb-12"
          >
            Musik Quiz
          </Link>
          {gameOver ? (
            <div>
              <h1 className="text-4xl font-bold ">Bra Spelat!</h1>
              <h3 className="text-xl font-bold ">(Statistik...)</h3>
            </div>
          ) : showQuestion ? (
            <div>
              <h1 className="text-2xl font-bold ">
                {questions.at(currentIndex)?.name ?? "(Inget ifyllt)?"}
              </h1>
              <div className="mt-10 grid grid-cols-2 gap-2">
                {questions.at(currentIndex)?.answers?.map((answer, index) => (
                  <button className="btn btn-outline btn-accent h-24 text-lg" key={index}>
                    <h3>{answer.text}</h3>
                  </button>
                ))}
              </div>
              <div className="flex flex-col p-10">
                <progress
                  className="progress mx-auto w-96"
                  value={timePassed}
                  max="30"
                ></progress>
                <h3 className="text-xl font-bold ">
                  {currentIndex + 1}/{NUM_QUESTIONS}
                </h3>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold text-white">Gör er redo!</h1>
            </div>
          )}
      </main>
    </>
  );
  
}
