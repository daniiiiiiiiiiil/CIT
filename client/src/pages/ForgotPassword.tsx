// pages/ForgotPassword.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../api/auth.api";
import "../styles/auth.scss";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resetLink, setResetLink] = useState<string | null>(null);
    const [showDebug, setShowDebug] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError("Введите email");
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await authApi.forgotPassword(email);
            setSubmitted(true);
            
            // @ts-ignore 
            if (response.resetLink) {
                // @ts-ignore
                setResetLink(response.resetLink);
            }
        } catch (err: any) {
            if (err.response?.data?.resetLink) {
                setResetLink(err.response.data.resetLink);
                setSubmitted(true);
            } else {
                setError(err.response?.data?.message || "Ошибка отправки");
            }
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="app">
                <div className="card" style={{ textAlign: "center" }}>
                    <div className="header">
                        <h1> Проверьте почту</h1>
                        <p>
                            Мы отправили инструкции по сбросу пароля на <strong>{email}</strong>
                        </p>
                    </div>

                    {resetLink && (
                        <div style={{ 
                            background: "#e8f4fd", 
                            padding: "20px", 
                            borderRadius: "12px",
                            margin: "20px 0",
                            textAlign: "left",
                            border: "2px solid #00d2ff"
                        }}>
                            <p style={{ margin: "0 0 12px 0", color: "#0066cc", fontWeight: "bold", fontSize: "14px" }}>
                                 Запасная ссылка (если письмо не пришло):
                            </p>
                            <div style={{ 
                                wordBreak: "break-all", 
                                fontSize: "13px",
                                background: "#fff",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                fontFamily: "monospace"
                            }}>
                                {resetLink}
                            </div>
                            <p style={{ fontSize: "13px", color: "#555", marginTop: "12px", marginBottom: 0 }}>
                                 Скопируйте ссылку и вставьте в адресную строку браузера
                            </p>
                        </div>
                    )}

                    <div style={{ marginTop: "20px" }}>
                        <button
                            onClick={() => setShowDebug(!showDebug)}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#00d2ff",
                                fontSize: "13px",
                                cursor: "pointer",
                                marginBottom: "15px",
                                textDecoration: "underline"
                            }}
                        >
                            {showDebug ? "▼ Скрыть подсказки" : "▶ Не пришло письмо?"}
                        </button>
                        
                        {showDebug && (
                            <div style={{ 
                                background: "#fff3e0", 
                                padding: "15px", 
                                borderRadius: "8px",
                                marginBottom: "20px",
                                textAlign: "left",
                                border: "1px solid #ff9800"
                            }}>
                                <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#e65100" }}>
                                     Что делать, если письмо не приходит:
                                </p>
                                <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "13px", lineHeight: "1.6" }}>
                                    <li>Проверьте папку <strong>"Спам"</strong> или <strong>"Promotions"</strong></li>
                                    <li>Добавьте адрес <strong>noreply@profcifra.ru</strong> в контакты</li>
                                    <li>Подождите 1-2 минуты — письмо может идти дольше</li>
                                    <li>Попробуйте <strong>запросить сброс пароля заново</strong></li>
                                    <li>Используйте <strong>запасную ссылку выше</strong> (если отображается)</li>
                                    <li>Для разработки: проверьте <strong>консоль сервера</strong></li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div style={{ 
                        marginTop: "25px", 
                        padding: "12px", 
                        background: "#f0f0f0", 
                        borderRadius: "8px",
                        fontSize: "13px"
                    }}>
                        <Link to="/" style={{ color: "#00d2ff", textDecoration: "none", fontWeight: "bold" }}>
                            ← Вернуться на страницу входа
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <div className="card">
                <div className="header">
                    <h1>Восстановление пароля</h1>
                    <p>Введите email, указанный при регистрации</p>
                </div>

                {error && <div className="alert error">{error}</div>}

                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Отправка..." : "Отправить ссылку для сброса"}
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Link to="/" style={{ color: "#00d2ff", textDecoration: "none" }}>
                        ← Вернуться ко входу
                    </Link>
                </div>

                <div style={{ 
                    marginTop: "30px", 
                    padding: "12px", 
                    background: "#e8f5e9", 
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#2e7d32",
                    textAlign: "center"
                }}>
                 <strong>Совет:</strong><br />
                    После отправки проверьте почту через 1-2 минуты.<br />
                    Если письма нет — нажмите <strong>"Не пришло письмо?"</strong> после отправки
                </div>
            </div>
        </div>
    );
}