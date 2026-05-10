import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/admin.scss";

const API = "http://localhost:5000";

interface Competence { id: number; name: string; }
interface Category {
    id: number; name: string; description: string;
    competence_id: number; competence_name: string; questions_count: number;
}
interface AnswerForm { text: string; isCorrect: boolean; }
interface Question {
    id: number; text: string; type: "single" | "multiple";
    category_id: number; answers_count: number;
}
interface Stats {
    totalUsers: number; totalQuestions: number; totalTests: number;
    avgPercent: number; failedCount: number;
}
interface User { id: number; email: string; name: string; is_admin: boolean; created_at: string; }
interface Certificate {
    id: number; cert_number: string; user_name: string; user_email: string;
    category_name: string; competence_name: string | null; score: number; issued_at: string;
}
interface CertificateStats {
    total: { total: number; unique_users: number; };
    daily: Array<{ issued_date: string; issued_count: number; }>;
    byCompetence: Array<{ competence_name: string; certificates_count: number; avg_score: number; }>;
}
interface ApiError { response?: { data?: { message?: string; }; }; }
type Tab = "stats" | "users" | "tests" | "competences" | "certificates";
interface QuestionForm {
    id: string; editQ: Question | null; qText: string;
    qType: "single" | "multiple"; answers: AnswerForm[];
}

const getToken = () => localStorage.getItem("token");
const getHeaders = () => ({ Authorization: `Bearer ${getToken()}` });
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

