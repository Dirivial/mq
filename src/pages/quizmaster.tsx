import Head from "next/head";
import { signOut } from "next-auth/react";

import { env } from "~/env.mjs";

import { useRouter } from "next/navigation";

import ConfigureMusicKit from "~/utils/musicKitConf";
import Script from "next/script";

export default function QuizMaster() {
  const router = useRouter();

  const startQuiz = () => {
    console.log("Starting quiz...");
    router.push("/quiz");
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
        //onLoad={ConfigureMusicKit}
      />
      <main className=" flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            QuizMaster
          </h1>
          <button
            onClick={startQuiz}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          >
            Starta Quiz
          </button>

          <button
            onClick={() => void ConfigureMusicKit()}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          >
            Anslut till Apple Music
          </button>

          <div className="w-1/2">
            <div className="divider">eller</div>
          </div>

          <button
            onClick={void signOut}
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          >
            Logga ut
          </button>
        </div>
      </main>
    </>
  );
}
