import React from 'react';
import backgroundImage from '../staticFiles/Poe-Logo.jpg';

function CategoryCard(props) {
  return (
    <div
      className="category-card"
      style={{ backgroundImage: `url(${props.background})` }}
    >
      <h2>{props.title}</h2>
      <button
        onClick={() => props.onStart(props.categoryId)}
        className="start-button"
      >
        Start
      </button>
    </div>
  );
}

export default CategoryCard;
