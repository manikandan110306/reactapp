import React, { useState } from "react";
import axios from "axios";

const QuestionForm = ({ quizzes = [], quizId: propQuizId = null }) => {
  const [quizId, setQuizId] = useState(propQuizId || "");
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("MULTIPLE_CHOICE");
  const [options, setOptions] = useState([
    { optionText: "", correct: false },
    { optionText: "", correct: false },
    { optionText: "", correct: false },
    { optionText: "", correct: false },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = value;
    setOptions(updatedOptions);
  };

  const handleCorrectChange = (index) => {
    if (questionType === "MULTIPLE_CHOICE") {
      const updatedOptions = options.map((opt, i) => ({
        ...opt,
        correct: i === index,
      }));
      setOptions(updatedOptions);
    } else {
      const updatedOptions = [...options];
      updatedOptions[index].correct = !updatedOptions[index].correct;
      setOptions(updatedOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quizId) {
      setMessage({ text: "Please select a quiz first!", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const payload = {
        questionText,
        questionType,
        options: options.map((opt) => ({ optionText: opt.optionText, isCorrect: opt.correct })),
      };
      await axios.post(`http://localhost:8080/api/quizzes/${quizId}/questions`, payload);
      setMessage({ text: "Question added successfully!", type: "success" });
      setQuestionText("");
      setOptions([
        { optionText: "", correct: false },
        { optionText: "", correct: false },
        { optionText: "", correct: false },
        { optionText: "", correct: false },
      ]);
    } catch (error) {
      console.error(error);
      setMessage({ text: "Failed to add question. Please check your connection.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card question-form">
      <h2>Add Question</h2>

      {message.text && (
        <div className={`message ${message.type === "error" ? "error" : "success"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Quiz Select Dropdown */}
        <div className="form-row">
          <label className="block font-medium text-gray-700 mb-1">Select Quiz</label>
          {propQuizId ? (
            <div className="form-input">Selected Quiz ID: {propQuizId}</div>
          ) : (
            <select
              value={quizId}
              onChange={(e) => setQuizId(e.target.value)}
              className="form-input"
              required
            >
              <option value="">-- Select a Quiz --</option>
              {Array.isArray(quizzes) && quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Question Text */}
        <div className="form-row">
          <label className="block font-medium text-gray-700 mb-1">Question Text</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="form-input"
            required
          />
        </div>

        {/* Question Type */}
        <div className="form-row">
          <label className="block font-medium text-gray-700 mb-1">Question Type</label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="form-input"
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
          </select>
        </div>

        {/* Options */}
        <div className="form-row">
          <label className="block font-medium text-gray-700 mb-2">Options</label>
          <div className="options-list">
            {options.map((option, index) => (
              <div key={index} className="option-row">
                <input
                  type="text"
                  value={option.optionText}
                  onChange={(e) => handleOptionChange(index, "optionText", e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="option-text"
                  required
                />
                <div className="correct-toggle">
                  <input
                    type={questionType === "MULTIPLE_CHOICE" ? "radio" : "checkbox"}
                    name={`correct-${questionType === "MULTIPLE_CHOICE" ? "single" : index}`}
                    checked={option.correct}
                    onChange={() => handleCorrectChange(index)}
                  />
                  <label style={{ fontSize: '0.9rem' }}>Correct</label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="btn-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn btn-primary`}
            style={isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
          >
            {isSubmitting ? "Adding Question..." : "Add Question"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;