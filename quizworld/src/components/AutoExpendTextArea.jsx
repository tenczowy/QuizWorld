import React, { useRef, useEffect, useState } from 'react';

const AutoExpandTextarea = ({ onChange, id }) => {
  const textareaRef = useRef(null);
  const [areaValue, setAreaValue] = useState('');

  useEffect(() => {
    const textarea = textareaRef.current;

    const handleInput = () => {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
    };

    textarea.addEventListener('input', handleInput);

    // Cleanup event listener on component unmount
    return () => {
      textarea.removeEventListener('input', handleInput);
    };
  }, []);

  function handleValue(e) {
    const value = e.target.value;
    setAreaValue(value);
    onChange(value, id);
  }

  return (
    <textarea
      ref={textareaRef}
      placeholder="Type here..."
      className="auto-expand-textarea"
      onChange={handleValue}
    />
  );
};

export default AutoExpandTextarea;
