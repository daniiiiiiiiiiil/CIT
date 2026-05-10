import { adminApi } from "../../api/admin.api";
import type { QuestionFormType, AnswerForm } from "../../types/admin.types";

interface QuestionFormProps {
    form: QuestionFormType;
    categoryId: number;
    onUpdate: (id: string, updates: Partial<Omit<QuestionFormType, "id">>) => void;
    onRemove: (id: string) => void;
    onSuccess: () => void;
}

export function QuestionForm({ form, categoryId, onUpdate, onRemove, onSuccess }: QuestionFormProps) {
    const addAnswer = () => {
        onUpdate(form.id, { answers: [...form.answers, { text: "", isCorrect: false }] });
    };

    const removeAnswer = (index: number) => {
        onUpdate(form.id, { answers: form.answers.filter((_, i) => i !== index) });
    };

    const updateAnswer = (index: number, field: keyof AnswerForm, value: string | boolean) => {
        const newAnswers = form.answers.map((a, i) =>
            i === index ? { ...a, [field]: value } : a
        );
        onUpdate(form.id, { answers: newAnswers });
    };

    const updateCorrect = (index: number, checked: boolean) => {
        if (form.qType === "single") {
            const newAnswers = form.answers.map((a, i) => ({
                ...a,
                isCorrect: i === index ? checked : false
            }));
            onUpdate(form.id, { answers: newAnswers });
        } else {
            updateAnswer(index, "isCorrect", checked);
        }
    };

    const handleSubmit = async () => {
        const validAnswers = form.answers.filter(a => a.text.trim());
        if (!form.qText.trim() || validAnswers.length < 2) {
            alert("Заполните текст и минимум 2 варианта");
            return;
        }
        if (!validAnswers.some(a => a.isCorrect)) {
            alert("Выберите хотя бы один правильный ответ");
            return;
        }

        const body = {
            text: form.qText,
            type: form.qType,
            categoryId: categoryId,
            answers: validAnswers
        };

        try {
            if (form.editQ) {
                await adminApi.updateQuestion(form.editQ.id, body);
            } else {
                await adminApi.createQuestion(body);
            }
            onSuccess();
        } catch (error) {
            alert("Ошибка сохранения вопроса");
        }
    };

    return (
        <div className="adm-form adm-form--question">
            <div className="adm-form__header">
                <span className="adm-form__title">{form.editQ ? "// РЕДАКТИРОВАТЬ ВОПРОС" : "// НОВЫЙ ВОПРОС"}</span>
                <button className="adm-btn-icon" onClick={() => onRemove(form.id)}>✕</button>
            </div>

            <div className="adm-field">
                <label>Текст вопроса</label>
                <textarea
                    value={form.qText}
                    onChange={e => onUpdate(form.id, { qText: e.target.value })}
                    rows={3}
                    placeholder="Введите вопрос..."
                />
            </div>

            <div className="adm-field">
                <label>Тип ответа</label>
                <select value={form.qType} onChange={e => onUpdate(form.id, { qType: e.target.value as "single" | "multiple" })}>
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
                                onChange={e => updateCorrect(i, e.target.checked)}
                            />
                            <input
                                type="text"
                                value={ans.text}
                                placeholder={`Вариант ${i + 1}`}
                                onChange={e => updateAnswer(i, "text", e.target.value)}
                            />
                            {form.answers.length > 2 && (
                                <button className="adm-btn-icon" onClick={() => removeAnswer(i)}>✕</button>
                            )}
                        </div>
                    ))}
                    <button className="adm-btn-ghost" onClick={addAnswer}>+ Добавить вариант</button>
                </div>
            </div>

            <div className="adm-form__actions">
                <button className="adm-btn-primary" onClick={handleSubmit}>Сохранить вопрос</button>
                <button className="adm-btn-ghost" onClick={() => onRemove(form.id)}>Отмена</button>
            </div>
        </div>
    );
}