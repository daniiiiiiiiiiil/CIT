import { RadialProgress } from "./RadialProgress";
import type { UserProfile } from "../../types/profile.types";

interface ProfileHeaderProps {
    profile: UserProfile;
    avgPercent: number;
    initials: string;
    formatDate: (date: string) => string;
}

export function ProfileHeader({ profile, avgPercent, initials, formatDate }: ProfileHeaderProps) {
    return (
        <div className="pf-hero">
            <div className="pf-hero__glow" />
            <div className="pf-hero__avatar-wrap">
                <div className="pf-hero__avatar">
                    {profile.picture ? <img src={profile.picture} alt={profile.name} /> : <span>{initials}</span>}
                </div>
                <div className="pf-hero__avatar-ring" />
            </div>
            <div className="pf-hero__info">
                <div className="pf-hero__tag">// ПОЛЬЗОВАТЕЛЬ</div>
                <h1 className="pf-hero__name">{profile.name}</h1>
                <p className="pf-hero__email">{profile.email}</p>
                <div className="pf-hero__badges">
                    <span className={`pf-badge ${profile.isAdmin ? "pf-badge--admin" : "pf-badge--user"}`}>
                        {profile.isAdmin ? "⬡ Администратор" : "◉ Пользователь"}
                    </span>
                    <span className="pf-badge pf-badge--date">С {formatDate(profile.created_at)}</span>
                    <span className="pf-badge pf-badge--id">ID #{profile.id}</span>
                </div>
            </div>
            <div className="pf-hero__score-preview">
                <div className="pf-hero__score-ring">
                    <RadialProgress percent={avgPercent} size={120} color={avgPercent >= 80 ? "#00ff88" : avgPercent >= 50 ? "#f59e0b" : "#ff4757"} />
                    <div className="pf-hero__score-center">
                        <span className="pf-hero__score-val">{avgPercent}%</span>
                        <span className="pf-hero__score-sub">avg</span>
                    </div>
                </div>
            </div>
        </div>
    );
}