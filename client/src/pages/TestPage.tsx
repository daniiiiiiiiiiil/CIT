import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        const fetchQuestions = async () => {
            try {
                const res = await axios.get<Question[]>(`${API}/api/questions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuestions(res.data);
                setAnswers(res.data.map(q => ({ questionId: q.id, selectedAnswers: [] })));
            } catch (error) {
                console.error(error);
                const mockQuestions: Question[] = [
                    {
                        id: 1,
                        text: "Что такое цифровая грамотность?",
                        type: "single",
                        competence: "Цифровая грамотность",
                        answers: [
                            { id: 1, text: "Умение пользоваться компьютером" },
                            { id: 2, text: "Способность эффективно использовать цифровые технологии" },
                            { id: 3, text: "Знание языков программирования" },
                            { id: 4, text: "Умение создавать сайты" }
                        ]
                    },
                    // Add more mock questions as needed
                ];
                setQuestions(mockQuestions);
                setAnswers(mockQuestions.map(q => ({ questionId: q.id, selectedAnswers: [] })));
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [navigate]);

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

        setSubmitting(true);
        try {
            const res = await axios.post(`${API}/api/test/submit`,
                { answers },
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
            <div className="test-error">
                <p>Нет доступных вопросов</p>
                <button onClick={handleLogout}>Выйти</button>
            </div>
        );
    }

    const currentQ = questions[currentIndex];
    const currentAnswer = answers[currentIndex];
    const isSelected = (answerId: number) => currentAnswer.selectedAnswers.includes(answerId);
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="test-page">
            <div className="test-header">
                <div className="test-progress">
                    <div className="test-progress__bar" style={{ width: `${progress}%` }} />
                </div>
                <div className="test-counter">
                    Вопрос {currentIndex + 1} из {questions.length}
                </div>
                <button className="test-logout" onClick={handleLogout}>Выйти</button>
            </div>

            <div className="test-content">
                <div className="test-competence">{currentQ.competence}</div>
                <div className="test-question">{currentQ.text}</div>
                <div className="test-answers">
                    {currentQ.answers.map(answer => (
                        <label key={answer.id} className="test-answer">
                            <input
                                type={currentQ.type === "single" ? "radio" : "checkbox"}
                                name="answer"
                                checked={isSelected(answer.id)}
                                onChange={() => handleAnswer(answer.id)}
                            />
                            <span>{answer.text}</span>
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
                    Назад
                </button>

                {currentIndex === questions.length - 1 ? (
                    <button
                        className="test-btn test-btn--submit"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? "Отправка..." : "Завершить"}
                    </button>
                ) : (
                    <button
                        className="test-btn test-btn--next"
                        onClick={handleNext}
                    >
                        Далее
                    </button>
                )}
            </div>
        </div>
    );
}