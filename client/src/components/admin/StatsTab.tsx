import { AnimNum } from "./AnimNum";
import type { Stats } from "../../types/admin.types";

interface StatsTabProps {
    stats: Stats;
}

export function StatsTab({ stats }: StatsTabProps) {
    const statsItems = [
        { val: stats.totalUsers, label: "Пользователей", icon: "◉", color: "#00d4ff" },
        { val: stats.totalQuestions, label: "Вопросов в базе", icon: "▣", color: "#534AB7" },
        { val: stats.totalTests, label: "Тестов пройдено", icon: "◈", color: "#00ff88" },
        { val: stats.avgPercent, label: "Средний результат", icon: "◎", color: "#f59e0b", suffix: "%" },
        { val: stats.failedCount, label: "Не прошли (< 80%)", icon: "✕", color: "#ff4757" },
    ];

    const successRate = stats.totalTests > 0
        ? Math.round(((stats.totalTests - stats.failedCount) / stats.totalTests) * 100)
        : 0;

    return (
        <>
            <div className="adm-stats-grid">
                {statsItems.map((s, i) => (
                    <div key={i} className="adm-stat" style={{ "--s-color": s.color } as React.CSSProperties}>
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
                        {successRate}%
                    </span>
                </div>
                <div className="adm-passbar">
                    <div className="adm-passbar__fill" style={{ width: `${successRate}%` }} />
                    <div className="adm-passbar__mark" />
                </div>
                <div className="adm-passbar__sub">Порог прохождения: 80%</div>
            </div>
        </>
    );
}