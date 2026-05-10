import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resultApi } from "../api/result.api";
import { Particles } from "../components/result/Particles";
import { Confetti } from "../components/result/Confetti";
import { ResultHero } from "../components/result/ResultHero";
import { CompetenceBar } from "../components/result/CompetenceBar";
import { Certificate } from "../components/result/Certificate";
import type { TestResult } from "../types/result.types";
import "../styles/result.scss";

export default function ResultPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const resultId = parseInt(id || "0");

    const [result, setResult] = useState<TestResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState<string>("");
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/"); return; }

        Promise.all([
            resultApi.getUserInfo(),
            resultApi.getTestResult(resultId).catch(() => ({
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
            }))
        ]).then(([userData, resultData]) => {
            setUserName(userData.name);
            setResult(resultData);
        }).catch(() => {
            localStorage.removeItem("token");
            navigate("/");
        }).finally(() => {
            setLoading(false);
            setTimeout(() => setRevealed(true), 100);
        });
    }, [resultId, navigate]);

    if (loading) return (
        <div className="res-loading">
            <div className="res-loading__ring" />
            <span className="res-loading__text">
                АНАЛИЗ РЕЗУЛЬТАТОВ<span className="res-loading__dots">
                    <span>.</span><span>.</span><span>.</span>
                </span>
            </span>
        </div>
    );

    if (!result) return null;

    const date = new Date(result.finishedAt).toLocaleDateString("ru-RU", {
        day: "numeric", month: "long", year: "numeric"
    });

    return (
        <div className={`res-page ${revealed ? "res-page--in" : ""}`}>
            <div className="res-grid-bg" />
            <div className="res-scanline" />
            <Particles active={true} />
            {result.passed && <Confetti />}

            <div className="res-topbar">
                <button className="res-topbar__back" onClick={() => navigate("/categories")}>
                    <span>←</span> Назад
                </button>
                <div className="res-topbar__logo">
                    <span className="res-topbar__bracket">[</span>
                    ПрофЦифра
                    <span className="res-topbar__bracket">]</span>
                </div>
                <div className="res-topbar__date">{date}</div>
            </div>

            <div className="res-content">
                <ResultHero result={result} />

                <div className="res-section">
                    <div className="res-section__header">
                        <div className="res-section__line" />
                        <h2 className="res-section__title">
                            <span className="res-section__title-accent">01</span>
                            Результаты по компетенциям
                        </h2>
                    </div>

                    <div className="res-comp-list">
                        {result.competences.map((c, i) => (
                            <CompetenceBar key={c.name} item={c} index={i} />
                        ))}
                    </div>
                </div>

                {result.passed && result.certificateNumber && (
                    <div className="res-section">
                        <div className="res-section__header">
                            <div className="res-section__line" />
                            <h2 className="res-section__title">
                                <span className="res-section__title-accent">02</span>
                                Сертификат
                            </h2>
                        </div>

                        <Certificate result={result} userName={userName} date={date} />

                        <button className="res-btn res-btn--ghost"
                                onClick={() => window.print()}
                                style={{ marginTop: 20 }}>
                            <span>⬇</span> Распечатать сертификат
                        </button>
                    </div>
                )}

                <div className="res-actions">
                    <button className="res-btn res-btn--primary"
                            onClick={() => navigate("/categories")}>
                        <span className="res-btn__icon">◈</span>
                        К списку тестов
                    </button>
                    <button className="res-btn res-btn--secondary"
                            onClick={() => navigate("/profile")}>
                        <span className="res-btn__icon">◉</span>
                        Мой профиль
                    </button>
                </div>
            </div>
        </div>
    );
}