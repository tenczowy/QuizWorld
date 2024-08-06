import React, { useEffect, useState } from 'react';
import '../public/QuestionCard.css'; // Import the CSS file
import axios from 'axios';

function ResultQuestionCard({
  question,
  questionId,
  answersToQuestions,
  correct,
  selectedAnswer,
}) {
  return (
    <div className="question-card">
      <h2 className="question-card__question">{question}</h2>
      <ul className="question-card__answers">
        {answersToQuestions.map((el) => {
          return (
            <li key={el.id} className="question-card__answer-item">
              <label
                className="question-card__answer-label question-card_result"
                style={
                  correct && el.correct
                    ? { backgroundColor: '#4f772d' }
                    : selectedAnswer === el.id && !correct
                    ? { backgroundColor: 'red' }
                    : el.correct && !correct
                    ? { backgroundColor: '#40916c' }
                    : { backgroundColor: 'null' }
                }
              >
                <input
                  name="answer"
                  value={el.id}
                  className="question-card__answer-radio"
                  readOnly
                />
                <span className="question-card__answer-text">{el.answer}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ResultQuestionCard;
