import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/auth.scss";


const API = "http://localhost:5000";

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});

    const validateForm = () => {
        const newErrors: { email?: string; password?: string; name?: string } = {};
        if (!email) newErrors.email = "Email обязателен";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Неверный формат email";
        if (!password) newErrors.password = "Пароль обязателен";
        else if (password.length < 6) newErrors.password = "Минимум 6 символов";
        if (!name) newErrors.name = "Имя обязательно";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const res = await axios.post(`${API}/api/register`, { email, password, name });
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }
            navigate("/categories");
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.response?.data?.message || "Ошибка регистрации");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <div className="card">
                <div className="header">
                    <h1>Регистрация</h1>
                    <p>Создайте новый аккаунт</p>
                </div>

                {error && <div className="alert error">{error}</div>}

                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Имя</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ваше имя"
                            className={errors.name ? "error" : ""}
                        />
                        {errors.name && <div className="error-message">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@mail.com"
                            className={errors.email ? "error" : ""}
                        />
                        {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Минимум 6 символов"
                            className={errors.password ? "error" : ""}
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Загрузка..." : "Зарегистрироваться"}
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Link to="/" style={{ color: "#00d2ff", textDecoration: "none" }}>
                        Уже есть аккаунт? Войти
                    </Link>
                </div>
            </div>
        </div>
    );
}