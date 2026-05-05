import { Link } from "react-router-dom";
import "../styles/App.scss";

export default function ErrorPage() {
    return (
        <div className="app">
            <div className="card" style={{ textAlign: "center" }}>
                <h1>404</h1>
                <p>Страница не найдена</p>
                <Link to="/" style={{ color: "#00d2ff", textDecoration: "none" }}>
                    Вернуться на главную
                </Link>
            </div>
        </div>
    );
}