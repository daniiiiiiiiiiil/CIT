import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    RadialLinearScale,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";
import type { TooltipItem } from "chart.js";
import { Bar, Doughnut, Radar, Line } from "react-chartjs-2";
import "./../styles/profile.scss";

ChartJS.register(
    CategoryScale, LinearScale, BarElement, ArcElement,
    LineElement, PointElement, RadialLinearScale, Filler,
    Tooltip, Legend
);

const API = "http://localhost:5000";

interface UserProfile {
    id: number;
    email: string;
    name: string;
    picture?: string;
    isAdmin: boolean;
    created_at: string;
}

interface TestResult {
    id: number;
    categoryName: string;
    percent: number;
    passed: boolean;
    finishedAt: string;
    certificateNumber: string | null;
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
    const [displayed, setDisplayed] = useState(0);
    useEffect(() => {
        let start: number | null = null;
        const duration = 1200;
        const step = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setDisplayed(Math.round(ease * value));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [value]);
    return <>{displayed}{suffix}</>;
}

function RadialProgress({ percent, size = 80, color = "#534AB7" }: { percent: number; size?: number; color?: string }) {
    const [dash, setDash] = useState(0);
    const r = size / 2 - 6;
    const circ = 2 * Math.PI * r;
    useEffect(() => {
        setTimeout(() => setDash((percent / 100) * circ), 200);
    }, [percent, circ]);
    return (
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
                    strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${dash} ${circ}`}
                    style={{ transition: "stroke-dasharray 1s cubic-bezier(0.34,1.56,0.64,1)", filter: `drop-shadow(0 0 6px ${color})` }}
            />
        </svg>
    );
}

function StreakCalendar({ results }: { results: TestResult[] }) {
    const days = Array.from({ length: 30 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        const dateStr = d.toISOString().slice(0, 10);
        const dayResults = results.filter(r => r.finishedAt?.slice(0, 10) === dateStr);
        const best = dayResults.length > 0 ? Math.max(...dayResults.map(r => r.percent)) : null;
        return { date: d, best, count: dayResults.length };
    });

    return (
        <div className="pf-streak">
            <div className="pf-streak__label">Активность за 30 дней</div>
            <div className="pf-streak__grid">
                {days.map((d, i) => {
                    let cls = "pf-streak__cell";
                    if (d.best !== null) {
                        if (d.best >= 80) cls += " pf-streak__cell--high";
                        else if (d.best >= 50) cls += " pf-streak__cell--mid";
                        else cls += " pf-streak__cell--low";
                    }
                    return (
                        <div key={i} className={cls} title={`${d.date.toLocaleDateString("ru-RU")}: ${d.count > 0 ? `${d.count} тест(а), лучший: ${d.best}%` : "нет активности"}`} />
                    );
                })}
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [results, setResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"info" | "results" | "certificates">("info");
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/"); return; }
        const fetchProfile = async () => {
            try {
                const profileRes = await axios.get(`${API}/api/me`, { headers: { Authorization: `Bearer ${token}` } });
                setProfile(profileRes.data);
                try {
                    const resultsRes = await axios.get(`${API}/api/user/results`, { headers: { Authorization: `Bearer ${token}` } });
                    setResults(resultsRes.data);
                } catch { setResults([]); }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    localStorage.removeItem("token"); navigate("/");
                }
            } finally {
                setLoading(false);
                setTimeout(() => setRevealed(true), 100);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try { await axios.post(`${API}/api/logout`, {}, { headers: { Authorization: `Bearer ${token}` } }); } catch {
                //ignore
                 }
        }
        localStorage.removeItem("token"); navigate("/");
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
    };
    const formatDateShort = (dateString: string) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
    };

    if (loading) return (
        <div className="pf-loading">
            <div className="pf-loading__ring" />
            <span className="pf-loading__text">ЗАГРУЗКА ПРОФИЛЯ<span className="pf-loading__dots"><span>.</span><span>.</span><span>.</span></span></span>
        </div>
    );
    if (!profile) return null;

    const passedCount = results.filter(r => r.passed).length;
    const failedCount = results.length - passedCount;
    const avgPercent = results.length > 0 ? Math.round(results.reduce((s, r) => s + r.percent, 0) / results.length) : 0;
    const certCount = results.filter(r => r.certificateNumber).length;
    const passRate = results.length > 0 ? Math.round((passedCount / results.length) * 100) : 0;
    const bestScore = results.length > 0 ? Math.max(...results.map(r => r.percent)) : 0;

    const catMap: Record<string, { total: number; sum: number; passed: number }> = {};
    results.forEach(r => {
        const key = r.categoryName || "Без категории";
        if (!catMap[key]) catMap[key] = { total: 0, sum: 0, passed: 0 };
        catMap[key].total++;
        catMap[key].sum += r.percent;
        if (r.passed) catMap[key].passed++;
    });
    const topCategories = Object.entries(catMap)
        .map(([name, v]) => ({ name, avg: Math.round(v.sum / v.total), total: v.total, passed: v.passed }))
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 6);

    const last10 = results.slice(-10);
    const barData = {
        labels: last10.map(r => r.categoryName?.slice(0, 8) || "Тест"),
        datasets: [{
            label: "%",
            data: last10.map(r => r.percent),
            backgroundColor: last10.map(r => r.passed ? "rgba(0,255,136,0.7)" : "rgba(255,71,87,0.6)"),
            borderColor: last10.map(r => r.passed ? "#00ff88" : "#ff4757"),
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false as const,
        }],
    };
    const barOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: TooltipItem<"bar">) => `${c.parsed.y}%` } } },
        scales: {
            x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "rgba(255,255,255,0.35)", font: { size: 10 } } },
            y: { min: 0, max: 100, grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "rgba(255,255,255,0.35)", font: { size: 10 }, callback: (v: number | string) => v + "%" } },
        },
    };

    const donutData = {
        labels: ["Сдано", "Не сдано"],
        datasets: [{ data: results.length > 0 ? [passedCount, failedCount] : [1, 0], backgroundColor: ["#00ff88", "#ff4757"], borderWidth: 0, hoverOffset: 4 }],
    };
    const donutOptions = {
        responsive: true, maintainAspectRatio: false, cutout: "72%",
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: TooltipItem<"doughnut">) => `${c.label}: ${c.parsed}` } } },
    };

    const sortedResults = [...results].sort((a, b) => new Date(a.finishedAt).getTime() - new Date(b.finishedAt).getTime());
    const lineData = {
        labels: sortedResults.slice(-12).map((_, i) => `#${i + 1}`),
        datasets: [{
            label: "Результат",
            data: sortedResults.slice(-12).map(r => r.percent),
            borderColor: "#534AB7",
            backgroundColor: "rgba(83,74,183,0.15)",
            pointBackgroundColor: sortedResults.slice(-12).map(r => r.passed ? "#00ff88" : "#ff4757"),
            pointBorderColor: "transparent",
            pointRadius: 5,
            fill: true,
            tension: 0.4,
        }],
    };
    const lineOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "rgba(255,255,255,0.3)", font: { size: 10 } } },
            y: { min: 0, max: 100, grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "rgba(255,255,255,0.3)", font: { size: 10 }, callback: (v: number | string) => v + "%" } },
        },
    };

    const radarLabels = topCategories.slice(0, 5).map(c => c.name.slice(0, 12));
    const radarData = {
        labels: radarLabels,
        datasets: [{
            label: "Средний %",
            data: topCategories.slice(0, 5).map(c => c.avg),
            backgroundColor: "rgba(83,74,183,0.25)",
            borderColor: "#534AB7",
            pointBackgroundColor: "#00d4ff",
            pointBorderColor: "transparent",
            pointRadius: 4,
        }],
    };
    const radarOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            r: {
                min: 0, max: 100,
                grid: { color: "rgba(255,255,255,0.08)" },
                ticks: { display: false },
                pointLabels: { color: "rgba(255,255,255,0.5)", font: { size: 10 } },
                angleLines: { color: "rgba(255,255,255,0.06)" },
            },
        },
    };

    const initials = profile.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";

    return (
        <div className={`pf-page ${revealed ? "pf-page--in" : ""}`}>
            <div className="pf-grid-bg" />
            <div className="pf-scanline" />

            <main className="pf-main">

                <div className="pf-topbar">
                    <div className="pf-topbar__logo">
                        <span className="pf-topbar__bracket">[</span>
                        ПрофЦифра
                        <span className="pf-topbar__bracket">]</span>
                    </div>
                    <div className="pf-topbar__title">// МОЙ ПРОФИЛЬ</div>
                    <div className="pf-topbar__actions">
                        <button className="pf-btn-ghost" onClick={() => navigate("/categories")}>← Назад</button>
                        <button className="pf-btn-danger" onClick={handleLogout}>Выйти</button>
                    </div>
                </div>

                <div className="pf-hero">
                    <div className="pf-hero__glow" />
                    <div className="pf-hero__avatar-wrap">
                        <div className="pf-hero__avatar">
                            {profile.picture ? <img src={profile.picture} alt={profile.name} /> : <span>{initials}</span>}
                        </div>
                        <div className="pf-hero__avatar-ring" />
                    </div>
                    <div className="pf-hero__info">
                        <div className="pf-hero__tag">// ПОЛЬЗОВАТЕЛЬ</div>
                        <h1 className="pf-hero__name">{profile.name}</h1>
                        <p className="pf-hero__email">{profile.email}</p>
                        <div className="pf-hero__badges">
                            <span className={`pf-badge ${profile.isAdmin ? "pf-badge--admin" : "pf-badge--user"}`}>
                                {profile.isAdmin ? "⬡ Администратор" : "◉ Пользователь"}
                            </span>
                            <span className="pf-badge pf-badge--date">С {formatDate(profile.created_at)}</span>
                            <span className="pf-badge pf-badge--id">ID #{profile.id}</span>
                        </div>
                    </div>
                    <div className="pf-hero__score-preview">
                        <div className="pf-hero__score-ring">
                            <RadialProgress percent={avgPercent} size={120} color={avgPercent >= 80 ? "#00ff88" : avgPercent >= 50 ? "#f59e0b" : "#ff4757"} />
                            <div className="pf-hero__score-center">
                                <span className="pf-hero__score-val">{avgPercent}%</span>
                                <span className="pf-hero__score-sub">avg</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pf-metrics">
                    {[
                        { val: results.length, label: "Тестов пройдено", suffix: "", color: "#534AB7", icon: "◈" },
                        { val: passedCount, label: "Успешно сдано", suffix: "", color: "#00ff88", icon: "✓" },
                        { val: certCount, label: "Сертификатов", suffix: "", color: "#f59e0b", icon: "★" },
                        { val: passRate, label: "Успешность", suffix: "%", color: "#00d4ff", icon: "◎" },
                        { val: bestScore, label: "Лучший результат", suffix: "%", color: "#a855f7", icon: "▲" },
                    ].map((m, i) => (
                        <div className="pf-metric" key={i} style={{ "--m-color": m.color } as React.CSSProperties}>
                            <div className="pf-metric__icon">{m.icon}</div>
                            <div className="pf-metric__val">
                                <AnimatedNumber value={m.val} suffix={m.suffix} />
                            </div>
                            <div className="pf-metric__label">{m.label}</div>
                            <div className="pf-metric__bar">
                                <div className="pf-metric__bar-fill" style={{ width: `${m.suffix === "%" ? m.val : Math.min((m.val / Math.max(results.length, 1)) * 100, 100)}%` }} />
                            </div>
                        </div>
                    ))}
                </div>

                {results.length > 0 && (
                    <div className="pf-charts">
                        <div className="pf-chart-card pf-chart-card--wide">
                            <div className="pf-chart-card__header">
                                <span className="pf-chart-card__num">01</span>
                                <div>
                                    <div className="pf-chart-card__title">Динамика результатов</div>
                                    <div className="pf-chart-card__sub">Последние {last10.length} попыток</div>
                                </div>
                                <div className="pf-chart-legend">
                                    <span><span className="pf-dot" style={{ background: "#00ff88" }} />Сдан</span>
                                    <span><span className="pf-dot" style={{ background: "#ff4757" }} />Не сдан</span>
                                </div>
                            </div>
                            <div style={{ height: 180 }}><Bar data={barData} options={barOptions} /></div>
                        </div>

                        <div className="pf-chart-card pf-chart-card--wide">
                            <div className="pf-chart-card__header">
                                <span className="pf-chart-card__num">02</span>
                                <div>
                                    <div className="pf-chart-card__title">Тренд обучения</div>
                                    <div className="pf-chart-card__sub">Прогресс во времени</div>
                                </div>
                            </div>
                            <div style={{ height: 180 }}><Line data={lineData} options={lineOptions} /></div>
                        </div>

                        <div className="pf-chart-card">
                            <div className="pf-chart-card__header">
                                <span className="pf-chart-card__num">03</span>
                                <div>
                                    <div className="pf-chart-card__title">Распределение</div>
                                    <div className="pf-chart-card__sub">Сдано / Не сдано</div>
                                </div>
                            </div>
                            <div className="pf-donut-wrap">
                                <div style={{ position: "relative", height: 150, width: 150 }}>
                                    <Doughnut data={donutData} options={donutOptions} />
                                    <div className="pf-donut-center">
                                        <span className="pf-donut-val">{passRate}%</span>
                                        <span className="pf-donut-sub">сдано</span>
                                    </div>
                                </div>
                                <div className="pf-chart-legend pf-chart-legend--col">
                                    <span><span className="pf-dot" style={{ background: "#00ff88" }} />Сдано ({passedCount})</span>
                                    <span><span className="pf-dot" style={{ background: "#ff4757" }} />Не сдано ({failedCount})</span>
                                </div>
                            </div>
                        </div>

                        {topCategories.length >= 3 && (
                            <div className="pf-chart-card">
                                <div className="pf-chart-card__header">
                                    <span className="pf-chart-card__num">04</span>
                                    <div>
                                        <div className="pf-chart-card__title">По компетенциям</div>
                                        <div className="pf-chart-card__sub">Средний балл</div>
                                    </div>
                                </div>
                                <div style={{ height: 190 }}><Radar data={radarData} options={radarOptions} /></div>
                            </div>
                        )}
                    </div>
                )}

                {results.length > 0 && <StreakCalendar results={results} />}

                <div className="pf-tabs-section">
                    <div className="pf-tabs-header">
                        {(["info", "results", "certificates"] as const).map(tab => (
                            <button key={tab} className={`pf-tab-btn ${activeTab === tab ? "pf-tab-btn--active" : ""}`} onClick={() => setActiveTab(tab)}>
                                {tab === "info" && "◉ Обо мне"}
                                {tab === "results" && `◈ Результаты (${results.length})`}
                                {tab === "certificates" && `★ Сертификаты (${certCount})`}
                            </button>
                        ))}
                    </div>

                    <div className="pf-tab-content">
                        {activeTab === "info" && (
                            <div className="pf-info-grid">
                                {[
                                    { label: "ID пользователя", value: `#${profile.id}` },
                                    { label: "Email", value: profile.email },
                                    { label: "Имя", value: profile.name },
                                    { label: "Роль", value: profile.isAdmin ? "Администратор" : "Пользователь" },
                                    { label: "Дата регистрации", value: formatDate(profile.created_at) },
                                    { label: "Всего попыток", value: String(results.length) },
                                ].map((row, i) => (
                                    <div className="pf-info-row" key={i}>
                                        <span className="pf-info-label">{row.label}</span>
                                        <span className="pf-info-value">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "results" && (
                            <div className="pf-results">
                                {results.length === 0 ? (
                                    <div className="pf-empty">
                                        <div className="pf-empty__icon">◈</div>
                                        <p>Вы ещё не проходили тесты</p>
                                        <button className="pf-btn-primary" onClick={() => navigate("/categories")}>Начать тест</button>
                                    </div>
                                ) : (
                                    [...results].reverse().map((result) => (
                                        <div key={result.id} className={`pf-result-item ${result.passed ? "pf-result-item--pass" : "pf-result-item--fail"}`}>
                                            <div className="pf-result-item__indicator" />
                                            <div className="pf-result-item__left">
                                                <div className="pf-result-item__cat">{result.categoryName || "Без категории"}</div>
                                                <div className="pf-result-item__date">{formatDateShort(result.finishedAt)}</div>
                                            </div>
                                            <div className="pf-result-item__progress">
                                                <div className="pf-result-item__progress-bar">
                                                    <div className="pf-result-item__progress-fill" style={{ width: `${result.percent}%` }} />
                                                </div>
                                            </div>
                                            <div className="pf-result-item__right">
                                                <span className={`pf-result-item__score ${result.passed ? "pf-result-item__score--pass" : "pf-result-item__score--fail"}`}>
                                                    {result.percent}%
                                                </span>
                                                <span className={`pf-status-badge ${result.passed ? "pf-status-badge--pass" : "pf-status-badge--fail"}`}>
                                                    {result.passed ? "✓ Сдан" : "✗ Не сдан"}
                                                </span>
                                                <button className="pf-btn-sm" onClick={() => navigate(`/result/${result.id}`)}>
                                                    Детали →
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === "certificates" && (
                            <div className="pf-certs">
                                {certCount === 0 ? (
                                    <div className="pf-empty">
                                        <div className="pf-empty__icon">★</div>
                                        <p>У вас пока нет сертификатов</p>
                                        <p className="pf-empty__sub">Наберите 80% и выше, чтобы получить сертификат</p>
                                        <button className="pf-btn-primary" onClick={() => navigate("/categories")}>Пройти тест</button>
                                    </div>
                                ) : (
                                    results.filter(r => r.certificateNumber).map(result => (
                                        <div key={result.id} className="pf-cert-item">
                                            <div className="pf-cert-item__glow" />
                                            <div className="pf-cert-item__icon">★</div>
                                            <div className="pf-cert-item__info">
                                                <div className="pf-cert-item__name">{result.categoryName || "Тест"}</div>
                                                <div className="pf-cert-item__meta">{result.percent}% · {formatDateShort(result.finishedAt)}</div>
                                                <div className="pf-cert-item__num">№ {result.certificateNumber}</div>
                                            </div>
                                            <button className="pf-btn-sm" onClick={() => navigate(`/result/${result.id}`)}>Открыть →</button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
