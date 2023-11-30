export type Question = {
    name: string;
    songId: string;
    answers: { text: string; correct: boolean }[];
  };
  
export type Quiz = {
name: string;
questions: Question[];
};

export type QuizNameInputProps = {
value: string;
onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
onNameSave: () => void;
};

export type QuizFormInputProps = {
    //value: string;
    onQuestionSave: (newQuestion: Question) => void;
    //onNameSave: () => void;
    quizName: string;
};

export type QuestionFormProps = {
  questionName: string;
  onQuestionSave: (newQuestion: Question) => void;
  quizName: string;
  onQuizSave: () => void;
  onQuizCancel: () => void;
  onQuestionNameChange: (name : string) => void;
  answers: { text: string; correct: boolean }[];
  onAnswerChange: (answer: string, index: number) => void;
  correctAnswer: number;
  onCorrectAnswerChange: (index: number) => void;
};

export type Answer = {
  text: string;
  correct: boolean;
};