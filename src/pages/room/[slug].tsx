import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { env } from "~/env.mjs";

interface UserJoin {
  name: string;
}

const dummyIds = [
  "60f9b3b3d9b3a1b4e4f1e3a1",
  "60f9b3b3d9b3a1b4e4f1e3a2",
  "60f9b3b3d9b3a1b4e4f1e3a3",
  "60f9b3b3d9b3a1b4e4f1e3a4",
];

export default function Room() {
  const router = useRouter();
  const session = useSession();
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [members, setMembers] = useState<string[]>([]);

  const addMemberToList = (name: string) => {
    setMembers((prev) => [...prev, name]);
  };

  const sendStart = () => {
    if (!router.query.slug || router.query.slug.at(0) === "") return;
    fetch(
      "/api/room/" + (router.query.slug.toString() ?? "no-room") + "/start",
      {
        method: "POST",
        body: JSON.stringify({ questionIds: dummyIds }),
      },
    )
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        console.log("fetched");
      });
  };

  const openRoom = () => {
    const p = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
    });

    const channel = p.subscribe("game@" + router.query.slug?.toString());
    channel.bind("join", function (data: UserJoin) {
      try {
        const name = data.name;
        if (name === undefined) {
          throw new Error("Player joined with undefined credentials");
        } else {
          console.log("Player joined with name " + name);
          addMemberToList(name);
        }
      } catch (e) {
        console.log(e);
      }
    });

    setPusher(p);
  };

  const getURL = () => {
    return env.NEXT_PUBLIC_URL + "/play/" + router.query.slug?.toString();
  };

  return (
    <div className="flex flex-grow flex-col items-center h-[100vh]">

      <main className="flex flex-col justify-between items-center w-4/5 h-[50vh] mx-auto my-auto">

        <h1 className="text-6xl font-extrabold tracking-tight text-base-content sm:text-[7rem]">
          Quizroom
        </h1>

        <div className="text-center mb-4 flex flex-col gap-5">
          Room ID: {router.query.slug}
          {pusher != null ? (
            <span>{pusher.connection.state}</span>
            <QRCode className="rounded-md bg-white p-2" value={getURL()} />
          ) : (
            <button className="btn btn-wide btn-primary" onClick={openRoom}>
              Öppna Rum
            </button>
          )}
          <button className="btn btn-wide btn-primary mb-4" onClick={sendStart}>
            Starta
          </button>
        </div>
        
        <div className="">
          <div className="grid grid-cols-1 grid-rows-2 mb-4">
            <span className="loading loading-spinner loading-md m-auto"></span>
            <span>{members.length} spelare</span>
          </div>
          <div>
            <h2 className="text-center text-2xl font-bold">Spelare</h2>
            <ul className="text-base-content">
              {members.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
