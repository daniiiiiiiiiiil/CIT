interface RegisterFormProps {
    name: string;
    email: string;
    password: string;
    onNameChange: (value: string) => void;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    errors: { name?: string; email?: string; password?: string };
}

export function RegisterForm({
                                 name,
                                 email,
                                 password,
                                 onNameChange,
                                 onEmailChange,
                                 onPasswordChange,
                                 onSubmit,
                                 loading,
                                 errors
                             }: RegisterFormProps) {
    return (
        <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
                <label>Имя</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
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
                    placeholder="Минимум 6 символов"
                    className={errors.password ? "error" : ""}
                />
                {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Загрузка..." : "Зарегистрироваться"}
            </button>
        </form>
    );
}