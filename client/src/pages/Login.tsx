import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import { LoginForm } from "../components/auth/LoginForm";
import { AuthCard } from "../components/auth/AuthCard";
import { GoogleLoginButton } from "../components/auth/GoogleLoginButton";
import type { ApiError, ValidationErrors } from "../types/auth.types";
import "../styles/auth.scss";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};
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
            const res = await authApi.login({ email, password });
            authApi.saveToken(res.token);
            navigate(res.user.isAdmin ? "/admin" : "/categories");
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.response?.data?.message || "Ошибка входа");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credential: string) => {
        setLoading(true);
        try {
            const res = await authApi.googleLogin(credential);
            authApi.saveToken(res.token);
            navigate(res.user.isAdmin ? "/admin" : "/categories");
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.response?.data?.message || "Ошибка Google");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError("Ошибка Google");
    };

    return (
        <div className="app">
            <AuthCard title="ПрофЦифра Аттестация" subtitle="Войдите в свой аккаунт" error={error}>
                <LoginForm
                    email={email}
                    password={password}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onSubmit={handleSubmit}
                    loading={loading}
                    errors={errors}
                />

                <div className="divider"><span>ИЛИ</span></div>

                <div className="google-wrapper">
                    <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
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
            </AuthCard>
        </div>
    );
}