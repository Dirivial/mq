import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

import { api } from "~/utils/api";

export default function QuizMaster() {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>MQ</title>
        <meta name="description" content="Dashboard för quizmasters." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            QuizMaster
          </h1>

          <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
            Starta Quiz
          </button>

          <div className="w-1/2">
            <div className="divider">eller</div>
          </div>

          <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
            Logga ut
          </button>
        </div>
      </main>
    </>
  );
}
