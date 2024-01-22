//import Link from "next/link";
import { useState } from "react";
import type { Question} from "~/utils/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { createAvatar } from '@dicebear/core';
import { personas } from '@dicebear/collection';



/*
const QuestionDetail: React.FC<{ question: Question }> = ({ question }) => {
    return (
      <div>
        <p><strong>Fråga:</strong> {question.name}</p>
        <ul>
          {question.answers.map((answer, index) => (
            <li key={index} className={answer.correct ? "text-green-500" : ""}>
              {answer.text} {answer.correct ? "(Korrekt)" : ""}
            </li>
          ))}
        </ul>
      </div>
    );
  };


const Sidebar: React.FC<{
    questions: Question[];
    onSelectQuestion: (index: number) => void;
  }> = ({ questions, onSelectQuestion }) => {
    const [selectedQuestionDetail, setSelectedQuestionDetail] = useState<number | null>(null);
  
    const showQuestionDetail = (index: number) => {
      if (index >= 0 && index < questions.length) {
        setSelectedQuestionDetail(index);
      }
    };
  
    const closeQuestionDetail = () => {
      setSelectedQuestionDetail(null);
    };
  
    const selectedQuestion = selectedQuestionDetail !== null ? questions[selectedQuestionDetail] : undefined;
  
    return (
      <div className="flex overflow-y-auto h-full max-h-full w-full bg-base-100">
        <table className="table w-full ">
          <thead>
            <tr>
              <th>Nr</th>
              <th>Fråga</th>
              <th>Låt</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-base-300" : ""}>
                <th>{index + 1}</th>
                <td>
                  <button 
                    className="btn btn-ghost btn-xs"
                    onClick={() => showQuestionDetail(index)}>
                    {question.name}
                  </button>
                </td>
                <td>***</td>
                <td>
                  <button 
                    className="btn btn-ghost btn-xs"
                    onClick={() => onSelectQuestion(index)}>
                    Redigera
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedQuestion && (
          <div className="modal modal-open">
            <div className="modal-box">
              <QuestionDetail question={selectedQuestion} />
              <div className="modal-action">
                <button className="btn btn-primary" onClick={closeQuestionDetail}>Stäng</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
*/



const Sidebar = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const currentPage = String(router.pathname).split("/")[1];

  const handleSignOut = () => {
    void signOut({ callbackUrl: "/" });
  };

  const avatar = createAvatar(personas, {
    seed: `${sessionData?.user?.name ?? "no user"}`,
  });
  
  const svg = avatar.toString(); 

  const UserIndicator = () => {
    if (sessionData) {
      return (
        <div className="flex flex-col items-center prose">
          <div className="card flex h-60 w-3/4 bg-base-200 shadow-xl rounded-full justify-center">
                <svg
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
          </div>
          <h2 className="mt-5">
            Hej {String(sessionData.user.name)}!
          </h2>
        </div>
      );
    } else {
      return (
        <div className="avatar indicator flex ">
          <div className="flex h-15 w-10 rounded-full ">
            <img
              alt="No login"
              src="https://raw.githubusercontent.com/Dirivial/mq/main/public/qmark.png"
            />
          </div>
        </div>
      );
    }
  };

  const UserStats = () => {
    if (sessionData) {
      return (
        <div className="flex flex-col items-center prose pt-5">
          <div className="flex space-x-4">
            <div className="flex flex-row w-24 h-32 bg-green-opacity shadow-xl rounded-xl justify-center items-center">
              <p className="text-4xl font-bold ">0</p>
              <p className="text-xl">Rätt</p>
            </div>
            <div className="flex flex-row w-24 h-32 bg-red-opacity shadow-xl rounded-xl justify-center items-center">
              <p className="text-4xl font-bold">0</p>
              <p className="text-xl">Fel</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center prose pt-5">
          <div className="flex space-x-4">
            <div className="flex flex-row w-24 h-32 bg-green-opacity shadow-xl rounded-xl justify-center items-center">
              <p className="text-4xl font-bold ">0</p>
              <p className="text-xl">Rätt</p>
            </div>
            <div className="flex flex-row w-24 h-32 bg-red-opacity shadow-xl rounded-xl justify-center items-center">
              <p className="text-4xl font-bold">0</p>
              <p className="text-xl">Fel</p>
            </div>
          </div>
        </div>
      );
    }
  }
  
    return (
        <div className="flex w-1/4 flex-col bg-base-100 justify-center items-center">
            <UserIndicator />
            <UserStats></UserStats>
        </div>
    );
}

  export default Sidebar;
