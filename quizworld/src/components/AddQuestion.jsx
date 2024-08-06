import React from 'react';
import NavBar from './NavBar';
import AddQuestionForm from './AddQuestionForm';
function AddQuestion() {
  return (
    <div className="container">
      <NavBar />
      <div className="container-centered">
        <AddQuestionForm />
      </div>
    </div>
  );
}

export default AddQuestion;
