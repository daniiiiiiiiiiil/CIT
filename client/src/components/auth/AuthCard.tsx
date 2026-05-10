import type { ReactNode } from "react";

interface AuthCardProps {
    title: string;
    subtitle: string;
    error?: string | null;
    children: ReactNode;
}

export function AuthCard({ title, subtitle, error, children }: AuthCardProps) {
    return (
        <div className="card">
            <div className="header">
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>

            {error && <div className="alert error">{error}</div>}

            {children}
        </div>
    );
}