import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import "../styles/App.scss";

const API = "http://localhost:5000";

interface AuthResponse {
    user: {
        id: number;
        email: string;
        name: string;
        isAdmin?: boolean;
    };
    token: string;
}

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email) newErrors.email = "Email обязателен";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Неверный формат email";
        if (!password) newErrors.password = "Пароль обязателен";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const res = await axios.post<AuthResponse>(`${API}/api/login`, { email, password });
            localStorage.setItem("token", res.data.token);
            navigate(res.data.user.isAdmin ? "/admin" : "/test");
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.response?.data?.message || "Ошибка входа");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        setLoading(true);
        try {
            const res = await axios.post<AuthResponse>(`${API}/auth/google`, {
                token: credentialResponse.credential,
            });
            localStorage.setItem("token", res.data.token);
            navigate(res.data.user.isAdmin ? "/admin" : "/test");
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.response?.data?.message || "Ошибка Google");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <div className="card">
                <div className="header">
                    <h1>ПрофЦифра Аттестация</h1>
                    <p>Войдите в свой аккаунт</p>
                </div>

                {error && <div className="alert error">{error}</div>}

                <form className="form" onSubmit={handleSubmit}>
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
                            placeholder="Введите пароль"
                            className={errors.password ? "error" : ""}
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Загрузка..." : "Войти"}
                    </button>
                </form>

                <div className="divider"><span>ИЛИ</span></div>

                <div className="google-wrapper">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Ошибка Google")} />
                </div>

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Link to="/register" style={{ color: "#00d2ff", textDecoration: "none" }}>
                        Нет аккаунта? Зарегистрироваться
                    </Link>
                    <br />
                    <Link to="/forgot-password" style={{ color: "#a0a0b0", textDecoration: "none", fontSize: "12px" }}>
                        Забыли пароль?
                    </Link>
                </div>
            </div>
        </div>
    );
}