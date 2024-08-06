import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../public/AddQuestionForm.css';
import AutoExpandTextarea from './AutoExpendTextArea';
import { Navigate, useNavigate } from 'react-router-dom';

function AddQuestionForm() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const [formValues, setFormValues] = useState({
    category: '',
    question: '',
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    correct: '1',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('http://localhost:4000/getCategories');
        setAllCategories(res.data);
      } catch (err) {
        console.log('error');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (allCategories.length > 0) {
      setFormValues((prevValues) => ({
        ...prevValues,
        category: String(allCategories[0].id),
      }));
    }
  }, [allCategories]);

  const handleChange = (value, id) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSelect = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    handleChange(value, name);
  };

  const handleSubmit = async (event) => {
    const userId = sessionStorage.getItem('userId');
    event.preventDefault();
    if (validateForm(formValues) === false) {
      alert('All fields are required!');
    } else {
      try {
        const res = await axios.post('http://localhost:4000/addQuestion', {
          params: {
            formData: formValues,
            userId: userId,
          },
        });
        alert(res.data.result);
        setRefreshKey((oldKey) => oldKey + 1);
      } catch {
        console.log('Error during sending submit request');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="add-question-form"
      key={refreshKey}
    >
      <div className="form-group-addQuestion">
        <label htmlFor="category">Choose Category: </label>
        <select name="category" id="category" onChange={handleSelect} required>
          {allCategories.map((category) => {
            return (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="form-group-addQuestion">
        <label htmlFor="question">Question</label>
        <AutoExpandTextarea
          id="question"
          className="auto-expand-area"
          onChange={handleChange}
        />
      </div>
      <div className="form-group-addQuestion">
        <label htmlFor="answer1">Answer 1</label>
        <AutoExpandTextarea
          id="answer1"
          className="auto-expand-area"
          onChange={handleChange}
        />

        <label htmlFor="answer2">Answer 2</label>
        <AutoExpandTextarea
          id="answer2"
          className="auto-expand-area"
          onChange={handleChange}
        />

        <label htmlFor="answer3">Answer 3</label>
        <AutoExpandTextarea
          id="answer3"
          className="auto-expand-area"
          onChange={handleChange}
        />

        <label htmlFor="answer4">Answer 4</label>
        <AutoExpandTextarea
          id="answer4"
          className="auto-expand-area"
          onChange={handleChange}
        />

        <label htmlFor="correct">Correct answer is?</label>
        <select
          name="correct"
          id="correct-answer"
          onChange={handleSelect}
          required
        >
          <option value="1">Answer 1</option>
          <option value="2">Answer 2</option>
          <option value="3">Answer 3</option>
          <option value="4">Answer 4</option>
        </select>
      </div>
      <div className="form-group-addQuestion, form-btns-container">
        <button>Submit</button>
      </div>
    </form>
  );
}

function validateForm(formData) {
  const isValid = !Object.values(formData).some((el) => el.trim().length === 0);
  return isValid;
}

export default AddQuestionForm;
