import React, { useState, useEffect } from 'react';
import '../public/ManageQuestions.css';
import axios from 'axios';

function QuestionsToVerifyCard({ questionId, categoryName, questionText }) {
  const [isLoading, setIsLoading] = useState(true);
  const [answersToCurrentQuestion, setAnswers] = useState([]);

  useEffect(() => {
    const fetchAnswers = async () => {
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
    fetchAnswers();
  }, []);

  function handleAccept() {
    console.log(questionId);
  }

  function handleDelete() {}

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="questionToVerifyCard">
      <h1>{categoryName}</h1>
      <h2>{questionText}</h2>
      <ul className="answersList">
        {answersToCurrentQuestion.map((answer, index) => (
          <li
            className="answer"
            key={answer.id}
            style={answer.correct ? { color: '#38b000' } : null}
          >
            {index + 1}: {answer.answer}
          </li>
        ))}
      </ul>
      <div className="buttons-container">
        <button className="btn-accpet" onClick={handleAccept}>
          Accept
        </button>
        <button className="btn-delete" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default QuestionsToVerifyCard;
