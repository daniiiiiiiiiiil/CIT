import { useNavigate } from "react-router-dom";
import type { TestResult } from "../../types/profile.types";

interface ResultsTabProps {
    results: TestResult[];
    formatDateShort: (date: string) => string;
}

export function ResultsTab({ results, formatDateShort }: ResultsTabProps) {
    const navigate = useNavigate();

    if (results.length === 0) {
        return (
            <div className="pf-empty">
                <div className="pf-empty__icon">◈</div>
                <p>Вы ещё не проходили тесты</p>
                <button className="pf-btn-primary" onClick={() => navigate("/categories")}>Начать тест</button>
            </div>
        );
    }

    return (
        <div className="pf-results">
            {[...results].reverse().map((result) => (
                <div key={result.id} className={`pf-result-item ${result.passed ? "pf-result-item--pass" : "pf-result-item--fail"}`}>
                    <div className="pf-result-item__indicator" />
                    <div className="pf-result-item__left">
                        <div className="pf-result-item__cat">{result.categoryName || "Без категории"}</div>
                        <div className="pf-result-item__date">{formatDateShort(result.finishedAt)}</div>
                    </div>
                    <div className="pf-result-item__progress">
                        <div className="pf-result-item__progress-bar">
                            <div className="pf-result-item__progress-fill" style={{ width: `${result.percent}%` }} />
                        </div>
                    </div>
                    <div className="pf-result-item__right">
                        <span className={`pf-result-item__score ${result.passed ? "pf-result-item__score--pass" : "pf-result-item__score--fail"}`}>
                            {result.percent}%
                        </span>
                        <span className={`pf-status-badge ${result.passed ? "pf-status-badge--pass" : "pf-status-badge--fail"}`}>
                            {result.passed ? "✓ Сдан" : "✗ Не сдан"}
                        </span>
                        <button className="pf-btn-sm" onClick={() => navigate(`/result/${result.id}`)}>
                            Детали →
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}