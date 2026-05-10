import { CircularScore } from "./CircularScore";
import type { TestResult } from "../../types/result.types";

interface ResultHeroProps {
    result: TestResult;
}

export function ResultHero({ result }: ResultHeroProps) {
    return (
        <div className="res-hero">
            <div className="res-hero__left">
                <div className="res-hero__tag">
                    // РЕЗУЛЬТАТЫ АТТЕСТАЦИИ
                </div>
                <h1 className="res-hero__title">
                    {result.passed ? (
                        <>
                            <span className="res-hero__title-line">ТЕСТ</span>
                            <span className="res-hero__title-line res-hero__title-line--accent">
                                ПРОЙДЕН
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="res-hero__title-line">ТЕСТ НЕ</span>
                            <span className="res-hero__title-line res-hero__title-line--fail">
                                ПРОЙДЕН
                            </span>
                        </>
                    )}
                </h1>

                <div className="res-stats-row">
                    <div className="res-stat">
                        <span className="res-stat__val">{result.totalCorrect}</span>
                        <span className="res-stat__label">Правильных</span>
                    </div>
                    <div className="res-stat__sep" />
                    <div className="res-stat">
                        <span className="res-stat__val">{result.totalQuestions - result.totalCorrect}</span>
                        <span className="res-stat__label">Ошибок</span>
                    </div>
                    <div className="res-stat__sep" />
                    <div className="res-stat">
                        <span className="res-stat__val">{result.totalQuestions}</span>
                        <span className="res-stat__label">Всего</span>
                    </div>
                </div>

                <div className="res-threshold">
                    <div className="res-threshold__labels">
                        <span>Ваш результат</span>
                        <span style={{ color: result.passed ? "#00ff88" : "#ff4757" }}>
                            {result.percent}%
                        </span>
                    </div>
                    <div className="res-threshold__track">
                        <div
                            className="res-threshold__fill"
                            style={{
                                width: `${result.percent}%`,
                                background: result.passed
                                    ? "linear-gradient(90deg,#00ff8880,#00ff88)"
                                    : "linear-gradient(90deg,#ff475780,#ff4757)",
                                boxShadow: result.passed
                                    ? "0 0 12px rgba(0,255,136,0.4)"
                                    : "0 0 12px rgba(255,71,87,0.4)",
                            }}
                        />
                        <div className="res-threshold__mark">
                            <span>80%</span>
                        </div>
                    </div>
                    <div className="res-threshold__hint">
                        Порог прохождения: 80%
                    </div>
                </div>
            </div>

            <CircularScore percent={result.percent} passed={result.passed} />
        </div>
    );
}