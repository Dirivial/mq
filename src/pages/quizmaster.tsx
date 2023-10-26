import Head from "next/head";
import { signOut } from "next-auth/react";

import { env } from "~/env.mjs";

import { useRouter } from "next/navigation";

import { ConfigureMusicKit } from "~/utils/musicPlayer";

import Script from "next/script";
import { useState } from "react";

export default function QuizMaster() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(true);

  const startQuiz = () => {
    console.log("Starting quiz...");
    router.push("/quiz");
  };

  const openRoom = () => {
    const roomId = Math.random().toString(36).substring(7);
    console.log("Opening a new room with id " + roomId + "...");
    router.push("/room/" + roomId);
  };

  const tryAuthorize = async () => {
    if (isAuthorized) return;
    await ConfigureMusicKit(env.NEXT_PUBLIC_APPLE_DEVELOPER_TOKEN)
      .catch((e) => console.log(e))
      .then((authorized) => {
        setIsAuthorized(authorized ?? false);
      });
  };

  return (
    <>
      <Head>
        <title>MQ</title>
        <meta name="description" content="Dashboard för quizmasters." />
        <meta
          name="apple-music-developer-token"
          content={env.NEXT_PUBLIC_APPLE_DEVELOPER_TOKEN}
        />
        <meta name="apple-music-app-name" content="My Cool App" />
        <meta name="apple-music-app-build" content="1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        src="https://js-cdn.music.apple.com/musickit/v3/musickit.js"
        onLoad={() => void tryAuthorize()}
      />
      <main className="flex min-h-screen items-center justify-center">
        <div className="container flex flex-col items-center gap-12 px-4 py-16 text-center">
          <h1 className="text-[clamp(5rem,10vw,12rem)] md:text-[clamp(8rem,10vw,12rem)] font-extrabold ">
            QuizMaster
          </h1>
          <button
            onClick={startQuiz}
            className="btn btn-wide btn-primary"
          >
            Starta Quiz
          </button>
          <button
            onClick={openRoom}
            className="btn btn-wide btn-primary"
          >
            Öppna ett Rum
          </button>
          {!isAuthorized && (
            <button
              onClick={() => void tryAuthorize()}
              className="btn btn-wide btn-primary"
            >
              Anslut till Apple Music
            </button>
          )}
          <div className="w-1/2 my-4">
            <div className="divider">eller</div>
          </div>
          <button
            onClick={void signOut}
            className="btn btn-wide btn-outline btn-primary"
          >
            Logga ut
          </button>
        </div>
      </main>
    </>
  );
  
  }
