// pages/ResetPassword.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/auth.api";
import "../styles/auth.scss";

export default function ResetPassword() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validToken, setValidToken] = useState<boolean | null>(null);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    // Проверяем валидность токена при загрузке
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setValidToken(false);
                return;
            }
            
            try {
                const result = await authApi.verifyResetToken(token);
                if (result.valid) {
                    setValidToken(true);
                    setEmail(result.email);
                } else {
                    setValidToken(false);
                }
            } catch {
                setValidToken(false);
            }
        };
        
        verifyToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!password || password.length < 6) {
            setError("Пароль должен быть минимум 6 символов");
            return;
        }
        
        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }
        
        if (!token) {
            setError("Недействительная ссылка");
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            await authApi.resetPassword(token, password);
            setSubmitted(true);
        } catch (err: any) {
            setError(err.response?.data?.message || "Ошибка сброса пароля");
        } finally {
            setLoading(false);
        }
    };

    // Токен невалиден
    if (validToken === false) {
        return (
            <div className="app">
                <div className="card" style={{ textAlign: "center" }}>
                    <div className="header">
                        <h1>Ссылка недействительна</h1>
                        <p>
                            Ссылка для сброса пароля устарела или была уже использована.
                            <br />
                            <br />
                            Пожалуйста, запросите сброс пароля заново.
                        </p>
                    </div>
                    <Link to="/forgot-password" style={{ color: "#00d2ff", textDecoration: "none" }}>
                        Запросить новую ссылку →
                    </Link>
                </div>
            </div>
        );
    }

    // Загрузка проверки токена
    if (validToken === null) {
        return (
            <div className="app">
                <div className="card" style={{ textAlign: "center" }}>
                    <div className="loading-spinner">
                        <div className="spinner" />
                        <p>Проверка ссылки...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Успешная смена пароля
    if (submitted) {
        return (
            <div className="app">
                <div className="card" style={{ textAlign: "center" }}>
                    <div className="header">
                        <h1>Пароль изменен! ✓</h1>
                        <p>
                            Ваш пароль успешно изменен.
                            <br />
                            <br />
                            Теперь вы можете войти с новым паролем.
                        </p>
                    </div>
                    <Link to="/" style={{ color: "#00d2ff", textDecoration: "none" }}>
                        Войти в аккаунт →
                    </Link>
                </div>
            </div>
        );
    }

    // Форма сброса пароля
    return (
        <div className="app">
            <div className="card">
                <div className="header">
                    <h1>Создание нового пароля</h1>
                    <p>Для аккаунта: <strong>{email}</strong></p>
                </div>

                {error && <div className="alert error">{error}</div>}

                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Новый пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Минимум 6 символов"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Подтвердите пароль</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Введите пароль еще раз"
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Сохранение..." : "Сохранить пароль"}
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Link to="/" style={{ color: "#00d2ff", textDecoration: "none" }}>
                        ← Вернуться ко входу
                    </Link>
                </div>
            </div>
        </div>
    );
}