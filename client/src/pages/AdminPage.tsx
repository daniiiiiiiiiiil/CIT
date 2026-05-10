import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../api/admin.api";
import { StatsTab } from "../components/admin/StatsTab";
import { UsersTab } from "../components/admin/UsersTab";
import { TestsTab } from "../components/admin/TestsTab";
import { CompetencesTab } from "../components/admin/CompetencesTab";
import { CertificatesTab } from "../components/admin/CertificatesTab";
import type { Stats, User, Category, Question, Competence, Certificate, CertificateStats } from "../types/admin.types";
import "./../styles/admin.scss";

const getToken = () => localStorage.getItem("token");
type Tab = "stats" | "users" | "tests" | "competences" | "certificates";

export default function AdminPage() {
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>("stats");
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [competences, setCompetences] = useState<Competence[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [certStats, setCertStats] = useState<CertificateStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialCheckDone, setInitialCheckDone] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const isMounted = useRef(true);

    const [certFilterCategory, setCertFilterCategory] = useState("");
    const [certFilterDateFrom, setCertFilterDateFrom] = useState("");
    const [certFilterDateTo, setCertFilterDateTo] = useState("");

    useEffect(() => {
        const token = getToken();
        if (!token) { navigate("/"); }
        else {
            setTimeout(() => {
                setInitialCheckDone(true);
                setTimeout(() => setRevealed(true), 100);
            }, 0);
        }
    }, [navigate]);

    const fetchData = useCallback(async () => {
        const token = getToken();
        if (!token) { navigate("/"); return; }
        setLoading(true);
        try {
            const [statsRes, usersRes, categoriesRes, questionsRes, competencesRes] = await Promise.all([
                adminApi.getStats(),
                adminApi.getUsers(),
                adminApi.getCategories(),
                adminApi.getQuestions(),
                adminApi.getCompetences(),
            ]);
            if (isMounted.current) {
                setStats(statsRes);
                setUsers(usersRes);
                setCategories(categoriesRes);
                setQuestions(questionsRes);
                setCompetences(competencesRes);
            }
        } catch {
            navigate("/");
        } finally { if (isMounted.current) setLoading(false); }
    }, [navigate]);

    const fetchCertificates = useCallback(async () => {
        const token = getToken();
        if (!token) return;
        try {
            const [certsRes, statsRes] = await Promise.all([
                adminApi.getCertificates({
                    category: certFilterCategory || undefined,
                    dateFrom: certFilterDateFrom || undefined,
                    dateTo: certFilterDateTo || undefined
                }),
                adminApi.getCertificateStats(),
            ]);
            if (isMounted.current) {
                setCertificates(certsRes);
                setCertStats(statsRes);
            }
        } catch {
            console.error("Failed to fetch certificates");
        }
    }, [certFilterCategory, certFilterDateFrom, certFilterDateTo]);

    useEffect(() => { if (initialCheckDone) { const t = setTimeout(fetchData, 0); return () => clearTimeout(t); } }, [initialCheckDone, fetchData]);
    useEffect(() => { if (tab === "certificates" && initialCheckDone) { const t = setTimeout(fetchCertificates, 0); return () => clearTimeout(t); } }, [tab, fetchCertificates, initialCheckDone]);
    useEffect(() => { return () => { isMounted.current = false; }; }, []);

    const handleLogout = async () => {
        const token = getToken();
        if (token) { try { await adminApi.logout(); } catch {
            // ignore
        } }
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleToggleAdmin = async (userId: number, currentStatus: boolean) => {
        const action = currentStatus ? "снять права администратора" : "назначить администратором";
        if (!confirm(`Вы уверены, что хотите ${action}?`)) return;
        try {
            await adminApi.toggleAdmin(userId);
            await fetchData();
        } catch {
            alert("Ошибка");
        }
    };

    const handleDeleteUser = async (userId: number, userName: string) => {
        if (!confirm(`Удалить пользователя "${userName}"? Это действие необратимо.`)) return;
        try {
            await adminApi.deleteUser(userId);
            alert("Пользователь удалён");
            await fetchData();
        } catch {
            alert("Ошибка");
        }
    };

    const handleCreateCompetence = async (name: string) => {
        await adminApi.createCompetence(name);
        await fetchData();
    };

    const handleDeleteCompetence = async (id: number) => {
        if (!confirm("Удалить компетенцию?")) return;
        await adminApi.deleteCompetence(id);
        await fetchData();
    };

    const handleCreateCategory = async (data: { name: string; description: string; competenceId: number | null }) => {
        await adminApi.createCategory(data);
        await fetchData();
    };

    const handleUpdateCategory = async (id: number, data: { name: string; description: string; competenceId: number | null }) => {
        await adminApi.updateCategory(id, data);
        await fetchData();
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm("Удалить тест? Все вопросы будут удалены!")) return;
        await adminApi.deleteCategory(id);
        await fetchData();
    };

    const handleDeleteQuestion = async (id: number) => {
        if (!confirm("Удалить вопрос?")) return;
        await adminApi.deleteQuestion(id);
        await fetchData();
    };

    const resetCertFilters = () => {
        setCertFilterCategory("");
        setCertFilterDateFrom("");
        setCertFilterDateTo("");
    };

    const uniqueCategories = [...new Map(categories.map(cat => [cat.id, cat.name])).values()];

    if (!initialCheckDone || loading) {
        return (
            <div className="adm-loading">
                <div className="adm-loading__ring" />
                <span className="adm-loading__text">
                    {!initialCheckDone ? "ПРОВЕРКА АВТОРИЗАЦИИ" : "ЗАГРУЗКА ДАННЫХ"}
                    <span className="adm-loading__dots"><span>.</span><span>.</span><span>.</span></span>
                </span>
            </div>
        );
    }

    const navItems: { key: Tab; label: string; icon: string }[] = [
        { key: "stats", label: "Статистика", icon: "◈" },
        { key: "users", label: "Пользователи", icon: "◉" },
        { key: "tests", label: "Тесты", icon: "▣" },
        { key: "competences", label: "Компетенции", icon: "⬡" },
        { key: "certificates", label: "Сертификаты", icon: "★" },
    ];

    return (
        <div className={`adm-page ${revealed ? "adm-page--in" : ""}`}>
            <div className="adm-grid-bg" />
            <div className="adm-scanline" />

            <aside className="adm-sidebar">
                <div className="adm-sidebar__brand">
                    <span className="adm-sidebar__bracket">[</span>
                    ПрофЦифра
                    <span className="adm-sidebar__bracket">]</span>
                </div>
                <div className="adm-sidebar__role">// ПАНЕЛЬ АДМИНИСТРАТОРА</div>

                <nav className="adm-nav">
                    {navItems.map(item => (
                        <button
                            key={item.key}
                            className={`adm-nav-btn ${tab === item.key ? "adm-nav-btn--active" : ""}`}
                            onClick={() => {
                                setTab(item.key);
                                if (item.key === "certificates") resetCertFilters();
                            }}
                        >
                            <span className="adm-nav-btn__icon">{item.icon}</span>
                            {item.label}
                            {tab === item.key && <span className="adm-nav-btn__bar" />}
                        </button>
                    ))}
                </nav>

                <button className="adm-logout" onClick={handleLogout}>← Выйти</button>
            </aside>

            <main className="adm-content">
                <div className="adm-section">
                    {tab === "stats" && stats && <StatsTab stats={stats} />}
                    {tab === "users" && <UsersTab users={users} onToggleAdmin={handleToggleAdmin} onDeleteUser={handleDeleteUser} />}
                    {tab === "tests" && (
                        <TestsTab
                            categories={categories}
                            questions={questions}
                            competences={competences}
                            onCreateCategory={handleCreateCategory}
                            onUpdateCategory={handleUpdateCategory}
                            onDeleteCategory={handleDeleteCategory}
                            onDeleteQuestion={handleDeleteQuestion}
                        />
                    )}
                    {tab === "competences" && (
                        <CompetencesTab
                            competences={competences}
                            onCreate={handleCreateCompetence}
                            onDelete={handleDeleteCompetence}
                        />
                    )}
                    {tab === "certificates" && (
                        <CertificatesTab
                            certificates={certificates}
                            stats={certStats}
                            filterCategory={certFilterCategory}
                            filterDateFrom={certFilterDateFrom}
                            filterDateTo={certFilterDateTo}
                            categories={uniqueCategories}
                            onFilterChange={(field, value) => {
                                if (field === "category") setCertFilterCategory(value);
                                else if (field === "dateFrom") setCertFilterDateFrom(value);
                                else if (field === "dateTo") setCertFilterDateTo(value);
                            }}
                            onResetFilters={resetCertFilters}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}