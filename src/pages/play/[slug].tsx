import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";

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
  const [answer, setAnswer] = useState<string>("");

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
      console.log("New question ", data.newQuestionIndex);
      setCurrentIndex(data.newQuestionIndex);
      setTimePassed(0);
    });
    // Handle end of question
    channel.bind("end-question", function (data: number) {
      console.log("End question ", data);
      setTimePassed(0);
      // Maybe show a correct/incorrect message? And possibly add the score in a fun way.
    });

    setPusher(p);
  };

  // Send info to the host that we've joined the game
  const sendCall = () => {
    if (!router.query.slug || router.query.slug.at(0) === "") return;

    initPusher();

    fetch("/api/room/" + (router.query.slug.toString() ?? "") + "/join", {
      method: "POST",
      body: JSON.stringify({ name: session.data?.user?.name }),
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

  /*
    This converts all the questions to a more digestible format.
    I hate that it's in a useEffect, but I currently don't know how to do it in a different way due to tRPC + useQuery.
  */
  useEffect(() => {
    if (gotQuestions && questions.length === 0 && questionData.length > 0) {
      console.log(questionData);
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
          name: question.text,
          songId: question.content,
          answers: answers,
        });
      });

      setQuestions(questions);
    }
  }, [questionData, gotQuestions, questions]);

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
                        setAnswer={setAnswer}
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
  setAnswer: (answer: string) => void;
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
            onClick={() => props.setAnswer(answer.text)}
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
