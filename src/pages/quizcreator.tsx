import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import GoBackButton from "~/components/GoBackButton";

type Question = {
  name: string;
  songId: string;
  answers: { text: string; correct: boolean }[];
};

type Quiz = {
  name: string;
  questions: Question[];
};

type QuizNameInputProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNameSave: () => void;
};

const QuizNameInput: React.FC<QuizNameInputProps> = ({ value, onChange, onNameSave }) => {
  return(
    <div className="flex flex-auto card">
      <div className="flex card-body items-center items-center justify-center">
        <h2 className="card-title">Börja med att namnge ditt quiz!</h2>
        <input type="text" value={value} onChange={onChange} placeholder="Skriv namnet här" className="flex input input-bordered input-primary w-full max-w-xs" />
        <button className="btn btn-primary w-full max-w-xs" onClick={onNameSave}>Spara namn</button>
      </div>
    </div>
  );
};



const QuestionForm: React.FC<{ onSave: (question: Question) => void }> = ({ onSave }) => {
  // Implement the form here
  return <div>*Question form*</div>;
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
    setQuestions([...questions, newQuestion]);
  };

  const handleQuizSave = () => {
    const newQuiz: Quiz = { name: quizName, questions };
    // Code to save the entire quiz
    console.log(newQuiz);
  };

  return (
    <>
      <Head>
        <title>MQ</title>
        <meta name="description" content="Nu är det dags för QUIZ!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-auto justify-center">
        <GoBackButton />
        {!isQuizNameSaved ? (
        <>
          <QuizNameInput value={quizName} onChange={handleQuizNameChange} onNameSave={handleQuizNameSave} />
        </>
      ) : (
        <div>
          {/* The component or message you want to show after the quiz is saved */}
          <QuestionForm onSave={handleQuestionSave} />
          <button className="btn btn-primary" onClick={handleQuizSave}>Spara Quiz</button>
          {questions.map((question, index) => (
            <div key={index}>Question {index + 1}: {question.name}</div>
          ))}
          {/* You can add more components or logic here */}
        </div>
      )}
    </main>
  </>
);
}