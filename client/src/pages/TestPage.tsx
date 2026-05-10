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

interface Category {
    id: number;
    name: string;
}

const FLOATING_CODE_LINES = [
    "const future = await build();",
    "import { skill } from 'mind';",
    "git push origin main",
    "npm run excellence",
    "SELECT * FROM knowledge;",
    "docker build -t legend .",
    "while(true) { learn(); }",
    "export default greatness;",
    "ssh root@next-level.dev",
    "pip install ambition==∞",
    "async fn solve() -> Result",
    "kubectl apply -f dreams.yml",
];

const TERMINAL_LINES = [
    { text: "$ node server.js", color: "#06ffa5" },
    { text: "  ► listening on :3000", color: "#64748b" },
    { text: "$ git status", color: "#06ffa5" },
    { text: "  On branch main", color: "#94a3b8" },
    { text: "  modified: index.tsx", color: "#fbbf24" },
    { text: "$ npm run build", color: "#06ffa5" },
    { text: "  > vite build", color: "#64748b" },
    { text: "  ✓ built in 1.2s", color: "#06ffa5" },
    { text: "$ docker ps", color: "#06ffa5" },
    { text: "  api   Up 3h  ✓", color: "#94a3b8" },
    { text: "  db    Up 3h  ✓", color: "#94a3b8" },
    { text: "$ ping future.dev", color: "#06ffa5" },
    { text: "  64 bytes: time=1ms", color: "#64748b" },
    { text: "$ ssh deploy@prod", color: "#06ffa5" },
    { text: "  Welcome back! 🚀", color: "#7c3aed" },
    { text: "▋", color: "#00d4ff" },
];

const generateParticles = () =>
    Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 6,
        dur: 4 + Math.random() * 4,
    }));

const PARTICLES = generateParticles();

const FloatingCode = () => (
    <div className="floating-code" aria-hidden="true">
        {FLOATING_CODE_LINES.map((line, i) => (
            <span
                key={i}
                className="floating-code__line"
                style={{
                    "--delay": `${(i * 1.7) % 12}s`,
                    "--x": `${(i * 8.3) % 90}%`,
                    "--dur": `${14 + (i % 5) * 3}s`,
                } as React.CSSProperties}
            >
                {line}
            </span>
        ))}
    </div>
);

const Particles = () => (
    <div className="particles" aria-hidden="true">
        {PARTICLES.map((p) => (
            <div
                key={p.id}
                className="particle"
                style={{
                    "--x": `${p.x}%`,
                    "--y": `${p.y}%`,
                    "--delay": `${p.delay}s`,
                    "--dur": `${p.dur}s`,
                } as React.CSSProperties}
            />
        ))}
    </div>
);

const BigLaptop = ({ pulse }: { pulse: boolean }) => (
    <div className={`big-laptop ${pulse ? "pulse" : ""}`} aria-hidden="true">
        <div className="big-laptop__lid">
            <div className="big-laptop__screen-header">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
                <span className="big-laptop__screen-title">main.tsx</span>
            </div>
            <div className="big-laptop__screen-body">
                {[
                    { ln: "01", code: "import React from 'react'", c: "#7c3aed" },
                    { ln: "02", code: "import { build } from './future'", c: "#94a3b8" },
                    { ln: "03", code: "", c: "" },
                    { ln: "04", code: "const App = () => {", c: "#00d4ff" },
                    { ln: "05", code: "  const [data, setData]", c: "#e2e8f0" },
                    { ln: "06", code: "    = useState(null)", c: "#e2e8f0" },
                    { ln: "07", code: "", c: "" },
                    { ln: "08", code: "  return <Future />", c: "#06ffa5" },
                    { ln: "09", code: "}", c: "#00d4ff" },
                    { ln: "10", code: "", c: "" },
                    { ln: "11", code: "export default App", c: "#fbbf24" },
                ].map((row, i) => (
                    <div key={i} className="big-laptop__code-row" style={{ animationDelay: `${i * 0.12}s` }}>
                        <span className="big-laptop__ln">{row.ln}</span>
                        <span className="big-laptop__code" style={{ color: row.c }}>{row.code}</span>
                    </div>
                ))}
                <div className="big-laptop__caret">▋</div>
            </div>
        </div>
        <div className="big-laptop__hinge" />
        <div className="big-laptop__base">
            <div className="big-laptop__keyboard">
                {Array.from({ length: 42 }).map((_, i) => (
                    <div key={i} className="big-laptop__key" style={{ "--ki": i } as React.CSSProperties} />
                ))}
            </div>
            <div className="big-laptop__trackpad" />
        </div>
    </div>
);

const Terminal = () => {
    const [visibleLines, setVisibleLines] = useState(1);

    useEffect(() => {
        if (visibleLines >= TERMINAL_LINES.length) return;
        const t = setTimeout(() => setVisibleLines(v => v + 1), 420);
        return () => clearTimeout(t);
    }, [visibleLines]);

    return (
        <div className="side-terminal" aria-hidden="true">
            <div className="side-terminal__header">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
                <span className="side-terminal__title">bash — 80×24</span>
            </div>
            <div className="side-terminal__body">
                {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                    <div key={i} className="side-terminal__line" style={{ color: line.color }}>
                        {line.text}
                    </div>
                ))}
            </div>
        </div>
    );
};

