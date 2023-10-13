import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

import { SkipToNext, Play, Pause, AddSongsToQueue } from "~/utils/musicPlayer";

type Quiz = {
  name: string;
  questions: Question[];
};

type Question = {
  name: string;
  songId: string;
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
      songId: "380907765",
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
      songId: "800157892",
      answers: [
        {
          name: "Take Me Home Tonight",
          correct: false,
        },
        {
          name: "This Charming Man",
          correct: false,
        },
        {
          name: "The Queen Is Dead",
          correct: false,
        },
        {
          name: "There Is a Light That Never Goes Out",
          correct: true,
        },
      ],
    },
    {
      name: "Vad heter låten?",
      songId: "1389378880",
      answers: [
        {
          name: "Världen är din",
          correct: false,
        },
        {
          name: "Drottningen ikväll",
          correct: false,
        },
        {
          name: "Kung för en dag",
          correct: true,
        },
        {
          name: "Johnny the Rucker",
          correct: false,
        },
      ],
    },
  ],
};

export default function Quiz() {
  const [timePassed, setTimePassed] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(
    exampleQuiz.questions[0] ?? {
      name: "No question",
      songId: "0",
      answers: [{ name: "No answer", correct: false }],
    },
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);

  useEffect(() => {
    const nextQuestion = () => {
      const nextQuestionIndex = currentIndex + 1;

      if (nextQuestionIndex < exampleQuiz.questions.length) {
        const q = exampleQuiz.questions[nextQuestionIndex];
        if (q) {
          setCurrentQuestion(q);
        }
        setCurrentIndex(nextQuestionIndex);
      } else {
        setGameOver(true);
      }
    };

    const interval = setInterval(() => {
      if (timePassed > 30) {
        console.log("Time passed");
        setTimePassed(0);
        setShowQuestion(false);
        nextQuestion();
      } else {
        setTimePassed((timePassed) => timePassed + 0.1);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [currentIndex, timePassed]);

  useEffect(() => {
    if (songsLoaded && !gameOver) {
      console.log(currentIndex);
      if (currentIndex === 0) {
        Play()
          .then((v) => {
            setTimePassed(0);
            console.log("Playing", v);
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
    }
  }, [currentIndex, songsLoaded, gameOver]);

  useEffect(() => {
    if (!songsLoaded) {
      const songs: string[] = [];
      exampleQuiz.questions.forEach((question) => {
        songs.push(question.songId);
      });

      AddSongsToQueue(songs)
        .then(() => {
          console.log("Added songs to queue");
          setSongsLoaded(true);
        })
        .catch(() => console.log("Error adding songs to queue"));
    }
  }, [songsLoaded]);

  return (
    <>
      <Head>
        <title>MQ</title>
        <meta name="description" content="Nu är det dags för QUIZ!." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <Link
            href={"/quizmaster"}
            className="text-6xl font-extrabold tracking-tight text-white sm:text-[3rem]"
          >
            {exampleQuiz.name}
          </Link>
        </div>
        {gameOver ? (
          <div>
            <h1 className="text-center text-2xl font-bold text-white">
              Bra Spelat!
            </h1>

            <h3 className="text-center text-xl font-bold text-white">
              (Statistik...)
            </h3>
          </div>
        ) : showQuestion ? (
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
        ) : (
          <div>
            <h1 className="text-center text-2xl font-bold text-white">
              Gör er redo!
            </h1>
          </div>
        )}
      </main>
    </>
  );
}
