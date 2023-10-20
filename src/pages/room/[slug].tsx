import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { env } from "~/env.mjs";

export default function Room() {
  const router = useRouter();
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [members, setMembers] = useState<string[]>([]);

  const addMemberToList = (memberId: string) => {
    setMembers((prev) => [...prev, memberId]);
  };

  const initPusher = () => {
    const p = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
    });

    //const channel = p.subscribe("join-room:" + router.query.slug?.toString());
    const channel = p.subscribe("users");
    channel.bind("join", function (data: JSON) {
      alert(JSON.stringify(data));
    });

    channel.bind("pusher:subscription_succeeded", () => {
      addMemberToList("papi");
      console.log("AAAAYoo");
    });
    channel.bind("pusher:member_added", (member: { id: string }) => {
      console.log("Ayo");
      addMemberToList(member.id);
    });
    channel.bind("pusher:member_removed", (member: { id: string }) => {
      setMembers((prev) => prev.filter((m) => m !== member.id));
    });
    setPusher(p);
  };

  const sendCall = () => {
    if (!router.query.slug || router.query.slug.at(0) === "") return;
    fetch("/api/room/" + router.query.slug.toString() ?? "")
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

  return (
    <div className="">
      <main className=" flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            MQ
          </h1>
          Room ID: {router.query.slug}{" "}
          <button className="btn" onClick={initPusher}>
            Create Pusher Instance
          </button>
          <button className="btn" onClick={sendCall}>
            Send API call
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">Members</h2>
            <ul className="text-white">
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
