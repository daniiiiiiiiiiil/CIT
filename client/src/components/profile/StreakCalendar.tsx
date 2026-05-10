import type { TestResult, DayActivity } from "../../types/profile.types";

interface StreakCalendarProps {
    results: TestResult[];
}

export function StreakCalendar({ results }: StreakCalendarProps) {
    const days: DayActivity[] = Array.from({ length: 30 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        const dateStr = d.toISOString().slice(0, 10);
        const dayResults = results.filter(r => r.finishedAt?.slice(0, 10) === dateStr);
        const best = dayResults.length > 0 ? Math.max(...dayResults.map(r => r.percent)) : null;
        return { date: d, best, count: dayResults.length };
    });

    const getCellClass = (best: number | null): string => {
        let cls = "pf-streak__cell";
        if (best !== null) {
            if (best >= 80) cls += " pf-streak__cell--high";
            else if (best >= 50) cls += " pf-streak__cell--mid";
            else cls += " pf-streak__cell--low";
        }
        return cls;
    };

    const getTitle = (day: DayActivity): string => {
        return `${day.date.toLocaleDateString("ru-RU")}: ${
            day.count > 0 ? `${day.count} тест(а), лучший: ${day.best}%` : "нет активности"
        }`;
    };

    return (
        <div className="pf-streak">
            <div className="pf-streak__label">Активность за 30 дней</div>
            <div className="pf-streak__grid">
                {days.map((d, i) => (
                    <div key={i} className={getCellClass(d.best)} title={getTitle(d)} />
                ))}
            </div>
        </div>
    );
}