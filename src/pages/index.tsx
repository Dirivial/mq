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
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="container mx-auto p-4 text-center">
          <Header />
          <AuthShowcase />
        </div>
      </main>
    </>
  );
}

function Header() {
  return (
    <header className="mb-10">
      <h1 className="text-6xl font-extrabold tracking-tight md:text-7xl">
        MQ
      </h1>
      <p className="mt-3 text-lg md:text-xl">
        Quizet för musikälskaren
      </p>
    </header>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  return (
    <div className="w-full">
      {sessionData && (
        <div className="absolute top-0 left-0 right-0 bg-primary p-4 text-center text-base-100">
          Inloggad som {sessionData.user?.email}
        </div>
      )}
      <div className="flex flex-col items-center justify-center gap-4">
        {secretMessage && (
          <Link 
            href="/quizmaster"
            className="btn btn-primary btn-wide"
          > 
            Gå vidare
          </Link>
        )}
        <button
          className="btn btn-outline btn-primary btn-wide"
          onClick={sessionData ? signOut : signIn}
        >
          {sessionData ? "Logga ut" : "Logga in"}
        </button>
      </div>
    </div>
  );
}
