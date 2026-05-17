import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { testApi } from "../api/test.api";
import { FloatingCode } from "../components/test/FloatingCode";
import { Particles } from "../components/test/Particles";
import { BigLaptop } from "../components/test/BigLaptop";
import { Terminal } from "../components/test/Terminal";
import { FloatingKeyboard } from "../components/test/FloatingKeyboard";
import { TestQuestion } from "../components/test/TestQuestion";
import { TestAnswers } from "../components/test/TestAnswers";
import { TestProgress } from "../components/test/TestProgress";
import { TestNavigation } from "../components/test/TestNavigation";
import { LoadingState } from "../components/test/LoadingState";
import { EmptyState } from "../components/test/EmptyState";
import type { Question, UserAnswer } from "../types/test.types";
import "../styles/test.scss";

export default function TestPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const categoryId = parseInt(id || "0");

    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<UserAnswer[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/"); return; }

        const fetchData = async () => {
            try {
                const [questionsData, categoriesData] = await Promise.all([
                    testApi.getQuestions(categoryId),
                    testApi.getCategories()
                ]);
                setQuestions(questionsData);
                setAnswers(questionsData.map((q: Question) => ({
                    questionId: q.id, selectedAnswers: []
                })));
                const category = categoriesData.find((c: { id: number }) => c.id === categoryId);
                setCategoryName(category?.name || "Test");
            } catch (error) {
                console.error(error);
                alert("Ошибка загрузки вопросов");
                navigate("/categories");
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) fetchData();
        else navigate("/categories");
    }, [categoryId, navigate]);

    const handleAnswer = (answerId: number) => {
        const currentQ = questions[currentIndex];
        setSelected(true);
        setAnswers(prev => {
            const next = [...prev];
            const cur = { ...next[currentIndex] };
            if (currentQ.type === "single") {
                cur.selectedAnswers = [answerId];
            } else {
                const s = cur.selectedAnswers;
                cur.selectedAnswers = s.includes(answerId)
                    ? s.filter(x => x !== answerId)
                    : [...s, answerId];
            }
            next[currentIndex] = cur;
            return next;
        });
    };

    const handleNext = () => {
        setSelected(false);
        if (currentIndex < questions.length - 1) setCurrentIndex(i => i + 1);
    };

    const handlePrev = () => {
        setSelected(false);
        if (currentIndex > 0) setCurrentIndex(i => i - 1);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/"); return; }
        const allAnswered = answers.every(a => a.selectedAnswers.length > 0);
        if (!allAnswered && !window.confirm("Вы ответили не на все вопросы. Отправить?")) return;
        setSubmitting(true);
        try {
            const res = await testApi.submitTest(answers, categoryId);
            navigate(`/result/${res.resultId}`);
        } catch (err) {
            console.error(err);
            alert("Ошибка при отправке теста");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingState />;
    if (questions.length === 0) return <EmptyState />;

    const currentQ = questions[currentIndex];
    const currentAnswer = answers[currentIndex];
    const answeredCount = answers.filter(a => a.selectedAnswers.length > 0).length;
    const isLast = currentIndex === questions.length - 1;
    const answeredStatus = answers.map(a => a.selectedAnswers.length > 0);

    return (
        <div className="test-page">
            <FloatingCode />
            <Particles />
            <div className="grid-bg" aria-hidden="true" />

            <div className="side-panel side-panel--left" aria-hidden="true">
                <BigLaptop pulse={selected} />
                <FloatingKeyboard />
            </div>

            <div className="side-panel side-panel--right" aria-hidden="true">
                <Terminal />
            </div>

            <TestProgress
                currentIndex={currentIndex}
                total={questions.length}
                answersCount={answeredCount}
                categoryName={categoryName}
            />

            <main className="test-content">
                <TestQuestion
                    question={currentQ}
                    index={currentIndex}
                />
                <TestAnswers
                    answers={currentQ.answers}
                    questionType={currentQ.type}
                    selectedAnswers={currentAnswer.selectedAnswers}
                    onAnswer={handleAnswer}
                />
            </main>

            <TestNavigation
                currentIndex={currentIndex}
                total={questions.length}
                isLast={isLast}
                submitting={submitting}
                onPrev={handlePrev}
                onNext={handleNext}
                onSubmit={handleSubmit}
                answeredStatus={answeredStatus}
            />
        </div>
    );
}