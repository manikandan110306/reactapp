import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TakeQuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [quizId, setQuizId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // Fetch all quizzes
  useEffect(() => {
    axios.get("http://localhost:8080/api/quizzes")
      .then(res => setQuizzes(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch questions when quiz is selected
  useEffect(() => {
    if (quizId) {
      axios.get(`http://localhost:8080/api/quizzes/${quizId}/questions`)
        .then(res => setQuestions(res.data))
        .catch(err => console.error(err));
    }
  }, [quizId]);

  const handleOptionChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = () => {
    const payload = {
      quizId: parseInt(quizId),
      studentName: "John Doe", // replace with logged-in user if available
      answers: Object.entries(answers).map(([qId, selectedOption]) => ({
        questionId: parseInt(qId),
        selectedOption
      }))
    };

    axios.post("http://localhost:8080/api/quizAttempts", payload)
      .then(res => {
        setResult(res.data);
        setSubmitted(true);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Take a Quiz</h2>

      {/* Quiz selection */}
      {!quizId && (
        <select
          className="p-2 border rounded mb-6"
          onChange={(e) => setQuizId(e.target.value)}
        >
          <option value="">Select a Quiz</option>
          {quizzes.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.title}
            </option>
          ))}
        </select>
      )}

      {/* Show Questions */}
      {quizId && !submitted && (
        <div className="w-full max-w-2xl">
          {questions.map((q, index) => (
            <div key={q.id} className="p-4 mb-4 border rounded shadow">
              <p className="font-semibold">{index + 1}. {q.questionText}</p>
              <div className="mt-2">
                {q.options.map((opt, i) => (
                  <label key={i} className="block">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => handleOptionChange(q.id, opt)}
                    />
                    <span className="ml-2">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Quiz
          </button>
        </div>
      )}

      {/* Show Results */}
      {submitted && result && (
        <div className="mt-6 p-6 border rounded shadow bg-green-50">
          <h3 className="text-xl font-bold">Quiz Result</h3>
          <p><b>Student:</b> {result.studentName}</p>
          <p><b>Score:</b> {result.score} / {result.totalQuestions}</p>
          <p><b>Completed At:</b> {result.completedAt}</p>
        </div>
      )}
    </div>
  );
}
