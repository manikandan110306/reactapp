import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizzes, deleteQuiz } from '../utils/api';

const QuizList = ({ onSelectQuiz }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  // show delete for all users by default; adjust if you want admin-only
  const showAdminActions = true;

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const data = await getQuizzes({ page, size, sort: `${sortBy},${order}` });

        // Support both pageable (with .content) and plain-array responses
        if (data && Array.isArray(data)) {
          setQuizzes(data);
          setTotalPages(1);
          setTotalElements(data.length);
        } else if (data && data.content) {
          setQuizzes(data.content || []);
          setTotalPages(data.totalPages || 0);
          setTotalElements(data.totalElements || 0);
        } else {
          // Unknown shape: attempt to set as array if possible
          setQuizzes([]);
          setTotalPages(0);
          setTotalElements(0);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch quizzes');
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [page, size, sortBy, order, refresh]);

  const prevPage = () => setPage((p) => Math.max(0, p - 1));
  const nextPage = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  if (loading) return <div className="loading-state">Loading quizzes</div>;
  if (error) return <div className="error">{error}</div>;
  if (!quizzes || quizzes.length === 0) return <div className="empty-state">No quizzes available</div>;

  return (
    <div data-testid="quiz-list" className="quiz-list-page">
      <div className="quiz-list-header">
        <div className="quiz-controls">
        <label>
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Created</option>
            <option value="title">Title</option>
          </select>
        </label>
        <label>
          Order:
          <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
        </div>
      </div>

      <div className="quiz-grid">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-item" data-testid={`quiz-${quiz.id}`}>
            <div className="quiz-item-title">{quiz.title}</div>
            <div className="quiz-item-desc">{quiz.description}</div>
            <div className="quiz-separator" />
            <div className="quiz-item-meta">
              <div>Time Limit: {quiz.timeLimit} mins</div>
              <div>Questions: {quiz.questions ? quiz.questions.length : '—'}</div>
            </div>
            <div className="quiz-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  // always navigate to the take-quiz route
                  navigate(`/take-quiz/${quiz.id}`);
                  // also call parent handler if provided
                  if (onSelectQuiz) onSelectQuiz(quiz.id);
                }}
              >
                Take
              </button>
              <button className="btn" style={{ background: 'transparent', border: '1px solid #e6eefc' }}>Details</button>
              {showAdminActions && (
                <button
                  className="btn"
                  style={{ background: '#ffecec', border: '1px solid #ffd7d7', color: '#b91c1c' }}
                  onClick={async () => {
                    const confirmDelete = window.confirm('Delete this quiz and all its data?');
                    if (!confirmDelete) return;
                    try {
                      await deleteQuiz(quiz.id);
                      // refresh list
                      setRefresh((r) => !r);
                    } catch (err) {
                      alert('Failed to delete quiz');
                    }
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pagination-controls">
        <button onClick={prevPage} disabled={page <= 0} className="btn">Prev</button>
        <span>
          Page {page + 1} of {totalPages} — {totalElements} quizzes
        </span>
        <button onClick={nextPage} disabled={page >= totalPages - 1} className="btn">Next</button>
      </div>
    </div>
  );
};

export default QuizList;
