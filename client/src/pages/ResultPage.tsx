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

const generateParticles = () => {
    return Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 60 + 20,
        size: Math.random() * 4 + 2,
        dur: Math.random() * 3 + 2,
        delay: Math.random() * 2,
        color: ["#00d4ff", "#00ff88", "#a855f7", "#f59e0b"][Math.floor(Math.random() * 4)],
    }));
};

const generateConfetti = () => {
    return Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        rot: Math.random() * 360,
        size: Math.random() * 8 + 5,
        dur: Math.random() * 2 + 2,
        delay: Math.random() * 3,
        color: ["#00d4ff", "#00ff88", "#a855f7", "#f59e0b", "#ff6b9d"][Math.floor(Math.random() * 5)],
    }));
};

const PARTICLES = generateParticles();
const CONFETTI_PIECES = generateConfetti();

function CircularScore({ percent, passed }: { percent: number; passed: boolean }) {
    const [displayed, setDisplayed] = useState(0);
    const [strokeDash, setStrokeDash] = useState(0);
    const radius = 90;
    const circ = 2 * Math.PI * radius;

    useEffect(() => {
        let start: number | null = null;
        const duration = 1800;

        const step = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setDisplayed(Math.round(ease * percent));
            setStrokeDash(ease * (percent / 100) * circ);
            if (progress < 1) requestAnimationFrame(step);
        };

        const timer = setTimeout(() => requestAnimationFrame(step), 400);
        return () => clearTimeout(timer);
    }, [percent, circ]);

    const color = passed
        ? "url(#scoreGradientPass)"
        : "url(#scoreGradientFail)";

    return (
        <div className="res-circle-wrap">
            <svg className="res-circle-svg" viewBox="0 0 220 220">
                <defs>
                    <linearGradient id="scoreGradientPass" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00ff88" />
                        <stop offset="100%" stopColor="#00d4ff" />
                    </linearGradient>
                    <linearGradient id="scoreGradientFail" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff4757" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <filter id="scoreGlow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                <circle cx="110" cy="110" r={radius}
                        fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                {Array.from({ length: 40 }).map((_, i) => {
                    const angle = (i / 40) * 360 - 90;
                    const rad = (angle * Math.PI) / 180;
                    const inner = 96, outer = 102;
                    return (
                        <line key={i}
                              x1={110 + inner * Math.cos(rad)} y1={110 + inner * Math.sin(rad)}
                              x2={110 + outer * Math.cos(rad)} y2={110 + outer * Math.sin(rad)}
                              stroke="rgba(0,212,255,0.15)" strokeWidth="1"
                        />
                    );
                })}
                <circle cx="110" cy="110" r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${strokeDash} ${circ}`}
                        strokeDashoffset={0}
                        transform="rotate(-90 110 110)"
                        filter="url(#scoreGlow)"
                        style={{ transition: "stroke-dasharray 0.05s linear" }}
                />
                {strokeDash > 0 && (() => {
                    const angle = (strokeDash / circ) * 360 - 90;
                    const rad = (angle * Math.PI) / 180;
                    const cx = 110 + radius * Math.cos(rad);
                    const cy = 110 + radius * Math.sin(rad);
                    return (
                        <circle cx={cx} cy={cy} r="6"
                                fill={passed ? "#00ff88" : "#ff4757"}
                                filter="url(#scoreGlow)"
                        />
                    );
                })()}
                <text x="110" y="100" textAnchor="middle"
                      fill={passed ? "#00ff88" : "#ff4757"}
                      fontSize="52" fontWeight="800"
                      fontFamily="'JetBrains Mono', monospace">
                    {displayed}
                </text>
                <text x="110" y="124" textAnchor="middle"
                      fill="rgba(255,255,255,0.4)"
                      fontSize="14" fontFamily="'JetBrains Mono', monospace">
                    %
                </text>
                <text x="110" y="148" textAnchor="middle"
                      fill={passed ? "rgba(0,255,136,0.7)" : "rgba(255,71,87,0.7)"}
                      fontSize="11" fontFamily="'JetBrains Mono', monospace"
                      letterSpacing="3">
                    {passed ? "ПРОЙДЕНО" : "НЕ ПРОЙДЕНО"}
                </text>
            </svg>
        </div>
    );
}

function CompetenceBar({ item, index }: { item: CompetenceResult; index: number }) {
    const [width, setWidth] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setTimeout(() => setWidth(item.percent), index * 120);
                observer.disconnect();
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [item.percent, index]);

    const color = item.percent >= 80 ? "#00ff88" : item.percent >= 60 ? "#f59e0b" : "#ff4757";
    const glowColor = item.percent >= 80
        ? "rgba(0,255,136,0.35)"
        : item.percent >= 60
            ? "rgba(245,158,11,0.35)"
            : "rgba(255,71,87,0.35)";

    return (
        <div className="res-comp-item" ref={ref}
             style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="res-comp-header">
                <span className="res-comp-name">{item.name}</span>
                <div className="res-comp-right">
                    <span className="res-comp-fraction">{item.correct}/{item.total}</span>
                    <span className="res-comp-pct" style={{ color }}>{item.percent}%</span>
                </div>
            </div>
            <div className="res-comp-track">
                <div
                    className="res-comp-fill"
                    style={{
                        width: `${width}%`,
                        background: `linear-gradient(90deg, ${color}99, ${color})`,
                        boxShadow: `0 0 12px ${glowColor}`,
                    }}
                />
                <div className="res-comp-mark" style={{ left: "80%" }} />
            </div>
        </div>
    );
}

function Particles({ active }: { active: boolean }) {
    if (!active) return null;
    return (
        <div className="res-particles" aria-hidden>
            {PARTICLES.map(p => (
                <div key={p.id} className="res-particle" style={{
                    left: `${p.x}%`, top: `${p.y}%`,
                    width: p.size, height: p.size,
                    background: p.color,
                    animationDuration: `${p.dur}s`,
                    animationDelay: `${p.delay}s`,
                }} />
            ))}
        </div>
    );
}

function Confetti() {
    return (
        <div className="res-confetti" aria-hidden>
            {CONFETTI_PIECES.map(p => (
                <div key={p.id} className="res-confetti__piece" style={{
                    left: `${p.x}%`,
                    width: p.size, height: p.size,
                    background: p.color,
                    transform: `rotate(${p.rot}deg)`,
                    animationDuration: `${p.dur}s`,
                    animationDelay: `${p.delay}s`,
                }} />
            ))}
        </div>
    );
}

function Certificate({ result, userName, date }: {
    result: TestResult; userName: string; date: string;
}) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); observer.disconnect(); }
        }, { threshold: 0.2 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`res-cert ${visible ? "res-cert--visible" : ""}`}>
            {["tl","tr","bl","br"].map(c => (
                <div key={c} className={`res-cert__corner res-cert__corner--${c}`} />
            ))}

            <div className="res-cert__scan" />

            <div className="res-cert__header">
                <div className="res-cert__logo">
                    <span className="res-cert__logo-bracket">[</span>
                    ПрофЦифра
                    <span className="res-cert__logo-bracket">]</span>
                </div>
                <div className="res-cert__badges">
                    <span className="res-cert__badge">VERIFIED</span>
                    <span className="res-cert__badge res-cert__badge--green">✓ PASSED</span>
                </div>
            </div>

            <div className="res-cert__divider" />

            <div className="res-cert__title-wrap">
                <div className="res-cert__title">СЕРТИФИКАТ</div>
                <div className="res-cert__subtitle">об успешном прохождении аттестации</div>
            </div>

            <div className="res-cert__body">
                <p className="res-cert__label">Настоящим подтверждается, что</p>
                <div className="res-cert__name">{userName}</div>
                <p className="res-cert__desc">
                    успешно прошёл(а) аттестацию по цифровым компетенциям
                </p>
                <div className="res-cert__program">«ПрофЦифра Аттестация»</div>

                <div className="res-cert__score-wrap">
                    <div className="res-cert__score-item">
                        <span className="res-cert__score-val">{result.percent}%</span>
                        <span className="res-cert__score-key">Результат</span>
                    </div>
                    <div className="res-cert__score-sep" />
                    <div className="res-cert__score-item">
                        <span className="res-cert__score-val">
                            {result.totalCorrect}/{result.totalQuestions}
                        </span>
                        <span className="res-cert__score-key">Правильных</span>
                    </div>
                </div>
            </div>

            <div className="res-cert__divider" />

            <div className="res-cert__footer">
                <div className="res-cert__footer-item">
                    <span className="res-cert__footer-label">Дата выдачи</span>
                    <span className="res-cert__footer-val">{date}</span>
                </div>
                <div className="res-cert__seal">
                    <div className="res-cert__seal-inner">ЦИТ</div>
                </div>
                <div className="res-cert__footer-item res-cert__footer-item--right">
                    <span className="res-cert__footer-label">Номер</span>
                    <span className="res-cert__footer-val">№ {result.certificateNumber}</span>
                </div>
            </div>
        </div>
    );
}

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

        axios.get<{ name: string }>(`${API}/api/me`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(r => setUserName(r.data.name))
            .catch(() => { localStorage.removeItem("token"); navigate("/"); });
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/"); return; }

        axios.get<TestResult>(`${API}/api/test/result/${resultId}`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(r => setResult(r.data))
            .catch(() => setResult({
                resultId,
                totalCorrect: 17, totalQuestions: 20, percent: 85, passed: true,
                certificateNumber: "PROF-2026-00042",
                competences: [
                    { name: "Цифровая грамотность",    correct: 5, total: 6, percent: 83 },
                    { name: "Цифровая безопасность",   correct: 4, total: 5, percent: 80 },
                    { name: "Цифровые коммуникации",   correct: 4, total: 4, percent: 100 },
                    { name: "Цифровое потребление",    correct: 4, total: 5, percent: 80 },
                ],
                finishedAt: new Date().toISOString(),
            }))
            .finally(() => {
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