import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { profileApi } from "../api/profile.api";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { MetricsGrid } from "../components/profile/MetricsGrid";
import { ChartsSection } from "../components/profile/ChartsSection";
import { StreakCalendar } from "../components/profile/StreakCalendar";
import { InfoTab } from "../components/profile/InfoTab";
import { ResultsTab } from "../components/profile/ResultsTab";
import { CertificatesTab } from "../components/profile/CertificatesTab";
import type { UserProfile, TestResult, Metric, CategoryStats } from "../types/profile.types";
import "../styles/profile.scss";

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
                const [profileData, resultsData] = await Promise.all([
                    profileApi.getProfile(),
                    profileApi.getResults().catch(() => [])
                ]);
                setProfile(profileData);
                setResults(resultsData);
            } catch {
                localStorage.removeItem("token");
                navigate("/");
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
            try { await profileApi.logout(); } catch { /* ignore */ }
        }
        localStorage.removeItem("token");
        navigate("/");
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
    };

    const formatDateShort = (dateString: string) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
    };

    if (loading) {
        return (
            <div className="pf-loading">
                <div className="pf-loading__ring" />
                <span className="pf-loading__text">
                    ЗАГРУЗКА ПРОФИЛЯ
                    <span className="pf-loading__dots"><span>.</span><span>.</span><span>.</span></span>
                </span>
            </div>
        );
    }

    if (!profile) return null;

    const passedCount = results.filter(r => r.passed).length;
    const failedCount = results.length - passedCount;
    const avgPercent = results.length > 0 ? Math.round(results.reduce((s, r) => s + r.percent, 0) / results.length) : 0;
    const certCount = results.filter(r => r.certificateNumber).length;
    const passRate = results.length > 0 ? Math.round((passedCount / results.length) * 100) : 0;
    const bestScore = results.length > 0 ? Math.max(...results.map(r => r.percent)) : 0;

    const metrics: Metric[] = [
        { val: results.length, label: "Тестов пройдено", suffix: "", color: "#534AB7", icon: "◈" },
        { val: passedCount, label: "Успешно сдано", suffix: "", color: "#00ff88", icon: "✓" },
        { val: certCount, label: "Сертификатов", suffix: "", color: "#f59e0b", icon: "★" },
        { val: passRate, label: "Успешность", suffix: "%", color: "#00d4ff", icon: "◎" },
        { val: bestScore, label: "Лучший результат", suffix: "%", color: "#a855f7", icon: "▲" },
    ];

    const catMap: Record<string, { total: number; sum: number; passed: number }> = {};
    results.forEach(r => {
        const key = r.categoryName || "Без категории";
        if (!catMap[key]) catMap[key] = { total: 0, sum: 0, passed: 0 };
        catMap[key].total++;
        catMap[key].sum += r.percent;
        if (r.passed) catMap[key].passed++;
    });

    const topCategories: CategoryStats[] = Object.entries(catMap)
        .map(([name, v]) => ({ name, avg: Math.round(v.sum / v.total), total: v.total, passed: v.passed }))
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 6);

    const last10 = results.slice(-10);
    const certificates = results.filter(r => r.certificateNumber);
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

                <ProfileHeader profile={profile} avgPercent={avgPercent} initials={initials} formatDate={formatDate} />
                <MetricsGrid metrics={metrics} totalTests={results.length} />
                <ChartsSection results={results} last10={last10} topCategories={topCategories} passRate={passRate} passedCount={passedCount} failedCount={failedCount} />
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
                        {activeTab === "info" && <InfoTab profile={profile} resultsCount={results.length} formatDate={formatDate} />}
                        {activeTab === "results" && <ResultsTab results={results} formatDateShort={formatDateShort} />}
                        {activeTab === "certificates" && <CertificatesTab certificates={certificates} formatDateShort={formatDateShort} />}
                    </div>
                </div>
            </main>
        </div>
    );
}