import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import '../public/ManageQuestions.css';
import axios from 'axios';
import QuestionsToVerifyCard from './QuestionToVerifyCard';

function ManageQuestions() {
  const [isLoading, setIsLoading] = useState(true);
  const [questionsToVerify, setQuestionsToVerify] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios.get(
          'http://localhost:4000/questionsToVerify'
        );
        setIsLoading(false);
        setQuestionsToVerify(result.data);
      } catch (err) {
        console.log('error sending fetch request' + err);
      }
    }

    fetchData();
  }, []);

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="manageQuestionsContainer">
      <NavBar />
      <div className="manageQuestionsContent">
        {questionsToVerify.map((question) => (
          <QuestionsToVerifyCard
            key={question.id}
            questionId={question.id}
            categoryName={question.categoryname}
            questionText={question.question}
          />
        ))}
      </div>
    </div>
  );
}

export default ManageQuestions;
