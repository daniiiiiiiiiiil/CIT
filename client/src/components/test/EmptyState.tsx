import { useNavigate } from "react-router-dom";

export function EmptyState() {
    const navigate = useNavigate();

    return (
        <div className="test-empty">
            <div className="test-empty__icon">🖥️</div>
            <p>Нет вопросов в этом тесте</p>
            <button className="cta-btn primary" onClick={() => navigate("/categories")}>Вернуться</button>
        </div>
    );
}