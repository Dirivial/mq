//import Link from "next/link";
import { useState } from "react";
import type { Question} from "~/utils/types";


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
      <div className="overflow-y-auto h-full max-h-full w-full bg-base-100">
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

  export default Sidebar;