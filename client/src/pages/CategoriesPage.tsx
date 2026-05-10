import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/categories.scss";

const API = "http://localhost:5000";

interface Category {
    id: number;
    name: string;
    description: string;
    questions_count: number;
    created_at: string;
}

interface User {
    id: number;
    email: string;
    name: string;
    isAdmin: boolean;
}

const CATEGORY_COLORS = [
    { bg: "linear-gradient(135deg, #00d4ff22, #0099ff11)", border: "#00d4ff", glow: "#00d4ff" },
    { bg: "linear-gradient(135deg, #00ff8822, #00cc6611)", border: "#00ff88", glow: "#00ff88" },
    { bg: "linear-gradient(135deg, #ff6b3522, #ff440011)", border: "#ff6b35", glow: "#ff6b35" },
    { bg: "linear-gradient(135deg, #a855f722, #7c3aed11)", border: "#a855f7", glow: "#a855f7" },
    { bg: "linear-gradient(135deg, #ffd70022, #ffaa0011)", border: "#ffd700", glow: "#ffd700" },
    { bg: "linear-gradient(135deg, #ff458b22, #e0196511)", border: "#ff458b", glow: "#ff458b" },
    { bg: "linear-gradient(135deg, #00e5ff22, #0097a711)", border: "#00e5ff", glow: "#00e5ff" },
    { bg: "linear-gradient(135deg, #76ff0322, #33691e11)", border: "#76ff03", glow: "#76ff03" },
];

const ICONS = ["🚀", "📚", "🎨", "🎵", "💻", "📖", "🔬", "📜", "🎮", "🏆", "⚽", "🎭"];

const CUBES = [
    { size: 60,  x: 5,   y: 10,  dur: 18, delay: 0,    rotX: 25,  rotY: 45,  color: "#00d4ff" },
    { size: 35,  x: 88,  y: 6,   dur: 22, delay: -4,   rotX: 60,  rotY: 20,  color: "#00ff88" },
    { size: 80,  x: 92,  y: 45,  dur: 28, delay: -8,   rotX: 15,  rotY: 70,  color: "#a855f7" },
    { size: 25,  x: 3,   y: 60,  dur: 15, delay: -2,   rotX: 45,  rotY: 90,  color: "#ff6b35" },
    { size: 50,  x: 75,  y: 80,  dur: 20, delay: -10,  rotX: 30,  rotY: 55,  color: "#ffd700" },
    { size: 40,  x: 15,  y: 85,  dur: 25, delay: -6,   rotX: 75,  rotY: 30,  color: "#00d4ff" },
    { size: 20,  x: 50,  y: 3,   dur: 12, delay: -3,   rotX: 50,  rotY: 110, color: "#ff458b" },
    { size: 65,  x: 60,  y: 88,  dur: 32, delay: -14,  rotX: 20,  rotY: 80,  color: "#00ff88" },
    { size: 30,  x: 35,  y: 70,  dur: 17, delay: -7,   rotX: 80,  rotY: 40,  color: "#a855f7" },
    { size: 45,  x: 82,  y: 20,  dur: 23, delay: -11,  rotX: 35,  rotY: 65,  color: "#00e5ff" },
];

const generateParticles = () => {
    return Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 6,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 5 + 4,
    }));
};

const PARTICLES = generateParticles();

interface CubeProps {
    size: number; x: number; y: number;
    dur: number; delay: number;
    rotX: number; rotY: number; color: string;
}

function FloatingCube({ size, x, y, dur, delay, rotX, rotY, color }: CubeProps) {
    const half = size / 2;
    const face = (transform: string): React.CSSProperties => ({
        position: "absolute",
        width: size,
        height: size,
        border: `1px solid ${color}`,
        background: `${color}09`,
        boxSizing: "border-box",
        transform,
    });

    return (
        <div
            className="cat-cube"
            style={{
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                "--cube-dur":   `${dur}s`,
                "--cube-delay": `${delay}s`,
                "--cube-rot-x": `${rotX}deg`,
                "--cube-rot-y": `${rotY}deg`,
                "--cube-color": color,
                "--cube-half":  `${half}px`,
            } as React.CSSProperties}
        >
            <div className="cat-cube__inner">
                <div style={face(`translateZ(${half}px)`)} />
                <div style={face(`rotateY(180deg) translateZ(${half}px)`)} />
                <div style={face(`rotateY(-90deg) translateZ(${half}px)`)} />
                <div style={face(`rotateY(90deg) translateZ(${half}px)`)} />
                <div style={face(`rotateX(90deg) translateZ(${half}px)`)} />
                <div style={face(`rotateX(-90deg) translateZ(${half}px)`)} />
            </div>
        </div>
    );
}

