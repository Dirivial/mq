import type { CurrentQuestionInterface } from "~/utils/interfaces";
  

function ShowCurrentQuestion(props: CurrentQuestionInterface) {
    // Use show prop to control rendering of the question
    if (props.show === false) {
      return null; // Don't render anything if show is explicitly set to false
    }

    const handleAnswerClick = (answerCorrect: boolean) => {
        if (props.allowAnswerSelection && props.setAnswer) {
          props.setAnswer(answerCorrect);
        }
    };
  
    return (
      <div className="flex flex-grow card bg-base-100 shadow-xl">
      <main className="mx-auto my-auto flex h-[60vh] w-full flex-col items-center justify-center md:pl-10 md:pr-10 pl-5 pr-5 pt-5">
        <div className="flex flex-col flex-grow w-full justify-center">
          <h1 className="text-center text-4xl font-bold mt-5 ">{props.question.name}</h1>
          {props.answerSelected ? (
            <div className="flex mt-10 grid grid-cols-1 gap-2 prose text-center">
              <h1>Svar registrerat! Häng kvar så kommer nästa fråga strax.</h1>
            </div>
          ) : (
            <div className="flex flex-grow mt-10 grid grid-cols-2 gap-2">
              {props.question.answers.map((answer, index) => (
                <button
                  className="flex flex-grow h-full btn btn-outline btn-accent md:text-4xl text-xl font-bold"
                  key={index}
                  onClick={() => handleAnswerClick(answer.correct)}
                >
                  <h3>{answer.text}</h3>
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-col mt-10 mb-10">
            {props.time !== undefined && (
              <progress
                className="progress w-full mx-auto"
                value={props.time}
                max="30"
              ></progress>
            )}
            <h3 className="text-center text-4xl font-bold mt-5">
              {props.currentIndex + 1}/{props.quizLength}
            </h3>
          </div>
        </div>
      </main>
    </div>
    );
  }
  

  

export default ShowCurrentQuestion;