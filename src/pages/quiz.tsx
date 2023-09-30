import Head from "next/head";
import { useState } from "react";

import { api } from "~/utils/api";

export default function Quiz() {
  return (
    <>
      <Head>
        <title>MQ</title>
        <meta name="description" content="Välj en match att vadslå på." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            Här händer det grejer!!!!
          </h1>

          <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-[2rem]">
            Quiz quiz
          </h1>
          <p>ojojoj här är det quiz frågor!!!</p>
          <p>så otroligt många quiz frågor!!!</p>
          <p>weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee!!!</p>
        </div>
      </main>
    </>
  );
}