export default function CategoriesPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const isMounted = useRef(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        isMounted.current = true;
        const token = localStorage.getItem("token");
        if (!token) { navigate("/"); return; }

        const fetchUserAndCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const userRes = await axios.get(`${API}/api/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (isMounted.current) setUser(userRes.data);

                const categoriesRes = await axios.get(`${API}/api/categories`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Полученные категории:", categoriesRes.data);
                if (isMounted.current) {
                    setCategories(categoriesRes.data);
                    setFilteredCategories(categoriesRes.data);
                }
            } catch (error) {
                console.error("Ошибка загрузки:", error);
            } finally {
                if (isMounted.current) setLoading(false);
            }
        };

        fetchUserAndCategories();
        return () => { isMounted.current = false; };
    }, [navigate]);

    useEffect(() => {
        const id = setTimeout(() => {
            if (searchQuery.trim() === "") {
                setFilteredCategories(categories);
            } else {
                setFilteredCategories(categories.filter(c =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
                ));
            }
        }, 0);
        return () => clearTimeout(id);
    }, [searchQuery, categories]);

    const handleSelectCategory = (id: number) => navigate(`/test/${id}`);

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                await axios.post(`${API}/api/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch { /* ignore */ }
        }
        localStorage.removeItem("token");
        navigate("/");
    };

    if (loading) {
        return (
            <div className="cat-loading">
                <div className="cat-loading__ring" />
                <div className="cat-loading__text">
                    <span>Загрузка</span>
                    <span className="cat-loading__dots">
                        <span>.</span><span>.</span><span>.</span>
                    </span>
                </div>
            </div>
        );
    }

    const userName = user?.name || user?.email?.split('@')[0] || "Гость";
    const displayCategories = filteredCategories;

    return (
        <div className="cat-page" ref={containerRef}>
            <div className="cat-grid-bg" />
            <div className="cat-scanline" />

            <div className="cat-cubes" aria-hidden="true">
                {CUBES.map((cube, i) => <FloatingCube key={i} {...cube} />)}
            </div>

            <div className="cat-particles" aria-hidden="true">
                {PARTICLES.map((particle) => (
                    <div
                        key={particle.id}
                        className="cat-particle"
                        style={{
                            "--x": `${particle.x}%`,
                            "--y": `${particle.y}%`,
                            "--delay": `${particle.delay}s`,
                            "--size": `${particle.size}px`,
                            "--duration": `${particle.duration}s`,
                        } as React.CSSProperties}
                    />
                ))}
            </div>

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
                        <button className="cat-btn cat-btn--ghost" onClick={() => navigate("/profile")}>
                            <span className="cat-btn__icon">👤</span>
                            <span>Профиль</span>
                        </button>
                        <button className="cat-btn cat-btn--danger" onClick={handleLogout}>
                            <span>Выйти</span>
                            <span className="cat-btn__icon">→</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="cat-main">
                <section className="cat-hero">
                    <div className="cat-hero__badge">
                        <span className="cat-hero__badge-dot" />
                        QUIZ UNIVERSE
                    </div>
                    <h1 className="cat-hero__title">
                        <span className="cat-hero__title-line">ВЫБЕРИ</span>
                        <span className="cat-hero__title-line cat-hero__title-line--accent">КАТЕГОРИЮ</span>
                    </h1>
                    <div className="cat-search">
                        <div className="cat-search__wrapper">
                            <span className="cat-search__icon">⌕</span>
                            <input
                                type="text"
                                className="cat-search__input"
                                placeholder="Поиск по категориям..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="cat-search__clear" onClick={() => setSearchQuery("")}>✕</button>
                            )}
                        </div>
                    </div>
                </section>

                <section className="cat-section">
                    <div className="cat-section__header">
                        <div className="cat-section__title-group">
                            <span className="cat-section__line" />
                            <h2 className="cat-section__title">Категории</h2>
                        </div>
                        <button className="cat-see-all" onClick={() => setSearchQuery("")}>
                            Все категории <span>→</span>
                        </button>
                    </div>

                    {displayCategories.length > 0 ? (
                        <div className="cat-grid">
                            {displayCategories.map((category, index) => {
                                const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
                                return (
                                    <div
                                        key={category.id}
                                        className={`cat-card ${hoveredCard === category.id ? "cat-card--hovered" : ""}`}
                                        onClick={() => handleSelectCategory(category.id)}
                                        onMouseEnter={() => setHoveredCard(category.id)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        style={{
                                            "--card-bg":     color.bg,
                                            "--card-border": color.border,
                                            "--card-glow":   color.glow,
                                            "--card-index":  index,
                                        } as React.CSSProperties}
                                    >
                                        <div className="cat-card__corner cat-card__corner--tl" />
                                        <div className="cat-card__corner cat-card__corner--tr" />
                                        <div className="cat-card__corner cat-card__corner--bl" />
                                        <div className="cat-card__corner cat-card__corner--br" />
                                        <div className="cat-card__num">{String(index + 1).padStart(2, "0")}</div>
                                        <div className="cat-card__icon-wrap">
                                            <div className="cat-card__ring cat-card__ring--1" />
                                            <div className="cat-card__ring cat-card__ring--2" />
                                            <div className="cat-card__icon">{ICONS[index % ICONS.length]}</div>
                                        </div>
                                        <h3 className="cat-card__title">{category.name}</h3>
                                        <p className="cat-card__count">
                                            <span className="cat-card__count-num">{category.questions_count}</span>
                                            {" "}вопросов
                                        </p>
                                        <div className="cat-card__arrow">→</div>
                                        <div className="cat-card__glitch-1" />
                                        <div className="cat-card__glitch-2" />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="cat-empty">
                            <div className="cat-empty__icon">⊘</div>
                            <p className="cat-empty__title">Ничего не найдено</p>
                            <p className="cat-empty__sub">Попробуйте другой запрос</p>
                        </div>
                    )}
                </section>
            </main>

            <nav className="cat-nav">
                <div className="cat-nav__item cat-nav__item--active">
                    <span className="cat-nav__icon">⬡</span>
                    <span className="cat-nav__label">Главная</span>
                </div>
            </nav>

            {categories.length === 0 && (
                <div className="cat-no-quizzes">
                    <p>Нет доступных тестов</p>
                    <p>Пожалуйста, свяжитесь с администратором</p>
                </div>
            )}
        </div>
    );
}