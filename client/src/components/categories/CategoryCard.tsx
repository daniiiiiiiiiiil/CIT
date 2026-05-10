import { CATEGORY_COLORS, ICONS } from "../../constants/categories.constants";
import type { Category } from "../../types/categories.types";

interface CategoryCardProps {
    category: Category;
    index: number;
    isHovered: boolean;
    onHover: (id: number | null) => void;
    onClick: (id: number) => void;
}

export function CategoryCard({ category, index, isHovered, onHover, onClick }: CategoryCardProps) {
    const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
    const icon = ICONS[index % ICONS.length];

    return (
        <div
            className={`cat-card ${isHovered ? "cat-card--hovered" : ""}`}
            onClick={() => onClick(category.id)}
            onMouseEnter={() => onHover(category.id)}
            onMouseLeave={() => onHover(null)}
            style={{
                "--card-bg": color.bg,
                "--card-border": color.border,
                "--card-glow": color.glow,
                "--card-index": index,
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
                <div className="cat-card__icon">{icon}</div>
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
}