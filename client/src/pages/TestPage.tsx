import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/test.scss";

const API = "http://localhost:5000";

interface Question {
    id: number;
    text: string;
    type: "single" | "multiple";
    competence: string;
    answers: { id: number; text: string }[];
}

interface Answer {
    questionId: number;
    selectedAnswers: number[];
}

export default function TestPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const categoryId = parseInt(id || "0");

    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        const fetchData = async () => {
            try {
                const questionsRes = await axios.get(`${API}/api/categories/${categoryId}/questions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuestions(questionsRes.data);
                setAnswers(questionsRes.data.map((q: Question) => ({
                    questionId: q.id,
                    selectedAnswers: []
                })));

                const categoriesRes = await axios.get(`${API}/api/categories`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const category = categoriesRes.data.find((c: any) => c.id === categoryId);
                setCategoryName(category?.name || "Тест");
            } catch (error) {
                console.error(error);
                alert("Ошибка загрузки вопросов");
                navigate("/categories");
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchData();
        } else {
            navigate("/categories");
        }
    }, [categoryId, navigate]);

    const handleAnswer = (answerId: number) => {
        const currentQ = questions[currentIndex];
        setAnswers(prev => {
            const newAnswers = [...prev];
            const currentAnswer = newAnswers[currentIndex];

            if (currentQ.type === "single") {
                currentAnswer.selectedAnswers = [answerId];
            } else {
                const selected = currentAnswer.selectedAnswers;
                if (selected.includes(answerId)) {
                    currentAnswer.selectedAnswers = selected.filter(id => id !== answerId);
                } else {
                    currentAnswer.selectedAnswers = [...selected, answerId];
                }
            }
            return newAnswers;
        });
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        const allAnswered = answers.every(a => a.selectedAnswers.length > 0);
        if (!allAnswered && !window.confirm("Вы ответили не на все вопросы. Отправить тест?")) {
            return;
        }

        setSubmitting(true);
        try {
            const res = await axios.post(`${API}/api/test/submit`,
                { answers, categoryId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate(`/result/${res.data.resultId}`);
        } catch (error) {
            console.error(error);
            alert("Ошибка при отправке теста");
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                await axios.post(`${API}/api/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch {
                // ignore
            }
        }
        localStorage.removeItem("token");
        navigate("/");
    };

    const getLetter = (index: number) => {
        return String.fromCharCode(65 + index);
    };

    if (loading) {
        return (
            <div className="test-loading">
                <div className="spinner" />
                <p>Загрузка вопросов...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="test-empty">
                <p>Нет доступных вопросов в этом тесте</p>
                <button className="btn-primary" onClick={() => navigate("/categories")}>
                    Вернуться к выбору теста
                </button>
                <button className="btn-ghost" onClick={handleLogout}>
                    Выйти
                </button>
            </div>
        );
    }

    const currentQ = questions[currentIndex];
    const currentAnswer = answers[currentIndex];
    const isSelected = (answerId: number) => currentAnswer.selectedAnswers.includes(answerId);
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const answeredCount = answers.filter(a => a.selectedAnswers.length > 0).length;
    const isLastQuestion = currentIndex === questions.length - 1;

    return (
        <div className="test-page">
            <div className="test-counter">
                <span>{currentIndex + 1}</span>/{questions.length}
            </div>

            <div className="test-progress">
                <div className="test-progress__bar" style={{ width: `${progress}%` }} />
            </div>

            <div className="test-header">
                <div className="test-header__title">{categoryName}</div>
                <div className="test-header__info">
                    <div className="test-header__question-number">
                        Question {currentIndex + 1} of {questions.length}
                    </div>
                </div>
            </div>

            <div className="test-content">
                <div className="test-question">
                    <div className="test-question__text">{currentQ.text}</div>
                    <div className="test-question__sub">Выберите ответ</div>
                </div>

                <div className="test-answers">
                    {currentQ.answers.map((answer, idx) => (
                        <label
                            key={answer.id}
                            className={`test-answer ${isSelected(answer.id) ? "selected" : ""}`}
                        >
                            <input
                                type={currentQ.type === "single" ? "radio" : "checkbox"}
                                name="answer"
                                checked={isSelected(answer.id)}
                                onChange={() => handleAnswer(answer.id)}
                            />
                            <div className="test-answer__letter">{getLetter(idx)}</div>
                            <div className="test-answer__text">{answer.text}</div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="test-footer">
                <button
                    className="test-btn test-btn--prev"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                >
                    ‹ Previous
                </button>

                <div className="test-footer__info">
                    <span>{answeredCount}</span> of {questions.length} answered
                </div>

                {isLastQuestion ? (
                    <button
                        className="test-btn test-btn--next"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? "Submitting..." : "Next ›"}
                    </button>
                ) : (
                    <button
                        className="test-btn test-btn--next"
                        onClick={handleNext}
                    >
                        Next ›
                    </button>
                )}
            </div>
        </div>
    );
}