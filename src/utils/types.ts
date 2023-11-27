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
  onQuestionSave: (newQuestion: Question) => void;
  quizName: string;
  onQuizSave: () => void;
  onQuizCancel: () => void;
};

export type Answer = {
  text: string;
  correct: boolean;
};