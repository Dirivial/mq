import Head from "next/head";
import { useState } from "react";

import { api } from "~/utils/api";

export default function Games() {
  const [matches, setMatches] = useState([]);

  return (
    <>
      <Head>
        <title>Olé</title>
        <meta name="description" content="Välj en match att vadslå på." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            Välj din match!
          </h1>

          <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-[2rem]">
            Pågående
          </h1>
          <div>
            <Game
              player1="Björken"
              player1Score={3}
              player2="Modo"
              player2Score={1}
            />
          </div>

          <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-[2rem]">
            Kommande
          </h1>
          <div>
            <ComingGame
              time={new Date("2023-09-27T18:30:00.000Z")}
              player1="HV75"
              player2="Modo"
            />
          </div>
        </div>
      </main>
    </>
  );
}

interface GameProps {
  player1: string;
  player1Score?: number;
  player2: string;
  player2Score?: number;
}

function Game(props: GameProps) {
  return (
    <div className="grid h-24 w-80 grid-cols-3 grid-rows-1 items-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-2xl font-bold text-white">
      <span className="text-center">{props.player1}</span>

      <div className="flex justify-center gap-1 text-4xl">
        {}
        <span className="text-center">{props.player1Score}</span>
        <span className="text-center"> - </span>
        <span className="text-center">{props.player2Score}</span>
      </div>

      <span className="text-center"> {props.player2}</span>
    </div>
  );
}

interface ComingGameProps {
  time: Date;
  player1: string;
  player2: string;
}

function ComingGame(props: ComingGameProps) {
  return (
    <div className="grid h-24 w-80 grid-cols-3 grid-rows-1 items-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-2xl font-bold text-white">
      <span className="text-center">{props.player1}</span>

      <div className="flex justify-center gap-1 text-3xl">
        <span className="text-center">
          {props.time.getHours()}:{props.time.getMinutes()}
        </span>
      </div>

      <span className="text-center"> {props.player2}</span>
    </div>
  );
}
