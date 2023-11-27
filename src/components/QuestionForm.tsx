import React, { useState } from 'react';
import { Question, QuestionFormProps, Answer } from '~/utils/types';

const AnswerInput: React.FC<{
  value: string;
  index: number;
  onChange: (text: string, index: number) => void;
}> = React.memo(({ value, index, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value, index)}
        placeholder={`Alternativ ${index + 1}`}
        className="flex input input-bordered w-full input-primary"
      />
    </div>
  );
});

const AnswerInputs: React.FC<{
  answers: Answer[];
  onAnswerChange: (text: string, index: number) => void;
}> = ({ answers, onAnswerChange }) => {
  return (
    <div>
    <p className='flex mb-0'>Fyll i svarsalternativen och välj det korrekta alternativet.</p>
    <div className="flex grid grid-cols-2 gap-2">
      {answers.map((answer, index) => (
        <AnswerInput key={index} value={answer.text} index={index} onChange={onAnswerChange} />
      ))}
    </div>
    </div>
  );
};

const SelectSong: React.FC = React.memo(() => {
  const showModal = () => {
    const dialog = document.getElementById('my_modal_5');
    if (dialog instanceof HTMLDialogElement) {
      dialog.showModal();
    } else {
      console.error('Dialog element not found or incorrect type');
    }
  };

  return (
    <div className='flex'>
      <button className="flex btn btn-primary w-full" onClick={showModal}>Koppla låt</button>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
});

const NameQuestion: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = React.memo(({ value, onChange }) => {
  return (
    <div>
      <p className='flex opacity-90 mb-0 mt-0'>Frågan som du vill att spelare ska svara på.</p>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder='"Vad heter låten?"' 
        className="flex input input-bordered input-primary w-full max-w-x" 
      />
    </div>
  );
});

const SelectCorrectAnswer: React.FC<{
  answers: Answer[];
  correctAnswer: number;
  onCorrectAnswerChange: (index: number) => void;
}> = ({ answers, correctAnswer, onCorrectAnswerChange }) => {
  return (
    <div className='flex flex-col w-full'>
      <p className='flex mb-0'>Välj det korrekta svaret.</p>
      <select className="select select-primary w-full" value={correctAnswer} onChange={(e) => onCorrectAnswerChange(parseInt(e.target.value))}>
        <option disabled value={-1}>Välj det korrekta svaret</option>
        {answers.map((answer, index) => (
          <option key={index} value={index}>{answer.text || `Alternativ ${index + 1}`}</option>
        ))}
      </select>
    </div>
  );
};

const QuestionForm: React.FC<QuestionFormProps> = ({ onQuestionSave, quizName, onQuizSave, onQuizCancel }) => {
  const [questionName, setQuestionName] = useState('');
  const [answers, setAnswers] = useState<Answer[]>(Array.from({ length: 4 }, () => ({ text: '', correct: false })));
  const [correctAnswer, setCorrectAnswer] = useState(-1);

  const handleAnswerChange = (text: string, index: number) => {
    const newAnswers = answers.map((answer, idx) => ({
      ...answer,
      text: idx === index ? text : answer.text
    }));
    setAnswers(newAnswers);
  };

  const handleCorrectAnswerChange = (index: number) => {
    setCorrectAnswer(index);
    const newAnswers = answers.map((answer, idx) => ({
      ...answer,
      correct: idx === index
    }));
    setAnswers(newAnswers);
  };

  const saveQuestion = () => {
    const newQuestion: Question = {
      name: questionName,
      songId: '', // Replace with actual value
      answers: answers,
    };
    onQuestionSave(newQuestion);
  };

  return (
    <div className='flex flex-col'>
      <div className="prose flex h-fit bg-base-100 card">
        <div className="flex card-body items-center">
          <div className='flex flex-col text-center'>
            <h1 className='-mb-3'>{quizName}</h1>
            <p className='mt-0 mb-0 opacity-50'>quizets namn</p>
          </div>
          <div className='flex flex-col w-full gap-2'>
            <NameQuestion value={questionName} onChange={setQuestionName} />
            <SelectSong />
          </div>
          <AnswerInputs answers={answers} onAnswerChange={handleAnswerChange} />
          <SelectCorrectAnswer answers={answers} correctAnswer={correctAnswer} onCorrectAnswerChange={handleCorrectAnswerChange} />
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
