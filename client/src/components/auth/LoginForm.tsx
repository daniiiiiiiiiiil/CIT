interface LoginFormProps {
    email: string;
    password: string;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    errors: { email?: string; password?: string };
}

export function LoginForm({
                              email,
                              password,
                              onEmailChange,
                              onPasswordChange,
                              onSubmit,
                              loading,
                              errors
                          }: LoginFormProps) {
    return (
        <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
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
                    onChange={(e) => onPasswordChange(e.target.value)}
                    placeholder="Введите пароль"
                    className={errors.password ? "error" : ""}
                />
                {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Загрузка..." : "Войти"}
            </button>
        </form>
    );
}