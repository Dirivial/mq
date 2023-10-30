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

  interface ActionButtonProps {
    onClick: () => void;
    label: string;
    outline?: boolean;
  }

  function ActionButton({
    onClick,
    label,
    outline = false,
  }: ActionButtonProps) {
    const buttonClass = `btn btn-wide ${
      outline ? "btn-outline" : ""
    } btn-primary`;
    return (
      <button onClick={onClick} className={buttonClass}>
        {label}
      </button>
    );
  }

  return (
    <>
      <Head>
        <title>MQ - QuizMaster</title>
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
        onLoad={() => void tryAuthorize()} // Assuming tryAuthorize is defined elsewhere
      />
      <main className="bg-background flex min-h-screen items-center justify-center">
        <div className="container mx-auto p-4 text-center">
          <h1 className="mb-12 text-6xl font-extrabold md:text-7xl">
            QuizMaster
          </h1>
          <div className="flex flex-col items-center gap-4">
            <ActionButton onClick={startQuiz} label="Starta Quiz" />
            <ActionButton onClick={openRoom} label="Öppna ett Rum" />
            {!isAuthorized && (
              <ActionButton
                onClick={() => void tryAuthorize()}
                label="Anslut till Apple Music"
              />
            )}
            <div className="my-4 w-full">
              <div className="divider">eller</div>
            </div>
            <ActionButton
              onClick={() => void signOut()}
              label="Logga ut"
              outline
            />
          </div>
        </div>
      </main>
    </>
  );
}
