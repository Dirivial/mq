import React, { useState } from 'react';
import type { Question, QuestionFormProps, Answer } from '~/utils/types';

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
        className="flex input input-bordered w-full"
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
    <div className='prose'>
        <h3 className='flex opacity-90 mb-0 mt-0'>Fyll i svarsalternativen och välj det korrekta alternativet.</h3>
    </div>
    <div className="flex grid grid-cols-2 gap-2">
      {answers.map((answer, index) => (
        <AnswerInput key={index} value={answer.text} index={index} onChange={onAnswerChange} />
      ))}
    </div>
    </div>
  );
};

const SelectSong: React.FC = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState('');

  const showModal = () => {
    const dialog = document.getElementById('my_modal_5');
    if (dialog instanceof HTMLDialogElement) {
      dialog.showModal();
    } else {
      console.error('Dialog element not found or incorrect type');
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement search logic here or call a function that handles it
    console.log('Searching for:', searchTerm);
  };

  const handleSave = () => {
    // Implement save logic here or call a function that handles it
    console.log(`saving song ${searchTerm}`);

    // Close the modal after saving
    const dialog = document.getElementById('my_modal_5');
    if (dialog instanceof HTMLDialogElement) {
      dialog.close();
    } else {
      console.error('Dialog element not found or incorrect type');
    }
  }

  return (
    <div className='flex items-center justify-center '>
      <button className="flex btn btn-primary w-full" onClick={showModal}>Koppla en låt</button>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="prose flex flex-col items-center modal-box">
          <h2 >Sök efter en låt</h2>
          <form className="flex flex-col w-full" onSubmit={handleSearch}>
            <input 
              type="text" 
              className="flex input input-bordered w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Skriv ett sångnamn..."
            />
            <div className="modal-action">
              <button type="submit" className="flex flex-1 btn btn-primary" onClick={handleSearch}>Sök</button>
              <button type="button" className="flex flex-1 btn btn-primary " onClick={handleSave}>Spara</button>

            </div>
          </form>
          <div className="flex w-full flex-col modal-action">
            <form method="dialog" className='flex flex-1'>
              <button className="btn flex flex-grow" onClick={() => setSearchTerm('')}>Avbryt</button>
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
    <div className='flex flex-col w-full '>
      <div className='prose'>
        <h3 className='flex opacity-90 mb-0 mt-0'>Frågan som du vill att spelare ska svara på.</h3>
      </div>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder='Ställ din fråga...' 
        className="flex input input-bordered w-full max-w-x h-20" 
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
      <div className='prose'>
        <h3 className='flex opacity-90 mb-0 mt-0'>Välj det korrekta svaret</h3>
      </div>
      <select className="select select-bordered w-full" value={correctAnswer} onChange={(e) => onCorrectAnswerChange(parseInt(e.target.value))}>
        <option disabled value={-1}>Välj det korrekta svaret</option>
        {answers.map((answer, index) => (
          <option key={index} value={index}>{answer.text || `Alternativ ${index + 1}`}</option>
        ))}
      </select>
    </div>
  );
};

AnswerInput.displayName = 'AnswerInput'; 
SelectSong.displayName = 'SelectSong'; 
NameQuestion.displayName = 'NameQuestion';

const QuestionForm: React.FC<QuestionFormProps> = ({ 
  onQuestionSave, 
  quizName, 
  onQuizSave, 
  onQuizCancel,
  questionName,
  onQuestionNameChange,
  answers,
  onAnswerChange,
  correctAnswer,
  onCorrectAnswerChange,
 }) => {

  const saveQuestion = () => {
    // Construct the new question object
    const newQuestion: Question = {
      name: questionName,
      songId: '', // Assuming you have a way to set this
      answers: answers,
    };
    
    // Call the passed onQuestionSave function with the new question
    onQuestionSave(newQuestion);
  };

  return (
    <div className='flex flex-col w-full h-full'>
      <div className="flex flex-grow bg-base-100 rounded">
        <div className="flex flex-grow flex-col p-5 items-center justify-between">
          <div className='flex flex-col text-center prose items-center '>
            <h1 className='-mb-3'>{String(quizName).toUpperCase()}</h1>
            <p className='mt-0 mb-0 opacity-50'>QUIZETS NAMN</p>
          </div>
          <div className='flex flex-col w-full gap-2'>
            <NameQuestion value={questionName} onChange={onQuestionNameChange} />
            <SelectSong />
          </div>
          <div className='flex flex-col w-full'>
            <AnswerInputs answers={answers} onAnswerChange={onAnswerChange} />
          </div>
          <SelectCorrectAnswer answers={answers} correctAnswer={correctAnswer} onCorrectAnswerChange={onCorrectAnswerChange} />

        </div>
      </div>
      <button className="btn btn-primary w-full mt-5" onClick={saveQuestion}>Lägg till fråga</button>
      <div className='flex pt-5'>
        <button className="flex flex-grow btn btn-secondary" onClick={onQuizSave}>Avsluta <br/> & Spara</button>
        <div className="divider divider-horizontal"></div>
        <button className="flex flex-grow btn btn-secondary" onClick={onQuizCancel}>Avbryt</button>
      </div>
    </div>
  );
};

export default QuestionForm;
