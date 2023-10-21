import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { env } from "~/env.mjs";

interface UserJoin {
  name: string;
}

export default function Room() {
  const router = useRouter();
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [members, setMembers] = useState<string[]>([]);

  const addMemberToList = (name: string) => {
    setMembers((prev) => [...prev, name]);
  };

  const sendStart = () => {
    if (!router.query.slug || router.query.slug.at(0) === "") return;
    fetch("/api/room/" + router.query.slug.toString() ?? "no-room" + "/start")
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

  return (
    <div className="">
      <main className=" flex min-h-screen flex-col items-center bg-base-100">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-6xl font-extrabold tracking-tight text-base-content sm:text-[7rem]">
            Q
          </h1>
          Room ID: {router.query.slug}{" "}
          {pusher != null ? (
            <span>{pusher.connection.state}</span>
          ) : (
            <button className="btn btn-primary" onClick={openRoom}>
              Öppna Rum
            </button>
          )}
          <button className="btn btn-primary" onClick={sendStart}>
            Starta
          </button>
          <div className="grid grid-cols-1 grid-rows-2">
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
