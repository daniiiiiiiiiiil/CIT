interface CategoriesHeaderProps {
    userName: string;
    onProfileClick: () => void;
    onLogout: () => void;
}

export function CategoriesHeader({ userName, onProfileClick, onLogout }: CategoriesHeaderProps) {
    return (
        <header className="cat-header">
            <div className="cat-header__inner">
                <div className="cat-header__logo">
                    <span className="cat-header__logo-bracket">{"<"}</span>
                    <span className="cat-header__logo-text">ПрофЦифра Аттестация</span>
                    <span className="cat-header__logo-bracket">{"/>"}</span>
                </div>
                <div className="cat-header__welcome">
                    <span className="cat-header__greeting">Привет, </span>
                    <span className="cat-header__username">{userName}</span>
                    <span className="cat-header__cursor">_</span>
                </div>
                <div className="cat-header__actions">
                    <button className="cat-btn cat-btn--ghost" onClick={onProfileClick}>
                        <span className="cat-btn__icon">👤</span>
                        <span>Профиль</span>
                    </button>
                    <button className="cat-btn cat-btn--danger" onClick={onLogout}>
                        <span>Выйти</span>
                        <span className="cat-btn__icon">→</span>
                    </button>
                </div>
            </div>
        </header>
    );
}