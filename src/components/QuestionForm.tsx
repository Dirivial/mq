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

  const SelectCorrectAnswer = () => {
    const options = ["1", "2", "3", "4"];
    return (
      <select className="select select-primary w-full">
        <option disabled selected>Välj det korrekta svaret</option>
        {options.map((option, index) => (
          <option key={index}>Svarsalternativ {option}</option>
        ))}
      </select>
    );
  }

  const AnswerInputs = () => {
    return (
      <div className="grid grid-cols-2 gap-4"> {/* Grid container for 2x2 layout */}
        {[answer1, answer2, answer3, answer4].map((answer, index) => (
          <div className="flex items-center" key={index}>
            <input
              value={answer.text}
              onChange={(e) => handleAnswerChange(e.target.value, index)}
              placeholder={`Alternativ ${index + 1}`}
              className="flex input input-bordered input-primary flex-1 mr-2"
            />
          </div>
        ))}
      </div>
    );
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
                <SelectCorrectAnswer/>
        </div>
      </div>

      <button className="btn btn-primary w-full mt-5" onClick={saveQuestion}>Lägg till fråga</button>
      <div className='flex pt-5'>
        <button className="flex flex-grow btn btn-primary" onClick={onQuizSave}>Avsluta <br/> & Spara</button>
        <div className="divider divider-horizontal"></div>
        <button className="flex flex-grow btn btn-primary" onClick={onQuizCancel}>Avbryt</button>
      </div>
    </div>
  );
};


export default QuestionForm;
