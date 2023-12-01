import Head from "next/head";
import { env } from "~/env.mjs"
import { useRouter } from "next/navigation";
import { ConfigureMusicKit } from "~/utils/musicPlayer";
import Script from "next/script";
import { useState } from "react";

const qid = 1;

export default function QuizMaster() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(true);

  const createQuiz = () => {
    router.push("/quizcreator");
  };

  const openRoom = () => {
    const roomId = Math.random().toString(36).substring(7);
    console.log("Opening a new room with id " + roomId + "...");
    router.push("/room/" + roomId + "?qid=" + qid);
  };

  const tryAuthorize = async () => {
    if (isAuthorized) return;
    await ConfigureMusicKit(env.NEXT_PUBLIC_APPLE_DEVELOPER_TOKEN)
      .catch((e) => console.log(e))
      .then((authorized) => {
        setIsAuthorized(authorized ?? false);
      });
  };

  const CreateQuizCard = () => {
    return(
    <div className="card card-compact w-80 bg-base-100 shadow-xl">
      <figure><img src="quizcard.png" alt="Shoes"/></figure>
      <div className="flex card-body items-center items-center justify-center">
        <h2 className="flex card-title">Skapa ett helt eget quiz!</h2>
        <p>Skräddarsay den ultimata quizupplevelsen.</p>
        <button className="btn btn-primary w-full max-w-xs" onClick={createQuiz}>QuizMaker</button>
      </div>
    </div>
    );
  };

  const OpenRoomCard = () => {
    return(
    <div className="card card-compact w-80 bg-base-100 shadow-xl text-center">
      <figure><img src="quizroom.png" alt="Shoes" /></figure>
      <div className="flex card-body items-center items-center justify-center">
        <h2 className="flex card-title">Öppna ett rum Quizrum!</h2>
        <p>Öppna ett rum, välj ett quiz och låt folk joina.</p>
        <button className="btn btn-primary w-full max-w-xs" onClick={openRoom}>Quizroom</button>
      </div>
    </div>
    );
  };

  const UserQuizzesList = () => {
    const quizzes = [
      { id: 1, title: '80-talsmusik Quiz' },
      { id: 2, title: 'Rockmusikens Historia' },
      { id: 3, title: 'Rockmusikens Historia' },

      // Lägg till fler quizzes här
    ];
  
    return (
      <div className="prose overflow-x-auto flex items-center flex-col pt-10">
        <h2>Mina skapade quiz</h2>
        <div className="flex flex-col items-center gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card card-compact w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                <h5 className="card-title">{quiz.title}</h5>
                <button className="btn btn-secondary">Visa Quiz</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
      <main className="flex flex-auto flex-col items-center justify-center">

          <div className="flex flex-col md:flex-row items-center gap-4">
            <CreateQuizCard/>
            {!isAuthorized && (
              <ActionButton
                onClick={() => void tryAuthorize()}
                label="Anslut till Apple Music"
              />
            )}
          </div>
          <UserQuizzesList />

      </main>
    </>
  );
}
