import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000";

interface Competence {
    id: number;
    name: string;
}

interface AnswerForm {
    text: string;
    isCorrect: boolean;
}

interface Question {
    id: number;
    text: string;
    type: "single" | "multiple";
    competenceId: number;
    competenceName: string;
    answersCount: number;
}

interface Stats {
    totalUsers: number;
    totalQuestions: number;
    totalTests: number;
    avgPercent: number;
    failedCount: number;
}

type Tab = "stats" | "questions" | "competences";

export default function AdminPage() {
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>("stats");
    const [stats, setStats] = useState<Stats | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [competences, setCompetences] = useState<Competence[]>([]);
    const [loading, setLoading] = useState(false);

    const [showQForm, setShowQForm] = useState(false);
    const [editQ, setEditQ] = useState<Question | null>(null);
    const [qText, setQText] = useState("");
    const [qType, setQType] = useState<"single" | "multiple">("single");
    const [qCompetence, setQCompetence] = useState<number>(0);
    const [answers, setAnswers] = useState<AnswerForm[]>([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
    ]);

    const [newCompName, setNewCompName] = useState("");

    const getToken = () => localStorage.getItem("token");
    const getHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

    const fetchAll = useCallback(async () => {
        const token = getToken();
        if (!token) {
            navigate("/");
            return;
        }

        setLoading(true);
        try {
            const [statsRes, qRes, cRes] = await Promise.all([
                axios.get<Stats>(`${API}/api/admin/stats`, { headers: getHeaders() }),
                axios.get<Question[]>(`${API}/api/admin/questions`, { headers: getHeaders() }),
                axios.get<Competence[]>(`${API}/api/competences`, { headers: getHeaders() }),
            ]);
            setStats(statsRes.data);
            setQuestions(qRes.data);
            setCompetences(cRes.data);
            if (cRes.data.length > 0 && qCompetence === 0) {
                setQCompetence(cRes.data[0].id);
            }
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                navigate("/");
            }
        } finally {
            setLoading(false);
        }
    }, [navigate, qCompetence]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

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

    const resetQForm = () => {
        setQText("");
        setQType("single");
        setAnswers([{ text: "", isCorrect: false }, { text: "", isCorrect: false }]);
        setEditQ(null);
        setShowQForm(false);
        if (competences.length > 0) setQCompetence(competences[0].id);
    };

    const openEdit = (q: Question) => {
        setEditQ(q);
        setQText(q.text);
        setQType(q.type);
        setQCompetence(q.competenceId);
        setAnswers([{ text: "", isCorrect: false }, { text: "", isCorrect: false }]);
        setShowQForm(true);
    };

    const saveQuestion = async () => {
        const validAnswers = answers.filter(a => a.text.trim());
        if (!qText.trim() || validAnswers.length < 2) return;

        try {
            const body = { text: qText, type: qType, competenceId: qCompetence, answers: validAnswers };
            if (editQ) {
                await axios.put(`${API}/api/admin/questions/${editQ.id}`, body, { headers: getHeaders() });
            } else {
                await axios.post(`${API}/api/admin/questions`, body, { headers: getHeaders() });
            }
            resetQForm();
            fetchAll();
        } catch {
            alert("Ошибка сохранения");
        }
    };

    const deleteQuestion = async (id: number) => {
        if (!confirm("Удалить вопрос?")) return;
        try {
            await axios.delete(`${API}/api/admin/questions/${id}`, { headers: getHeaders() });
            fetchAll();
        } catch {
            alert("Ошибка удаления");
        }
    };

    const addCompetence = async () => {
        if (!newCompName.trim()) return;
        try {
            await axios.post(`${API}/api/admin/competences`, { name: newCompName }, { headers: getHeaders() });
            setNewCompName("");
            fetchAll();
        } catch {
            alert("Ошибка добавления");
        }
    };

    const deleteCompetence = async (id: number) => {
        if (!confirm("Удалить компетенцию?")) return;
        try {
            await axios.delete(`${API}/api/admin/competences/${id}`, { headers: getHeaders() });
            fetchAll();
        } catch {
            alert("Ошибка удаления");
        }
    };

    if (loading) {
        return <div className="admin-loading">Загрузка...</div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-sidebar">
                <div className="admin-sidebar__brand">
                    <span>⚙️</span>
                    <span>Администратор</span>
                </div>
                <nav>
                    {([["stats", "📊 Статистика"], ["questions", "❓ Вопросы"], ["competences", "🏷 Компетенции"]] as [Tab, string][]).map(([t, label]) => (
                        <button
                            key={t}
                            className={`admin-nav-btn ${tab === t ? "active" : ""}`}
                            onClick={() => setTab(t)}
                        >
                            {label}
                        </button>
                    ))}
                </nav>
                <button className="admin-logout" onClick={handleLogout}>Выйти</button>
            </div>

            <div className="admin-content">
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
                                <div className="stat-card__label">Вопросов в тесте</div>
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

                {tab === "questions" && (
                    <div>
                        <div className="admin-section-header">
                            <h2>Вопросы ({questions.length})</h2>
                            <button className="btn-primary" onClick={() => { resetQForm(); setShowQForm(true); }}>
                                + Добавить вопрос
                            </button>
                        </div>

                        {showQForm && (
                            <div className="q-form">
                                <h3>{editQ ? "Редактировать вопрос" : "Новый вопрос"}</h3>
                                <div className="form-group">
                                    <label>Текст вопроса</label>
                                    <textarea value={qText} onChange={e => setQText(e.target.value)} rows={3} placeholder="Введите вопрос..." />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Тип ответа</label>
                                        <select value={qType} onChange={e => setQType(e.target.value as "single" | "multiple")}>
                                            <option value="single">Один правильный</option>
                                            <option value="multiple">Несколько правильных</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Компетенция</label>
                                        <select value={qCompetence} onChange={e => setQCompetence(+e.target.value)}>
                                            {competences.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Варианты ответов</label>
                                    {answers.map((ans, i) => (
                                        <div key={i} className="answer-row">
                                            <input
                                                type="checkbox"
                                                checked={ans.isCorrect}
                                                onChange={e => {
                                                    const next = [...answers];
                                                    if (qType === "single") next.forEach(a => a.isCorrect = false);
                                                    next[i].isCorrect = e.target.checked;
                                                    setAnswers([...next]);
                                                }}
                                                title="Правильный ответ"
                                            />
                                            <input
                                                type="text"
                                                value={ans.text}
                                                onChange={e => {
                                                    const next = [...answers];
                                                    next[i].text = e.target.value;
                                                    setAnswers(next);
                                                }}
                                                placeholder={`Вариант ${i + 1}`}
                                            />
                                            {answers.length > 2 && (
                                                <button onClick={() => setAnswers(answers.filter((_, j) => j !== i))} className="btn-icon-del">✕</button>
                                            )}
                                        </div>
                                    ))}
                                    <button className="btn-ghost" onClick={() => setAnswers([...answers, { text: "", isCorrect: false }])}>
                                        + Добавить вариант
                                    </button>
                                </div>
                                <div className="form-actions">
                                    <button className="btn-primary" onClick={saveQuestion}>Сохранить</button>
                                    <button className="btn-ghost" onClick={resetQForm}>Отмена</button>
                                </div>
                            </div>
                        )}

                        <div className="q-list">
                            {questions.map(q => (
                                <div key={q.id} className="q-item">
                                    <div className="q-item__meta">
                                        <span className="q-item__competence">{q.competenceName}</span>
                                        <span className="q-item__type">{q.type === "single" ? "Один ответ" : "Несколько"}</span>
                                    </div>
                                    <div className="q-item__text">{q.text}</div>
                                    <div className="q-item__actions">
                                        <button className="btn-sm" onClick={() => openEdit(q)}>✏️ Изменить</button>
                                        <button className="btn-sm btn-sm--del" onClick={() => deleteQuestion(q.id)}>🗑 Удалить</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === "competences" && (
                    <div>
                        <h2>Компетенции</h2>
                        <div className="comp-form">
                            <input
                                type="text"
                                value={newCompName}
                                onChange={e => setNewCompName(e.target.value)}
                                placeholder="Название компетенции"
                                onKeyDown={e => e.key === "Enter" && addCompetence()}
                            />
                            <button className="btn-primary" onClick={addCompetence}>Добавить</button>
                        </div>
                        <div className="comp-list">
                            {competences.map(c => (
                                <div key={c.id} className="comp-item">
                                    <span>{c.name}</span>
                                    <button className="btn-sm btn-sm--del" onClick={() => deleteCompetence(c.id)}>🗑</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}