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
      <main className="hero min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="hero-content text-center">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              MQ
            </h1>
            <AuthShowcase />
          </div>
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
    <div className="flex flex-col items-center justify-center gap-10">
      <p className="grid grid-rows-2 gap-y-10 text-center text-2xl text-white">
        {sessionData && (
          <span className="text-3xl">Tjena {sessionData.user?.name}!</span>
        )}
        {secretMessage && (
          <Link className="btn btn-primary" href="/restaurant">
            Gå vidare
          </Link>
        )}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Logga out" : "Logga in"}
      </button>
    </div>
  );
}
