import type { UserProfile } from "../../types/profile.types";

interface InfoTabProps {
    profile: UserProfile;
    resultsCount: number;
    formatDate: (date: string) => string;
}

export function InfoTab({ profile, resultsCount, formatDate }: InfoTabProps) {
    const infoRows = [
        { label: "ID пользователя", value: `#${profile.id}` },
        { label: "Email", value: profile.email },
        { label: "Имя", value: profile.name },
        { label: "Роль", value: profile.isAdmin ? "Администратор" : "Пользователь" },
        { label: "Дата регистрации", value: formatDate(profile.created_at) },
        { label: "Всего попыток", value: String(resultsCount) },
    ];

    return (
        <div className="pf-info-grid">
            {infoRows.map((row, i) => (
                <div className="pf-info-row" key={i}>
                    <span className="pf-info-label">{row.label}</span>
                    <span className="pf-info-value">{row.value}</span>
                </div>
            ))}
        </div>
    );
}