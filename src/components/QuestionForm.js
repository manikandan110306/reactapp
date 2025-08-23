import React, { useState } from "react";
import axios from "axios";

const QuestionForm = ({ quizzes }) => {
  const [quizId, setQuizId] = useState("");
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
      const payload = { questionText, questionType, options };
      await axios.post(
        `http://localhost:8080/api/quizzes/${quizId}/questions`,
        payload
      );
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
    <div className="max-w-lg mx-auto mt-6 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Add Question</h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Quiz Select Dropdown */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">Select Quiz</label>
          <select
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Select a Quiz --</option>
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.title}
              </option>
            ))}
          </select>
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">Question Text</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Question Type */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">Question Type</label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
          </select>
        </div>

        {/* Options */}
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">Options</label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-3 gap-2">
              <input
                type="text"
                value={option.optionText}
                onChange={(e) =>
                  handleOptionChange(index, "optionText", e.target.value)
                }
                placeholder={`Option ${index + 1}`}
                className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex items-center">
                <input
                  type={questionType === "MULTIPLE_CHOICE" ? "radio" : "checkbox"}
                  name="correctOption"
                  checked={option.correct}
                  onChange={() => handleCorrectChange(index)}
                  className="mr-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">Correct</label>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded font-medium text-white ${
            isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {isSubmitting ? "Adding Question..." : "Add Question"}
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;