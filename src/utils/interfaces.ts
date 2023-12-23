import type { SimpleQuestion } from "./types";

interface GameStart {
    questionIds: number[];
  }
  
interface NewQuestion {
newQuestionIndex: number;
}

interface CurrentQuestionInterface {
    question: SimpleQuestion;
    currentIndex: number;
    setAnswer?: (answer: boolean) => void; // Optional, as it may not be needed in some cases
    answerSelected?: boolean;
    quizLength?: number;
    allowAnswerSelection: boolean; // Control whether answers are selectable
    time?: number; // Optional, used for displaying a timer or other time-related info
    show?: boolean; // Optional, control whether to show the question
  }
  

export type { GameStart, NewQuestion, CurrentQuestionInterface };