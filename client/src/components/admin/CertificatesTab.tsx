import { AnimNum } from "./AnimNum";
import type { Certificate, CertificateStats } from "../../types/admin.types";

interface CertificatesTabProps {
    certificates: Certificate[];
    stats: CertificateStats | null;
    filterCategory: string;
    filterDateFrom: string;
    filterDateTo: string;
    categories: string[];
    onFilterChange: (field: string, value: string) => void;
    onResetFilters: () => void;
}

export function CertificatesTab({
                                    certificates,
                                    stats,
                                    filterCategory,
                                    filterDateFrom,
                                    filterDateTo,
                                    categories,
                                    onFilterChange,
                                    onResetFilters,
                                }: CertificatesTabProps) {
    const formatDate = (d: string) => new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

    return (
        <>
            <div className="adm-section__head">
                <span className="adm-section__num">05</span>
                <h2 className="adm-section__title">Сертификаты</h2>
            </div>

            {stats && (
                <div className="adm-stats-grid adm-stats-grid--sm">
                    <div className="adm-stat" style={{ "--s-color": "#f59e0b" } as React.CSSProperties}>
                        <div className="adm-stat__icon">★</div>
                        <div className="adm-stat__val"><AnimNum value={stats.total.total} /></div>
                        <div className="adm-stat__label">Всего выдано</div>
                        <div className="adm-stat__glow" />
                    </div>
                    <div className="adm-stat" style={{ "--s-color": "#00d4ff" } as React.CSSProperties}>
                        <div className="adm-stat__icon">◉</div>
                        <div className="adm-stat__val"><AnimNum value={stats.total.unique_users} /></div>
                        <div className="adm-stat__label">Получателей</div>
                        <div className="adm-stat__glow" />
                    </div>
                    {stats.byCompetence.map(comp => (
                        <div key={comp.competence_name} className="adm-stat" style={{ "--s-color": "#534AB7" } as React.CSSProperties}>
                            <div className="adm-stat__icon">⬡</div>
                            <div className="adm-stat__val">{comp.certificates_count}</div>
                            <div className="adm-stat__label">
                                {comp.competence_name || "Без компетенции"}
                                <br /><span style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>ср. {comp.avg_score}%</span>
                            </div>
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
                        <select value={filterCategory} onChange={e => onFilterChange("category", e.target.value)}>
                            <option value="">Все категории</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="adm-field">
                        <label>Дата от</label>
                        <input type="date" value={filterDateFrom} onChange={e => onFilterChange("dateFrom", e.target.value)} />
                    </div>
                    <div className="adm-field">
                        <label>Дата до</label>
                        <input type="date" value={filterDateTo} onChange={e => onFilterChange("dateTo", e.target.value)} />
                    </div>
                    <div className="adm-field adm-field--end">
                        <button className="adm-btn-ghost" onClick={onResetFilters}>Сбросить</button>
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
        </>
    );
}