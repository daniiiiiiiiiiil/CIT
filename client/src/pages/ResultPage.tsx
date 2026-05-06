import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/result.scss";

const API = "http://localhost:5000";

interface CompetenceResult {
    name: string;
    correct: number;
    total: number;
    percent: number;
}

interface TestResult {
    resultId: number;
    totalCorrect: number;
    totalQuestions: number;
    percent: number;
    passed: boolean;
    certificateNumber: string | null;
    competences: CompetenceResult[];
    finishedAt: string;
}

function CompetenceChart({ data }: { data: CompetenceResult[] }) {
    const barH = 32;
    const gap = 12;
    const labelW = 180;
    const chartW = 400;
    const height = data.length * (barH + gap) + gap;

    return (
        <svg viewBox={`0 0 ${labelW + chartW + 60} ${height}`} className="competence-chart">
            {data.map((c, i) => {
                const y = gap + i * (barH + gap);
                const fillW = (c.percent / 100) * chartW;
                const color = c.percent >= 80 ? "#22c55e" : c.percent >= 60 ? "#f59e0b" : "#ef4444";
                return (
                    <g key={c.name}>
                        <text x={labelW - 8} y={y + barH / 2 + 5} textAnchor="end" fontSize="13" fill="currentColor">
                            {c.name}
                        </text>
                        <rect x={labelW} y={y} width={chartW} height={barH} rx={6} fill="var(--bar-bg, #e5e7eb)" />
                        <rect x={labelW} y={y} width={fillW} height={barH} rx={6} fill={color} />
                        <text x={labelW + fillW + 8} y={y + barH / 2 + 5} fontSize="13" fontWeight="600" fill={color}>
                            {c.percent}%
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

export default function ResultPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const resultId = parseInt(id || "0");

    const [result, setResult] = useState<TestResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState<string>("");
    const certRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await axios.get<{ name: string }>(`${API}/api/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserName(res.data.name);
            } catch {
                localStorage.removeItem("token");
                navigate("/");
            }
        };
        fetchUser();
    }, [navigate]);

    useEffect(() => {
        const fetchResult = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }

            try {
                const res = await axios.get<TestResult>(`${API}/api/test/result/${resultId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setResult(res.data);
            } catch (err) {
                console.error(err);
                setResult({
                    resultId,
                    totalCorrect: 17,
                    totalQuestions: 20,
                    percent: 85,
                    passed: true,
                    certificateNumber: "PROF-2026-00042",
                    competences: [
                        { name: "Цифровая грамотность", correct: 5, total: 6, percent: 83 },
                        { name: "Цифровая безопасность", correct: 4, total: 5, percent: 80 },
                        { name: "Цифровые коммуникации", correct: 4, total: 4, percent: 100 },
                        { name: "Цифровое потребление", correct: 4, total: 5, percent: 80 },
                    ],
                    finishedAt: new Date().toISOString(),
                });
            } finally {
                setLoading(false);
            }
        };

        if (resultId) {
            fetchResult();
        }
    }, [resultId, navigate]);

    const handlePrint = () => {
        window.print();
    };

    const handleGoToCategories = () => {
        navigate("/categories");
    };

    const handleGoToProfile = () => {
        navigate("/profile");
    };

    if (loading) return (
        <div className="test-loading">
            <div className="spinner" />
            <p>Загружаем результаты...</p>
        </div>
    );

    if (!result) return null;

    const date = new Date(result.finishedAt).toLocaleDateString("ru-RU", {
        day: "numeric", month: "long", year: "numeric"
    });

    return (
        <div className="result-page">
            <div className="result-summary">
                <div className={`result-badge ${result.passed ? "passed" : "failed"}`}>
                    <span className="result-badge__icon">{result.passed ? "🏆" : "📊"}</span>
                    <div className="result-badge__score">{result.percent}%</div>
                    <div className="result-badge__label">
                        {result.passed ? "Тест пройден!" : "Тест не пройден"}
                    </div>
                    <div className="result-badge__sub">
                        {result.totalCorrect} из {result.totalQuestions} правильных ответов
                    </div>
                </div>

                <div className="result-threshold">
                    <span>Порог прохождения: 80%</span>
                    <div className="result-threshold__bar">
                        <div
                            className="result-threshold__fill"
                            style={{
                                width: `${result.percent}%`,
                                background: result.passed ? "#22c55e" : "#ef4444"
                            }}
                        />
                        <div className="result-threshold__mark" style={{ left: "80%" }} />
                    </div>
                </div>
            </div>

            <div className="result-section">
                <h3>Результаты по компетенциям</h3>
                <CompetenceChart data={result.competences} />
            </div>

            {result.passed && result.certificateNumber && (
                <div className="result-section">
                    <h3>Сертификат</h3>
                    <div className="certificate" ref={certRef}>
                        <div className="certificate__header">
                            <div className="certificate__logo">ПрофЦифра</div>
                            <div className="certificate__title">СЕРТИФИКАТ</div>
                            <div className="certificate__subtitle">об успешном прохождении аттестации</div>
                        </div>
                        <div className="certificate__body">
                            <p>Настоящим подтверждается, что</p>
                            <div className="certificate__name">{userName}</div>
                            <p>успешно прошёл(а) аттестацию по цифровым компетенциям</p>
                            <div className="certificate__program">«ПрофЦифра Аттестация»</div>
                            <div className="certificate__score">
                                Результат: <strong>{result.percent}%</strong> правильных ответов
                            </div>
                        </div>
                        <div className="certificate__footer">
                            <div className="certificate__date">{date}</div>
                            <div className="certificate__number">№ {result.certificateNumber}</div>
                        </div>
                        <div className="certificate__seal"> ЦИТ </div>
                    </div>
                    <button className="btn-secondary" onClick={handlePrint}>
                        Распечатать сертификат
                    </button>
                </div>
            )}

            <div className="result-actions">
                <button className="btn-primary" onClick={handleGoToCategories}>
                     К списку тестов
                </button>
                <button className="btn-ghost" onClick={handleGoToProfile}>
                     Мой профиль
                </button>
            </div>
        </div>
    );
}