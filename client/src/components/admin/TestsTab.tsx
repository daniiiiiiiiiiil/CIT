import { useState } from "react";
import type { Category, Question, Competence, QuestionFormType } from "../../types/admin.types";
import { QuestionForm } from "./QuestionForm";

interface TestsTabProps {
    categories: Category[];
    questions: Question[];
    competences: Competence[];
    onCreateCategory: (data: { name: string; description: string; competenceId: number | null }) => Promise<void>;
    onUpdateCategory: (id: number, data: { name: string; description: string; competenceId: number | null }) => Promise<void>;
    onDeleteCategory: (id: number) => Promise<void>;
    onDeleteQuestion: (id: number) => Promise<void>;
}

export function TestsTab({
                             categories,
                             questions,
                             competences,
                             onCreateCategory,
                             onUpdateCategory,
                             onDeleteCategory,
                             onDeleteQuestion,
                         }: TestsTabProps) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editTest, setEditTest] = useState<Category | null>(null);
    const [testName, setTestName] = useState("");
    const [testDesc, setTestDesc] = useState("");
    const [testCompetence, setTestCompetence] = useState<number>(0);
    const [questionForms, setQuestionForms] = useState<QuestionFormType[]>([]);

    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

    const resetForm = () => {
        setTestName("");
        setTestDesc("");
        setTestCompetence(0);
        setEditTest(null);
        setShowForm(false);
        setQuestionForms([]);
    };

    const openEdit = (test: Category) => {
        setEditTest(test);
        setTestName(test.name);
        setTestDesc(test.description || "");
        setTestCompetence(test.competence_id || 0);
        setShowForm(true);
        setExpandedId(null);
        setQuestionForms([]);
    };

    const saveCategory = async () => {
        if (!testName.trim()) return;
        const data = { name: testName, description: testDesc, competenceId: testCompetence || null };
        if (editTest) {
            await onUpdateCategory(editTest.id, data);
        } else {
            await onCreateCategory(data);
        }
        resetForm();
    };

    const addQuestionForm = () => {
        setQuestionForms(prev => [...prev, {
            id: generateId(),
            editQ: null,
            qText: "",
            qType: "single",
            answers: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }]
        }]);
    };

    const removeQuestionForm = (id: string) => setQuestionForms(prev => prev.filter(f => f.id !== id));

    const toggleExpand = (id: number) => {
        if (expandedId === id) {
            setExpandedId(null);
            setQuestionForms([]);
        } else {
            setExpandedId(id);
            setQuestionForms([]);
            setShowForm(false);
            setEditTest(null);
        }
    };

    const categoryQuestions = expandedId ? questions.filter(q => q.category_id === expandedId) : [];

    return (
        <>
            <div className="adm-section__head">
                <span className="adm-section__num">03</span>
                <h2 className="adm-section__title">Тесты <span className="adm-count">({categories.length})</span></h2>
                <button className="adm-btn-primary" onClick={() => { resetForm(); setShowForm(true); setExpandedId(null); }}>
                    + Создать тест
                </button>
            </div>

            {showForm && (
                <div className="adm-form">
                    <div className="adm-form__header">
                        <span className="adm-form__title">{editTest ? "// РЕДАКТИРОВАТЬ ТЕСТ" : "// НОВЫЙ ТЕСТ"}</span>
                        <button className="adm-btn-icon" onClick={resetForm}>✕</button>
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
                        <button className="adm-btn-primary" onClick={saveCategory}>Сохранить</button>
                        <button className="adm-btn-ghost" onClick={resetForm}>Отмена</button>
                    </div>
                </div>
            )}

            <div className="adm-tests-list">
                {categories.length === 0 && !showForm && (
                    <div className="adm-empty"><span>▣</span><p>Нет тестов. Нажмите «+ Создать тест»</p></div>
                )}
                {categories.map(cat => {
                    const isExp = expandedId === cat.id;
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
                                    <button className="adm-btn-sm" onClick={() => openEdit(cat)}>✏</button>
                                    <button className="adm-btn-sm adm-btn-sm--del" onClick={() => onDeleteCategory(cat.id)}>✕</button>
                                </div>
                            </div>

                            {isExp && (
                                <div className="adm-test-card__body">
                                    <div className="adm-questions-header">
                                        <span className="adm-questions-title">// ВОПРОСЫ ТЕСТА</span>
                                        <button className="adm-btn-primary" onClick={addQuestionForm}>+ Добавить</button>
                                    </div>

                                    <div className="adm-questions-list">
                                        {categoryQuestions.length === 0 && questionForms.length === 0 && (
                                            <div className="adm-empty adm-empty--sm"><p>Нет вопросов</p></div>
                                        )}
                                        {categoryQuestions.map(q => (
                                            <div key={q.id} className="adm-q-card">
                                                <div className="adm-q-card__text">{q.text}</div>
                                                <div className="adm-q-card__meta">
                                                    <span className="adm-chip">{q.type === "single" ? "Один ответ" : "Несколько"}</span>
                                                    <span className="adm-chip">{q.answers_count} вариантов</span>
                                                </div>
                                                <div className="adm-q-card__actions">
                                                    <button className="adm-btn-sm" onClick={() => {
                                                        // Добавить редактирование
                                                    }}>✏</button>
                                                    <button className="adm-btn-sm adm-btn-sm--del" onClick={() => onDeleteQuestion(q.id)}>✕</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {questionForms.map(form => (
                                        <QuestionForm
                                            key={form.id}
                                            form={form}
                                            categoryId={expandedId}
                                            onUpdate={(id, updates) => {
                                                setQuestionForms(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
                                            }}
                                            onRemove={removeQuestionForm}
                                            onSuccess={() => {
                                                removeQuestionForm(form.id);
                                                // refresh questions
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}