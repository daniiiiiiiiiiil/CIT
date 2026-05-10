interface EmptyStateProps {
    message?: string;
    subMessage?: string;
}

export function EmptyState({ message = "Ничего не найдено", subMessage = "Попробуйте другой запрос" }: EmptyStateProps) {
    return (
        <div className="cat-empty">
            <div className="cat-empty__icon">⊘</div>
            <p className="cat-empty__title">{message}</p>
            <p className="cat-empty__sub">{subMessage}</p>
        </div>
    );
}