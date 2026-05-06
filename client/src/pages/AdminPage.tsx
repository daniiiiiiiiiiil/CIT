import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/admin.scss";

const API = "http://localhost:5000";

interface Competence {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    description: string;
    competence_id: number;
    competence_name: string;
    questions_count: number;
}

interface AnswerForm {
    text: string;
    isCorrect: boolean;
}

interface Question {
    id: number;
    text: string;
    type: "single" | "multiple";
    category_id: number;
    answers_count: number;
}

interface Stats {
    totalUsers: number;
    totalQuestions: number;
    totalTests: number;
    avgPercent: number;
    failedCount: number;
}

interface User {
    id: number;
    email: string;
    name: string;
    is_admin: boolean;
    created_at: string;
}

interface Certificate {
    id: number;
    cert_number: string;
    user_name: string;
    user_email: string;
    category_name: string;
    competence_name: string | null;
    score: number;
    issued_at: string;
}

interface CertificateStats {
    total: {
        total: number;
        unique_users: number;
    };
    daily: Array<{
        issued_date: string;
        issued_count: number;
    }>;
    byCompetence: Array<{
        competence_name: string;
        certificates_count: number;
        avg_score: number;
    }>;
}

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

type Tab = "stats" | "users" | "tests" | "competences" | "certificates";

interface QuestionForm {
    id: string;
    editQ: Question | null;
    qText: string;
    qType: "single" | "multiple";
    answers: AnswerForm[];
}

