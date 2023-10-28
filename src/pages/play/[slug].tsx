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
  const [questionIds, setQuestionIds] = useState<number[]>([]);
  const [questions, setQuestions] = useState<SimpleQuestion[]>([]);
  const [successfullJoin, setSuccessfullJoin] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const { data: questionData, isSuccess: gotQuestions } =
    api.question.getGroupOfQuestions.useQuery({ ids: questionIds });

  const initPusher = () => {
    const p = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
    });

    const channel = p.subscribe("game@" + router.query.slug?.toString());
    channel.bind("start", function (data: GameStart) {
      setQuestionIds(data.questionIds);
      console.log("Game started with questions ", data.questionIds);
      // TODO: Fetch questions from db
      // We want to fetch the questions to lessen the load on the socket server
      // (Also, we should cache the questions so that the server doesn't have to do a db call every time)
    });
    channel.bind("new-question", function (data: NewQuestion) {
      console.log("New question ", data.newQuestionIndex);
      setCurrentIndex(data.newQuestionIndex);
    });

    setPusher(p);
  };

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
