import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Head from "next/head";
import Link from "next/link";
import Navbar from "~/components/layout/NavBar";

import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <Head>
        <title>Melody Masters</title>
        <meta name="description" content="En webapp för musikquiz." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-grow items-center justify-center">
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
      <h1 className="text-7xl font-extrabold tracking-tight md:text-7xl">Melody <br/> Masters</h1>
      <p className="mt-3 text-lg md:text-xl">Quizet för musikälskaren</p>
    </header>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    },
  );

  return (
  
    <div>

      <div className="flex flex-col items-center justify-center gap-4">
        {sessionData && (
          <Link href="/quizmaster" className="btn btn-primary btn-wide">
            Fortsätt
          </Link>
        )}
        {!sessionData && (
          <button
            className="btn btn-primary btn-wide"
            onClick={() => void signIn()}
          >
            Logga in
          </button>
        )}

      </div>
    </div>
  );
}