const getToken = () => localStorage.getItem("token");
const getHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

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
    const isMounted = useRef(true);

    // Фильтры для сертификатов
    const [certFilterCategory, setCertFilterCategory] = useState<string>("");
    const [certFilterDateFrom, setCertFilterDateFrom] = useState<string>("");
    const [certFilterDateTo, setCertFilterDateTo] = useState<string>("");

    const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);

    // Форма теста
    const [showTestForm, setShowTestForm] = useState(false);
    const [editTest, setEditTest] = useState<Category | null>(null);
    const [testName, setTestName] = useState("");
    const [testDesc, setTestDesc] = useState("");
    const [testCompetence, setTestCompetence] = useState<number>(0);

    // Форма компетенции
    const [showCompForm, setShowCompForm] = useState(false);
    const [newCompName, setNewCompName] = useState("");

    // Формы вопросов
    const [questionForms, setQuestionForms] = useState<QuestionForm[]>([]);

    // Проверка токена при монтировании
    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate("/");
        } else {
            const timeoutId = setTimeout(() => {
                setInitialCheckDone(true);
            }, 0);
            return () => clearTimeout(timeoutId);
        }
    }, [navigate]);

    const fetchData = useCallback(async () => {
        const token = getToken();
        if (!token) {
            navigate("/");
            return;
        }

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
                setStats(statsRes.data);
                setUsers(usersRes.data);
                setCategories(categoriesRes.data);
                setQuestions(questionsRes.data);
                setCompetences(competencesRes.data);
            }
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                navigate("/");
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, [navigate]);

    const fetchCertificates = useCallback(async () => {
        const token = getToken();
        if (!token) return;

        try {
            const params = new URLSearchParams();
            if (certFilterCategory) params.append("category", certFilterCategory);
            if (certFilterDateFrom) params.append("dateFrom", certFilterDateFrom);
            if (certFilterDateTo) params.append("dateTo", certFilterDateTo);

            const [certsRes, statsRes] = await Promise.all([
                axios.get<Certificate[]>(`${API}/api/admin/certificates?${params.toString()}`, { headers: getHeaders() }),
                axios.get<CertificateStats>(`${API}/api/admin/certificates/stats`, { headers: getHeaders() }),
            ]);

            if (isMounted.current) {
                setCertificates(certsRes.data);
                setCertStats(statsRes.data);
            }
        } catch (error) {
            console.error("Ошибка загрузки сертификатов:", error);
        }
    }, [certFilterCategory, certFilterDateFrom, certFilterDateTo]);

    // Загрузка основных данных после проверки токена
    useEffect(() => {
        if (initialCheckDone) {
            const timeoutId = setTimeout(() => {
                fetchData();
            }, 0);
            return () => clearTimeout(timeoutId);
        }
    }, [initialCheckDone, fetchData]);

    // Загрузка сертификатов при переключении на вкладку
    useEffect(() => {
        if (tab === "certificates" && initialCheckDone) {
            const timeoutId = setTimeout(() => {
                fetchCertificates();
            }, 0);
            return () => clearTimeout(timeoutId);
        }
    }, [tab, fetchCertificates, initialCheckDone]);

    // Очистка при размонтировании
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleLogout = async () => {
        const token = getToken();
        if (token) {
            try {
                await axios.post(`${API}/api/logout`, {}, { headers: getHeaders() });
            } catch {
                // ignore
            }
        }
        localStorage.removeItem("token");
        navigate("/");
    };

    const resetCompForm = () => {
        setNewCompName("");
        setShowCompForm(false);
    };

    const addCompetence = async () => {
        if (!newCompName.trim()) {
            alert("Введите название компетенции");
            return;
        }
        try {
            await axios.post(`${API}/api/admin/competences`, { name: newCompName }, { headers: getHeaders() });
            resetCompForm();
            await fetchData();
        } catch {
            alert("Ошибка добавления компетенции");
        }
    };

    const deleteCompetence = async (id: number) => {
        if (!confirm("Удалить компетенцию?")) return;
        try {
            await axios.delete(`${API}/api/admin/competences/${id}`, { headers: getHeaders() });
            await fetchData();
        } catch {
            alert("Ошибка удаления");
        }
    };

    const resetTestForm = () => {
        setTestName("");
        setTestDesc("");
        setTestCompetence(0);
        setEditTest(null);
        setShowTestForm(false);
    };

    const openEditTest = (test: Category) => {
        setEditTest(test);
        setTestName(test.name);
        setTestDesc(test.description || "");
        setTestCompetence(test.competence_id || 0);
        setShowTestForm(true);
        setExpandedCategoryId(null);
        setQuestionForms([]);
    };

    const saveTest = async () => {
        if (!testName.trim()) {
            alert("Введите название теста");
            return;
        }
        try {
            if (editTest) {
                await axios.put(
                    `${API}/api/admin/categories/${editTest.id}`,
                    { name: testName, description: testDesc, competenceId: testCompetence || null },
                    { headers: getHeaders() }
                );
            } else {
                await axios.post(
                    `${API}/api/admin/categories`,
                    { name: testName, description: testDesc, competenceId: testCompetence || null },
                    { headers: getHeaders() }
                );
            }
            resetTestForm();
            await fetchData();
        } catch {
            alert("Ошибка сохранения теста");
        }
    };

    const deleteTest = async (id: number) => {
        if (!confirm("Удалить тест? Все вопросы будут удалены!")) return;
        try {
            await axios.delete(`${API}/api/admin/categories/${id}`, { headers: getHeaders() });
            if (expandedCategoryId === id) {
                setExpandedCategoryId(null);
                setQuestionForms([]);
            }
            await fetchData();
        } catch {
            alert("Ошибка удаления");
        }
    };

    const toggleExpand = (categoryId: number) => {
        if (expandedCategoryId === categoryId) {
            setExpandedCategoryId(null);
            setQuestionForms([]);
        } else {
            setExpandedCategoryId(categoryId);
            setQuestionForms([]);
            setShowTestForm(false);
            setEditTest(null);
        }
    };

    const addQuestionForm = () => {
        setQuestionForms((prev) => [
            ...prev,
            {
                id: generateId(),
                editQ: null,
                qText: "",
                qType: "single",
                answers: [
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                ],
            },
        ]);
    };

    const removeQuestionForm = (formId: string) => {
        setQuestionForms((prev) => prev.filter((f) => f.id !== formId));
    };

    const updateQuestionForm = (formId: string, updates: Partial<Omit<QuestionForm, "id">>) => {
        setQuestionForms((prev) =>
            prev.map((f) => (f.id === formId ? { ...f, ...updates } : f))
        );
    };

    const openEditQ = (q: Question) => {
        const load = async () => {
            try {
                const res = await axios.get(`${API}/api/admin/questions/${q.id}/details`, {
                    headers: getHeaders(),
                });
                setQuestionForms((prev) => [
                    ...prev,
                    {
                        id: generateId(),
                        editQ: q,
                        qText: res.data.text,
                        qType: res.data.type,
                        answers: res.data.answers.map((a: { text: string; is_correct: boolean }) => ({
                            text: a.text,
                            isCorrect: a.is_correct,
                        })),
                    },
                ]);
            } catch {
                alert("Ошибка загрузки вопроса");
            }
        };
        load();
    };

    const saveQuestion = async (formId: string, form: QuestionForm) => {
        if (!expandedCategoryId) return;

        const validAnswers = form.answers.filter((a) => a.text.trim());
        if (!form.qText.trim() || validAnswers.length < 2) {
            alert("Заполните текст вопроса и минимум 2 варианта ответа");
            return;
        }
        if (!validAnswers.some((a) => a.isCorrect)) {
            alert("Выберите хотя бы один правильный ответ");
            return;
        }

        try {
            const body = {
                text: form.qText,
                type: form.qType,
                categoryId: expandedCategoryId,
                answers: validAnswers,
            };
            if (form.editQ) {
                await axios.put(`${API}/api/admin/questions/${form.editQ.id}`, body, {
                    headers: getHeaders(),
                });
            } else {
                await axios.post(`${API}/api/admin/questions`, body, {
                    headers: getHeaders(),
                });
            }
            removeQuestionForm(formId);
            await fetchData();
        } catch {
            alert("Ошибка сохранения вопроса");
        }
    };

    const deleteQuestion = async (id: number) => {
        if (!confirm("Удалить вопрос?")) return;
        try {
            await axios.delete(`${API}/api/admin/questions/${id}`, { headers: getHeaders() });
            await fetchData();
        } catch {
            alert("Ошибка удаления");
        }
    };

    const toggleAdmin = async (userId: number, currentStatus: boolean) => {
        const action = currentStatus ? "снять права администратора" : "назначить администратором";
        if (!confirm(`Вы уверены, что хотите ${action}?`)) return;

        try {
            const res = await axios.put(
                `${API}/api/admin/users/${userId}/toggle-admin`,
                {},
                { headers: getHeaders() }
            );
            alert(res.data.message);
            await fetchData();
        } catch (error) {
            const apiError = error as ApiError;
            alert(apiError.response?.data?.message || "Ошибка");
        }
    };

    const deleteUser = async (userId: number, userName: string) => {
        if (!confirm(`Удалить пользователя "${userName}"? Это действие необратимо.`)) return;
        try {
            await axios.delete(`${API}/api/admin/users/${userId}`, { headers: getHeaders() });
            alert("Пользователь удален");
            await fetchData();
        } catch (error) {
            const apiError = error as ApiError;
            alert(apiError.response?.data?.message || "Ошибка");
        }
    };

    const resetCertFilters = () => {
        setCertFilterCategory("");
        setCertFilterDateFrom("");
        setCertFilterDateTo("");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (loading) {
        return <div className="admin-loading">Загрузка...</div>;
    }

    if (!initialCheckDone) {
        return <div className="admin-loading">Проверка авторизации...</div>;
    }

    const uniqueCategories = [...new Map(categories.map(cat => [cat.id, cat.name])).values()];

    return (
        <div className="admin-page">
            {/* Сайдбар */}
            <div className="admin-sidebar">
                <div className="admin-sidebar__brand">
                    <span>⚙️</span>
                    <span>Администратор</span>
                </div>
                <nav>
                    <button
                        className={`admin-nav-btn ${tab === "stats" ? "active" : ""}`}
                        onClick={() => setTab("stats")}
                    >
                        Статистика
                    </button>
                    <button
                        className={`admin-nav-btn ${tab === "users" ? "active" : ""}`}
                        onClick={() => setTab("users")}
                    >
                        Пользователи
                    </button>
                    <button
                        className={`admin-nav-btn ${tab === "tests" ? "active" : ""}`}
                        onClick={() => {
                            setTab("tests");
                            setShowTestForm(false);
                            setExpandedCategoryId(null);
                            setQuestionForms([]);
                        }}
                    >
                        Тесты
                    </button>
                    <button
                        className={`admin-nav-btn ${tab === "competences" ? "active" : ""}`}
                        onClick={() => {
                            setTab("competences");
                            setShowCompForm(false);
                        }}
                    >
                        🏷 Компетенции
                    </button>
                    <button
                        className={`admin-nav-btn ${tab === "certificates" ? "active" : ""}`}
                        onClick={() => {
                            setTab("certificates");
                            resetCertFilters();
                        }}
                    >
                        Сертификаты
                    </button>
                </nav>
                <button className="admin-logout" onClick={handleLogout}>
                    Выйти
                </button>
            </div>

            {/* Контент */}
            <div className="admin-content">
                {/* СТАТИСТИКА */}
                {tab === "stats" && stats && (
                    <div>
                        <h2>Общая статистика</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-card__value">{stats.totalUsers}</div>
                                <div className="stat-card__label">Пользователей</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-card__value">{stats.totalQuestions}</div>
                                <div className="stat-card__label">Всего вопросов</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-card__value">{stats.totalTests}</div>
                                <div className="stat-card__label">Тестов пройдено</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-card__value">{stats.avgPercent}%</div>
                                <div className="stat-card__label">Средний результат</div>
                            </div>
                            <div className="stat-card stat-card--warn">
                                <div className="stat-card__value">{stats.failedCount}</div>
                                <div className="stat-card__label">Не прошли (менее 80%)</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ПОЛЬЗОВАТЕЛИ */}
                {tab === "users" && (
                    <div>
                        <h2>Пользователи ({users.length})</h2>
                        <div className="users-table-wrapper">
                            <table className="users-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Имя</th>
                                    <th>Email</th>
                                    <th>Роль</th>
                                    <th>Дата регистрации</th>
                                    <th>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                                <span
                                                    className={`role-badge ${
                                                        user.is_admin ? "role-admin" : "role-user"
                                                    }`}
                                                >
                                                    {user.is_admin ? "👑 Админ" : "👤 Пользователь"}
                                                </span>
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td className="users-table__actions">
                                            <button
                                                className="btn-sm"
                                                onClick={() => toggleAdmin(user.id, user.is_admin)}
                                            >
                                                {user.is_admin ? "🔽 Снять админа" : "⭐ Назначить админом"}
                                            </button>
                                            <button
                                                className="btn-sm btn-sm--del"
                                                onClick={() => deleteUser(user.id, user.name)}
                                            >
                                                🗑 Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ТЕСТЫ */}
                {tab === "tests" && (
                    <div>
                        <div className="admin-section-header">
                            <h2>Тесты ({categories.length})</h2>
                            <button
                                className="btn-primary"
                                onClick={() => {
                                    resetTestForm();
                                    setShowTestForm(true);
                                    setExpandedCategoryId(null);
                                    setQuestionForms([]);
                                }}
                            >
                                + Создать тест
                            </button>
                        </div>

                        {showTestForm && (
                            <div className="admin-form">
                                <h3>{editTest ? "Редактировать тест" : "Новый тест"}</h3>
                                <div className="form-group">
                                    <label>Название теста</label>
                                    <input
                                        type="text"
                                        value={testName}
                                        onChange={(e) => setTestName(e.target.value)}
                                        placeholder="Например: Базы данных"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Описание</label>
                                    <textarea
                                        value={testDesc}
                                        onChange={(e) => setTestDesc(e.target.value)}
                                        placeholder="Описание теста"
                                        rows={2}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Компетенция</label>
                                    <select
                                        value={testCompetence}
                                        onChange={(e) => setTestCompetence(Number(e.target.value))}
                                    >
                                        <option value={0}>-- Выберите компетенцию --</option>
                                        {competences.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-actions">
                                    <button className="btn-primary" onClick={saveTest}>
                                        Сохранить
                                    </button>
                                    <button className="btn-ghost" onClick={resetTestForm}>
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="tests-list">
                            {categories.length === 0 && !showTestForm && (
                                <div className="admin-empty">Нет тестов. Нажмите «+ Создать тест»</div>
                            )}

                            {categories.map((cat) => {
                                const isExpanded = expandedCategoryId === cat.id;
                                const catQuestions = questions.filter((q) => q.category_id === cat.id);

                                return (
                                    <div
                                        key={cat.id}
                                        className={`test-card ${isExpanded ? "selected" : ""}`}
                                    >
                                        <div className="test-card__header">
                                            <div className="test-card__info">
                                                <h3>{cat.name}</h3>
                                                <p>{cat.description || "Нет описания"}</p>
                                                <div className="test-card__meta">
                                                    {cat.competence_name && (
                                                        <span className="test-card__competence">
                                                            {cat.competence_name}
                                                        </span>
                                                    )}
                                                    <span className="test-card__count">
                                                         {cat.questions_count} вопросов
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="test-card__actions">
                                                <button
                                                    className={`btn-sm ${isExpanded ? "btn-sm--active" : ""}`}
                                                    onClick={() => toggleExpand(cat.id)}
                                                >
                                                    {isExpanded ? "▲ Скрыть" : "▼ Вопросы"}
                                                </button>
                                                <button className="btn-sm" onClick={() => openEditTest(cat)}>
                                                    ✏️ Изменить
                                                </button>
                                                <button
                                                    className="btn-sm btn-sm--del"
                                                    onClick={() => deleteTest(cat.id)}
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="test-card__questions">
                                                <div className="test-card__questions-header">
                                                    <span className="test-card__questions-title">
                                                        Вопросы теста
                                                    </span>
                                                    <button
                                                        className="btn-primary btn-sm-primary"
                                                        onClick={addQuestionForm}
                                                    >
                                                        + Добавить вопрос
                                                    </button>
                                                </div>

                                                <div className="questions-list">
                                                    {catQuestions.length === 0 &&
                                                        questionForms.length === 0 && (
                                                            <div className="questions-empty">
                                                                Нет вопросов. Нажмите «+ Добавить вопрос»
                                                            </div>
                                                        )}
                                                    {catQuestions.map((q) => (
                                                        <div key={q.id} className="question-card">
                                                            <div className="question-card__text">
                                                                {q.text}
                                                            </div>
                                                            <div className="question-card__meta">
                                                                <span className="question-card__type">
                                                                    {q.type === "single"
                                                                        ? "Один ответ"
                                                                        : "Несколько ответов"}
                                                                </span>
                                                                <span className="question-card__count">
                                                                    {q.answers_count} вариантов
                                                                </span>
                                                            </div>
                                                            <div className="question-card__actions">
                                                                <button
                                                                    className="btn-sm"
                                                                    onClick={() => openEditQ(q)}
                                                                >
                                                                    ✏️
                                                                </button>
                                                                <button
                                                                    className="btn-sm btn-sm--del"
                                                                    onClick={() => deleteQuestion(q.id)}
                                                                >
                                                                    🗑
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {questionForms.map((form) => (
                                                    <div key={form.id} className="admin-form question-form">
                                                        <div className="question-form__header">
                                                            <h3>
                                                                {form.editQ
                                                                    ? "Редактировать вопрос"
                                                                    : "Новый вопрос"}
                                                            </h3>
                                                            <button
                                                                className="btn-icon-del"
                                                                onClick={() => removeQuestionForm(form.id)}
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>

                                                        <div className="form-group">
                                                            <label>Текст вопроса</label>
                                                            <textarea
                                                                value={form.qText}
                                                                onChange={(e) =>
                                                                    updateQuestionForm(form.id, {
                                                                        qText: e.target.value,
                                                                    })
                                                                }
                                                                rows={3}
                                                                placeholder="Введите вопрос..."
                                                            />
                                                        </div>

                                                        <div className="form-group">
                                                            <label>Тип ответа</label>
                                                            <select
                                                                value={form.qType}
                                                                onChange={(e) =>
                                                                    updateQuestionForm(form.id, {
                                                                        qType: e.target.value as
                                                                            | "single"
                                                                            | "multiple",
                                                                    })
                                                                }
                                                            >
                                                                <option value="single">
                                                                    Один правильный ответ
                                                                </option>
                                                                <option value="multiple">
                                                                    Несколько правильных ответов
                                                                </option>
                                                            </select>
                                                        </div>

                                                        <div className="form-group">
                                                            <label>Варианты ответов</label>
                                                            {form.answers.map((ans, i) => (
                                                                <div key={i} className="answer-row">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={ans.isCorrect}
                                                                        onChange={(e) => {
                                                                            const newAnswers = form.answers.map(
                                                                                (a, j) => ({
                                                                                    ...a,
                                                                                    isCorrect:
                                                                                        form.qType === "single"
                                                                                            ? j === i
                                                                                                ? e.target.checked
                                                                                                : false
                                                                                            : j === i
                                                                                                ? e.target.checked
                                                                                                : a.isCorrect,
                                                                                })
                                                                            );
                                                                            updateQuestionForm(form.id, {
                                                                                answers: newAnswers,
                                                                            });
                                                                        }}
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={ans.text}
                                                                        placeholder={`Вариант ${i + 1}`}
                                                                        onChange={(e) => {
                                                                            const newAnswers = form.answers.map(
                                                                                (a, j) =>
                                                                                    j === i
                                                                                        ? {
                                                                                            ...a,
                                                                                            text: e.target.value,
                                                                                        }
                                                                                        : a
                                                                            );
                                                                            updateQuestionForm(form.id, {
                                                                                answers: newAnswers,
                                                                            });
                                                                        }}
                                                                    />
                                                                    {form.answers.length > 2 && (
                                                                        <button
                                                                            className="btn-icon-del"
                                                                            onClick={() =>
                                                                                updateQuestionForm(form.id, {
                                                                                    answers: form.answers.filter(
                                                                                        (_, j) => j !== i
                                                                                    ),
                                                                                })
                                                                            }
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <button
                                                                className="btn-ghost"
                                                                onClick={() =>
                                                                    updateQuestionForm(form.id, {
                                                                        answers: [
                                                                            ...form.answers,
                                                                            { text: "", isCorrect: false },
                                                                        ],
                                                                    })
                                                                }
                                                            >
                                                                + Добавить вариант
                                                            </button>
                                                        </div>

                                                        <div className="form-actions">
                                                            <button
                                                                className="btn-primary"
                                                                onClick={() => saveQuestion(form.id, form)}
                                                            >
                                                                Сохранить вопрос
                                                            </button>
                                                            <button
                                                                className="btn-ghost"
                                                                onClick={() => removeQuestionForm(form.id)}
                                                            >
                                                                Отмена
                                                            </button>
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
                    <div>
                        <div className="admin-section-header">
                            <h2>Компетенции ({competences.length})</h2>
                            <button className="btn-primary" onClick={() => setShowCompForm(true)}>
                                + Создать компетенцию
                            </button>
                        </div>

                        {showCompForm && (
                            <div className="admin-form">
                                <h3>Новая компетенция</h3>
                                <div className="form-group">
                                    <label>Название компетенции</label>
                                    <input
                                        type="text"
                                        value={newCompName}
                                        onChange={(e) => setNewCompName(e.target.value)}
                                        placeholder="Например: Базы данных"
                                        onKeyDown={(e) => e.key === "Enter" && addCompetence()}
                                    />
                                </div>
                                <div className="form-actions">
                                    <button className="btn-primary" onClick={addCompetence}>
                                        Сохранить
                                    </button>
                                    <button className="btn-ghost" onClick={resetCompForm}>
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="competences-list">
                            {competences.length === 0 && !showCompForm && (
                                <div className="admin-empty">
                                    Нет компетенций. Нажмите «+ Создать компетенцию»
                                </div>
                            )}
                            {competences.map((comp) => (
                                <div key={comp.id} className="competence-card">
                                    <div className="competence-card__info">
                                        <span className="competence-card__name">{comp.name}</span>
                                    </div>
                                    <div className="competence-card__actions">
                                        <button
                                            className="btn-sm btn-sm--del"
                                            onClick={() => deleteCompetence(comp.id)}
                                        >
                                            🗑 Удалить
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* СЕРТИФИКАТЫ */}
                {tab === "certificates" && (
                    <div>
                        <h2>Сертификаты</h2>

                        {/* Статистика сертификатов */}
                        {certStats && (
                            <div className="stats-grid" style={{ marginBottom: "24px" }}>
                                <div className="stat-card">
                                    <div className="stat-card__value">{certStats.total.total}</div>
                                    <div className="stat-card__label">Всего выдано</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-card__value">{certStats.total.unique_users}</div>
                                    <div className="stat-card__label">Получателей</div>
                                </div>
                            </div>
                        )}

                        {/* Фильтры */}
                        <div className="admin-form" style={{ marginBottom: "24px" }}>
                            <h3>Фильтры</h3>
                            <div className="filter-row">
                                <div className="filter-group">
                                    <label>Категория</label>
                                    <select
                                        value={certFilterCategory}
                                        onChange={(e) => setCertFilterCategory(e.target.value)}
                                    >
                                        <option value="">Все категории</option>
                                        {uniqueCategories.map((catName) => (
                                            <option key={catName} value={catName}>
                                                {catName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="filter-group">
                                    <label>Дата от</label>
                                    <input
                                        type="date"
                                        value={certFilterDateFrom}
                                        onChange={(e) => setCertFilterDateFrom(e.target.value)}
                                    />
                                </div>
                                <div className="filter-group">
                                    <label>Дата до</label>
                                    <input
                                        type="date"
                                        value={certFilterDateTo}
                                        onChange={(e) => setCertFilterDateTo(e.target.value)}
                                    />
                                </div>
                                <div className="filter-actions">
                                    <button className="btn-ghost" onClick={resetCertFilters}>
                                        Сбросить
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Статистика по компетенциям */}
                        {certStats && certStats.byCompetence.length > 0 && (
                            <div className="stats-grid" style={{ marginBottom: "24px" }}>
                                {certStats.byCompetence.map((comp) => (
                                    <div key={comp.competence_name} className="stat-card">
                                        <div className="stat-card__value">{comp.certificates_count}</div>
                                        <div className="stat-card__label">
                                            {comp.competence_name || "Без компетенции"}<br />
                                            <span style={{ fontSize: "11px", color: "#6b6b7a" }}>
                                                ср. {comp.avg_score}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Таблица сертификатов */}
                        <div className="users-table-wrapper">
                            <table className="users-table">
                                <thead>
                                <tr>
                                    <th>№</th>
                                    <th>Пользователь</th>
                                    <th>Email</th>
                                    <th>Тест / Компетенция</th>
                                    <th>Результат</th>
                                    <th>Дата выдачи</th>
                                </tr>
                                </thead>
                                <tbody>
                                {certificates.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#6b6b7a" }}>
                                            Нет выданных сертификатов
                                        </td>
                                    </tr>
                                ) : (
                                    certificates.map((cert) => (
                                        <tr key={cert.id}>
                                            <td className="certificate-number">{cert.cert_number}</td>
                                            <td>{cert.user_name}</td>
                                            <td>{cert.user_email}</td>
                                            <td>
                                                <div className="certificate-category">{cert.category_name}</div>
                                                {cert.competence_name && (
                                                    <div className="certificate-competence">{cert.competence_name}</div>
                                                )}
                                            </td>
                                            <td>
                                                    <span className={`certificate-score ${cert.score >= 90 ? 'certificate-score--high' : 'certificate-score--medium'}`}>
                                                        {cert.score}%
                                                    </span>
                                            </td>
                                            <td>{formatDate(cert.issued_at)}</td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}