function AnimNum({ value, suffix = "" }: { value: number; suffix?: string }) {
    const [d, setD] = useState(0);
    useEffect(() => {
        let start: number | null = null;
        const step = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / 1000, 1);
            setD(Math.round((1 - Math.pow(1 - p, 3)) * value));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [value]);
    return <>{d}{suffix}</>;
}

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
    const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);

    const [showTestForm, setShowTestForm] = useState(false);
    const [editTest, setEditTest] = useState<Category | null>(null);
    const [testName, setTestName] = useState("");
    const [testDesc, setTestDesc] = useState("");
    const [testCompetence, setTestCompetence] = useState<number>(0);
    const [showCompForm, setShowCompForm] = useState(false);
    const [newCompName, setNewCompName] = useState("");
    const [questionForms, setQuestionForms] = useState<QuestionForm[]>([]);

    useEffect(() => {
        const token = getToken();
        if (!token) { navigate("/"); }
        else { setTimeout(() => { setInitialCheckDone(true); setTimeout(() => setRevealed(true), 100); }, 0); }
    }, [navigate]);

    const fetchData = useCallback(async () => {
        const token = getToken();
        if (!token) { navigate("/"); return; }
        setLoading(true);
        try {
            const [statsRes, usersRes, categoriesRes, questionsRes, competencesRes] = await Promise.all([
                axios.get<Stats>(`${API}/api/admin/stats`, { headers: getHeaders() }),
                axios.get<User[]>(`${API}/api/admin/users`, { headers: getHeaders() }),
                axios.get<Category[]>(`${API}/api/admin/categories`, { headers: getHeaders() }),
                axios.get<Question[]>(`${API}/api/admin/questions`, { headers: getHeaders() }),
                axios.get<Competence[]>(`${API}/api/competences`, { headers: getHeaders() }),
            ]);
            if (isMounted.current) {
                setStats(statsRes.data); setUsers(usersRes.data);
                setCategories(categoriesRes.data); setQuestions(questionsRes.data);
                setCompetences(competencesRes.data);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 403) navigate("/");
        } finally { if (isMounted.current) setLoading(false); }
    }, [navigate]);

    const fetchCertificates = useCallback(async () => {
        const token = getToken(); if (!token) return;
        try {
            const params = new URLSearchParams();
            if (certFilterCategory) params.append("category", certFilterCategory);
            if (certFilterDateFrom) params.append("dateFrom", certFilterDateFrom);
            if (certFilterDateTo) params.append("dateTo", certFilterDateTo);
            const [certsRes, statsRes] = await Promise.all([
                axios.get<Certificate[]>(`${API}/api/admin/certificates?${params.toString()}`, { headers: getHeaders() }),
                axios.get<CertificateStats>(`${API}/api/admin/certificates/stats`, { headers: getHeaders() }),
            ]);
            if (isMounted.current) { setCertificates(certsRes.data); setCertStats(statsRes.data); }
        } catch (e) { console.error(e); }
    }, [certFilterCategory, certFilterDateFrom, certFilterDateTo]);

    useEffect(() => { if (initialCheckDone) { const t = setTimeout(fetchData, 0); return () => clearTimeout(t); } }, [initialCheckDone, fetchData]);
    useEffect(() => { if (tab === "certificates" && initialCheckDone) { const t = setTimeout(fetchCertificates, 0); return () => clearTimeout(t); } }, [tab, fetchCertificates, initialCheckDone]);
    useEffect(() => { return () => { isMounted.current = false; }; }, []);

    const handleLogout = async () => {
        const token = getToken();
        if (token) { try { await axios.post(`${API}/api/logout`, {}, { headers: getHeaders() }); } catch {
            //ignore
        } }
        localStorage.removeItem("token"); navigate("/");
    };

    const resetCompForm = () => { setNewCompName(""); setShowCompForm(false); };
    const addCompetence = async () => {
        if (!newCompName.trim()) { alert("Введите название"); return; }
        try { await axios.post(`${API}/api/admin/competences`, { name: newCompName }, { headers: getHeaders() }); resetCompForm(); await fetchData(); }
        catch { alert("Ошибка добавления"); }
    };
    const deleteCompetence = async (id: number) => {
        if (!confirm("Удалить компетенцию?")) return;
        try { await axios.delete(`${API}/api/admin/competences/${id}`, { headers: getHeaders() }); await fetchData(); }
        catch { alert("Ошибка удаления"); }
    };

    const resetTestForm = () => { setTestName(""); setTestDesc(""); setTestCompetence(0); setEditTest(null); setShowTestForm(false); };
    const openEditTest = (test: Category) => {
        setEditTest(test); setTestName(test.name); setTestDesc(test.description || "");
        setTestCompetence(test.competence_id || 0); setShowTestForm(true);
        setExpandedCategoryId(null); setQuestionForms([]);
    };
    const saveTest = async () => {
        if (!testName.trim()) { alert("Введите название"); return; }
        try {
            const body = { name: testName, description: testDesc, competenceId: testCompetence || null };
            if (editTest) await axios.put(`${API}/api/admin/categories/${editTest.id}`, body, { headers: getHeaders() });
            else await axios.post(`${API}/api/admin/categories`, body, { headers: getHeaders() });
            resetTestForm(); await fetchData();
        } catch { alert("Ошибка сохранения"); }
    };
    const deleteTest = async (id: number) => {
        if (!confirm("Удалить тест? Все вопросы будут удалены!")) return;
        try {
            if (expandedCategoryId === id) { setExpandedCategoryId(null); setQuestionForms([]); }
            await axios.delete(`${API}/api/admin/categories/${id}`, { headers: getHeaders() }); await fetchData();
        } catch { alert("Ошибка удаления"); }
    };
    const toggleExpand = (id: number) => {
        if (expandedCategoryId === id) { setExpandedCategoryId(null); setQuestionForms([]); }
        else { setExpandedCategoryId(id); setQuestionForms([]); setShowTestForm(false); setEditTest(null); }
    };

    const addQuestionForm = () => setQuestionForms(prev => [...prev, { id: generateId(), editQ: null, qText: "", qType: "single", answers: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }] }]);
    const removeQuestionForm = (id: string) => setQuestionForms(prev => prev.filter(f => f.id !== id));
    const updateQuestionForm = (id: string, updates: Partial<Omit<QuestionForm, "id">>) => setQuestionForms(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));

    const openEditQ = (q: Question) => {
        const load = async () => {
            try {
                const res = await axios.get(`${API}/api/admin/questions/${q.id}/details`, { headers: getHeaders() });
                setQuestionForms(prev => [...prev, {
                    id: generateId(), editQ: q, qText: res.data.text, qType: res.data.type,
                    answers: res.data.answers.map((a: { text: string; is_correct: boolean }) => ({ text: a.text, isCorrect: a.is_correct })),
                }]);
            } catch { alert("Ошибка загрузки вопроса"); }
        };
        load();
    };

    const saveQuestion = async (formId: string, form: QuestionForm) => {
        if (!expandedCategoryId) return;
        const valid = form.answers.filter(a => a.text.trim());
        if (!form.qText.trim() || valid.length < 2) { alert("Заполните текст и минимум 2 варианта"); return; }
        if (!valid.some(a => a.isCorrect)) { alert("Выберите хотя бы один правильный ответ"); return; }
        try {
            const body = { text: form.qText, type: form.qType, categoryId: expandedCategoryId, answers: valid };
            if (form.editQ) await axios.put(`${API}/api/admin/questions/${form.editQ.id}`, body, { headers: getHeaders() });
            else await axios.post(`${API}/api/admin/questions`, body, { headers: getHeaders() });
            removeQuestionForm(formId); await fetchData();
        } catch { alert("Ошибка сохранения вопроса"); }
    };

    const deleteQuestion = async (id: number) => {
        if (!confirm("Удалить вопрос?")) return;
        try { await axios.delete(`${API}/api/admin/questions/${id}`, { headers: getHeaders() }); await fetchData(); }
        catch { alert("Ошибка удаления"); }
    };

    const toggleAdmin = async (userId: number, currentStatus: boolean) => {
        const action = currentStatus ? "снять права администратора" : "назначить администратором";
        if (!confirm(`Вы уверены, что хотите ${action}?`)) return;
        try {
            const res = await axios.put(`${API}/api/admin/users/${userId}/toggle-admin`, {}, { headers: getHeaders() });
            alert(res.data.message); await fetchData();
        } catch (error) { alert((error as ApiError).response?.data?.message || "Ошибка"); }
    };

    const deleteUser = async (userId: number, userName: string) => {
        if (!confirm(`Удалить пользователя "${userName}"? Это действие необратимо.`)) return;
        try { await axios.delete(`${API}/api/admin/users/${userId}`, { headers: getHeaders() }); alert("Пользователь удалён"); await fetchData(); }
        catch (error) { alert((error as ApiError).response?.data?.message || "Ошибка"); }
    };

    const resetCertFilters = () => { setCertFilterCategory(""); setCertFilterDateFrom(""); setCertFilterDateTo(""); };
    const formatDate = (d: string) => new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

    if (!initialCheckDone || loading) return (
        <div className="adm-loading">
            <div className="adm-loading__ring" />
            <span className="adm-loading__text">
                {!initialCheckDone ? "ПРОВЕРКА АВТОРИЗАЦИИ" : "ЗАГРУЗКА ДАННЫХ"}
                <span className="adm-loading__dots"><span>.</span><span>.</span><span>.</span></span>
            </span>
        </div>
    );

    const uniqueCategories = [...new Map(categories.map(cat => [cat.id, cat.name])).values()];
    const navItems: { key: Tab; label: string; icon: string }[] = [
        { key: "stats",        label: "Статистика",    icon: "◈" },
        { key: "users",        label: "Пользователи",  icon: "◉" },
        { key: "tests",        label: "Тесты",         icon: "▣" },
        { key: "competences",  label: "Компетенции",   icon: "⬡" },
        { key: "certificates", label: "Сертификаты",   icon: "★" },
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
                                if (item.key === "tests") { setShowTestForm(false); setExpandedCategoryId(null); setQuestionForms([]); }
                                if (item.key === "competences") setShowCompForm(false);
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

                {tab === "stats" && stats && (
                    <div className="adm-section">
                        <div className="adm-section__head">
                            <span className="adm-section__num">01</span>
                            <h2 className="adm-section__title">Общая статистика</h2>
                        </div>

                        <div className="adm-stats-grid">
                            {[
                                { val: stats.totalUsers,     label: "Пользователей",        icon: "◉", color: "#00d4ff" },
                                { val: stats.totalQuestions, label: "Вопросов в базе",       icon: "▣", color: "#534AB7" },
                                { val: stats.totalTests,     label: "Тестов пройдено",       icon: "◈", color: "#00ff88" },
                                { val: stats.avgPercent,     label: "Средний результат",     icon: "◎", color: "#f59e0b", suffix: "%" },
                                { val: stats.failedCount,    label: "Не прошли (< 80%)",     icon: "✕", color: "#ff4757" },
                            ].map((s, i) => (
                                <div className="adm-stat" key={i} style={{ "--s-color": s.color } as React.CSSProperties}>
                                    <div className="adm-stat__icon">{s.icon}</div>
                                    <div className="adm-stat__val"><AnimNum value={s.val} suffix={s.suffix} /></div>
                                    <div className="adm-stat__label">{s.label}</div>
                                    <div className="adm-stat__glow" />
                                </div>
                            ))}
                        </div>

                        <div className="adm-passbar-card">
                            <div className="adm-passbar-card__header">
                                <span className="adm-passbar-card__title">Успешность прохождения</span>
                                <span className="adm-passbar-card__val" style={{ color: "#00ff88" }}>
                                    {stats.totalTests > 0 ? Math.round(((stats.totalTests - stats.failedCount) / stats.totalTests) * 100) : 0}%
                                </span>
                            </div>
                            <div className="adm-passbar">
                                <div className="adm-passbar__fill" style={{
                                    width: `${stats.totalTests > 0 ? Math.round(((stats.totalTests - stats.failedCount) / stats.totalTests) * 100) : 0}%`
                                }} />
                                <div className="adm-passbar__mark" />
                            </div>
                            <div className="adm-passbar__sub">Порог прохождения: 80%</div>
                        </div>
                    </div>
                )}

                {tab === "users" && (
                    <div className="adm-section">
                        <div className="adm-section__head">
                            <span className="adm-section__num">02</span>
                            <h2 className="adm-section__title">Пользователи <span className="adm-count">({users.length})</span></h2>
                        </div>

                        <div className="adm-table-wrap">
                            <table className="adm-table">
                                <thead>
                                <tr>
                                    <th>ID</th><th>Имя</th><th>Email</th>
                                    <th>Роль</th><th>Дата</th><th>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td className="adm-table__id">#{user.id}</td>
                                        <td className="adm-table__name">{user.name}</td>
                                        <td className="adm-table__email">{user.email}</td>
                                        <td>
                                                <span className={`adm-role ${user.is_admin ? "adm-role--admin" : "adm-role--user"}`}>
                                                    {user.is_admin ? "⬡ Админ" : "◉ Польз."}
                                                </span>
                                        </td>
                                        <td className="adm-table__date">{new Date(user.created_at).toLocaleDateString("ru-RU")}</td>
                                        <td>
                                            <div className="adm-table__actions">
                                                <button className="adm-btn-sm" onClick={() => toggleAdmin(user.id, user.is_admin)}>
                                                    {user.is_admin ? "↓ Снять" : "↑ Админ"}
                                                </button>
                                                <button className="adm-btn-sm adm-btn-sm--del" onClick={() => deleteUser(user.id, user.name)}>
                                                    ✕
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {tab === "tests" && (
                    <div className="adm-section">
                        <div className="adm-section__head">
                            <span className="adm-section__num">03</span>
                            <h2 className="adm-section__title">Тесты <span className="adm-count">({categories.length})</span></h2>
                            <button className="adm-btn-primary" onClick={() => { resetTestForm(); setShowTestForm(true); setExpandedCategoryId(null); setQuestionForms([]); }}>
                                + Создать тест
                            </button>
                        </div>

                        {showTestForm && (
                            <div className="adm-form">
                                <div className="adm-form__header">
                                    <span className="adm-form__title">{editTest ? "// РЕДАКТИРОВАТЬ ТЕСТ" : "// НОВЫЙ ТЕСТ"}</span>
                                    <button className="adm-btn-icon" onClick={resetTestForm}>✕</button>
                                </div>
                                <div className="adm-form__grid">
                                    <div className="adm-field">
                                        <label>Название теста</label>
                                        <input type="text" value={testName} onChange={e => setTestName(e.target.value)} placeholder="Например: Базы данных" />
                                    </div>
                                    <div className="adm-field">
                                        <label>Компетенция</label>
                                        <select value={testCompetence} onChange={e => setTestCompetence(Number(e.target.value))}>
                                            <option value={0}>-- Выберите --</option>
                                            {competences.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="adm-field adm-field--full">
                                        <label>Описание</label>
                                        <textarea value={testDesc} onChange={e => setTestDesc(e.target.value)} placeholder="Описание теста" rows={2} />
                                    </div>
                                </div>
                                <div className="adm-form__actions">
                                    <button className="adm-btn-primary" onClick={saveTest}>Сохранить</button>
                                    <button className="adm-btn-ghost" onClick={resetTestForm}>Отмена</button>
                                </div>
                            </div>
                        )}

                        <div className="adm-tests-list">
                            {categories.length === 0 && !showTestForm && (
                                <div className="adm-empty"><span>▣</span><p>Нет тестов. Нажмите «+ Создать тест»</p></div>
                            )}
                            {categories.map(cat => {
                                const isExp = expandedCategoryId === cat.id;
                                const catQ = questions.filter(q => q.category_id === cat.id);
                                return (
                                    <div key={cat.id} className={`adm-test-card ${isExp ? "adm-test-card--open" : ""}`}>
                                        <div className="adm-test-card__header">
                                            <div className="adm-test-card__info">
                                                <h3 className="adm-test-card__name">{cat.name}</h3>
                                                <p className="adm-test-card__desc">{cat.description || "Нет описания"}</p>
                                                <div className="adm-test-card__meta">
                                                    {cat.competence_name && (
                                                        <span className="adm-chip adm-chip--comp">{cat.competence_name}</span>
                                                    )}
                                                    <span className="adm-chip">{cat.questions_count} вопросов</span>
                                                </div>
                                            </div>
                                            <div className="adm-test-card__actions">
                                                <button className={`adm-btn-sm ${isExp ? "adm-btn-sm--active" : ""}`} onClick={() => toggleExpand(cat.id)}>
                                                    {isExp ? "▲" : "▼"} Вопросы
                                                </button>
                                                <button className="adm-btn-sm" onClick={() => openEditTest(cat)}>✏</button>
                                                <button className="adm-btn-sm adm-btn-sm--del" onClick={() => deleteTest(cat.id)}>✕</button>
                                            </div>
                                        </div>

                                        {isExp && (
                                            <div className="adm-test-card__body">
                                                <div className="adm-questions-header">
                                                    <span className="adm-questions-title">// ВОПРОСЫ ТЕСТА</span>
                                                    <button className="adm-btn-primary" onClick={addQuestionForm}>+ Добавить</button>
                                                </div>

                                                <div className="adm-questions-list">
                                                    {catQ.length === 0 && questionForms.length === 0 && (
                                                        <div className="adm-empty adm-empty--sm"><p>Нет вопросов</p></div>
                                                    )}
                                                    {catQ.map(q => (
                                                        <div key={q.id} className="adm-q-card">
                                                            <div className="adm-q-card__text">{q.text}</div>
                                                            <div className="adm-q-card__meta">
                                                                <span className="adm-chip">{q.type === "single" ? "Один ответ" : "Несколько"}</span>
                                                                <span className="adm-chip">{q.answers_count} вариантов</span>
                                                            </div>
                                                            <div className="adm-q-card__actions">
                                                                <button className="adm-btn-sm" onClick={() => openEditQ(q)}>✏</button>
                                                                <button className="adm-btn-sm adm-btn-sm--del" onClick={() => deleteQuestion(q.id)}>✕</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {questionForms.map(form => (
                                                    <div key={form.id} className="adm-form adm-form--question">
                                                        <div className="adm-form__header">
                                                            <span className="adm-form__title">{form.editQ ? "// РЕДАКТИРОВАТЬ ВОПРОС" : "// НОВЫЙ ВОПРОС"}</span>
                                                            <button className="adm-btn-icon" onClick={() => removeQuestionForm(form.id)}>✕</button>
                                                        </div>

                                                        <div className="adm-field">
                                                            <label>Текст вопроса</label>
                                                            <textarea value={form.qText} onChange={e => updateQuestionForm(form.id, { qText: e.target.value })} rows={3} placeholder="Введите вопрос..." />
                                                        </div>

                                                        <div className="adm-field">
                                                            <label>Тип ответа</label>
                                                            <select value={form.qType} onChange={e => updateQuestionForm(form.id, { qType: e.target.value as "single" | "multiple" })}>
                                                                <option value="single">Один правильный ответ</option>
                                                                <option value="multiple">Несколько правильных ответов</option>
                                                            </select>
                                                        </div>

                                                        <div className="adm-field">
                                                            <label>Варианты ответов</label>
                                                            <div className="adm-answers">
                                                                {form.answers.map((ans, i) => (
                                                                    <div key={i} className={`adm-answer-row ${ans.isCorrect ? "adm-answer-row--correct" : ""}`}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={ans.isCorrect}
                                                                            className="adm-checkbox"
                                                                            onChange={e => {
                                                                                const newA = form.answers.map((a, j) => ({
                                                                                    ...a,
                                                                                    isCorrect: form.qType === "single" ? j === i ? e.target.checked : false : j === i ? e.target.checked : a.isCorrect,
                                                                                }));
                                                                                updateQuestionForm(form.id, { answers: newA });
                                                                            }}
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={ans.text}
                                                                            placeholder={`Вариант ${i + 1}`}
                                                                            onChange={e => {
                                                                                const newA = form.answers.map((a, j) => j === i ? { ...a, text: e.target.value } : a);
                                                                                updateQuestionForm(form.id, { answers: newA });
                                                                            }}
                                                                        />
                                                                        {form.answers.length > 2 && (
                                                                            <button className="adm-btn-icon" onClick={() => updateQuestionForm(form.id, { answers: form.answers.filter((_, j) => j !== i) })}>✕</button>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                                <button className="adm-btn-ghost" onClick={() => updateQuestionForm(form.id, { answers: [...form.answers, { text: "", isCorrect: false }] })}>
                                                                    + Добавить вариант
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="adm-form__actions">
                                                            <button className="adm-btn-primary" onClick={() => saveQuestion(form.id, form)}>Сохранить вопрос</button>
                                                            <button className="adm-btn-ghost" onClick={() => removeQuestionForm(form.id)}>Отмена</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {tab === "competences" && (
                    <div className="adm-section">
                        <div className="adm-section__head">
                            <span className="adm-section__num">04</span>
                            <h2 className="adm-section__title">Компетенции <span className="adm-count">({competences.length})</span></h2>
                            <button className="adm-btn-primary" onClick={() => setShowCompForm(true)}>+ Создать</button>
                        </div>

                        {showCompForm && (
                            <div className="adm-form">
                                <div className="adm-form__header">
                                    <span className="adm-form__title">// НОВАЯ КОМПЕТЕНЦИЯ</span>
                                    <button className="adm-btn-icon" onClick={resetCompForm}>✕</button>
                                </div>
                                <div className="adm-field">
                                    <label>Название компетенции</label>
                                    <input type="text" value={newCompName} onChange={e => setNewCompName(e.target.value)} placeholder="Например: Базы данных" onKeyDown={e => e.key === "Enter" && addCompetence()} />
                                </div>
                                <div className="adm-form__actions">
                                    <button className="adm-btn-primary" onClick={addCompetence}>Сохранить</button>
                                    <button className="adm-btn-ghost" onClick={resetCompForm}>Отмена</button>
                                </div>
                            </div>
                        )}

                        <div className="adm-comp-list">
                            {competences.length === 0 && !showCompForm && (
                                <div className="adm-empty"><span>⬡</span><p>Нет компетенций</p></div>
                            )}
                            {competences.map(comp => (
                                <div key={comp.id} className="adm-comp-card">
                                    <span className="adm-comp-card__icon">⬡</span>
                                    <span className="adm-comp-card__name">{comp.name}</span>
                                    <span className="adm-comp-card__id">#{comp.id}</span>
                                    <button className="adm-btn-sm adm-btn-sm--del" onClick={() => deleteCompetence(comp.id)}>✕ Удалить</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === "certificates" && (
                    <div className="adm-section">
                        <div className="adm-section__head">
                            <span className="adm-section__num">05</span>
                            <h2 className="adm-section__title">Сертификаты</h2>
                        </div>

                        {certStats && (
                            <div className="adm-stats-grid adm-stats-grid--sm">
                                <div className="adm-stat" style={{ "--s-color": "#f59e0b" } as React.CSSProperties}>
                                    <div className="adm-stat__icon">★</div>
                                    <div className="adm-stat__val"><AnimNum value={certStats.total.total} /></div>
                                    <div className="adm-stat__label">Всего выдано</div>
                                    <div className="adm-stat__glow" />
                                </div>
                                <div className="adm-stat" style={{ "--s-color": "#00d4ff" } as React.CSSProperties}>
                                    <div className="adm-stat__icon">◉</div>
                                    <div className="adm-stat__val"><AnimNum value={certStats.total.unique_users} /></div>
                                    <div className="adm-stat__label">Получателей</div>
                                    <div className="adm-stat__glow" />
                                </div>
                                {certStats.byCompetence.map(comp => (
                                    <div key={comp.competence_name} className="adm-stat" style={{ "--s-color": "#534AB7" } as React.CSSProperties}>
                                        <div className="adm-stat__icon">⬡</div>
                                        <div className="adm-stat__val">{comp.certificates_count}</div>
                                        <div className="adm-stat__label">{comp.competence_name || "Без компетенции"}<br /><span style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>ср. {comp.avg_score}%</span></div>
                                        <div className="adm-stat__glow" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="adm-form adm-form--filters">
                            <div className="adm-form__header">
                                <span className="adm-form__title">// ФИЛЬТРЫ</span>
                            </div>
                            <div className="adm-filters-row">
                                <div className="adm-field">
                                    <label>Категория</label>
                                    <select value={certFilterCategory} onChange={e => setCertFilterCategory(e.target.value)}>
                                        <option value="">Все категории</option>
                                        {uniqueCategories.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                                <div className="adm-field">
                                    <label>Дата от</label>
                                    <input type="date" value={certFilterDateFrom} onChange={e => setCertFilterDateFrom(e.target.value)} />
                                </div>
                                <div className="adm-field">
                                    <label>Дата до</label>
                                    <input type="date" value={certFilterDateTo} onChange={e => setCertFilterDateTo(e.target.value)} />
                                </div>
                                <div className="adm-field adm-field--end">
                                    <button className="adm-btn-ghost" onClick={resetCertFilters}>Сбросить</button>
                                </div>
                            </div>
                        </div>

                        <div className="adm-table-wrap">
                            <table className="adm-table">
                                <thead>
                                <tr>
                                    <th>№ Сертификата</th><th>Пользователь</th><th>Email</th>
                                    <th>Тест / Компетенция</th><th>Результат</th><th>Дата</th>
                                </tr>
                                </thead>
                                <tbody>
                                {certificates.length === 0 ? (
                                    <tr><td colSpan={6} className="adm-table__empty">Нет выданных сертификатов</td></tr>
                                ) : (
                                    certificates.map(cert => (
                                        <tr key={cert.id}>
                                            <td><span className="adm-cert-num">{cert.cert_number}</span></td>
                                            <td className="adm-table__name">{cert.user_name}</td>
                                            <td className="adm-table__email">{cert.user_email}</td>
                                            <td>
                                                <div className="adm-table__cat">{cert.category_name}</div>
                                                {cert.competence_name && <div className="adm-table__comp">{cert.competence_name}</div>}
                                            </td>
                                            <td>
                                                    <span className={`adm-score ${cert.score >= 90 ? "adm-score--high" : "adm-score--mid"}`}>
                                                        {cert.score}%
                                                    </span>
                                            </td>
                                            <td className="adm-table__date">{formatDate(cert.issued_at)}</td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
