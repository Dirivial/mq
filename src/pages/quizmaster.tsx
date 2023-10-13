import Head from "next/head";
import { signOut } from "next-auth/react";

import { env } from "~/env.mjs";

import { useRouter } from "next/navigation";

import {
  ConfigureMusicKit,
  SkipToNext,
  Play,
  AddAlbumToQueue,
  Pause,
  AddSongToQueue,
} from "~/utils/musicPlayer";

import Script from "next/script";
import { useState } from "react";

export default function QuizMaster() {
  const router = useRouter();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);

  const startQuiz = () => {
    console.log("Starting quiz...");
    router.push("/quiz");
  };

  const epic = async () => {
    setIsLoading(true);
    await AddAlbumToQueue("1440910966")
      .catch((e) => console.log(e))
      .then((ret) => {
        if (ret) {
          console.log("Added to queue!");
          setHasLoaded(true);
          setIsLoading(false);
        } else {
          console.log(
            "Failed to add to queue! You might need to authorize this browser, go to https://music.apple.com/",
          );
          setIsLoading(false);
        }
      });
  };

  const addSong = async () => {
    setIsLoading(true);
    // https://music.apple.com/se/album/news/1440721443?i=1440721450&l=en-GB
    await AddSongToQueue("1440721450") //AddSongToQueue("1440721443?i=1440721450")
      .catch((e) => console.log(e))
      .then((ret) => {
        if (ret) {
          console.log("Added to queue!");
          setHasLoaded(true);
          setIsLoading(false);
        } else {
          console.log(
            "Failed to add to queue! You might need to authorize this browser, go to https://music.apple.com/",
          );
          setIsLoading(false);
        }
      });
  };

  const togglePlaying = () => {
    if (isPlaying) {
      Pause();
    } else {
      Play()
        .then(() => {
          setIsLoading(false);
        })
        .catch((e) => console.log(e));
      setIsLoading(true);
    }
    setIsPlaying(!isPlaying);
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

          {!isAuthorized && (
            <button
              onClick={() => void tryAuthorize()}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            >
              Anslut till Apple Music
            </button>
          )}

          {!hasLoaded && (
            <>
              <button
                onClick={() => void epic()}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              >
                Köa Dire Straits
              </button>
              <button
                onClick={() => void addSong()}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              >
                Köa News
              </button>
            </>
          )}

          {isLoading && (
            <span className="loading loading-spinner loading-md"></span>
          )}

          {hasLoaded && (
            <>
              <button
                onClick={togglePlaying}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              >
                {isPlaying ? "Pausa" : "Spela"}{" "}
              </button>
            </>
          )}

          {hasLoaded && (
            <button
              onClick={() => void SkipToNext()}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            >
              Skippa
            </button>
          )}

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
