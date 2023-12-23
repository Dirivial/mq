import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import type { SimpleQuestion } from "~/utils/types";
import type {
  CurrentQuestionInterface,
  GameStart,
  NewQuestion,
} from "~/utils/interfaces";
import ShowCurrentQuestion from "~/components/quiz/quizdisplay/ShowCurrentQuestion";

export default function Play() {
  const [answerSelected, setAnswerSelected] = useState<boolean>(false);
  const router = useRouter();
  const session = useSession();
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [successfullJoin, setSuccessfullJoin] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  /* 
    Realistically this could change if we lean into having a "quiz" rather than a list of questions.
    It seems redundant to have two arrays for the questions.
  */
  const [questionIds, setQuestionIds] = useState<number[]>([]);
  const [questions, setQuestions] = useState<SimpleQuestion[]>([]);

  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [score, setScore] = useState<number>(0);

  // Used to know how quickly they responded to a question (and also to trigger events etc.).
  const [timePassed, setTimePassed] = useState<number>(0);

  // Keep track of the results of each question
  const [results, setResults] = useState<boolean[]>([]);

  // TODO: We should cache the questions so that the server doesn't have to do a db call every time
  const { data: questionData, isSuccess: gotQuestions } =
    api.question.getGroupOfQuestions.useQuery(
      { ids: questionIds },
      { enabled: questionIds.length > 0 && questions.length === 0 },
    );

  const displayResult = () => {
    console.log("Display result", results);
  };

  const initPusher = () => {
    const p = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
    });

    const channel = p.subscribe(
      "game@" + router.query.slug?.toString().toUpperCase(),
    );

    // Handle game start
    channel.bind("start", function (data: GameStart) {
      setQuestionIds(data.questionIds);
    });

    // Handle a new question
    channel.bind("new-question", function (data: NewQuestion) {
      setCurrentIndex(data.newQuestionIndex);
      setTimePassed(0);
      setAnswerSelected(false);
    });

    // Handle end of question
    channel.bind("end-question", function (data: number) {
      console.log("End question ", data);
      setTimePassed(0);
      // Maybe show a correct/incorrect message? And possibly add the score in a fun way.
      displayResult();
    });

    // Handle end of game
    channel.bind("end", function (data: number[]) {
      console.log("End game ", data);
      setTimePassed(0);
      setQuizFinished(true);
    });

    setPusher(p);
  };

  // Send score to the host when answering a question
  const sendScore = (score: number) => {
    if (!router.query.slug || router.query.slug.at(0) === "") return;

    fetch("/api/room/" + (router.query.slug.toString() ?? "") + "/score", {
      method: "POST",
      body: JSON.stringify({ id: session.data?.user?.id, score: score }),
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("Score sent");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Handle player answering a question
  const handleAnswer = (correct: boolean) => {
    console.log("Answered: ", correct);
    setAnswerSelected(true);
    // Only allow answering once
    if (correct) {
      sendScore(score + 1);
      setScore((score) => score + 1);
      setResults((results) => [...results, true]);
    } else {
      setResults((results) => [...results, false]);
      sendScore(score);
    }
    //console.log(results);
  };

  /*
    This converts all the questions to a more digestible format.
    I hate that it's in a useEffect, but I currently don't know how to do it in a different way due to tRPC + useQuery.
  */

  useEffect(() => {
    // Check if the quiz is finished: All questions are answered, the last question index is reached, and the quiz has started
    if (currentIndex !== -1 && currentIndex >= questionIds.length) {
      setQuizFinished(true);
    }
  }, [currentIndex, questionIds.length, results]);

  useEffect(() => {
    if (gotQuestions && questions.length === 0 && questionData.length > 0) {
      console.log(questionData);
      const questions: SimpleQuestion[] = [];

      // Order the questions in the same order as the questionIds - to make sure they're in the same order as the host
      const orderedQuestions: {
        id: number;
        type: string;
        text: string;
        content: string;
        answer: string;
        falseAnswers: string[];
        lastPicked: Date;
      }[] = [];
      questionIds.forEach((id) => {
        const q = questionData.find((q) => q.id === id);
        if (q) orderedQuestions.push(q);
      });

      // Convert the questions to a more digestible format
      orderedQuestions.forEach((question) => {
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
    }
  }, [questionData, gotQuestions, questions, questionIds]);

  // TODO: Decide if scores should be sent to the host, or calculated by the host (probably the former, since it's easier)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimePassed((timePassed) => timePassed + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const sendCall = () => {
    if (!router.query.slug || router.query.slug.at(0) === "") return;

    initPusher();

    fetch(
      "/api/room/" +
        (router.query.slug.toString().toUpperCase() ?? "") +
        "/join",
      {
        method: "POST",
        body: JSON.stringify({
          id: session.data?.user.id,
          name: session.data?.user?.name,
        }),
      },
    )
      .then((res) => {
        if (res.status === 200) {
          setSuccessfullJoin(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Call sendCall function after setting the username
  useEffect(() => {
    if (session.status === "authenticated") {
      sendCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status]);

  return (
    <main className="card mx-auto my-auto flex h-[50vh] w-[90vw] flex-col items-center justify-center">
      {quizFinished ? (
        // Quiz finished message
        <div className="prose text-center">
          <h1>Quizet är slut!</h1>
          <p>Tack för att du deltog!</p>
        </div>
      ) : successfullJoin ? (
        // Quiz in progress
        questionIds.length > 0 ? (
          currentIndex === -1 ? (
            <span>Nu kör vi!</span>
          ) : (
            <div className="flex w-full flex-grow">
              <ShowCurrentQuestion
                question={
                  questions.at(currentIndex) ?? {
                    name: "",
                    songId: "",
                    answers: [],
                  }
                }
                currentIndex={currentIndex}
                setAnswer={handleAnswer}
                answerSelected={answerSelected}
                quizLength={questionData?.length}
                allowAnswerSelection={true}
                time={timePassed}
              />
            </div>
          )
        ) : (
          // Waiting for the quiz to start
          <div className="prose flex flex-grow flex-col items-center justify-center text-center">
            <h2>Väntar på att spelet ska starta</h2>
            <span className="loading loading-dots loading-lg"></span>
          </div>
        )
      ) : (
        // Not joined or authenticated
        <div className="prose text-center">
          {session.status === "authenticated" ? (
            <div>
              <p>Connecting to the quiz</p>
              <span className="loading loading-spinner loading-xs"></span>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-wide"
              onClick={() => void signIn()}
            >
              Logga In
            </button>
          )}
        </div>
      )}
    </main>
  );
}
