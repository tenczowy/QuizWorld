import React, { useState, useEffect } from 'react';
import '../public/ManageQuestions.css';
import axios from 'axios';

function QuestionsToVerifyCard({
  questionId,
  categoryName,
  questionText,
  onAction,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [answersToCurrentQuestion, setAnswers] = useState([]);
  const authToken = sessionStorage.getItem('authToken');

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/getAnswers', {
          params: { questionId },
        });
        setAnswers(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log('ERROR FETCHING ANSWERS:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnswers();
  }, [questionId]);

  function handleAccept() {
    const isConfirmed = window.confirm(
      'Are you sure you want to accept this question?'
    );

    if (isConfirmed) {
      const sendAcceptRequest = async () => {
        try {
          const response = await axios.put(
            `http://localhost:4000/acceptQuestion/${questionId}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setIsLoading(false);
          const message = response.data.result;
          onAction(questionId, message);
        } catch (err) {
          console.log('Error during sending accept request: ', err);
        }
      };
      sendAcceptRequest();
    }
  }

  function handleDelete() {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this question?'
    );

    if (isConfirmed) {
      const sendDeleteRequest = async () => {
        try {
          const response = await axios.delete(
            `http://localhost:4000/deleteQuestion/${questionId}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setIsLoading(false);
          const message = response.data.result;
          onAction(questionId, message);
        } catch (err) {
          console.log('Error during sending delete request: ', err);
        }
      };
      sendDeleteRequest();
    }
  }

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
