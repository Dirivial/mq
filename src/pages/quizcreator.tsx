import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import GoBackButton from "~/components/GoBackButton";
import { Question, Quiz, QuizNameInputProps, QuizFormInputProps } from "~/utils/types";
import QuestionForm from "~/components/QuestionForm";




const QuizNameInput: React.FC<QuizNameInputProps> = ({ value, onChange, onNameSave }) => {
  return(
    <div className="flex w-fit h-fit md:w-fit bg-base-100 card">
      <div className="flex card-body">
        <h2 className="card-title">Börja med att namnge ditt quiz!</h2>
        <input type="text" value={value} onChange={onChange} placeholder="Skriv namnet här" className="flex input input-bordered input-primary w-full max-w-xs" />
        <button className="btn btn-primary w-full max-w-xs" onClick={onNameSave}>Spara namn</button>
      </div>
    </div>
  );
};

const QuestionSidebar: React.FC<{
  questions: Question[];
  onSelectQuestion: (index: number) => void;
}> = ({ questions, onSelectQuestion }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th>Nr</th>
            <th>Fråga</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* rows */}
          {questions.map((question, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-base-200" : ""}>
              <th>{index + 1}</th>
              <td>{question.name}</td>
              <td>
                <button 
                  className="btn btn-ghost btn-xs"
                  onClick={() => onSelectQuestion(index)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default function QuizCreator() {
  const [quizName, setQuizName] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isQuizNameSaved, setIsQuizNameSaved] = useState<boolean>(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
    // Moved from QuestionForm
  const [questionName, setQuestionName] = useState('');
  const [answers, setAnswers] = useState(Array.from({ length: 4 }, () => ({ text: '', correct: false })));
  const [correctAnswer, setCorrectAnswer] = useState(-1);

  // Handlers for QuestionForm
  const handleAnswerChange = (text : string, index: number) => {
    console.log(text, index);
    // ... logic to update answers
  };

  const handleCorrectAnswerChange = (index : number) => {
    console.log(index);
    // ... logic to update correct answer
  };

  const handleQuizNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setQuizName(event.target.value);
  };

  const handleQuizNameSave = () => {
    setIsQuizNameSaved(true);
  };

  const handleQuestionSave = (newQuestion: Question) => {
    console.log(newQuestion);
    setQuestions([...questions, newQuestion]);
  };

  const handleQuizSave = () => {
    const newQuiz: Quiz = { name: quizName, questions };
    // Code to save the entire quiz
    console.log(newQuiz);
  };

  const handleQuizCancel = () => {
    const newQuiz: Quiz = { name: quizName, questions };
    console.log(newQuiz);
  };

  const handleSelectQuestion = (index: number) => {
    setSelectedQuestionIndex(index);
    // Logic to load the selected question for editing
    // For example, you might want to set the form state to the selected question's data
  };

  return (
    <>
      <Head>
        <title>MQ</title>
        <meta name="description" content="Nu är det dags för QUIZ!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-auto flex-row justify-center items-center">
        <GoBackButton />
        <div className="flex h-full w-full justify-center gap-5"></div>
        <div className="flex h-full w-full justify-center gap-5">
          <div className="flex">
            {!isQuizNameSaved 
              ? <QuizNameInput value={quizName} onChange={handleQuizNameChange} onNameSave={handleQuizNameSave} />
              :     <QuestionForm 
                      onQuestionSave={handleQuestionSave} 
                      quizName={quizName} 
                      onQuizSave={handleQuizSave} 
                      onQuizCancel={handleQuizCancel}
                      questionName={questionName}
                      onQuestionNameChange={setQuestionName}
                      answers={answers}
                      onAnswerChange={handleAnswerChange}
                      correctAnswer={correctAnswer}
                      onCorrectAnswerChange={handleCorrectAnswerChange}
                      />
            }
          </div>
        </div>
        <div className="flex h-full w-full justify-center gap-5">
          {isQuizNameSaved && questions.length > 0 && (
              <QuestionSidebar 
                questions={questions} 
                onSelectQuestion={handleSelectQuestion} 
              />
            )}
        </div>

      </main>
    </>
  );
}