const FloatingKeyboard = () => (
    <div className="floating-keyboard" aria-hidden="true">
        {[14, 13, 11, 6].map((count, ri) => (
            <div key={ri} className="fkb__row">
                {Array.from({ length: count }).map((_, ki) => (
                    <div
                        key={ki}
                        className="fkb__key"
                        style={{ "--ki": ri * 14 + ki } as React.CSSProperties}
                    />
                ))}
            </div>
        ))}
    </div>
);

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
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/"); return; }

        const fetchData = async () => {
            try {
                const questionsRes = await axios.get(`${API}/api/categories/${categoryId}/questions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuestions(questionsRes.data);
                setAnswers(questionsRes.data.map((q: Question) => ({
                    questionId: q.id, selectedAnswers: []
                })));
                const categoriesRes = await axios.get(`${API}/api/categories`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const category = categoriesRes.data.find((c: Category) => c.id === categoryId);
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
            const res = await axios.post(`${API}/api/test/submit`,
                { answers, categoryId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate(`/result/${res.data.resultId}`);
        } catch (err) {
            console.error(err);
            alert("Ошибка при отправке теста");
        } finally {
            setSubmitting(false);
        }
    };

    const getLetter = (i: number) => String.fromCharCode(65 + i);

    if (loading) return (
        <div className="test-loading">
            <BigLaptop pulse={true} />
            <p className="test-loading__text">Загрузка<span className="test-loading__dots" /></p>
        </div>
    );

    if (questions.length === 0) return (
        <div className="test-empty">
            <div className="test-empty__icon">🖥️</div>
            <p>Нет вопросов в этом тесте</p>
            <button className="cta-btn primary" onClick={() => navigate("/categories")}>Вернуться</button>
        </div>
    );

    const currentQ = questions[currentIndex];
    const currentAnswer = answers[currentIndex];
    const isAnswered = (id: number) => currentAnswer.selectedAnswers.includes(id);
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const answeredCount = answers.filter(a => a.selectedAnswers.length > 0).length;
    const isLast = currentIndex === questions.length - 1;

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

            <div className="test-topbar">
                <div className="test-topbar__badge">{categoryName}</div>
                <div className="test-counter">
                    <span className="test-counter__cur">{currentIndex + 1}</span>
                    <span className="test-counter__sep">/</span>
                    <span className="test-counter__total">{questions.length}</span>
                </div>
                <div className="test-topbar__answered">{answeredCount} answered</div>
            </div>

            <div className="test-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="test-progress__bar" style={{ width: `${progress}%` }}>
                    <div className="test-progress__glow" />
                </div>
            </div>

            <main className="test-content">
                <div className="test-question">
                    <div className="test-question__number">Question {currentIndex + 1}</div>
                    <div className="test-question__text">{currentQ.text}</div>
                    <div className="test-question__sub">
                        {currentQ.type === "multiple" ? "Select all that apply" : "Choose one answer"}
                    </div>
                </div>

                <div className="test-answers">
                    {currentQ.answers.map((answer, idx) => (
                        <label
                            key={answer.id}
                            className={`test-answer ${isAnswered(answer.id) ? "selected" : ""}`}
                        >
                            <input
                                type={currentQ.type === "single" ? "radio" : "checkbox"}
                                name="answer"
                                checked={isAnswered(answer.id)}
                                onChange={() => handleAnswer(answer.id)}
                            />
                            <div className="test-answer__letter">{getLetter(idx)}</div>
                            <div className="test-answer__text">{answer.text}</div>
                            <div className="test-answer__check" aria-hidden="true">✓</div>
                        </label>
                    ))}
                </div>
            </main>

            <footer className="test-footer">
                <button
                    className="test-btn test-btn--prev"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    aria-label="Previous question"
                >
                    <span className="test-btn__arrow">‹</span>
                    <span>Prev</span>
                </button>

                <div className="test-dots" aria-hidden="true">
                    {questions.map((_, i) => (
                        <div
                            key={i}
                            className={`test-dot ${i === currentIndex ? "active" : ""} ${answers[i]?.selectedAnswers.length > 0 ? "done" : ""}`}
                        />
                    ))}
                </div>

                {isLast ? (
                    <button className="test-btn test-btn--next test-btn--submit" onClick={handleSubmit} disabled={submitting}>
                        <span>{submitting ? "Submitting..." : "Submit"}</span>
                        <span className="test-btn__arrow">⚡</span>
                    </button>
                ) : (
                    <button className="test-btn test-btn--next" onClick={handleNext}>
                        <span>Next</span>
                        <span className="test-btn__arrow">›</span>
                    </button>
                )}
            </footer>
        </div>
    );
}
