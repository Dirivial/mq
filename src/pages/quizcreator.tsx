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


export default function QuizCreator() {
  const [quizName, setQuizName] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isQuizNameSaved, setIsQuizNameSaved] = useState<boolean>(false);


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

  return (
    <>
      <Head>
        <title>MQ</title>
        <meta name="description" content="Nu är det dags för QUIZ!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-auto flex-col">
        <GoBackButton />
        <div className="flex h-full w-full items-center justify-center">
          {!isQuizNameSaved ? (
          <>
            <QuizNameInput value={quizName} onChange={handleQuizNameChange} onNameSave={handleQuizNameSave} />
          </>
          ) : (
          <div>
            <QuestionForm onQuestionSave={handleQuestionSave} quizName={quizName} onQuizSave={handleQuizSave} onQuizCancel={handleQuizCancel}/>
            {questions.map((question, index) => (
              <div key={index}>Question {index + 1}: {question.name}</div>
            ))}
          </div>
          )}
        </div>
        <ul className="steps steps-horizontal w-full mt-auto pb-2">
              <li className="step step-primary">Namnge</li>
              <li className="step ">Skapa frågor</li>
              <li className="step">Kontrollera</li>
              <li className="step">Spara</li>
        </ul>
      </main>
  </>
);
}