import { useState } from "react";
import type { Competence } from "../../types/admin.types";

interface CompetencesTabProps {
    competences: Competence[];
    onCreate: (name: string) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

export function CompetencesTab({ competences, onCreate, onDelete }: CompetencesTabProps) {
    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState("");

    const handleSubmit = async () => {
        if (!newName.trim()) return;
        await onCreate(newName);
        setNewName("");
        setShowForm(false);
    };

    return (
        <>
            <div className="adm-section__head">
                <span className="adm-section__num">04</span>
                <h2 className="adm-section__title">Компетенции <span className="adm-count">({competences.length})</span></h2>
                <button className="adm-btn-primary" onClick={() => setShowForm(true)}>+ Создать</button>
            </div>

            {showForm && (
                <div className="adm-form">
                    <div className="adm-form__header">
                        <span className="adm-form__title">// НОВАЯ КОМПЕТЕНЦИЯ</span>
                        <button className="adm-btn-icon" onClick={() => setShowForm(false)}>✕</button>
                    </div>
                    <div className="adm-field">
                        <label>Название компетенции</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            placeholder="Например: Базы данных"
                            onKeyDown={e => e.key === "Enter" && handleSubmit()}
                        />
                    </div>
                    <div className="adm-form__actions">
                        <button className="adm-btn-primary" onClick={handleSubmit}>Сохранить</button>
                        <button className="adm-btn-ghost" onClick={() => setShowForm(false)}>Отмена</button>
                    </div>
                </div>
            )}

            <div className="adm-comp-list">
                {competences.length === 0 && !showForm && (
                    <div className="adm-empty"><span>⬡</span><p>Нет компетенций</p></div>
                )}
                {competences.map(comp => (
                    <div key={comp.id} className="adm-comp-card">
                        <span className="adm-comp-card__icon">⬡</span>
                        <span className="adm-comp-card__name">{comp.name}</span>
                        <span className="adm-comp-card__id">#{comp.id}</span>
                        <button className="adm-btn-sm adm-btn-sm--del" onClick={() => onDelete(comp.id)}>✕ Удалить</button>
                    </div>
                ))}
            </div>
        </>
    );
}