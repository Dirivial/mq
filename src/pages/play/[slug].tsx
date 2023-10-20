import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { env } from "~/env.mjs";

export default function Play() {
  const router = useRouter();
  const [pusher, setPusher] = useState<Pusher | null>(null);

  const initPusher = () => {
    const p = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
    });

    const channel = p.subscribe("users");
    channel.bind("join", function (data: JSON) {
      alert(JSON.stringify(data));
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

  const postJoinMessage = () => {
    console.log("yo");
  };

  return (
    <div className="">
      <main className=" flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            {router.query.slug}
          </h1>
          <button className="btn" onClick={initPusher}>
            Create Pusher Instance
          </button>
          <button className="btn" onClick={postJoinMessage}>
            Post Join Message
          </button>
        </div>
      </main>
    </div>
  );
}
