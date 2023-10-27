import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { env } from "~/env.mjs";

interface GameStart {
  questionIds: number[];
}

export default function Play() {
  const router = useRouter();
  const session = useSession();
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [questionIds, setQuestionIds] = useState<number[]>([]);
  const [successfullJoin, setSuccessfullJoin] = useState<boolean>(false);

  const initPusher = () => {
    const p = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
    });

    const channel = p.subscribe("game@" + router.query.slug?.toString());
    channel.bind("start", function (data: GameStart) {
      setQuestionIds(data.questionIds);
      console.log("Game started with questions ", data.questionIds);
    });
    channel.bind("new-question", function (data: JSON) {
      alert(JSON.stringify(data));
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
          console.log("success");
          setSuccessfullJoin(true);
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        console.log("fetched");
      });
  };

  return (
    <div className="">
      <main className=" bg-base flex min-h-screen flex-col items-center text-base-content">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-6xl font-extrabold tracking-tight text-base-content sm:text-[3rem]">
            {router.query.slug}
          </h1>
          {session.status === "authenticated" ? (
            <button className="btn btn-primary" onClick={sendCall}>
              Anslut Till Rummet
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => void signIn()}>
              Logga In
            </button>
          )}

          {successfullJoin && (
            <div>
              {questionIds != undefined && questionIds.length > 0 ? (
                <span>Questions loaded!</span>
              ) : (
                <span>Waiting for game to start</span>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
