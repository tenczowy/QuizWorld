import React, { useEffect, useState } from 'react';
import '../public/QuestionCard.css'; // Import the CSS file
import axios from 'axios';

const QuestionCard = ({
  questionId,
  question,
  answers,
  next,
  questionCount,
}) => {
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [answersToCurrentQuestion, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchTrigger, setFetchTrigger] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:4000/getAnswers', {
          params: { questionId },
        });
        setAnswers(response.data);
      } catch (err) {
        console.log('ERROR FETCHING ANSWERS:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [fetchTrigger]);

  const handleAnswerChange = (event) => {
    setSelectedAnswerId(parseInt(event.target.value, 10));
  };

  const handleNext = () => {
    if (selectedAnswerId !== null) {
      //holds boolean value of submitted answer
      const isCorrect = answersToCurrentQuestion.filter(
        (answer) => answer.id === selectedAnswerId
      )[0].correct;
      next({
        questionId: questionId,
        currentQuestionAnswers: answersToCurrentQuestion,
        selectedAnswerId: selectedAnswerId,
        isCorrect: isCorrect,
      });
      setSelectedAnswerId(null);
      setFetchTrigger((prev) => !prev);
    } else {
      alert('Please select an answer before proceeding.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="question-card">
      <h2 className="question-card__question">{question}</h2>
      <ul className="question-card__answers">
        {answersToCurrentQuestion.map((el) => {
          return (
            <li key={el.id} className="question-card__answer-item">
              <label className="question-card__answer-label">
                <input
                  type="radio"
                  name="answer"
                  value={el.id}
                  checked={selectedAnswerId === el.id}
                  onChange={handleAnswerChange}
                  className="question-card__answer-radio"
                />
                <span className="question-card__answer-text">{el.answer}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <button onClick={handleNext} className="question-card__next-button">
        {questionCount !== 4 ? 'Next' : 'Finish'}
      </button>
    </div>
  );
};

export default QuestionCard;

// {answers.map((answer) => (
// <li key={answer.answerId} className="question-card__answer-item">
//   <label className="question-card__answer-label">
//     <input
//       type="radio"
//       name="answer"
//       value={answer.answerId}
//       checked={selectedAnswerId === answer.answerId}
//       onChange={handleAnswerChange}
//       className="question-card__answer-radio"
//     />
//     <span className="question-card__answer-text">
//       {answer.answer}
//     </span>
//   </label>
// </li>
//   ))}
