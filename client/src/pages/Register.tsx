import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import { RegisterForm } from "../components/auth/RegisterForm";
import { AuthCard } from "../components/auth/AuthCard";
import type { ApiError, ValidationErrors } from "../types/auth.types";
import "../styles/auth.scss";

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};
        if (!name) newErrors.name = "Имя обязательно";
        if (!email) newErrors.email = "Email обязателен";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Неверный формат email";
        if (!password) newErrors.password = "Пароль обязателен";
        else if (password.length < 6) newErrors.password = "Минимум 6 символов";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const res = await authApi.register({ name, email, password });
            if (res.token) {
                authApi.saveToken(res.token);
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
            <AuthCard title="Регистрация" subtitle="Создайте новый аккаунт" error={error}>
                <RegisterForm
                    name={name}
                    email={email}
                    password={password}
                    onNameChange={setName}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onSubmit={handleSubmit}
                    loading={loading}
                    errors={errors}
                />

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Link to="/" style={{ color: "#00d2ff", textDecoration: "none" }}>
                        Уже есть аккаунт? Войти
                    </Link>
                </div>
            </AuthCard>
        </div>
    );
}