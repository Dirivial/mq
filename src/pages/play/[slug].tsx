import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import GoBackButton from "~/components/layout/GoBackButton";

interface GameStart {
  questionIds: number[];
}

interface NewQuestion {
  newQuestionIndex: number;
}

type SimpleQuestion = {
  name: string;
  songId: string;
  answers: Answer[];
};

type Answer = {
  text: string;
  correct: boolean;
};

export default function Play() {
  const router = useRouter();
  const session = useSession();
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [successfullJoin, setSuccessfullJoin] = useState<boolean>(false);

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

    const channel = p.subscribe("game@" + router.query.slug?.toString());

    // Handle game start
    channel.bind("start", function (data: GameStart) {
      setQuestionIds(data.questionIds);
    });

    // Handle a new question
    channel.bind("new-question", function (data: NewQuestion) {
      setCurrentIndex(data.newQuestionIndex);
      setTimePassed(0);
    });

    // Handle end of question
    channel.bind("end-question", function (data: number) {
      console.log("End question ", data);
      setTimePassed(0);
      // Maybe show a correct/incorrect message? And possibly add the score in a fun way.
      displayResult();
    });

    // Handle end of game
    channel.bind("end", function (data: number) {
      console.log("End game ", data);
      setTimePassed(0);
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

  // Send info to the host that we've joined the game
  const sendCall = () => {
    if (!router.query.slug || router.query.slug.at(0) === "") return;

    initPusher();

    fetch("/api/room/" + (router.query.slug.toString() ?? "") + "/join", {
      method: "POST",
      body: JSON.stringify({
        id: session.data?.user.id,
        name: session.data?.user?.name,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          setSuccessfullJoin(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Handle player answering a question
  const handleAnswer = (correct: boolean) => {
    // Only allow answering once
    if (results.length === currentIndex) {
      if (correct) {
        sendScore(score + 1);
        setScore((score) => score + 1);
        setResults((results) => [...results, true]);
      } else {
        setResults((results) => [...results, false]);
        sendScore(score);
      }

      console.log(results);
    }
  };

  /*
    This converts all the questions to a more digestible format.
    I hate that it's in a useEffect, but I currently don't know how to do it in a different way due to tRPC + useQuery.
  */
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

  return (
    <div className="">
      <main className=" bg-base flex min-h-screen flex-col items-center text-base-content">
        <GoBackButton />
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          {!successfullJoin ||
            (questionIds === undefined && (
              <h1 className="text-6xl font-extrabold tracking-tight text-base-content sm:text-[3rem]">
                {router.query.slug}
              </h1>
            ))}

          {successfullJoin ? (
            <div>
              {questionIds != undefined && questionIds.length > 0 ? (
                <div>
                  {currentIndex === -1 ? (
                    <span>Nu kör vi!</span>
                  ) : (
                    <>
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
                      />
                    </>
                  )}
                </div>
              ) : (
                <span>Väntar på att spelet ska starta...</span>
              )}
            </div>
          ) : (
            <div>
              {session.status === "authenticated" ? (
                <button className="btn btn-primary btn-wide" onClick={sendCall}>
                  Anslut Till Rummet
                </button>
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
        </div>
      </main>
    </div>
  );
}

interface CurrentQuestionInterface {
  question: SimpleQuestion;
  currentIndex: number;
  setAnswer: (answer: boolean) => void;
}

function ShowCurrentQuestion(props: CurrentQuestionInterface) {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold">{props.question.name}</h1>
      <div className="mt-10 grid grid-cols-2 gap-2">
        {props.question.answers.map((answer, index) => (
          <button
            className="btn btn-accent btn-outline h-24 text-lg"
            key={index}
            onClick={() => props.setAnswer(answer.correct)}
          >
            <h3>{answer.text}</h3>
          </button>
        ))}
      </div>
      <div className="flex flex-col p-10">
        <h3 className="text-center text-xl font-bold">
          {props.currentIndex + 1}/5
        </h3>
      </div>
    </div>
  );
}
