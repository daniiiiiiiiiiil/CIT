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

export default function CategoriesPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const isMounted = useRef(true);

    const icons = ["🚀", "📚", "🎨", "🎵", "💻", "📖", "🔬", "📜", "🎮", "🏆", "⚽", "🎭"];

    useEffect(() => {
        isMounted.current = true;

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        const fetchUserAndCategories = async () => {
            try {
                const token = localStorage.getItem("token");

                const userRes = await axios.get(`${API}/api/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (isMounted.current) {
                    setUser(userRes.data);
                }

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
                if (isMounted.current) {
                    setLoading(false);
                }
            }
        };

        fetchUserAndCategories();

        return () => {
            isMounted.current = false;
        };
    }, [navigate]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim() === "") {
                setFilteredCategories(categories);
            } else {
                const filtered = categories.filter(category =>
                    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
                );
                setFilteredCategories(filtered);
            }
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, categories]);

    const handleSelectCategory = (categoryId: number) => {
        navigate(`/test/${categoryId}`);
    };

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                await axios.post(`${API}/api/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch {
                //ignore
            }
        }
        localStorage.removeItem("token");
        navigate("/");
    };

    if (loading) {
        return (
            <div className="test-loading">
                <div className="spinner" />
                <p>Загрузка квизов...</p>
            </div>
        );
    }

    const userName = user?.name || user?.email?.split('@')[0] || "Гость";

    const displayCategories = filteredCategories;

    return (
        <div className="categories-page">
            <div className="top-bar">
                <div className="welcome-section">
                    <h1>Привет, {userName}!</h1>
                </div>
                <div className="header-actions">
                    <button className="profile-btn" onClick={() => navigate("/profile")}>
                        👤 Мой профиль
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                        Выйти
                    </button>
                </div>
            </div>

            <div className="search-section">
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Поиск по категориям квизов"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="categories-header">
                <h2>Исследуйте категории</h2>
                <button className="see-all-btn" onClick={() => setSearchQuery("")}>
                    Все категории →
                </button>
            </div>

            <div className="categories-grid">
                {displayCategories.length > 0 ? (
                    displayCategories.map((category, index) => (
                        <div
                            key={category.id}
                            className="category-card"
                            onClick={() => handleSelectCategory(category.id)}
                        >
                            <div className="category-card__icon">
                                {icons[index % icons.length]}
                            </div>
                            <h3>{category.name}</h3>
                            <p>{category.questions_count} вопросов</p>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>Категории не найдены</p>
                    </div>
                )}
            </div>

            <div className="bottom-nav">
                <div className="nav-item active">
                    <span className="nav-icon">🏠</span>
                    <span className="nav-label">Главная</span>
                </div>
            </div>

            {categories.length === 0 && (
                <div className="categories-empty">
                    <p>Нет доступных квизов</p>
                    <p>Пожалуйста, свяжитесь с администратором</p>
                </div>
            )}
        </div>
    );
}