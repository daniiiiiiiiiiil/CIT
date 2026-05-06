import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import type { TooltipItem } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import "../styles/profile.scss";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
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

export default function ProfilePage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [results, setResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"info" | "results" | "certificates">("info");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        const fetchProfile = async () => {
            try {
                const profileRes = await axios.get(`${API}/api/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(profileRes.data);

                try {
                    const resultsRes = await axios.get(`${API}/api/user/results`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setResults(resultsRes.data);
                } catch (resultsError) {
                    console.error("Ошибка загрузки результатов:", resultsError);
                    setResults([]);
                }
            } catch (error) {
                console.error(error);
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                await axios.post(
                    `${API}/api/logout`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch {
                // ignore
            }
        }
        localStorage.removeItem("token");
        navigate("/");
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "Дата неизвестна";
        return new Date(dateString).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatDateShort = (dateString: string) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="pf-loading">
                <div className="pf-spinner" />
                <p>Загрузка профиля...</p>
            </div>
        );
    }

    if (!profile) return null;

    const passedCount = results.filter((r) => r.passed).length;
    const failedCount = results.length - passedCount;
    const avgPercent =
        results.length > 0
            ? Math.round(results.reduce((sum, r) => sum + r.percent, 0) / results.length)
            : 0;
    const certCount = results.filter((r) => r.certificateNumber).length;

    const last7 = results.slice(-7);
    const barData = {
        labels: last7.map((r) => r.categoryName?.slice(0, 10) || "Тест"),
        datasets: [
            {
                label: "Результат %",
                data: last7.map((r) => r.percent),
                backgroundColor: "#534AB7",
                borderRadius: 6,
                borderSkipped: false as const,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context: TooltipItem<"bar">) {
                        return `${context.parsed.y}%`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "#9ca3af", font: { size: 11 } },
            },
            y: {
                min: 0,
                max: 100,
                grid: { color: "rgba(0,0,0,0.05)" },
                ticks: {
                    color: "#9ca3af",
                    font: { size: 11 },
                    callback: function(value: number | string) {
                        return value + "%";
                    },
                },
            },
        },
    };

    const donutData = {
        labels: ["Сдано", "Не сдано"],
        datasets: [
            {
                data: results.length > 0 ? [passedCount, failedCount] : [1, 0],
                backgroundColor: ["#534AB7", "#F09595"],
                borderWidth: 0,
                hoverOffset: 6,
            },
        ],
    };

    const donutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context: TooltipItem<"doughnut">) {
                        return `${context.label}: ${context.parsed}`;
                    },
                },
            },
        },
    };

    const initials = profile.name
        ?.split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    return (
        <div className="pf-page">
            <main className="pf-main pf-main--full">
                <div className="pf-topbar">
                    <div className="pf-topbar__title">Мой профиль</div>
                    <div className="pf-topbar__actions">
                        <button className="pf-btn-back" onClick={() => navigate("/categories")}>
                            ← Назад
                        </button>
                        <button className="pf-btn-logout" onClick={handleLogout}>
                            Выйти
                        </button>
                    </div>
                </div>

                <div className="pf-hero">
                    <div className="pf-hero__avatar">
                        {profile.picture ? (
                            <img src={profile.picture} alt={profile.name} />
                        ) : (
                            <span>{initials}</span>
                        )}
                    </div>
                    <div className="pf-hero__info">
                        <h1 className="pf-hero__name">{profile.name}</h1>
                        <p className="pf-hero__email">{profile.email}</p>
                        <div className="pf-hero__badges">
                            <span className="pf-badge pf-badge--role">
                                {profile.isAdmin ? "Администратор" : "Пользователь"}
                            </span>
                            <span className="pf-badge pf-badge--date">
                                С {formatDateShort(profile.created_at)}
                            </span>
                            <span className="pf-badge pf-badge--id">ID #{profile.id}</span>
                        </div>
                    </div>
                </div>

                <div className="pf-metrics">
                    <div className="pf-metric pf-metric--purple">
                        <div className="pf-metric__icon">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                <path d="M4 19V7a2 2 0 012-2h12a2 2 0 012 2v12M4 19h16M4 19a2 2 0 01-2-2V9" />
                            </svg>
                        </div>
                        <div>
                            <div className="pf-metric__value">{results.length}</div>
                            <div className="pf-metric__label">Пройдено тестов</div>
                        </div>
                    </div>
                    <div className="pf-metric pf-metric--teal">
                        <div className="pf-metric__icon">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" />
                            </svg>
                        </div>
                        <div>
                            <div className="pf-metric__value">{passedCount}</div>
                            <div className="pf-metric__label">Успешно сдано</div>
                        </div>
                    </div>
                    <div className="pf-metric pf-metric--amber">
                        <div className="pf-metric__icon">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                <path d="M12 15l-2 5 2-1 2 1-2-5" /><circle cx="12" cy="9" r="6" />
                            </svg>
                        </div>
                        <div>
                            <div className="pf-metric__value">{certCount}</div>
                            <div className="pf-metric__label">Сертификатов</div>
                        </div>
                    </div>
                    <div className="pf-metric pf-metric--blue">
                        <div className="pf-metric__icon">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                <path d="M3 20h18M8 20V10M12 20V4M16 20v-6" />
                            </svg>
                        </div>
                        <div>
                            <div className="pf-metric__value">{avgPercent}%</div>
                            <div className="pf-metric__label">Средний балл</div>
                        </div>
                    </div>
                </div>

                {results.length > 0 && (
                    <div className="pf-charts">
                        <div className="pf-chart-card">
                            <div className="pf-chart-card__header">
                                <div>
                                    <div className="pf-chart-card__title">Результаты тестов</div>
                                    <div className="pf-chart-card__sub">Последние {last7.length} попыток</div>
                                </div>
                            </div>
                            <div className="pf-chart-card__body" style={{ height: 180 }}>
                                <Bar data={barData} options={barOptions} />
                            </div>
                            <div className="pf-legend">
                                <span className="pf-legend-item">
                                    <span className="pf-legend-dot" style={{ background: "#534AB7" }} />
                                    Результат
                                </span>
                            </div>
                        </div>

                        <div className="pf-chart-card">
                            <div className="pf-chart-card__header">
                                <div>
                                    <div className="pf-chart-card__title">Аналитика</div>
                                    <div className="pf-chart-card__sub">Распределение результатов</div>
                                </div>
                            </div>
                            <div className="pf-donut-wrap">
                                <div style={{ position: "relative", height: 160, width: 160 }}>
                                    <Doughnut data={donutData} options={donutOptions} />
                                    <div className="pf-donut-center">
                                        <span className="pf-donut-center__val">
                                            {results.length > 0
                                                ? Math.round((passedCount / results.length) * 100)
                                                : 0}%
                                        </span>
                                        <span className="pf-donut-center__label">сдано</span>
                                    </div>
                                </div>
                                <div className="pf-legend pf-legend--col">
                                    <span className="pf-legend-item">
                                        <span className="pf-legend-dot" style={{ background: "#534AB7" }} />
                                        Сдано ({passedCount})
                                    </span>
                                    <span className="pf-legend-item">
                                        <span className="pf-legend-dot" style={{ background: "#F09595" }} />
                                        Не сдано ({failedCount})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pf-tabs-section">
                    <div className="pf-tabs-header">
                        <button
                            className={`pf-tab-btn ${activeTab === "info" ? "pf-tab-btn--active" : ""}`}
                            onClick={() => setActiveTab("info")}
                        >
                            Обо мне
                        </button>
                        <button
                            className={`pf-tab-btn ${activeTab === "results" ? "pf-tab-btn--active" : ""}`}
                            onClick={() => setActiveTab("results")}
                        >
                            Результаты ({results.length})
                        </button>
                        <button
                            className={`pf-tab-btn ${activeTab === "certificates" ? "pf-tab-btn--active" : ""}`}
                            onClick={() => setActiveTab("certificates")}
                        >
                            Сертификаты ({certCount})
                        </button>
                    </div>

                    <div className="pf-tab-content">
                        {activeTab === "info" && (
                            <div className="pf-info-grid">
                                <div className="pf-info-row">
                                    <span className="pf-info-label">ID пользователя</span>
                                    <span className="pf-info-value">#{profile.id}</span>
                                </div>
                                <div className="pf-info-row">
                                    <span className="pf-info-label">Email</span>
                                    <span className="pf-info-value">{profile.email}</span>
                                </div>
                                <div className="pf-info-row">
                                    <span className="pf-info-label">Имя</span>
                                    <span className="pf-info-value">{profile.name}</span>
                                </div>
                                <div className="pf-info-row">
                                    <span className="pf-info-label">Роль</span>
                                    <span className="pf-info-value">
                                        {profile.isAdmin ? "Администратор" : "Пользователь"}
                                    </span>
                                </div>
                                <div className="pf-info-row">
                                    <span className="pf-info-label">Дата регистрации</span>
                                    <span className="pf-info-value">{formatDate(profile.created_at)}</span>
                                </div>
                            </div>
                        )}

                        {activeTab === "results" && (
                            <div className="pf-results">
                                {results.length === 0 ? (
                                    <div className="pf-empty">
                                        <p>Вы ещё не проходили тесты</p>
                                        <button
                                            className="pf-btn-primary"
                                            onClick={() => navigate("/categories")}
                                        >
                                            Пройти тест
                                        </button>
                                    </div>
                                ) : (
                                    results.map((result) => (
                                        <div key={result.id} className="pf-result-item">
                                            <div className="pf-result-item__left">
                                                <div className="pf-result-item__cat">
                                                    {result.categoryName || "Без категории"}
                                                </div>
                                                <div className="pf-result-item__date">
                                                    {formatDateShort(result.finishedAt)}
                                                </div>
                                            </div>
                                            <div className="pf-result-item__right">
                                                <span
                                                    className={`pf-result-item__score ${result.passed ? "pf-result-item__score--pass" : "pf-result-item__score--fail"}`}
                                                >
                                                    {result.percent}%
                                                </span>
                                                <span
                                                    className={`pf-status-badge ${result.passed ? "pf-status-badge--pass" : "pf-status-badge--fail"}`}
                                                >
                                                    {result.passed ? "✓ Сдан" : "✗ Не сдан"}
                                                </span>
                                                <button
                                                    className="pf-btn-sm"
                                                    onClick={() => navigate(`/result/${result.id}`)}
                                                >
                                                    Подробнее
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
                                        <p>У вас пока нет сертификатов</p>
                                        <p className="pf-empty__sub">
                                            Наберите 80% и более, чтобы получить сертификат
                                        </p>
                                        <button
                                            className="pf-btn-primary"
                                            onClick={() => navigate("/categories")}
                                        >
                                            Пройти тест
                                        </button>
                                    </div>
                                ) : (
                                    results
                                        .filter((r) => r.certificateNumber)
                                        .map((result) => (
                                            <div key={result.id} className="pf-cert-item">
                                                <div className="pf-cert-item__icon">🏅</div>
                                                <div className="pf-cert-item__info">
                                                    <div className="pf-cert-item__name">
                                                        {result.categoryName || "Тест"}
                                                    </div>
                                                    <div className="pf-cert-item__meta">
                                                        Результат: {result.percent}% · {formatDateShort(result.finishedAt)}
                                                    </div>
                                                    <div className="pf-cert-item__num">
                                                        № {result.certificateNumber}
                                                    </div>
                                                </div>
                                                <button
                                                    className="pf-btn-sm"
                                                    onClick={() => navigate(`/result/${result.id}`)}
                                                >
                                                    Посмотреть
                                                </button>
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