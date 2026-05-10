import { useNavigate } from "react-router-dom";
import type { TestResult } from "../../types/profile.types";

interface CertificatesTabProps {
    certificates: TestResult[];
    formatDateShort: (date: string) => string;
}

export function CertificatesTab({ certificates, formatDateShort }: CertificatesTabProps) {
    const navigate = useNavigate();

    if (certificates.length === 0) {
        return (
            <div className="pf-empty">
                <div className="pf-empty__icon">★</div>
                <p>У вас пока нет сертификатов</p>
                <p className="pf-empty__sub">Наберите 80% и выше, чтобы получить сертификат</p>
                <button className="pf-btn-primary" onClick={() => navigate("/categories")}>Пройти тест</button>
            </div>
        );
    }

    return (
        <div className="pf-certs">
            {certificates.map((result) => (
                <div key={result.id} className="pf-cert-item">
                    <div className="pf-cert-item__glow" />
                    <div className="pf-cert-item__icon">★</div>
                    <div className="pf-cert-item__info">
                        <div className="pf-cert-item__name">{result.categoryName || "Тест"}</div>
                        <div className="pf-cert-item__meta">{result.percent}% · {formatDateShort(result.finishedAt)}</div>
                        <div className="pf-cert-item__num">№ {result.certificateNumber}</div>
                    </div>
                    <button className="pf-btn-sm" onClick={() => navigate(`/result/${result.id}`)}>Открыть →</button>
                </div>
            ))}
        </div>
    );
}