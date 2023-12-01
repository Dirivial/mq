import Head from "next/head";
//import Link from "next/link";
import { useState } from "react";
import GoBackButton from "~/components/layout/GoBackButton";
import type { Question, Quiz, QuizNameInputProps,} from "~/utils/types";
import QuestionForm from "~/components/quizcreation/QuestionForm";
import Sidebar from "~/components/layout/Sidebar";

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
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [questionName, setQuestionName] = useState('');
  const [answers, setAnswers] = useState(Array.from({ length: 4 }, () => ({ text: '', correct: false })));
  const [correctAnswer, setCorrectAnswer] = useState(-1);
  console.log(selectedQuestionIndex);

  // Handlers for QuestionForm
  const handleAnswerChange = (text : string, index: number) => {
    setAnswers(answers => answers.map((answer, idx) => {
      if (idx === index) {
        return { ...answer, text: text };
      } else {
        return answer;
      }
    }));
  };
  
  const handleCorrectAnswerChange = (index: number) => {
    setCorrectAnswer(index);
    setAnswers(answers => answers.map((answer, idx) => ({
      ...answer,
      correct: idx === index
    })));
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
      <main className="flex flex-auto">
        <GoBackButton />
        <div className="flex flex-auto items-center justify-center gap-5 p-5">
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
        <div className="flex w-1/3">
              <Sidebar 
                questions={questions} 
                onSelectQuestion={handleSelectQuestion} 
              />
        </div>

      </main>
    </>
  );
}