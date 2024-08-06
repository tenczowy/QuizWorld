import React, { useState, useEffect } from 'react';
import CategoryCard from './CategoryCard';
import '../public/App.css';
import '../public/NavBar.css';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import QuestionCard from './QuestionCard';
import resetSession from '../utils/resetSession.js';
import ResultQuestionCard from './ResultQuestionCard.jsx';
import NavBar from './NavBar.jsx';
import { useLocation } from 'react-router-dom';

function App() {
  const [sessionToken, setSessionToken] = useState(null);
  const [currentCategory, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [loginStatus, setLoginStatus] = useState();
  const location = useLocation();

  useEffect(() => {
    setLoginStatus(JSON.parse(sessionStorage.getItem('loginStatus')) || false);
  }, []);

  // FETCH ALL CATEGORIES FROM DATABASE
  useEffect(() => {
    async function fetchData() {
      try {
        await axios
          .get('http://localhost:4000/getCategories')
          .then((res) => {
            setAllCategories(res.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching data: ', error);
            setIsLoading(false);
          });
      } catch (err) {
        console.log('error');
      }
    }
    fetchData();
  }, [sessionToken, loginStatus, location.key]);

  useEffect(() => {
    let token = sessionStorage.getItem('sessionToken');
    //RESET ALL STATES AFTER REFRESH
    setIsLoading(true);
    setQuestions([]);
    setCurrentQuestion(0);
    setIsFinished(false);
    setUserAnswers([]);
    setUserScore(0);
    setCategory(null);

    sessionStorage.setItem('isFinished', false);

    if (!token) {
      token = uuidv4();
      sessionStorage.setItem('sessionToken', token);
    }
    setSessionToken(token);

    if (!currentCategory) {
      setCategory(sessionStorage.getItem('currentCategory'));
    } else {
      sessionStorage.removeItem('currentCategory');
    }
  }, [sessionToken, loginStatus, location.key]);

  async function startQuiz(quizId) {
    setCategory(quizId);
    sessionStorage.setItem('currentCategory', quizId);

    await getQuestions(quizId);
  }

  async function getQuestions(quizId) {
    try {
      await axios
        .get('http://localhost:4000/getQuestions', {
          params: { quizId },
        })
        .then((res) => {
          setQuestions(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data: ', error);
          setIsLoading(false);
        });
    } catch (err) {
      console.error('Error fetching questions', +err);
    }
  }

  function handleNextQuestion(questionState) {
    if (currentQuestion === questions.length - 1) {
      setIsFinished(true);
      sessionStorage.setItem('isFinished', true);
      setUserAnswers((prev) => [...prev, questionState]);
    } else {
      setUserAnswers((prev) => [...prev, questionState]);
      setUserScore((prev) => {
        if (questionState.isCorrect) {
          return prev + 1;
        } else {
          return prev;
        }
      });
      setCurrentQuestion(currentQuestion + 1);
    }
  }

  if (isLoading) return <div>Loading...</div>;

  if (isFinished) {
    const endScore = Math.round((userScore / questions.length) * 100);
    return (
      <div className="container">
        <NavBar />
        <div className="container-centered">
          <p className="score-result">
            {endScore > 50
              ? 'Good Job, you scored'
              : 'Try to improve, you scored'}{' '}
            {endScore}%
          </p>
          {userAnswers.map((el) => {
            const questionToPass = questions.filter(
              (question) => question.id === el.questionId
            );
            const questionText = questionToPass[0].question;

            return (
              <ResultQuestionCard
                key={el.questionId}
                question={questionText}
                questionId={el.questionId}
                answersToQuestions={el.currentQuestionAnswers}
                correct={el.isCorrect}
                selectedAnswer={el.selectedAnswerId}
              />
            );
          })}
          <button onClick={resetSession} className="btn btn-reset-quiz">
            Take another quiz!
          </button>
        </div>
      </div>
    );
  }
  //If session token exists print current state of quiz, otherwise start new session

  if (sessionToken) {
    //If player chosen category print current state of started quiz otherwise print home page
    if (currentCategory) {
      if (questions.length > 0) {
        return (
          <div className="container">
            <NavBar />
            <div className="container-questions container-centered">
              <QuestionCard
                question={questions[currentQuestion].question}
                questionId={questions[currentQuestion].id}
                next={handleNextQuestion}
                questionCount={currentQuestion}
              />
            </div>
          </div>
        );
      } else {
        return <h1>ERROR</h1>;
      }
    } else {
      return (
        <div className="container">
          <NavBar />
          <h1>Quiz World</h1>
          <div className="category-container">
            {allCategories.map((el) => {
              return (
                <CategoryCard
                  key={el.id}
                  background={el.background_img}
                  title={el.name}
                  categoryId={el.id}
                  onStart={startQuiz}
                />
              );
            })}
          </div>
        </div>
      );
    }
  }
}

export default App;
