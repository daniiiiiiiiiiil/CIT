import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { categoriesApi } from "../api/categories.api";
import { CUBES, generateParticles } from "../constants/categories.constants";
import { FloatingCube } from "../components/categories/FloatingCube";
import { CategoryCard } from "../components/categories/CategoryCard";
import { LoadingSpinner } from "../components/categories/LoadingSpinner";
import { EmptyState } from "../components/categories/EmptyState";
import { SearchInput } from "../components/categories/SearchInput";
import { CategoriesHeader } from "../components/categories/CategoriesHeader";
import type { Category, User, Particle } from "../types/categories.types";
import "../styles/categories.scss";

const PARTICLES: Particle[] = generateParticles();

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
                const [userData, categoriesData] = await Promise.all([
                    categoriesApi.getMe(),
                    categoriesApi.getCategories(),
                ]);
                if (isMounted.current) {
                    setUser(userData);
                    setCategories(categoriesData);
                    setFilteredCategories(categoriesData);
                }
            } catch {
                console.error("Ошибка загрузки");
            } finally {
                if (isMounted.current) setLoading(false);
            }
        };

        fetchUserAndCategories();
        return () => { isMounted.current = false; };
    }, [navigate]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim() === "") {
                setFilteredCategories(categories);
            } else {
                setFilteredCategories(categories.filter(c =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
                ));
            }
        }, 0);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, categories]);

    const handleSelectCategory = (id: number) => navigate(`/test/${id}`);

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                await categoriesApi.logout();
            } catch { /* ignore */ }
        }
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleProfileClick = () => navigate("/profile");

    if (loading) {
        return <LoadingSpinner />;
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

            <CategoriesHeader
                userName={userName}
                onProfileClick={handleProfileClick}
                onLogout={handleLogout}
            />

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
                    <SearchInput value={searchQuery} onChange={setSearchQuery} />
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
                            {displayCategories.map((category, index) => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                    index={index}
                                    isHovered={hoveredCard === category.id}
                                    onHover={setHoveredCard}
                                    onClick={handleSelectCategory}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState />
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