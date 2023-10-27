import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <Head>
        <title>MQ</title>
        <meta name="description" content="En webapp för musikquiz." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="hero min-h-screen flex items-center justify-center ">
        <div className="container flex flex-col items-center gap-20 px-4 py-16 text-center">
          <div className="flex flex-col items-center">
          <h1 className="text-[clamp(4rem,17vw,6rem)] md:text-[clamp(4rem,8vw,6rem)] font-extrabold tracking-tight">
            MQ
          </h1>
          <h2 className="text-body">
           Quizet för dig som gillar musik (no shit) 
          </h2>
        </div>
          <AuthShowcase />
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-10 w-full">
      {sessionData && (
        <div className="absolute top-0 left-0 right-0 bg-primary p-4 text-center text-base-100">
          Inloggad som {sessionData.user?.email}
        </div>
      )}
      <div className="flex flex-col items-center justify-center gap-10">
        {secretMessage && (
          <Link className="btn btn-primary btn-wide" href="/quizmaster">
            Gå vidare
          </Link>
        )}
        <button
          className="btn btn-outline btn-primary btn-wide"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Logga ut" : "Logga in"}
        </button>
      </div>
    </div>
  );
}
