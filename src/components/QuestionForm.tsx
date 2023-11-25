import React, { useState } from 'react';
import { Question, QuestionFormProps } from '~/utils/types';



const QuestionForm: React.FC<QuestionFormProps> = ({ onQuestionSave, quizName, onQuizSave, onQuizCancel}) => {
  const [questionName, setQuestionName] = useState('');
  const [answer1, setAnswer1] = useState({ text: '', correct: false });
  const [answer2, setAnswer2] = useState({ text: '', correct: false });
  const [answer3, setAnswer3] = useState({ text: '', correct: false });
  const [answer4, setAnswer4] = useState({ text: '', correct: false });
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const saveQuestion = () => {
    const newQuestion: Question = {
      name: questionName,
      songId: '', // Replace with actual value
      answers: [] // Replace with actual answers
    };
    onQuestionSave(newQuestion);
  };

  const handleAnswerChange = (text: string, index: number) => {
    // Placeholder for handling answer change
  };

  const handleCorrectAnswerChange = (index: number) => {
    // Placeholder for handling correct answer change
  };

  const handleRadioChange = (index: number) => {
    setCorrectAnswer(index);
    [setAnswer1, setAnswer2, setAnswer3, setAnswer4].forEach((setFunc, idx) => {
      setFunc(prev => ({ ...prev, correct: idx === index }));
    });
  };

  const AnswerInputs = () => {
    return [answer1, answer2, answer3, answer4].map((answer, index) => (
      <div className="flex items-center" key={index}>
        <input
          type="text"
          value={answer.text}
          onChange={(e) => handleAnswerChange(e.target.value, index)}
          placeholder={`Alternativ ${index + 1}`}
          className="input input-bordered input-primary flex-1 mr-2"
        />
        <input
          type="radio"
          name="correctAnswer"
          checked={correctAnswer === index}
          onChange={() => handleRadioChange(index)}
        />
      </div>
    ));
  }


  return (
    <div className='flex flex-col'>
      <div className="prose flex h-fit bg-base-100 card">
        <div className="flex card-body items-center">
            <div className='text-center'>
                <h1 className='mb-0'>{quizName}</h1>
                <p className='mt-0 mb-0 opacity-50'>Quizets namn</p>
            </div>
                <p className='mt-0 mb-0 opacity-90'>Frågan som du vill att spelare ska svara på.</p>
                <input 
                type="text" 
                value={questionName} 
                onChange={(e) => setQuestionName(e.target.value)} 
                placeholder='"Vad heter låten?"' 
                className="input input-bordered input-primary w-full max-w-xs mt-0 mb-5" 
                />
                <AnswerInputs/>
                <button className="btn btn-primary w-full max-w-xs mt-5" onClick={saveQuestion}>Lägg till fråga</button>
        </div>
      </div>
      <div className='flex pt-5'>
        <button className="flex flex-grow btn btn-primary" onClick={onQuizSave}>Avsluta <br/> & Spara</button>
        <div className="divider divider-horizontal"></div>
        <button className="flex flex-grow btn btn-primary" onClick={onQuizCancel}>Avbryt</button>
      </div>
    </div>
  );
};


export default QuestionForm;
